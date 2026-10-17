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

export interface UserDevice {
  id: string;
  uid: string;
  deviceName: string;
  browser: string;
  platform: string;
  subscribedAt: number;
  lastActiveAt: number;
  isCurrentDevice?: boolean;
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

function getClientDeviceInfo(): { deviceName: string; browser: string; platform: string } {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { deviceName: 'Current Browser', browser: 'Browser', platform: 'Web' };
  }
  const ua = navigator.userAgent;
  let browser = 'Chrome';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';

  let platform = 'Desktop';
  if (/iPad|Tablet/i.test(ua)) platform = 'Tablet';
  else if (/iPhone|Android.*Mobile/i.test(ua)) platform = 'Mobile';

  return {
    deviceName: `${browser} on ${platform}`,
    browser,
    platform
  };
}

class NotificationService {
  private listeners: Set<NotificationListener> = new Set();
  private unsubscribeFirestore: (() => void) | null = null;
  private currentUid: string | null = null;
  private cachedNotifications: AppNotification[] = [];

  private getDeviceId(): string {
    if (typeof window === 'undefined') return 'server_device';
    let id = localStorage.getItem('zetadu_device_id');
    if (!id) {
      id = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem('zetadu_device_id', id);
    }
    return id;
  }

  private getStorageKey(uid: string): string {
    return `zetadu_notifications_${uid || 'guest'}`;
  }

  private getPrefsStorageKey(uid: string): string {
    return `zetadu_notif_prefs_${uid || 'guest'}`;
  }

  private getDevicesStorageKey(uid: string): string {
    return `zetadu_devices_${uid || 'guest'}`;
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

  public async getRegisteredDevices(uid?: string): Promise<UserDevice[]> {
    const resolvedUid = uid || this.currentUid || 'guest';
    const currentDeviceId = this.getDeviceId();

    // Check local devices first
    let localList: UserDevice[] = [];
    try {
      const raw = localStorage.getItem(this.getDevicesStorageKey(resolvedUid));
      if (raw) localList = JSON.parse(raw);
    } catch (_) {}

    // If authenticated, sync with Firestore device_push_subscriptions
    if (resolvedUid && resolvedUid !== 'guest') {
      try {
        const q = query(
          collection(db, 'device_push_subscriptions'),
          where('uid', '==', resolvedUid),
          limit(10)
        );
        const snap = await getDocs(q);
        const remoteList: UserDevice[] = snap.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            uid: d.uid,
            deviceName: d.deviceName || 'Registered Device',
            browser: d.browser || 'Browser',
            platform: d.platform || 'Device',
            subscribedAt: d.subscribedAt || Date.now(),
            lastActiveAt: d.lastActiveAt || Date.now(),
            isCurrentDevice: docSnap.id === currentDeviceId || d.deviceId === currentDeviceId
          };
        });
        if (remoteList.length > 0) {
          localStorage.setItem(this.getDevicesStorageKey(resolvedUid), JSON.stringify(remoteList));
          return remoteList;
        }
      } catch (err) {
        console.warn('Could not fetch cloud devices:', err);
      }
    }

    // Default current device entry if none exists
    if (localList.length === 0) {
      const info = getClientDeviceInfo();
      const currentDev: UserDevice = {
        id: currentDeviceId,
        uid: resolvedUid,
        deviceName: info.deviceName,
        browser: info.browser,
        platform: info.platform,
        subscribedAt: Date.now(),
        lastActiveAt: Date.now(),
        isCurrentDevice: true
      };
      localList = [currentDev];
      localStorage.setItem(this.getDevicesStorageKey(resolvedUid), JSON.stringify(localList));
    } else {
      localList = localList.map(d => ({
        ...d,
        isCurrentDevice: d.id === currentDeviceId
      }));
    }

    return localList;
  }

  public async registerCurrentDevice(uid?: string): Promise<void> {
    const resolvedUid = uid || this.currentUid || 'guest';
    const currentDeviceId = this.getDeviceId();
    const info = getClientDeviceInfo();

    const deviceData: UserDevice = {
      id: currentDeviceId,
      uid: resolvedUid,
      deviceName: info.deviceName,
      browser: info.browser,
      platform: info.platform,
      subscribedAt: Date.now(),
      lastActiveAt: Date.now(),
      isCurrentDevice: true
    };

    // Save locally
    const existing = await this.getRegisteredDevices(resolvedUid);
    const updated = [deviceData, ...existing.filter(d => d.id !== currentDeviceId)];
    localStorage.setItem(this.getDevicesStorageKey(resolvedUid), JSON.stringify(updated));

    // Save to Firestore if authenticated
    if (resolvedUid && resolvedUid !== 'guest') {
      try {
        await addDoc(
          collection(db, 'device_push_subscriptions'),
          cleanFirestoreData({
            deviceId: currentDeviceId,
            uid: resolvedUid,
            deviceName: info.deviceName,
            browser: info.browser,
            platform: info.platform,
            subscribedAt: Date.now(),
            lastActiveAt: Date.now(),
            status: 'active'
          })
        );
      } catch (err) {
        console.warn('Could not register device to cloud:', err);
      }
    }
  }

  public async removeRegisteredDevice(uid: string, deviceId: string): Promise<void> {
    const resolvedUid = uid || this.currentUid || 'guest';
    const existing = await this.getRegisteredDevices(resolvedUid);
    const updated = existing.filter(d => d.id !== deviceId);
    localStorage.setItem(this.getDevicesStorageKey(resolvedUid), JSON.stringify(updated));

    if (resolvedUid && resolvedUid !== 'guest') {
      try {
        await deleteDoc(doc(db, 'device_push_subscriptions', deviceId)).catch(() => {});
      } catch (_) {}
    }
  }

  public async requestBrowserPushPermission(uid: string): Promise<{ success: boolean; status: 'granted' | 'denied' | 'unsupported'; message: string }> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return { success: false, status: 'unsupported', message: 'Web push notifications are not supported on this browser.' };
    }

    if (Notification.permission === 'granted') {
      this.savePreferences(uid, { browserPush: true });
      await this.registerCurrentDevice(uid);
      return { success: true, status: 'granted', message: 'Browser push notifications are active for this device.' };
    }

    if (Notification.permission === 'denied') {
      this.savePreferences(uid, { browserPush: false });
      return { success: false, status: 'denied', message: 'Notification permission was denied. You can enable it in your browser address bar settings.' };
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      this.savePreferences(uid, { browserPush: granted });
      if (granted) {
        await this.registerCurrentDevice(uid);
        return { success: true, status: 'granted', message: 'Push notifications enabled successfully for this device.' };
      } else {
        return { success: false, status: 'denied', message: 'Notification permission was not granted.' };
      }
    } catch {
      return { success: false, status: 'denied', message: 'Could not request notification permission.' };
    }
  }

  public sendBrowserNotification(title: string, options?: NotificationOptions): void {
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;

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

  public async clearAllNotifications(uid: string): Promise<void> {
    const resolvedUid = uid || this.currentUid || 'guest';
    const current = this.getLocalNotifications(resolvedUid);
    this.saveLocalNotifications(resolvedUid, []);

    if (resolvedUid && resolvedUid !== 'guest') {
      try {
        const firestoreDocs = current.filter((n) => !n.id.startsWith('notif_'));
        for (const notif of firestoreDocs) {
          await deleteDoc(doc(db, 'notifications', notif.id)).catch(() => {});
        }
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
