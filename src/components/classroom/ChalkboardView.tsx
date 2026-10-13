import React, { useState, useEffect, useMemo } from 'react';
import { ClassroomStep, ChalkboardContent } from '../../types/classroom';
import ChalkboardDiagrams from './ChalkboardDiagrams';
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
}

// Helper to determine which page each step belongs to
// Capacity rule: 2 steps per page, or 1 step if it has a large worked example or diagram
export function calculateStepPages(steps: ClassroomStep[]): number[][] {
  const pages: number[][] = [];
  let currentPage: number[] = [];

  steps.forEach((step, idx) => {
    const hasHeavyContent = !!(step.chalkboard?.workedExample || step.chalkboard?.diagram);
    const currentPageHasHeavy = currentPage.some(
      (sIdx) => !!(steps[sIdx]?.chalkboard?.workedExample || steps[sIdx]?.chalkboard?.diagram)
    );

    // If current page already has 2 steps, or has heavy content, or this step is heavy, start a new page
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
}: ChalkboardViewProps) {
  const [boardTheme, setBoardTheme] = useState<'green' | 'black'>('green');
  const [isWiping, setIsWiping] = useState<boolean>(false);

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
  }, [activeStepPageIndex, onSetViewingPage]);

  // Board background styles
  const boardBgClass =
    boardTheme === 'green'
      ? 'bg-[#122319] text-[#f8fafc]'
      : 'bg-[#14181c] text-[#f8fafc]';

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

  return (
    <div className="w-full flex flex-col items-center select-none transition-all duration-300">
      {/* Outer Real Wood Frame */}
      <div
        className={`w-full relative rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 transition-all shadow-2xl ${
          isFullScreen ? 'min-h-[85vh]' : 'min-h-[500px] sm:min-h-[600px]'
        }`}
        style={{
          background: 'linear-gradient(135deg, #422614 0%, #683e20 35%, #523018 70%, #381f0e 100%)',
          boxShadow: '0 20px 45px -10px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.85)',
        }}
      >
        {/* Top Metallic Wall Mount Brackets */}
        <div className="absolute top-1 left-8 w-6 h-2 bg-neutral-400/80 rounded-t-sm shadow-xs border-b border-black/50"></div>
        <div className="absolute top-1 right-8 w-6 h-2 bg-neutral-400/80 rounded-t-sm shadow-xs border-b border-black/50"></div>

        {/* Board Header Toolbar: Subject, Page Selector, Theme, Fullscreen */}
        <div className="w-full mb-1.5 px-2 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-200/90 font-medium">
          {/* Subject & Topic Title */}
          <div className="flex items-center gap-2 truncate min-w-0">
            <span className="px-2 py-0.5 rounded bg-black/45 text-amber-300 font-bold uppercase tracking-wider text-[10px] shrink-0">
              {subject}
            </span>
            <span className="truncate opacity-90 text-[11px] sm:text-xs font-mono">
              {topic || lessonTitle}
            </span>
          </div>

          {/* Center: Chalkboard Page Selector Tabs (Page 1, Page 2, Page 3...) */}
          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => {
                if (viewingPageIndex > 0) {
                  chalkAudio.playEraserSweep();
                  onSetViewingPage(viewingPageIndex - 1);
                }
              }}
              disabled={viewingPageIndex === 0}
              className="p-1 rounded-lg text-amber-200 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
                  className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-400/30 text-amber-100 border border-amber-300/60 shadow-xs'
                      : 'text-amber-200/70 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Board Page ${pIdx + 1}`}
                >
                  <span>Board Page {pIdx + 1}</span>
                  {isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Active writing page" />
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
              className="p-1 rounded-lg text-amber-200 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Next Board Page"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Right Tools: Theme & Fullscreen */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Theme switcher: Classic Dark Green vs Black */}
            <button
              onClick={() => setBoardTheme((t) => (t === 'green' ? 'black' : 'green'))}
              title={`Switch to ${boardTheme === 'green' ? 'Black Chalkboard' : 'Dark Green Chalkboard'}`}
              className="px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 text-amber-200 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Palette size={12} />
              <span className="capitalize">{boardTheme === 'green' ? 'Green Slate' : 'Black Slate'}</span>
            </button>

            {/* Wipe Board button */}
            <button
              onClick={handleWipeClick}
              title="Wipe Chalkboard"
              className="px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 text-amber-200 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Eraser size={12} />
              <span>Wipe</span>
            </button>

            {/* Fullscreen toggle */}
            {onToggleFullScreen && (
              <button
                onClick={onToggleFullScreen}
                title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Board'}
                className="p-1 rounded bg-black/30 hover:bg-black/50 text-amber-200 transition-colors cursor-pointer"
              >
                {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
            )}
          </div>
        </div>

        {/* Inner Chalkboard Slate */}
        <div
          className={`w-full relative rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 overflow-y-auto transition-colors duration-300 shadow-inner flex flex-col justify-between ${boardBgClass} ${
            isFullScreen ? 'min-h-[75vh]' : 'min-h-[440px] sm:min-h-[520px]'
          }`}
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.35) 100%),
              radial-gradient(circle at 10% 85%, rgba(255,255,255,0.02) 0%, transparent 60%)
            `,
            boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.75), inset 0 0 100px rgba(0,0,0,0.4)',
          }}
        >
          {/* Subtle Chalk Dust Smudges Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Felt Eraser Sweep Animation Transition */}
          {isWiping && (
            <div className="absolute inset-0 z-30 bg-white/20 backdrop-blur-xs flex items-center justify-center animate-pulse transition-opacity">
              <div className="w-28 h-14 bg-amber-800 rounded-md border-2 border-amber-950 flex items-center justify-center shadow-2xl">
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-widest">WIPING BOARD...</span>
              </div>
            </div>
          )}

          {/* Top Rail: Active Page Banner & Indicator */}
          <div className="relative z-10 w-full flex items-center justify-between pb-3 border-b border-white/15">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-xs text-white/80 tracking-widest uppercase">
                BOARD PAGE {viewingPageIndex + 1} OF {totalPages}
              </span>
            </div>

            {/* Notification when viewing a previous page while live writing is on another page */}
            {!isViewingLivePage && (
              <button
                onClick={() => onSetViewingPage(activeStepPageIndex)}
                className="px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-200 font-mono text-[11px] flex items-center gap-1 cursor-pointer hover:bg-amber-500/40 transition-colors"
              >
                <span>Viewing Archived Page • Jump to Live Page {activeStepPageIndex + 1}</span>
                <ArrowRight size={12} />
              </button>
            )}

            {isViewingLivePage && isPlaying && (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>TEACHER WRITING ON BOARD</span>
              </div>
            )}
            {isViewingLivePage && isPaused && (
              <div className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 font-mono text-[11px]">
                PAUSED
              </div>
            )}
          </div>

          {/* Main Board Content: Renders ALL steps allocated to this page that have been reached! */}
          <div className="relative z-10 w-full flex-1 py-4 space-y-6 sm:space-y-8">
            {stepsOnViewingPage.map((stepIndex) => {
              // Only render steps that have been reached up to currentStepIndex
              if (stepIndex > currentStepIndex) return null;

              const step = allSteps[stepIndex];
              if (!step) return null;

              // If this is an earlier step on this page, render it completely (progress = 1)
              // If this is the active current step, render it with animated handwriting progress
              const isCurrentActiveStep = stepIndex === currentStepIndex;
              const stepProgress = isCurrentActiveStep ? progress : 1.0;

              return (
                <ChalkboardStepBlock
                  key={step.id || stepIndex}
                  step={step}
                  stepIndex={stepIndex}
                  totalSteps={totalSteps}
                  progress={stepProgress}
                  isActiveStep={isCurrentActiveStep}
                  isPlaying={isPlaying && isCurrentActiveStep}
                />
              );
            })}
          </div>

          {/* Bottom Chalkboard Metadata */}
          <div className="relative z-10 w-full pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
            <span>LearnDean Digital Chalkboard • Page {viewingPageIndex + 1}</span>
            <span>Room: Academic Studio</span>
          </div>
        </div>

        {/* Bottom Realistic Wooden Chalk Tray */}
        <div
          className="w-full h-7 sm:h-9 mt-1 rounded-b-xl flex items-center justify-between px-4 sm:px-6 shadow-inner relative"
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
            title="Click to wipe board"
          >
            <div className="w-14 sm:w-20 h-3.5 sm:h-4.5 bg-[#6b4226] rounded-sm border border-[#3e2412] flex items-center justify-center shadow-md">
              <div className="w-full h-1 bg-[#2b2b2b] mt-auto rounded-b-xs"></div>
            </div>
            <span className="text-[10px] text-amber-300/70 font-mono hidden md:inline">Eraser</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Renders an individual step written on the chalkboard with white chalk handwriting
interface ChalkboardStepBlockProps {
  step: ClassroomStep;
  stepIndex: number;
  totalSteps: number;
  progress: number;
  isActiveStep: boolean;
  isPlaying: boolean;
}

function ChalkboardStepBlock({
  step,
  stepIndex,
  totalSteps,
  progress,
  isActiveStep,
  isPlaying,
}: ChalkboardStepBlockProps) {
  const { heading, bulletPoints = [], equation, workedExample, diagram, chalkColor = 'white', highlightNote } =
    step.chalkboard;

  const isHeadingVisible = progress >= 0.04;
  const numBullets = bulletPoints.length;

  return (
    <div className="w-full space-y-3 sm:space-y-4 pb-4 border-b border-white/10 last:border-b-0 animate-fadeIn">
      {/* Step Label & Title */}
      {isHeadingVisible && (
        <div className="transition-all duration-300">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] sm:text-xs text-yellow-300/90 uppercase tracking-widest font-bold">
              [ STEP {stepIndex + 1}: {step.stepTitle || 'Explanation'} ]
            </span>
          </div>
          <h3
            className="text-lg sm:text-2xl font-bold font-mono tracking-wide text-white inline-block border-b-2 border-dashed border-white/60 pb-1"
            style={{
              textShadow: '0 0 2px rgba(255,255,255,0.7), 0 0 8px rgba(255,255,255,0.2)',
            }}
          >
            {heading}
          </h3>
        </div>
      )}

      {/* Bullet Points with natural handwriting line spacing */}
      <div className="space-y-2.5 sm:space-y-3.5 my-2">
        {bulletPoints.map((point, idx) => {
          const threshold = 0.08 + (idx / Math.max(1, numBullets)) * 0.45;
          const isVisible = progress >= threshold;

          if (!isVisible) return null;

          return (
            <div key={idx} className="flex items-start gap-2.5 sm:gap-3 transition-opacity animate-fadeIn">
              <span className="font-mono font-bold text-yellow-200 text-base sm:text-lg leading-tight select-none">
                ☞
              </span>
              <p
                className="text-sm sm:text-base md:text-lg font-mono text-white leading-relaxed tracking-wide"
                style={{
                  textShadow: '0 0 1px rgba(255,255,255,0.6)',
                }}
              >
                {point}
              </p>
            </div>
          );
        })}
      </div>

      {/* Formula / Equation Section */}
      {equation && progress >= 0.4 && (
        <div className="my-3 sm:my-4 p-3 sm:p-4 rounded-xl border-2 border-dashed border-cyan-300/60 bg-black/25 flex flex-col items-center justify-center transition-all animate-fadeIn">
          <span className="text-[10px] font-mono tracking-widest text-cyan-200/70 uppercase mb-1">
            [ MATHEMATICAL LAW / EQUATION ]
          </span>
          <div
            className="text-lg sm:text-2xl font-mono font-bold text-cyan-100 text-center tracking-wider"
            style={{
              textShadow: '0 0 4px rgba(125,211,252,0.8), 0 0 10px rgba(125,211,252,0.3)',
            }}
          >
            {equation}
          </div>
        </div>
      )}

      {/* Chalkboard Diagram */}
      {diagram && progress >= 0.45 && (
        <ChalkboardDiagrams diagram={diagram} progress={progress} />
      )}

      {/* Step-by-Step Worked Problem */}
      {workedExample && progress >= 0.55 && (
        <div className="my-3 p-3.5 sm:p-5 rounded-xl border-2 border-white/25 bg-black/30 font-mono text-xs sm:text-sm md:text-base space-y-2.5 transition-all animate-fadeIn">
          <div className="flex items-center justify-between text-yellow-200 font-bold border-b border-white/15 pb-1">
            <span>✎ WORKED EXAM PROBLEM:</span>
            <span className="text-[11px] text-white/60">Step-by-Step Solution</span>
          </div>
          <p className="text-white font-medium italic">{workedExample.problem}</p>

          {workedExample.given && (
            <p className="text-cyan-200 text-xs sm:text-sm">
              <strong>Given:</strong> {workedExample.given}
            </p>
          )}

          <div className="space-y-1.5 pt-1">
            {workedExample.solutionSteps.map((s, sIdx) => {
              const stepThreshold = 0.6 + (sIdx / Math.max(1, workedExample.solutionSteps.length)) * 0.28;
              if (progress < stepThreshold) return null;
              return (
                <div key={sIdx} className="flex items-start gap-2 text-white/95">
                  <span className="text-emerald-300 font-bold">Step {sIdx + 1}:</span>
                  <span>{s}</span>
                </div>
              );
            })}
          </div>

          {workedExample.answer && progress >= 0.9 && (
            <div className="mt-3 pt-2 border-t border-dashed border-white/20 flex items-center justify-between flex-wrap gap-2">
              <span className="text-yellow-200 font-bold">Final Result:</span>
              <span
                className="px-3 py-1 rounded border-2 border-yellow-300 bg-yellow-300/10 text-yellow-200 font-bold text-sm sm:text-base shadow"
                style={{
                  textShadow: '0 0 4px rgba(254,240,138,0.8)',
                }}
              >
                {workedExample.answer}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Highlight Note */}
      {highlightNote && progress >= 0.75 && (
        <div className="my-2 p-2.5 sm:p-3 rounded-lg border border-pink-400/50 bg-pink-950/30 text-pink-200 font-mono text-xs sm:text-sm flex items-start gap-2 animate-fadeIn">
          <span className="text-base select-none">⚡</span>
          <span className="leading-snug">{highlightNote}</span>
        </div>
      )}

      {/* Active Chalk Piece Writing Animation */}
      {isActiveStep && isPlaying && progress < 0.98 && (
        <div className="flex items-center gap-2 mt-2 text-white/70 font-mono text-xs">
          <span className="inline-block w-3.5 h-6 bg-white/95 rounded-xs shadow-[0_0_8px_#ffffff] animate-bounce" />
          <span className="text-white/50 text-[11px] animate-pulse">Writing step on board...</span>
        </div>
      )}
    </div>
  );
}
