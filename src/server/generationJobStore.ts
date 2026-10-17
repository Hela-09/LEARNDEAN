import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type JobType = 
  | 'notes_summary' 
  | 'notes_explain' 
  | 'notes_flashcards' 
  | 'notes_questions' 
  | 'combine_notes' 
  | 'study_journey'
  | 'practice_generation';

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

export interface GenerationJob {
  id: string;
  ownerUid: string;
  type: JobType;
  title: string;
  status: JobStatus;
  progress: number; // 0 - 100
  statusMessage: string;
  paramsHash: string;
  params: Record<string, any>;
  result?: any;
  error?: string;
  startedAt: number;
  completedAt?: number;
  route?: string;
  routeState?: Record<string, any>;
}

const STORAGE_FILE_LOCAL = path.resolve(process.cwd(), 'generation_jobs_store.json');
const STORAGE_FILE_TMP = '/tmp/zetadu_generation_jobs_store.json';

class GenerationJobStore {
  private jobs: Map<string, GenerationJob> = new Map();
  private abortControllers: Map<string, AbortController> = new Map();

  constructor() {
    this.loadStore();
  }

  private hashParams(type: JobType, params: Record<string, any>): string {
    try {
      const simplified = JSON.stringify({
        type,
        action: params.action,
        subject: params.subject,
        topic: params.topic,
        text: typeof params.text === 'string' ? params.text.slice(0, 500) : '',
        count: params.count,
        educationLevel: params.educationLevel,
        difficulty: params.difficulty,
        examType: params.examType,
      });
      return crypto.createHash('sha256').update(simplified).digest('hex').substring(0, 16);
    } catch {
      return `${Date.now()}`;
    }
  }

  private loadStore() {
    const candidates = [STORAGE_FILE_LOCAL, STORAGE_FILE_TMP];
    for (const filePath of candidates) {
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          const list: GenerationJob[] = JSON.parse(content);
          if (Array.isArray(list)) {
            list.forEach(j => {
              if (j && j.id) {
                // If server restarted while job was in_progress, mark as failed so it doesn't hang indefinitely
                if (j.status === 'in_progress' || j.status === 'pending') {
                  j.status = 'failed';
                  j.statusMessage = 'Job interrupted by server restart';
                  j.error = 'Job interrupted by server restart';
                  j.completedAt = Date.now();
                }
                this.jobs.set(j.id, j);
              }
            });
            return;
          }
        }
      } catch (_) {}
    }
  }

  private persistStore() {
    try {
      // Retain max 100 most recent jobs to conserve space
      const all = Array.from(this.jobs.values())
        .sort((a, b) => b.startedAt - a.startedAt)
        .slice(0, 100);
      const data = JSON.stringify(all, null, 2);
      try {
        fs.writeFileSync(STORAGE_FILE_LOCAL, data, 'utf-8');
      } catch (_) {
        try {
          fs.writeFileSync(STORAGE_FILE_TMP, data, 'utf-8');
        } catch (_) {}
      }
    } catch (_) {}
  }

  public findActiveJob(ownerUid: string, type: JobType, params: Record<string, any>): GenerationJob | undefined {
    const hash = this.hashParams(type, params);
    for (const job of this.jobs.values()) {
      if (
        job.ownerUid === ownerUid &&
        job.type === type &&
        job.paramsHash === hash &&
        (job.status === 'in_progress' || job.status === 'pending')
      ) {
        return job;
      }
    }
    return undefined;
  }

  public createJob(
    ownerUid: string,
    type: JobType,
    title: string,
    params: Record<string, any>,
    route?: string,
    routeState?: Record<string, any>
  ): { job: GenerationJob; isExisting: boolean; abortSignal: AbortSignal } {
    // Prevent duplicate jobs when users revisit a page or click multiple times
    const existing = this.findActiveJob(ownerUid, type, params);
    if (existing) {
      let controller = this.abortControllers.get(existing.id);
      if (!controller) {
        controller = new AbortController();
        this.abortControllers.set(existing.id, controller);
      }
      return { job: existing, isExisting: true, abortSignal: controller.signal };
    }

    const jobId = `job_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const controller = new AbortController();
    this.abortControllers.set(jobId, controller);

    const job: GenerationJob = {
      id: jobId,
      ownerUid,
      type,
      title,
      status: 'in_progress',
      progress: 10,
      statusMessage: 'Starting generation...',
      paramsHash: this.hashParams(type, params),
      params,
      startedAt: Date.now(),
      route,
      routeState
    };

    this.jobs.set(jobId, job);
    this.persistStore();

    return { job, isExisting: false, abortSignal: controller.signal };
  }

  public updateJobProgress(jobId: string, progress: number, message?: string) {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'cancelled' || job.status === 'completed' || job.status === 'failed') return;
    job.progress = Math.min(100, Math.max(0, Math.round(progress)));
    if (message) job.statusMessage = message;
    this.persistStore();
  }

  public completeJob(jobId: string, result: any, message = 'Completed successfully') {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'cancelled') return;
    this.abortControllers.delete(jobId);
    job.status = 'completed';
    job.progress = 100;
    job.statusMessage = message;
    job.completedAt = Date.now();
    job.result = result;
    this.persistStore();
  }

  public failJob(jobId: string, error: string) {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'cancelled') return;
    this.abortControllers.delete(jobId);
    job.status = 'failed';
    job.statusMessage = error || 'Generation failed';
    job.error = error;
    job.completedAt = Date.now();
    this.persistStore();
  }

  public cancelJob(jobId: string, ownerUid?: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;
    if (ownerUid && job.ownerUid !== ownerUid && job.ownerUid !== 'guest' && ownerUid !== 'admin') {
      return false;
    }
    const controller = this.abortControllers.get(jobId);
    if (controller) {
      try {
        controller.abort();
      } catch (_) {}
      this.abortControllers.delete(jobId);
    }
    job.status = 'cancelled';
    job.statusMessage = 'Cancelled by user';
    job.completedAt = Date.now();
    this.persistStore();
    return true;
  }

  public getJob(jobId: string): GenerationJob | undefined {
    return this.jobs.get(jobId);
  }

  public getUserJobs(ownerUid: string, limit = 20): GenerationJob[] {
    const list: GenerationJob[] = [];
    for (const job of this.jobs.values()) {
      if (job.ownerUid === ownerUid || job.ownerUid === 'guest') {
        list.push(job);
      }
    }
    return list
      .sort((a, b) => b.startedAt - a.startedAt)
      .slice(0, limit);
  }
}

export const generationJobStore = new GenerationJobStore();
