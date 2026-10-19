import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ClassroomStep } from '../../types/classroom';
import HandwrittenBoardContent, { BoardMode, BlackboardSlateTheme } from './HandwrittenBoardContent';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Palette,
  Eraser,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { chalkAudio } from '../../utils/chalkAudio';

interface ChalkboardViewProps {
  allSteps: ClassroomStep[];
  currentStepIndex: number;
  totalSteps: number;
  progress: number; // 0 to 1 for the currently active step
  isPlaying: boolean;
  isPaused: boolean;
  lessonTitle: string;
  subject: string;
  topic: string;
  viewingPageIndex: number;
  onSetViewingPage: (page: number) => void;
  onWipeBoard?: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  isWritingNotes?: boolean;
}

// Capacity rule: 2 steps per page, or 1 step if it has a large worked example or diagram
export function calculateStepPages(steps: ClassroomStep[]): number[][] {
  const pages: number[][] = [];
  let currentPage: number[] = [];

  steps.forEach((step, idx) => {
    const hasHeavyContent = !!(step.chalkboard?.workedExample || step.chalkboard?.diagram);
    const currentPageHasHeavy = currentPage.some(
      (sIdx) => !!(steps[sIdx]?.chalkboard?.workedExample || steps[sIdx]?.chalkboard?.diagram)
    );

    if (currentPage.length >= 2 || (currentPage.length >= 1 && (hasHeavyContent || currentPageHasHeavy))) {
      pages.push(currentPage);
      currentPage = [idx];
    } else {
      currentPage.push(idx);
    }
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages.length > 0 ? pages : [[0]];
}

export default function ChalkboardView({
  allSteps,
  currentStepIndex,
  totalSteps,
  progress,
  isPlaying,
  isPaused,
  lessonTitle,
  subject,
  topic,
  viewingPageIndex,
  onSetViewingPage,
  onWipeBoard,
  isFullScreen = false,
  onToggleFullScreen,
  isWritingNotes = false,
}: ChalkboardViewProps) {
  // Board Mode: 'blackboard' vs 'whiteboard'
  const [boardMode, setBoardMode] = useState<BoardMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learndean_classroom_board_mode');
      if (saved === 'whiteboard' || saved === 'blackboard') return saved;
    }
    return 'blackboard';
  });

  // Blackboard Slate Theme: 'green' vs 'black'
  const [blackboardTheme, setBlackboardTheme] = useState<BlackboardSlateTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('learndean_blackboard_slate_theme');
      if (saved === 'green' || saved === 'black') return saved;
    }
    return 'green';
  });

  const [isWiping, setIsWiping] = useState<boolean>(false);
  const boardScrollRef = useRef<HTMLDivElement>(null);

  // Persist board mode changes
  const handleToggleBoardMode = () => {
    chalkAudio.playEraserSweep();
    setBoardMode((prev) => {
      const next: BoardMode = prev === 'blackboard' ? 'whiteboard' : 'blackboard';
      if (typeof window !== 'undefined') {
        localStorage.setItem('learndean_classroom_board_mode', next);
      }
      return next;
    });
  };

  const handleToggleBlackboardTheme = () => {
    chalkAudio.playChalkTap();
    setBlackboardTheme((prev) => {
      const next: BlackboardSlateTheme = prev === 'green' ? 'black' : 'green';
      if (typeof window !== 'undefined') {
        localStorage.setItem('learndean_blackboard_slate_theme', next);
      }
      return next;
    });
  };

  // Calculate pages
  const stepPages = useMemo(() => calculateStepPages(allSteps), [allSteps]);
  const totalPages = stepPages.length;

  // Find which page the active step currently lives on
  const activeStepPageIndex = useMemo(() => {
    for (let p = 0; p < stepPages.length; p++) {
      if (stepPages[p].includes(currentStepIndex)) return p;
    }
    return 0;
  }, [stepPages, currentStepIndex]);

  // When active step page changes, auto-advance viewing page if user was on the previous active page
  useEffect(() => {
    onSetViewingPage(activeStepPageIndex);
  }, [activeStepPageIndex]);

  // Auto-scroll board smoothly to show active writing without jarring shifts
  useEffect(() => {
    if (boardScrollRef.current && viewingPageIndex === activeStepPageIndex) {
      boardScrollRef.current.scrollTo({
        top: boardScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [currentStepIndex, viewingPageIndex, activeStepPageIndex]);

  const handleWipeClick = () => {
    setIsWiping(true);
    chalkAudio.playEraserSweep();
    setTimeout(() => {
      setIsWiping(false);
      if (onWipeBoard) onWipeBoard();
    }, 450);
  };

  // Steps that appear on the currently viewed page
  const stepsOnViewingPage = stepPages[viewingPageIndex] || [];
  const isViewingLivePage = viewingPageIndex === activeStepPageIndex;

  const isWhiteboard = boardMode === 'whiteboard';

  // Surface background styles
  const boardBgClass = isWhiteboard
    ? 'bg-[#ffffff] text-slate-900 border border-slate-300/80'
    : blackboardTheme === 'green'
    ? 'bg-[#122319] text-[#f8fafc]'
    : 'bg-[#14181c] text-[#f8fafc]';

  // Frame styling: Oak wood for blackboard vs Brushed aluminum for whiteboard
  const frameStyle: React.CSSProperties = isWhiteboard
    ? {
        background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 35%, #e2e8f0 70%, #64748b 100%)',
        boxShadow:
          '0 20px 45px -10px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.3)',
      }
    : {
        background: 'linear-gradient(135deg, #422614 0%, #683e20 35%, #523018 70%, #381f0e 100%)',
        boxShadow:
          '0 20px 45px -10px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.85)',
      };

  return (
    <div className="w-full flex flex-col items-center select-none transition-all duration-300">
      {/* Outer Real Physical Board Frame (Wood for Blackboard, Aluminum for Whiteboard) */}
      <div
        className={`w-full relative rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 transition-all shadow-2xl ${
          isFullScreen ? 'min-h-[85vh]' : 'min-h-[500px] sm:min-h-[600px]'
        }`}
        style={frameStyle}
      >
        {/* Top Metallic Wall Mount Brackets */}
        <div
          className={`absolute top-1 left-8 w-6 h-2 rounded-t-sm shadow-xs border-b ${
            isWhiteboard
              ? 'bg-slate-400 border-slate-600'
              : 'bg-neutral-400/80 border-black/50'
          }`}
        />
        <div
          className={`absolute top-1 right-8 w-6 h-2 rounded-t-sm shadow-xs border-b ${
            isWhiteboard
              ? 'bg-slate-400 border-slate-600'
              : 'bg-neutral-400/80 border-black/50'
          }`}
        />

        {/* Board Header Toolbar: Subject, Page Tabs, Mode Switcher, Wipe, Fullscreen */}
        <div
          className={`w-full mb-2 px-2 flex flex-wrap items-center justify-between gap-2 text-xs font-medium ${
            isWhiteboard ? 'text-slate-700' : 'text-amber-200/90'
          }`}
        >
          {/* Subject & Topic Title */}
          <div className="flex items-center gap-2 truncate min-w-0">
            <span
              className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] shrink-0 ${
                isWhiteboard
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-black/45 text-amber-300'
              }`}
            >
              {subject}
            </span>
            <span className="truncate opacity-95 text-[11px] sm:text-xs font-mono font-bold">
              {topic || lessonTitle}
            </span>
          </div>

          {/* Center: Chalkboard / Whiteboard Page Selector Tabs */}
          <div
            className={`flex items-center gap-1 p-0.5 rounded-xl border ${
              isWhiteboard
                ? 'bg-white/80 border-slate-300 shadow-xs'
                : 'bg-black/40 border-white/10'
            }`}
          >
            <button
              onClick={() => {
                if (viewingPageIndex > 0) {
                  chalkAudio.playEraserSweep();
                  onSetViewingPage(viewingPageIndex - 1);
                }
              }}
              disabled={viewingPageIndex === 0}
              className={`p-1 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                isWhiteboard ? 'hover:bg-slate-100 text-slate-700' : 'text-amber-200 hover:text-white'
              }`}
              title="Previous Board Page"
            >
              <ChevronLeft size={14} />
            </button>

            {stepPages.map((_, pIdx) => {
              const isSelected = pIdx === viewingPageIndex;
              const isLive = pIdx === activeStepPageIndex;

              return (
                <button
                  key={pIdx}
                  onClick={() => {
                    chalkAudio.playChalkTap();
                    onSetViewingPage(pIdx);
                  }}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? isWhiteboard
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-amber-400/30 text-amber-100 border border-amber-300/60 shadow-xs'
                      : isWhiteboard
                      ? 'text-slate-600 hover:bg-slate-200/70'
                      : 'text-amber-200/70 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Board Page ${pIdx + 1}`}
                >
                  <span>Board Page {pIdx + 1}</span>
                  {isLive && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                        isWhiteboard ? 'bg-emerald-500' : 'bg-emerald-400'
                      }`}
                      title="Active writing page"
                    />
                  )}
                </button>
              );
            })}

            <button
              onClick={() => {
                if (viewingPageIndex < totalPages - 1) {
                  chalkAudio.playEraserSweep();
                  onSetViewingPage(viewingPageIndex + 1);
                }
              }}
              disabled={viewingPageIndex >= totalPages - 1}
              className={`p-1 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                isWhiteboard ? 'hover:bg-slate-100 text-slate-700' : 'text-amber-200 hover:text-white'
              }`}
              title="Next Board Page"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Right Tools: Switch Mode (Blackboard vs Whiteboard), Slate Color, Wipe, Fullscreen */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Primary Mode Switcher Button: Blackboard vs Whiteboard */}
            <button
              id="classroom-board-mode-toggle"
              onClick={handleToggleBoardMode}
              title={`Switch to ${isWhiteboard ? 'Classic Blackboard' : 'Modern Whiteboard'}`}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isWhiteboard
                  ? 'bg-slate-800 text-white hover:bg-slate-900 border border-slate-700'
                  : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-700/80 border border-emerald-600/50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-current" />
              <span>{isWhiteboard ? 'Switch to Blackboard' : 'Switch to Whiteboard'}</span>
            </button>

            {/* Blackboard Slate Color Theme (Green vs Black Slate) */}
            {!isWhiteboard && (
              <button
                onClick={handleToggleBlackboardTheme}
                title={`Switch to ${blackboardTheme === 'green' ? 'Black Slate' : 'Dark Green Slate'}`}
                className="px-2 py-1 rounded-lg bg-black/35 hover:bg-black/55 text-amber-200 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Palette size={12} />
                <span>{blackboardTheme === 'green' ? 'Green' : 'Black'}</span>
              </button>
            )}

            {/* Wipe Board button */}
            <button
              onClick={handleWipeClick}
              title="Wipe Board Surface"
              className={`px-2 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                isWhiteboard
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  : 'bg-black/30 hover:bg-black/50 text-amber-200'
              }`}
            >
              <Eraser size={12} />
              <span>Wipe</span>
            </button>

            {/* Fullscreen toggle */}
            {onToggleFullScreen && (
              <button
                onClick={onToggleFullScreen}
                title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Board'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isWhiteboard
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    : 'bg-black/30 hover:bg-black/50 text-amber-200'
                }`}
              >
                {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
            )}
          </div>
        </div>

        {/* Inner Physical Board Writing Canvas (Blackboard or Whiteboard) */}
        <div
          ref={boardScrollRef}
          className={`w-full relative rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 overflow-y-auto transition-colors duration-300 shadow-inner flex flex-col justify-between ${boardBgClass} ${
            isFullScreen ? 'min-h-[75vh]' : 'min-h-[440px] sm:min-h-[520px]'
          }`}
          style={
            isWhiteboard
              ? {
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px),
                    radial-gradient(ellipse at 50% 10%, rgba(255,255,255,1) 0%, rgba(248,250,252,0.85) 100%)
                  `,
                  backgroundSize: '24px 24px, 24px 24px, 100% 100%',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.06), inset 0 0 60px rgba(0,0,0,0.02)',
                }
              : {
                  backgroundImage: `
                    radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.35) 100%),
                    radial-gradient(circle at 10% 85%, rgba(255,255,255,0.02) 0%, transparent 60%)
                  `,
                  boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.75), inset 0 0 100px rgba(0,0,0,0.4)',
                }
          }
        >
          {/* Subtle Chalk Dust Smudges Overlay for Blackboard */}
          {!isWhiteboard && (
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          )}

          {/* Felt Eraser Sweep Animation Transition */}
          {isWiping && (
            <div className="absolute inset-0 z-30 bg-white/25 backdrop-blur-xs flex items-center justify-center animate-pulse transition-opacity">
              <div
                className={`w-32 h-16 rounded-lg border-2 flex items-center justify-center shadow-2xl ${
                  isWhiteboard
                    ? 'bg-blue-900 border-blue-950 text-white'
                    : 'bg-amber-800 border-amber-950 text-amber-200'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  WIPING BOARD...
                </span>
              </div>
            </div>
          )}

          {/* Top Rail: Active Page Banner & Indicator */}
          <div
            className={`relative z-10 w-full flex items-center justify-between pb-3 border-b ${
              isWhiteboard ? 'border-slate-200 text-slate-600' : 'border-white/15 text-white/80'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isWhiteboard
                    ? 'bg-blue-600 shadow-[0_0_8px_#2563eb]'
                    : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                }`}
              />
              <span className="font-mono text-xs tracking-widest uppercase font-bold">
                {isWhiteboard ? 'WHITEBOARD' : 'BLACKBOARD'} PAGE {viewingPageIndex + 1} OF {totalPages}
              </span>
            </div>

            {/* Notification when viewing an earlier page while writing is on active page */}
            {!isViewingLivePage && (
              <button
                onClick={() => onSetViewingPage(activeStepPageIndex)}
                className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                  isWhiteboard
                    ? 'bg-blue-50 border border-blue-300 text-blue-700 hover:bg-blue-100'
                    : 'bg-amber-500/25 border border-amber-400/50 text-amber-200 hover:bg-amber-500/40'
                }`}
              >
                <span>Viewing Archived Page • Jump to Live Page {activeStepPageIndex + 1}</span>
                <ArrowRight size={12} />
              </button>
            )}

            {isViewingLivePage && isWritingNotes && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] animate-pulse ${
                  isWhiteboard
                    ? 'bg-blue-50 border border-blue-300 text-blue-700'
                    : 'bg-amber-500/20 border border-amber-400/50 text-amber-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-ping ${
                    isWhiteboard ? 'bg-blue-600' : 'bg-amber-400'
                  }`}
                />
                <span>WRITING NOTES ON BOARD STROKE-BY-STROKE...</span>
              </div>
            )}
            {isViewingLivePage && !isWritingNotes && isPlaying && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] animate-pulse ${
                  isWhiteboard
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                    : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isWhiteboard ? 'bg-emerald-600' : 'bg-emerald-400'
                  }`}
                />
                <span>TEACHER EXPLAINING NOTES CLEARLY</span>
              </div>
            )}
            {isViewingLivePage && isPaused && (
              <div
                className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                  isWhiteboard
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-yellow-500/20 border border-yellow-400/40 text-yellow-300'
                }`}
              >
                PAUSED
              </div>
            )}
          </div>

          {/* Main Board Content: Retains previous writing as lesson continues */}
          <div className="relative z-10 w-full flex-1 py-4 space-y-6 sm:space-y-8">
            {stepsOnViewingPage.map((stepIndex) => {
              // Only render steps that have been reached up to currentStepIndex
              if (stepIndex > currentStepIndex) return null;

              const step = allSteps[stepIndex];
              if (!step) return null;

              const isCurrentActiveStep = stepIndex === currentStepIndex;

              return (
                <HandwrittenBoardContent
                  key={step.id || stepIndex}
                  step={step}
                  stepIndex={stepIndex}
                  totalSteps={totalSteps}
                  isActiveStep={isCurrentActiveStep}
                  isWritingNotes={isWritingNotes && isCurrentActiveStep}
                  boardMode={boardMode}
                  blackboardTheme={blackboardTheme}
                  writingSpeed={1.0}
                  isClassroomPlaying={isPlaying}
                  isClassroomPaused={isPaused}
                  speechProgress={isCurrentActiveStep ? progress : 1}
                />
              );
            })}
          </div>

          {/* Bottom Board Metadata */}
          <div
            className={`relative z-10 w-full pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
              isWhiteboard ? 'border-slate-200 text-slate-400' : 'border-white/10 text-white/40'
            }`}
          >
            <span>
              LearnDean {isWhiteboard ? 'Porcelain Whiteboard' : 'Slate Blackboard'} • Page {viewingPageIndex + 1}
            </span>
            <span>Academic Studio Mode: {isWhiteboard ? 'Whiteboard Marker' : 'Chalk Hand'}</span>
          </div>
        </div>

        {/* Realistic Physical Board Tray (Chalk Tray for Blackboard vs Marker Tray for Whiteboard) */}
        {isWhiteboard ? (
          /* Sleek Aluminum Whiteboard Marker Tray */
          <div
            className="w-full h-8 sm:h-10 mt-1 rounded-b-xl flex items-center justify-between px-4 sm:px-6 shadow-inner relative"
            style={{
              background: 'linear-gradient(180deg, #94a3b8 0%, #cbd5e1 50%, #64748b 100%)',
              borderTop: '2px solid rgba(0,0,0,0.15)',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.7), 0 3px 6px rgba(0,0,0,0.2)',
            }}
          >
            {/* Dry-Erase Chisel Tip Markers */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Black / Navy marker */}
              <div
                className="w-10 sm:w-14 h-3 sm:h-4 bg-slate-900 rounded-xs shadow-md border border-slate-700 transform -rotate-1 cursor-pointer hover:scale-105 transition-transform flex items-center justify-end pr-1"
                title="Black Dry-Erase Marker"
                onClick={() => chalkAudio.playChalkTap()}
              >
                <div className="w-1.5 h-full bg-slate-400 rounded-r-xs" />
              </div>
              {/* Blue marker */}
              <div
                className="w-9 sm:w-12 h-3 sm:h-4 bg-blue-600 rounded-xs shadow-md border border-blue-400 transform rotate-1 cursor-pointer hover:scale-105 transition-transform flex items-center justify-end pr-1"
                title="Blue Dry-Erase Marker"
                onClick={() => chalkAudio.playChalkTap()}
              >
                <div className="w-1.5 h-full bg-blue-300 rounded-r-xs" />
              </div>
              {/* Red marker */}
              <div
                className="w-8 sm:w-11 h-3 sm:h-4 bg-rose-600 rounded-xs shadow-md border border-rose-400 transform -rotate-2 cursor-pointer hover:scale-105 transition-transform flex items-center justify-end pr-1"
                title="Red Dry-Erase Marker"
                onClick={() => chalkAudio.playChalkTap()}
              >
                <div className="w-1.5 h-full bg-rose-300 rounded-r-xs" />
              </div>
              {/* Green marker */}
              <div
                className="hidden sm:flex w-9 h-3.5 bg-emerald-600 rounded-xs shadow-md border border-emerald-400 transform rotate-2 cursor-pointer hover:scale-105 transition-transform items-center justify-end pr-1"
                title="Green Dry-Erase Marker"
                onClick={() => chalkAudio.playChalkTap()}
              >
                <div className="w-1.5 h-full bg-emerald-300 rounded-r-xs" />
              </div>
            </div>

            {/* Magnetic Whiteboard Felt Eraser */}
            <div
              onClick={handleWipeClick}
              className="flex items-center gap-1.5 cursor-pointer hover:brightness-110 transition-all"
              title="Click to wipe whiteboard"
            >
              <div className="w-14 sm:w-20 h-4 sm:h-5 bg-blue-900 rounded-sm border border-blue-950 flex items-center justify-center shadow-md">
                <div className="w-full h-1 bg-slate-800 mt-auto rounded-b-xs" />
              </div>
              <span className="text-[10px] text-slate-800 font-mono font-bold hidden md:inline">
                Felt Eraser
              </span>
            </div>
          </div>
        ) : (
          /* Classic Authentic Wooden Chalkboard Tray */
          <div
            className="w-full h-8 sm:h-10 mt-1 rounded-b-xl flex items-center justify-between px-4 sm:px-6 shadow-inner relative"
            style={{
              background: 'linear-gradient(180deg, #382110 0%, #4a2d16 60%, #2e1a0b 100%)',
              borderTop: '2px solid rgba(0,0,0,0.6)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.7), 0 3px 6px rgba(0,0,0,0.5)',
            }}
          >
            {/* Left Chalk Sticks */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* White chalk */}
              <div
                className="w-8 sm:w-12 h-2.5 sm:h-3.5 bg-white rounded-xs shadow-md border border-white/80 transform -rotate-1 cursor-pointer hover:scale-105 transition-transform"
                title="White Chalk"
                onClick={() => chalkAudio.playChalkTap()}
              />
              {/* Yellow chalk */}
              <div
                className="w-6 sm:w-10 h-2.5 sm:h-3.5 bg-[#fef08a] rounded-xs shadow-md border border-yellow-200/80 transform rotate-1 cursor-pointer hover:scale-105 transition-transform"
                title="Yellow Chalk"
                onClick={() => chalkAudio.playChalkTap()}
              />
              {/* Cyan chalk */}
              <div
                className="w-7 sm:w-9 h-2.5 sm:h-3.5 bg-[#7dd3fc] rounded-xs shadow-md border border-cyan-200/80 transform -rotate-2 cursor-pointer hover:scale-105 transition-transform"
                title="Cyan Chalk"
                onClick={() => chalkAudio.playChalkTap()}
              />
              {/* Pink chalk */}
              <div
                className="hidden sm:block w-8 h-3 bg-[#fca5a5] rounded-xs shadow-md border border-pink-200/80 transform rotate-2 cursor-pointer hover:scale-105 transition-transform"
                title="Pink Chalk"
                onClick={() => chalkAudio.playChalkTap()}
              />
            </div>

            {/* Right Classic Wooden Felt Eraser in Tray */}
            <div
              onClick={handleWipeClick}
              className="flex items-center gap-1.5 cursor-pointer hover:brightness-110 transition-all"
              title="Click to wipe chalkboard"
            >
              <div className="w-14 sm:w-20 h-4 sm:h-5 bg-[#6b4226] rounded-sm border border-[#3e2412] flex items-center justify-center shadow-md">
                <div className="w-full h-1 bg-[#2b2b2b] mt-auto rounded-b-xs" />
              </div>
              <span className="text-[10px] text-amber-300/70 font-mono hidden md:inline">
                Chalk Eraser
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
