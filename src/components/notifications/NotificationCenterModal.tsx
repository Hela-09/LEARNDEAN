import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Award, 
  Settings, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Clock,
  Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService, AppNotification, NotificationPreferences, UserDevice } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenterModal({ isOpen, onClose }: NotificationCenterModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'settings'>('all');
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => 
    notificationService.getPreferences(user?.uid)
  );
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [devices, setDevices] = useState<UserDevice[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    notificationService.init(user?.uid || null);
    const unsubscribe = notificationService.subscribe((list) => {
      setNotifications(list);
    });

    setPreferences(notificationService.getPreferences(user?.uid));
    notificationService.getRegisteredDevices(user?.uid).then(setDevices).catch(() => {});

    return () => {
      unsubscribe();
    };
  }, [isOpen, user?.uid]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const handleOpenNotification = (notif: AppNotification) => {
    notificationService.markAsRead(user?.uid || 'guest', notif.id);
    onClose();
    if (notif.route) {
      navigate(notif.route, { state: notif.routeState });
    }
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead(user?.uid || 'guest');
  };

  const handleClearHistory = () => {
    notificationService.clearAllNotifications(user?.uid || 'guest');
    setShowClearConfirm(false);
  };

  const handleDeleteOne = (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation();
    notificationService.deleteNotification(user?.uid || 'guest', notifId);
  };

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    notificationService.savePreferences(user?.uid || 'guest', updated);
  };

  const handleRequestPush = async () => {
    setPushStatusMessage(null);
    const res = await notificationService.requestBrowserPushPermission(user?.uid || 'guest');
    setPreferences(notificationService.getPreferences(user?.uid));
    setPushStatusMessage(res.message);
    if (res.success) {
      notificationService.sendBrowserNotification('LearnDean Notifications Active', {
        body: 'You will receive timely updates when your background tasks complete.',
      });
    }
    notificationService.getRegisteredDevices(user?.uid).then(setDevices).catch(() => {});
    setTimeout(() => setPushStatusMessage(null), 5000);
  };

  const handleRemoveDevice = async (deviceId: string) => {
    await notificationService.removeRegisteredDevice(user?.uid || 'guest', deviceId);
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    setPushStatusMessage('Device removed from notification delivery.');
    setTimeout(() => setPushStatusMessage(null), 3000);
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    const dateObj = new Date(ts);
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

    if (mins < 1) return `Just now • ${timeStr}`;
    if (mins < 60) return `${mins}m ago • ${timeStr}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago • ${timeStr}`;
    return `${dateStr} • ${timeStr}`;
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'task_complete':
        return <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />;
      case 'task_error':
        return <AlertCircle size={18} className="text-rose-500 shrink-0" />;
      case 'lesson_complete':
      case 'assignment_complete':
        return <BookOpen size={18} className="text-blue-500 shrink-0" />;
      case 'study_reminder':
        return <Clock size={18} className="text-amber-500 shrink-0" />;
      default:
        return <Sparkles size={18} className="text-indigo-500 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-label="Notification Center"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Bell size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Background activities, completed tasks, and study alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && filter !== 'settings' && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="p-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck size={16} />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}

            {notifications.length > 0 && filter !== 'settings' && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="p-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer flex items-center gap-1"
                title="Clear notification history"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Clear Confirmation Banner */}
        {showClearConfirm && (
          <div className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs text-rose-900 dark:text-rose-200 animate-fadeIn">
            <span className="font-bold">Clear all notification history?</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearHistory}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-xs"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold bg-slate-100/60 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filter === 'unread'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('settings')}
            className={`ml-auto px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer ${
              filter === 'settings'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings size={13} />
            <span>Preferences</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100 dark:divide-slate-800/80">
          {filter === 'settings' ? (
            <div className="space-y-4 py-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200 mb-1">
                  Notification Preferences
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-[11px] leading-relaxed">
                  Choose which alerts and activities you want to receive. Background task progress will continue reliably regardless of notification preferences.
                </p>
              </div>

              {pushStatusMessage && (
                <div className="p-3 rounded-xl bg-slate-800 text-white text-xs font-semibold">
                  {pushStatusMessage}
                </div>
              )}

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white text-xs sm:text-sm">
                      Task Completion Alerts
                    </span>
                    <span className="text-[11px] text-slate-500">
                      When AI flashcards, note summaries, and question generation finish
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.taskCompletion}
                    onChange={() => handleTogglePref('taskCompletion')}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white text-xs sm:text-sm">
                      Study &amp; Streak Reminders
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Daily study plan suggestions and streak protection notices
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.studyReminders}
                    onChange={() => handleTogglePref('studyReminders')}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </label>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold block text-slate-900 dark:text-white text-xs sm:text-sm">
                        Browser Push Notifications
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Receive desktop or device alerts even when viewing other tabs
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRequestPush}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      {typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
                        ? 'Active'
                        : 'Enable Push'}
                    </button>
                  </div>
                </div>

                {/* Multi-Device Management */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      Registered Devices ({devices.length})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Devices registered to receive background completion alerts for your LearnDean account.
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {devices.map((dev) => (
                      <div
                        key={dev.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Smartphone size={16} className="text-blue-500 shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                {dev.deviceName}
                              </span>
                              {dev.isCurrentDevice && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                                  Current Device
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              Subscribed {new Date(dev.subscribedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {!dev.isCurrentDevice && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDevice(dev.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                            title="Deregister device"
                            aria-label="Deregister device"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear History with Confirmation */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">
                      Clear Notification History
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Permanently delete all received notification records
                    </span>
                  </div>
                  {showClearConfirm ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleClearHistory}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs cursor-pointer hover:bg-rose-700"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/60"
                    >
                      Clear History
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Bell size={20} />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {filter === 'unread'
                  ? 'All caught up! New alerts will appear here when background activities complete.'
                  : 'Start a practice drill, generate study notes, or learn in AI Classroom to receive updates.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleOpenNotification(notif)}
                className={`py-3 px-2 sm:px-3 rounded-2xl transition cursor-pointer flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-850 ${
                  !notif.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                }`}
              >
                <div className="mt-0.5">{getIconForType(notif.type)}</div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                    {notif.message}
                  </p>
                  {notif.route && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 pt-0.5">
                      <span>View details</span>
                      <ChevronRight size={12} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-start mt-1">
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteOne(e, notif.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                    title="Delete notification"
                    aria-label="Delete notification"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-850/50">
          <span>Synced locally &amp; to cloud</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
