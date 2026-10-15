import React, { useState, useEffect } from 'react';
import { Loader2, Square, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { backgroundTasksService, BackgroundTask } from '../services/backgroundTasksService';
import { useAuth } from '../contexts/AuthContext';

export default function BackgroundActivityIndicator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTasks, setActiveTasks] = useState<BackgroundTask[]>([]);

  useEffect(() => {
    const uid = user?.uid || 'guest';
    const checkTasks = () => {
      const all = backgroundTasksService.getTasks(uid);
      const running = all.filter((t) => t.status === 'in_progress');
      setActiveTasks(running);
    };

    checkTasks();
    const unsubscribe = backgroundTasksService.subscribeGlobal(() => {
      checkTasks();
    });

    const interval = setInterval(checkTasks, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [user?.uid]);

  if (activeTasks.length === 0) return null;

  const currentTask = activeTasks[0];

  const handleReturnToActivity = () => {
    if (currentTask.route) {
      navigate(currentTask.route, { state: currentTask.routeState });
    } else if (currentTask.type.startsWith('notes') || currentTask.type === 'combine_notes') {
      navigate('/upload-notes');
    } else if (currentTask.type === 'practice_generation') {
      navigate('/practice');
    }
  };

  const handleStopTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    backgroundTasksService.cancelTask(user?.uid || 'guest', currentTask.id);
  };

  return (
    <div 
      className="fixed bottom-20 md:bottom-6 right-4 z-40 max-w-sm animate-in slide-in-from-bottom-3 duration-200"
      role="status"
      aria-live="polite"
    >
      <div 
        onClick={handleReturnToActivity}
        className="flex items-center gap-2.5 p-2.5 pl-3.5 bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/80 hover:border-blue-500 transition-all cursor-pointer group"
      >
        <Loader2 size={16} className="animate-spin text-blue-400 shrink-0" />

        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-extrabold truncate text-slate-100">
              {currentTask.title}
            </span>
            <span className="font-mono text-[10px] text-blue-300 font-bold">
              {currentTask.progress}%
            </span>
          </div>

          <p className="text-[10px] text-slate-400 truncate">
            {currentTask.statusMessage || 'Processing in background...'}
          </p>

          {/* Progress bar */}
          <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mt-1.5">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(8, currentTask.progress)}%` }}
            />
          </div>
        </div>

        {/* Compact Stop Generation Button */}
        <button
          type="button"
          onClick={handleStopTask}
          className="p-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-rose-600 dark:hover:bg-rose-600 text-rose-400 hover:text-white transition cursor-pointer shrink-0"
          title="Stop generation"
          aria-label="Stop generation"
        >
          <Square size={13} className="fill-current" />
        </button>
      </div>
    </div>
  );
}
