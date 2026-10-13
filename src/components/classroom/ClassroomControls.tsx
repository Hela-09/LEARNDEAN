import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  FastForward,
  Gauge,
  Sliders,
  CheckCircle2,
  Settings2,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { chalkAudio } from '../../utils/chalkAudio';

interface ClassroomControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  speed: number;
  currentStepIndex: number;
  totalSteps: number;
  autoPlayNext: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onReplay: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onRestartLesson: () => void;
  onSetSpeed: (speed: number) => void;
  onToggleMute: () => void;
  onToggleAutoPlay: () => void;
  onFastForward: () => void;
  onJumpToStep: (index: number) => void;
  onOpenVoiceModal?: () => void;
  activeVoiceName?: string;
  stepTitles?: string[];
  viewingPageIndex?: number;
  totalPages?: number;
}

export default function ClassroomControls({
  isPlaying,
  isPaused,
  isMuted,
  speed,
  currentStepIndex,
  totalSteps,
  autoPlayNext,
  onPlay,
  onPause,
  onResume,
  onReplay,
  onPrevStep,
  onNextStep,
  onRestartLesson,
  onSetSpeed,
  onToggleMute,
  onToggleAutoPlay,
  onFastForward,
  onJumpToStep,
  onOpenVoiceModal,
  activeVoiceName,
  stepTitles = [],
  viewingPageIndex = 0,
  totalPages = 1,
}: ClassroomControlsProps) {
  const speeds = [0.75, 1.0, 1.25, 1.5];

  const handleSpeedCycle = () => {
    const currentIdx = speeds.indexOf(speed);
    const nextIdx = (currentIdx + 1) % speeds.length;
    onSetSpeed(speeds[nextIdx]);
    chalkAudio.playChalkTap();
  };

  const handlePlayPauseToggle = () => {
    if (isPlaying && !isPaused) {
      onPause();
    } else if (isPaused) {
      onResume();
    } else {
      onPlay();
    }
    chalkAudio.playChalkTap();
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm transition-all select-none space-y-3">
      {/* Top: Step Timeline Scrubber */}
      <div className="w-full flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={idx}
                onClick={() => onJumpToStep(idx)}
                title={stepTitles[idx] || `Step ${idx + 1}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20'
                    : isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={13} className="shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                )}
                <span className="hidden md:inline truncate max-w-[120px]">
                  {stepTitles[idx] ? stepTitles[idx].replace(/^\d+[\.\s]+/, '') : `Step ${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Auto-advance toggle */}
        <button
          onClick={onToggleAutoPlay}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
            autoPlayNext
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}
          title="Automatically proceed to the next step when explanation completes"
        >
          <span className={`w-2 h-2 rounded-full ${autoPlayNext ? 'bg-blue-500' : 'bg-slate-400'}`} />
          <span className="hidden sm:inline">Auto-Advance</span>
        </button>
      </div>

      {/* Main Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Step navigation + Restart Lesson */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Previous Step */}
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Prev Step</span>
          </button>

          {/* Restart Lesson Button */}
          <button
            onClick={() => {
              chalkAudio.playEraserSweep();
              onRestartLesson();
            }}
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            title="Restart Lesson from Step 1"
          >
            <RefreshCw size={14} />
            <span className="hidden md:inline">Restart Lesson</span>
          </button>
        </div>

        {/* Center: Core Playback Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Replay Step */}
          <button
            onClick={() => {
              chalkAudio.playChalkTap();
              onReplay();
            }}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer"
            title="Replay this step from beginning"
          >
            <RotateCcw size={17} />
          </button>

          {/* Primary Play / Pause / Resume Button */}
          <button
            onClick={handlePlayPauseToggle}
            className={`px-5 sm:px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isPlaying && !isPaused
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
            }`}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause size={17} />
                <span>Pause</span>
              </>
            ) : isPaused ? (
              <>
                <Play size={17} />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play size={17} />
                <span>Play Step</span>
              </>
            )}
          </button>

          {/* Fast-Forward (Instant Reveal) */}
          <button
            onClick={() => {
              chalkAudio.playChalkTap();
              onFastForward();
            }}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer"
            title="Reveal board immediately"
          >
            <FastForward size={17} />
          </button>
        </div>

        {/* Right: Next Step + Voice Settings */}
        <div className="flex items-center gap-2">
          {/* Speaking Speed Button */}
          <button
            onClick={handleSpeedCycle}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Adjust speaking speed"
          >
            <Gauge size={14} className="text-blue-500" />
            <span>{speed}x</span>
          </button>

          {/* Voice Selection Button */}
          {onOpenVoiceModal && (
            <button
              onClick={onOpenVoiceModal}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1"
              title="Change AI Teacher Voice & Accent"
            >
              <Settings2 size={16} />
              <span className="hidden lg:inline text-xs font-medium truncate max-w-[80px]">
                {activeVoiceName ? activeVoiceName.replace(/Google|Microsoft/gi, '').trim() : 'Voice'}
              </span>
            </button>
          )}

          {/* Mute Voice Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            title={isMuted ? 'Voice is muted (Silent reading)' : 'Voice is active'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Next Step Button */}
          <button
            onClick={onNextStep}
            disabled={currentStepIndex >= totalSteps - 1}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            title="Next Step"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
