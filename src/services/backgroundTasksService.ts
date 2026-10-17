import { notificationService } from './notificationService';

export type TaskType = 
  | 'notes_summary' 
  | 'notes_explain' 
  | 'notes_flashcards' 
  | 'notes_questions' 
  | 'combine_notes' 
  | 'study_journey'
  | 'practice_generation';

export type TaskStatus = 'in_progress' | 'completed' | 'failed' | 'cancelled';

export interface BackgroundTask<T = any> {
  id: string;
  uid: string;
  type: TaskType;
  title: string;
  status: TaskStatus;
  progress: number;
  statusMessage: string;
  startedAt: number;
  completedAt?: number;
  route?: string;
  routeState?: Record<string, any>;
  result?: T;
  error?: string;
  metadata?: Record<string, any>;
  isBackendJob?: boolean;
}

type TaskListener = (task: BackgroundTask) => void;

class BackgroundTasksService {
  private activeControllers: Map<string, AbortController> = new Map();
  private listeners: Map<string, Set<TaskListener>> = new Map();
  private globalListeners: Set<(tasks: BackgroundTask[]) => void> = new Set();
  private pollingIntervals: Map<string, any> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      // Sync on startup or page visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.resumeBackendJobsPolling();
        }
      });
      // Start polling for any active stored jobs on page load
      setTimeout(() => this.resumeBackendJobsPolling(), 1000);
    }
  }

  private getStorageKey(uid: string): string {
    return `zetadu_bg_tasks_${uid || 'guest'}`;
  }

  public getTasks(uid: string): BackgroundTask[] {
    try {
      if (typeof window === 'undefined') return [];
      const raw = localStorage.getItem(this.getStorageKey(uid));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveTasks(uid: string, tasks: BackgroundTask[]): void {
    try {
      if (typeof window === 'undefined') return;
      // Retain max 30 most recent tasks
      const trimmed = tasks.slice(0, 30);
      localStorage.setItem(this.getStorageKey(uid), JSON.stringify(trimmed));
      this.notifyGlobal(uid);
    } catch (_) {}
  }

  public getTask(uid: string, taskId: string): BackgroundTask | undefined {
    const all = this.getTasks(uid);
    return all.find(t => t.id === taskId);
  }

  public getActiveTask(uid: string, type?: TaskType): BackgroundTask | undefined {
    const all = this.getTasks(uid);
    return all.find(t => t.status === 'in_progress' && (!type || t.type === type));
  }

  public getRecentCompletedTask(uid: string, type: TaskType, withinSeconds = 600): BackgroundTask | undefined {
    const all = this.getTasks(uid);
    const cutoff = Date.now() - withinSeconds * 1000;
    return all.find(t => t.type === type && t.status === 'completed' && (t.completedAt || 0) > cutoff);
  }

  /**
   * Starts a persistent backend job running on the server.
   * This continues running when the user leaves the page or switches tabs.
   */
  public async startBackendJob<T>(
    uid: string,
    type: TaskType,
    title: string,
    params: Record<string, any>,
    route?: string,
    routeState?: Record<string, any>,
    token?: string | null
  ): Promise<{ taskId: string; isExisting: boolean }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/jobs/create', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        type,
        title,
        params,
        route,
        routeState
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Failed to start backend generation job (${response.status})`);
    }

    const data = await response.json();
    const serverJob = data.job;
    const isExisting = Boolean(data.isExisting);

    const clientTask: BackgroundTask<T> = {
      id: serverJob.id,
      uid,
      type,
      title: serverJob.title || title,
      status: serverJob.status,
      progress: serverJob.progress || 10,
      statusMessage: serverJob.statusMessage || 'Processing in background...',
      startedAt: serverJob.startedAt || Date.now(),
      route: serverJob.route || route,
      routeState: serverJob.routeState || routeState,
      result: serverJob.result,
      isBackendJob: true
    };

    const current = this.getTasks(uid);
    const existingIdx = current.findIndex(t => t.id === clientTask.id);
    let updated: BackgroundTask[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = clientTask;
    } else {
      updated = [
        clientTask,
        ...current.filter(t => t.id !== clientTask.id)
      ];
    }
    this.saveTasks(uid, updated);
    this.notify(clientTask);

    // Start live polling loop for this job
    this.pollBackendJob(uid, clientTask.id, token);

    return { taskId: clientTask.id, isExisting };
  }

  private pollBackendJob(uid: string, jobId: string, token?: string | null): void {
    if (this.pollingIntervals.has(jobId)) return;

    const poll = async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/jobs/${jobId}`, { headers });
        if (!res.ok) {
          if (res.status === 404) {
            this.stopPolling(jobId);
          }
          return;
        }

        const data = await res.json();
        const serverJob = data.job;
        if (!serverJob) return;

        const tasks = this.getTasks(uid);
        const index = tasks.findIndex(t => t.id === jobId);
        if (index >= 0) {
          const task = tasks[index];
          task.status = serverJob.status;
          task.progress = serverJob.progress;
          task.statusMessage = serverJob.statusMessage;
          task.completedAt = serverJob.completedAt;

          if (serverJob.status === 'completed') {
            task.result = serverJob.result;
            this.saveTasks(uid, tasks);
            this.notify(task);
            this.stopPolling(jobId);

            // Notify user
            notificationService.addNotification({
              uid,
              title: `${task.title} Ready`,
              message: serverJob.statusMessage || `${task.title} completed successfully. Tap to review.`,
              type: 'task_complete',
              route: task.route || '/upload-notes',
              routeState: task.routeState,
              taskId: task.id
            }).catch(() => {});
          } else if (serverJob.status === 'failed') {
            task.error = serverJob.error;
            this.saveTasks(uid, tasks);
            this.notify(task);
            this.stopPolling(jobId);

            notificationService.addNotification({
              uid,
              title: `${task.title} Notice`,
              message: serverJob.error || `We could not complete ${task.title}. Tap to review.`,
              type: 'task_error',
              route: task.route || '/upload-notes',
              routeState: task.routeState,
              taskId: task.id
            }).catch(() => {});
          } else if (serverJob.status === 'cancelled') {
            this.saveTasks(uid, tasks);
            this.notify(task);
            this.stopPolling(jobId);
          } else {
            // in_progress
            this.saveTasks(uid, tasks);
            this.notify(task);
          }
        }
      } catch (err) {
        // Transient network error, will retry on next poll
      }
    };

    // Run first poll immediately, then every 1500ms
    poll();
    const timer = setInterval(poll, 1500);
    this.pollingIntervals.set(jobId, timer);
  }

  private stopPolling(jobId: string): void {
    const timer = this.pollingIntervals.get(jobId);
    if (timer) {
      clearInterval(timer);
      this.pollingIntervals.delete(jobId);
    }
  }

  private resumeBackendJobsPolling(): void {
    if (typeof window === 'undefined') return;
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('zetadu_bg_tasks_'));
      for (const k of keys) {
        const uid = k.replace('zetadu_bg_tasks_', '');
        const tasks = this.getTasks(uid);
        for (const t of tasks) {
          if (t.status === 'in_progress' && (t.isBackendJob || t.id.startsWith('job_'))) {
            this.pollBackendJob(uid, t.id);
          }
        }
      }
    } catch (_) {}
  }

  /**
   * Starts and registers a new background task with its own AbortController (local fallback).
   */
  public registerTask<T>(
    uid: string,
    type: TaskType,
    title: string,
    initialMessage = 'Processing in background...',
    route?: string,
    routeState?: Record<string, any>
  ): { taskId: string; signal: AbortSignal } {
    const taskId = `task_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const controller = new AbortController();
    this.activeControllers.set(taskId, controller);

    const newTask: BackgroundTask<T> = {
      id: taskId,
      uid,
      type,
      title,
      status: 'in_progress',
      progress: 10,
      statusMessage: initialMessage,
      startedAt: Date.now(),
      route,
      routeState,
    };

    const current = this.getTasks(uid);
    const updated = [
      newTask,
      ...current.map(t => (t.type === type && t.status === 'in_progress' ? { ...t, status: 'cancelled' as TaskStatus } : t))
    ];
    this.saveTasks(uid, updated);
    this.notify(newTask);

    return { taskId, signal: controller.signal };
  }

  public updateProgress(uid: string, taskId: string, progress: number, message?: string): void {
    const tasks = this.getTasks(uid);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index >= 0) {
      tasks[index].progress = Math.min(Math.max(progress, 0), 100);
      if (message) tasks[index].statusMessage = message;
      this.saveTasks(uid, tasks);
      this.notify(tasks[index]);
    }
  }

  public completeTask<T>(uid: string, taskId: string, result: T, message = 'Completed successfully!'): void {
    this.activeControllers.delete(taskId);
    this.stopPolling(taskId);
    const tasks = this.getTasks(uid);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index >= 0) {
      const task = tasks[index];
      task.status = 'completed';
      task.progress = 100;
      task.statusMessage = message;
      task.completedAt = Date.now();
      task.result = result;
      this.saveTasks(uid, tasks);
      this.notify(task);

      // Dispatch in-app notification & browser push if permitted
      notificationService.addNotification({
        uid,
        title: `${task.title} Ready`,
        message: message || `${task.title} completed successfully. Tap to review.`,
        type: 'task_complete',
        route: task.route || (task.type.startsWith('notes') || task.type === 'combine_notes' ? '/upload-notes' : '/home'),
        routeState: task.routeState,
        taskId: task.id,
      }).catch(() => {});
    }
  }

  public failTask(uid: string, taskId: string, error: string): void {
    this.activeControllers.delete(taskId);
    this.stopPolling(taskId);
    const tasks = this.getTasks(uid);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index >= 0) {
      const task = tasks[index];
      task.status = 'failed';
      task.statusMessage = error || 'Task failed';
      task.completedAt = Date.now();
      task.error = error;
      this.saveTasks(uid, tasks);
      this.notify(task);

      // Dispatch failure notification
      notificationService.addNotification({
        uid,
        title: `${task.title} Notice`,
        message: error || `We could not complete ${task.title}. Tap to review and retry.`,
        type: 'task_error',
        route: task.route || (task.type.startsWith('notes') || task.type === 'combine_notes' ? '/upload-notes' : '/home'),
        routeState: task.routeState,
        taskId: task.id,
      }).catch(() => {});
    }
  }

  public cancelTask(uid: string, taskId: string, message = 'Canceled by user', token?: string | null): void {
    const controller = this.activeControllers.get(taskId);
    if (controller) {
      try {
        controller.abort();
      } catch (_) {}
      this.activeControllers.delete(taskId);
    }
    this.stopPolling(taskId);

    // Call backend cancel if this is a backend job
    if (taskId.startsWith('job_')) {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      fetch(`/api/jobs/${taskId}/cancel`, { method: 'POST', headers }).catch(() => {});
    }

    const tasks = this.getTasks(uid);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index >= 0) {
      tasks[index].status = 'cancelled';
      tasks[index].statusMessage = message;
      tasks[index].completedAt = Date.now();
      this.saveTasks(uid, tasks);
      this.notify(tasks[index]);
    }
  }

  public clearTask(uid: string, taskId: string): void {
    this.activeControllers.delete(taskId);
    this.stopPolling(taskId);
    const tasks = this.getTasks(uid).filter(t => t.id !== taskId);
    this.saveTasks(uid, tasks);
  }

  public subscribe(taskId: string, listener: TaskListener): () => void {
    if (!this.listeners.has(taskId)) {
      this.listeners.set(taskId, new Set());
    }
    this.listeners.get(taskId)!.add(listener);

    return () => {
      const set = this.listeners.get(taskId);
      if (set) {
        set.delete(listener);
        if (set.size === 0) this.listeners.delete(taskId);
      }
    };
  }

  public subscribeGlobal(listener: (tasks: BackgroundTask[]) => void): () => void {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  private notify(task: BackgroundTask): void {
    const listeners = this.listeners.get(task.id);
    if (listeners) {
      listeners.forEach(fn => fn(task));
    }
  }

  private notifyGlobal(uid: string): void {
    const tasks = this.getTasks(uid);
    this.globalListeners.forEach(fn => fn(tasks));
  }
}

export const backgroundTasksService = new BackgroundTasksService();
