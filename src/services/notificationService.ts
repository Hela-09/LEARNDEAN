import { db, cleanFirestoreData } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

export type NotificationType = 
  | 'task_complete' 
  | 'task_error' 
  | 'lesson_complete' 
  | 'assignment_complete' 
  | 'announcement' 
  | 'study_reminder';

export interface AppNotification {
  id: string;
  uid: string;
  title: string;
  message: string;
  type: NotificationType;
  route?: string;
  routeState?: Record<string, any>;
  isRead: boolean;
  createdAt: number;
  taskId?: string;
}

export interface NotificationPreferences {
  taskCompletion: boolean;
  studyReminders: boolean;
  announcements: boolean;
  browserPush: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  taskCompletion: true,
  studyReminders: true,
  announcements: true,
  browserPush: false,
};

type NotificationListener = (notifications: AppNotification[]) => void;

class NotificationService {
  private listeners: Set<NotificationListener> = new Set();
  private unsubscribeFirestore: (() => void) | null = null;
  private currentUid: string | null = null;
  private cachedNotifications: AppNotification[] = [];

  private getStorageKey(uid: string): string {
    return `zetadu_notifications_${uid || 'guest'}`;
  }

  private getPrefsStorageKey(uid: string): string {
    return `zetadu_notif_prefs_${uid || 'guest'}`;
  }

  public getPreferences(uid?: string): NotificationPreferences {
    try {
      if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
      const key = this.getPrefsStorageKey(uid || 'guest');
      const raw = localStorage.getItem(key);
      return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  public savePreferences(uid: string, prefs: Partial<NotificationPreferences>): void {
    try {
      if (typeof window === 'undefined') return;
      const current = this.getPreferences(uid);
      const updated = { ...current, ...prefs };
      localStorage.setItem(this.getPrefsStorageKey(uid || 'guest'), JSON.stringify(updated));
    } catch (_) {}
  }

  public async requestBrowserPushPermission(uid: string): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      this.savePreferences(uid, { browserPush: true });
      return true;
    }

    if (Notification.permission === 'denied') {
      this.savePreferences(uid, { browserPush: false });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      this.savePreferences(uid, { browserPush: granted });
      return granted;
    } catch {
      return false;
    }
  }

