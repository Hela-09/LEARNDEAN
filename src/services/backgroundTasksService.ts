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
  result?: T;
  error?: string;
  metadata?: Record<string, any>;
}

type TaskListener = (task: BackgroundTask) => void;

class BackgroundTasksService {
  private activeControllers: Map<string, AbortController> = new Map();
  private listeners: Map<string, Set<TaskListener>> = new Map();
  private globalListeners: Set<(tasks: BackgroundTask[]) => void> = new Set();

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
      // Retain max 20 most recent tasks
      const trimmed = tasks.slice(0, 20);
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
   * Starts and registers a new background task with its own AbortController.
   */
  public registerTask<T>(
    uid: string,
    type: TaskType,
    title: string,
    initialMessage = 'Processing in background...'
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
      startedAt: Date.now()
    };

    const current = this.getTasks(uid);
    // Replace any previous in_progress task of same type with cancelled
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
    const tasks = this.getTasks(uid);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index >= 0) {
      tasks[index].status = 'completed';
      tasks[index].progress = 100;
      tasks[index].statusMessage = message;
      tasks[index].completedAt = Date.now();
      tasks[index].result = result;
      this.saveTasks(uid, tasks);
      this.notify(tasks[index]);
    }
  }

  public failTask(uid: string, taskId: string, error: string): void {
    this.activeControllers.delete(taskId);
    const tasks = this.getTasks(uid);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index >= 0) {
      tasks[index].status = 'failed';
      tasks[index].statusMessage = error || 'Task failed';
      tasks[index].completedAt = Date.now();
      tasks[index].error = error;
      this.saveTasks(uid, tasks);
      this.notify(tasks[index]);
    }
  }

  public cancelTask(uid: string, taskId: string, message = 'Canceled by user'): void {
    const controller = this.activeControllers.get(taskId);
    if (controller) {
      controller.abort();
      this.activeControllers.delete(taskId);
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
