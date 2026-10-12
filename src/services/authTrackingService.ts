import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp, 
  where 
} from 'firebase/firestore';
import { db, isFirestoreQuotaExhausted } from '../lib/firebase';

export type AuthEventType = 'login_success' | 'login_failure' | 'logout';
export type LoginMethod = 'google' | 'password' | 'email_link' | 'unknown';

export interface AuthEventRecord {
  id?: string;
  eventType: AuthEventType;
  loginMethod: LoginMethod;
  email: string;
  uid?: string | null;
  displayName?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  userAgent?: string;
  platform?: string;
  timestamp: string;
  createdAt?: any;
}

export interface AuthLogFilters {
  eventType?: AuthEventType | 'all';
  searchEmail?: string;
  maxRecords?: number;
}

/**
 * Tracks authentication events (logins, failed attempts, logouts) securely to Firebase Firestore.
 * Passwords are NEVER accepted, transmitted, or recorded.
 */
export async function trackAuthEvent(params: {
  eventType: AuthEventType;
  loginMethod?: LoginMethod;
  email?: string;
  uid?: string | null;
  displayName?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
}): Promise<void> {
  try {
    const cleanEmail = (params.email || '').trim().toLowerCase();
    const cleanMethod: LoginMethod = params.loginMethod || 'unknown';
    const nowIso = new Date().toISOString();

    const clientInfo = {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      platform: typeof navigator !== 'undefined' ? (navigator as any).userAgentData?.platform || navigator.platform || 'web' : 'web'
    };

    const recordPayload: Record<string, any> = {
      eventType: params.eventType,
      loginMethod: cleanMethod,
      email: cleanEmail,
      uid: params.uid || null,
      displayName: params.displayName || null,
      timestamp: nowIso,
      userAgent: clientInfo.userAgent,
      platform: clientInfo.platform,
      createdAt: serverTimestamp()
    };

    // Include error metadata for failures, strictly sanitized without sensitive inputs
    if (params.eventType === 'login_failure') {
      recordPayload.errorCode = params.errorCode || 'auth/failed';
      recordPayload.errorMessage = params.errorMessage || 'Login attempt failed';
    }

    // 1. Record to Firestore 'auth_events' collection
    if (db && !isFirestoreQuotaExhausted()) {
      try {
        await addDoc(collection(db, 'auth_events'), recordPayload);
      } catch (err: any) {
        console.warn('[AuthTracking] Firestore write warning (quota or offline):', err?.message);
      }
    }

    // 2. If login succeeded and UID is present, update user's lastLoginAt and lastLoginMethod
    if (params.eventType === 'login_success' && params.uid && db && !isFirestoreQuotaExhausted()) {
      try {
        const userRef = doc(db, 'users', params.uid);
        await setDoc(userRef, {
          lastLoginAt: nowIso,
          lastLoginMethod: cleanMethod,
          updatedAt: nowIso
        }, { merge: true });
      } catch (userErr: any) {
        console.warn('[AuthTracking] Failed to update user lastLoginAt:', userErr?.message);
      }
    }

    // 3. Keep a rolling local cache of recent events for offline analysis (max 50)
    try {
      if (typeof window !== 'undefined') {
        const localKey = 'zetadu_recent_auth_events';
        const existingRaw = localStorage.getItem(localKey);
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        const updatedList = [
          { ...recordPayload, id: `local_${Date.now()}` },
          ...existingList.slice(0, 49)
        ];
        localStorage.setItem(localKey, JSON.stringify(updatedList));
      }
    } catch (_) {}
  } catch (error) {
    console.warn('[AuthTracking] Error recording auth event:', error);
  }
}

/**
 * Retrieves authentication logs from Firestore for authorized administrators.
 */
export async function getAdminAuthLogs(filters: AuthLogFilters = {}): Promise<AuthEventRecord[]> {
  const { eventType = 'all', searchEmail = '', maxRecords = 100 } = filters;

  try {
    if (db) {
      let q = query(collection(db, 'auth_events'), orderBy('createdAt', 'desc'), limit(maxRecords));
      
      const snap = await getDocs(q);
      const logs: AuthEventRecord[] = [];
      
      snap.forEach((d) => {
        const data = d.data();
        logs.push({
          id: d.id,
          eventType: data.eventType || 'login_success',
          loginMethod: data.loginMethod || 'unknown',
          email: data.email || '',
          uid: data.uid || null,
          displayName: data.displayName || null,
          errorCode: data.errorCode || null,
          errorMessage: data.errorMessage || null,
          userAgent: data.userAgent || '',
          platform: data.platform || '',
          timestamp: data.timestamp || (data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString())
        });
      });

      // Filter in-memory if search or type specified
      return logs.filter((log) => {
        if (eventType !== 'all' && log.eventType !== eventType) return false;
        if (searchEmail && !log.email.toLowerCase().includes(searchEmail.toLowerCase())) return false;
        return true;
      });
    }
  } catch (err: any) {
    console.warn('[AuthTracking] Admin logs fetch warning:', err);
  }

  // Fallback to local cache if offline or quota limit
  try {
    const raw = localStorage.getItem('zetadu_recent_auth_events');
    if (raw) {
      const parsed: AuthEventRecord[] = JSON.parse(raw);
      return parsed.filter((log) => {
        if (eventType !== 'all' && log.eventType !== eventType) return false;
        if (searchEmail && !log.email.toLowerCase().includes(searchEmail.toLowerCase())) return false;
        return true;
      });
    }
  } catch (_) {}

  return [];
}