  public sendBrowserNotification(title: string, options?: NotificationOptions): void {
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

      // Only send if the window is hidden/blurred or user explicitly requested
      new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/favicon-32x32.png',
        ...options,
      });
    } catch (_) {}
  }

  public getLocalNotifications(uid: string): AppNotification[] {
    try {
      if (typeof window === 'undefined') return [];
      const raw = localStorage.getItem(this.getStorageKey(uid));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveLocalNotifications(uid: string, notifications: AppNotification[]): void {
    try {
      if (typeof window === 'undefined') return;
      const trimmed = notifications.slice(0, 50); // Keep max 50 recent
      localStorage.setItem(this.getStorageKey(uid), JSON.stringify(trimmed));
      this.cachedNotifications = trimmed;
      this.notifyListeners();
    } catch (_) {}
  }

  public init(uid: string | null): void {
    if (this.currentUid === uid && this.unsubscribeFirestore) return;

    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
      this.unsubscribeFirestore = null;
    }

    this.currentUid = uid;
    const resolvedUid = uid || 'guest';
    this.cachedNotifications = this.getLocalNotifications(resolvedUid);
    this.notifyListeners();

    if (!uid) return;

    try {
      const q = query(
        collection(db, 'notifications'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(40)
      );

      this.unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          const list: AppNotification[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              uid: data.uid,
              title: data.title || 'Notification',
              message: data.message || '',
              type: data.type || 'task_complete',
              route: data.route,
              routeState: data.routeState,
              isRead: Boolean(data.isRead),
              createdAt: data.createdAt ? (typeof data.createdAt === 'number' ? data.createdAt : data.createdAt.toMillis?.() || Date.now()) : Date.now(),
              taskId: data.taskId,
            };
          });

          this.saveLocalNotifications(uid, list);
        },
        (error) => {
          console.warn('[NotificationService] Firestore snapshot notice:', error.message);
          // Fall back gracefully to local notifications
          this.cachedNotifications = this.getLocalNotifications(uid);
          this.notifyListeners();
        }
      );
    } catch (e) {
      console.warn('[NotificationService] Init notice:', e);
    }
  }

  public async addNotification(notification: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'> & { id?: string }): Promise<AppNotification> {
    const uid = notification.uid || this.currentUid || 'guest';
    const prefs = this.getPreferences(uid);

    // Filter by user preference
    if (notification.type === 'study_reminder' && !prefs.studyReminders) {
      return null as any;
    }
    if ((notification.type === 'task_complete' || notification.type === 'task_error') && !prefs.taskCompletion) {
      return null as any;
    }
    if (notification.type === 'announcement' && !prefs.announcements) {
      return null as any;
    }

    const newNotif: AppNotification = {
      id: notification.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      uid,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      route: notification.route,
      routeState: notification.routeState,
      isRead: false,
      createdAt: Date.now(),
      taskId: notification.taskId,
    };

    // Update local cache immediately
    const current = this.getLocalNotifications(uid);
    const updated = [newNotif, ...current.filter((n) => n.id !== newNotif.id)];
    this.saveLocalNotifications(uid, updated);

    // Send browser push if allowed and enabled
    if (prefs.browserPush) {
      this.sendBrowserNotification(newNotif.title, {
        body: newNotif.message,
        tag: newNotif.id,
      });
    }

    // Persist to Firestore if user authenticated
    if (uid && uid !== 'guest') {
      try {
        await addDoc(
          collection(db, 'notifications'),
          cleanFirestoreData({
            uid: newNotif.uid,
            title: newNotif.title,
            message: newNotif.message,
            type: newNotif.type,
            route: newNotif.route || null,
            routeState: newNotif.routeState || null,
            isRead: false,
            createdAt: serverTimestamp(),
            taskId: newNotif.taskId || null,
          })
        );
      } catch (e) {
        console.warn('[NotificationService] Firestore save notice:', e);
      }
    }

    return newNotif;
  }

  public async markAsRead(uid: string, notifId: string): Promise<void> {
    const resolvedUid = uid || this.currentUid || 'guest';
    const current = this.getLocalNotifications(resolvedUid);
    const updated = current.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
    this.saveLocalNotifications(resolvedUid, updated);

    if (resolvedUid && resolvedUid !== 'guest' && notifId && !notifId.startsWith('notif_')) {
      try {
        await updateDoc(doc(db, 'notifications', notifId), {
          isRead: true,
          updatedAt: serverTimestamp(),
        });
      } catch (_) {}
    }
  }

  public async markAllAsRead(uid: string): Promise<void> {
    const resolvedUid = uid || this.currentUid || 'guest';
    const current = this.getLocalNotifications(resolvedUid);
    const updated = current.map((n) => ({ ...n, isRead: true }));
    this.saveLocalNotifications(resolvedUid, updated);

    if (resolvedUid && resolvedUid !== 'guest') {
      try {
        const unreadDocs = current.filter((n) => !n.isRead && !n.id.startsWith('notif_'));
        for (const notif of unreadDocs) {
          await updateDoc(doc(db, 'notifications', notif.id), {
            isRead: true,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (_) {}
    }
  }

  public async deleteNotification(uid: string, notifId: string): Promise<void> {
    const resolvedUid = uid || this.currentUid || 'guest';
    const current = this.getLocalNotifications(resolvedUid);
    const updated = current.filter((n) => n.id !== notifId);
    this.saveLocalNotifications(resolvedUid, updated);

    if (resolvedUid && resolvedUid !== 'guest' && notifId && !notifId.startsWith('notif_')) {
      try {
        await deleteDoc(doc(db, 'notifications', notifId));
      } catch (_) {}
    }
  }

  public getUnreadCount(uid?: string): number {
    const resolvedUid = uid || this.currentUid || 'guest';
    const current = this.cachedNotifications.length > 0 ? this.cachedNotifications : this.getLocalNotifications(resolvedUid);
    return current.filter((n) => !n.isRead).length;
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.cachedNotifications);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => fn(this.cachedNotifications));
  }
}

export const notificationService = new NotificationService();
