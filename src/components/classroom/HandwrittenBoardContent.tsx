import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ClassroomStep } from '../../types/classroom';
import ChalkboardDiagrams from './ChalkboardDiagrams';
import { chalkAudio } from '../../utils/chalkAudio';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CheckCircle2,
  Sparkles,
  Volume2,
  Lightbulb,
  BookOpen,
} from 'lucide-react';

export type BoardMode = 'blackboard' | 'whiteboard';
export type BlackboardSlateTheme = 'green' | 'black';

interface HandwrittenBoardContentProps {
  step: ClassroomStep;
  stepIndex: number;
  totalSteps: number;
  isActiveStep: boolean;
  isWritingNotes: boolean;
  boardMode: BoardMode;
  blackboardTheme: BlackboardSlateTheme;
  writingSpeed?: number; // 0.75, 1.0, 1.25, 1.5
  onWritingComplete?: () => void;
  // External play/pause state from parent classroom
  isClassroomPlaying?: boolean;
  isClassroomPaused?: boolean;
  speechProgress?: number; // 0.0 to 1.0 for synchronized point-by-point teaching
}

export default function HandwrittenBoardContent({
  step,
  stepIndex,
  totalSteps,
  isActiveStep,
  isWritingNotes,
  boardMode,
  blackboardTheme,
  writingSpeed = 1.0,
  onWritingComplete,
  isClassroomPlaying = true,
  isClassroomPaused = false,
  speechProgress = 0,
}: HandwrittenBoardContentProps) {
  const { heading, bulletPoints = [], equation, workedExample, diagram, highlightNote } = step.chalkboard;

  // Active Point Explanation Synchronization (highlights the exact board note currently being explained)
  const activeExplainingPointIndex = useMemo(() => {
    if (!isActiveStep) return -1;
    const bulletsLen = bulletPoints.length;
    if (bulletsLen === 0) return 0;
    // Map speechProgress (0 to 1) across the bullet points and equations
    const totalSlots = bulletsLen + (equation ? 1 : 0) + (workedExample ? 1 : 0);
    const p = Math.max(0, Math.min(0.999, speechProgress || 0));
    return Math.floor(p * totalSlots);
  }, [isActiveStep, bulletPoints.length, equation, workedExample, speechProgress]);

  // Local writing playback state (allows manual pause, resume, replay of writing specifically)
  const [isLocalPaused, setIsLocalPaused] = useState<boolean>(false);
  const [hasCompletedWriting, setHasCompletedWriting] = useState<boolean>(!isActiveStep);
  const [visibleCharsHeading, setVisibleCharsHeading] = useState<number>(!isActiveStep ? heading.length : 0);
  const [visibleBulletsCount, setVisibleBulletsCount] = useState<number>(!isActiveStep ? bulletPoints.length : 0);
  const [activeBulletCharIndex, setActiveBulletCharIndex] = useState<number>(
    !isActiveStep && bulletPoints.length > 0 ? (bulletPoints[bulletPoints.length - 1]?.length || 0) : 0
  );
  const [showUnderline, setShowUnderline] = useState<boolean>(!isActiveStep);
  const [showEquation, setShowEquation] = useState<boolean>(!isActiveStep || !equation);
  const [showDiagram, setShowDiagram] = useState<boolean>(!isActiveStep || !diagram);
  const [visibleSolutionSteps, setVisibleSolutionSteps] = useState<number>(
    !isActiveStep && workedExample ? workedExample.solutionSteps.length : 0
  );
  const [diagramProgress, setDiagramProgress] = useState<number>(!isActiveStep ? 1 : 0);

  // Audio throttle to prevent sound clipping
  const lastSoundTimeRef = useRef<number>(0);
  const playStrokeSound = () => {
    const now = Date.now();
    if (now - lastSoundTimeRef.current > 75) {
      chalkAudio.playChalkStroke(60);
      lastSoundTimeRef.current = now;
    }
  };

  // Reset or initialize state when stepIndex or step changes
  useEffect(() => {
    if (!isActiveStep) {
      // Completed or past step: reveal everything fully and permanently
      setHasCompletedWriting(true);
      setVisibleCharsHeading(heading.length);
      setVisibleBulletsCount(bulletPoints.length);
      setActiveBulletCharIndex(bulletPoints.length > 0 ? bulletPoints[bulletPoints.length - 1].length : 0);
      setShowUnderline(true);
      setShowEquation(true);
      setShowDiagram(true);
      setDiagramProgress(1);
      setVisibleSolutionSteps(workedExample ? workedExample.solutionSteps.length : 0);
      setIsLocalPaused(false);
    } else {
      // Current active step: start animated progressive stroke writing
      setHasCompletedWriting(false);
      setVisibleCharsHeading(0);
      setVisibleBulletsCount(0);
      setActiveBulletCharIndex(0);
      setShowUnderline(false);
      setShowEquation(!equation);
      setShowDiagram(!diagram);
      setDiagramProgress(0);
      setVisibleSolutionSteps(0);
      setIsLocalPaused(false);
    }
  }, [stepIndex, isActiveStep, heading, equation, diagram]);

  // Main progressive animation loop using requestAnimationFrame / interval
  useEffect(() => {
    if (!isActiveStep || hasCompletedWriting) return;
    if (isLocalPaused || isClassroomPaused) return;

    // Time per character in ms (scaled by writingSpeed)
    const charDelay = Math.max(12, Math.floor(22 / writingSpeed));

    const timer = setInterval(() => {
      // Phase 1: Write Heading character by character
      if (visibleCharsHeading < heading.length) {
        setVisibleCharsHeading((prev) => {
          const next = prev + 1;
          if (next % 3 === 0) playStrokeSound();
          return next;
        });
        return;
      }

      // Phase 2: Sweep underline after heading finishes
      if (!showUnderline) {
        setShowUnderline(true);
        chalkAudio.playChalkStroke(120);
        return;
      }

      // Phase 3: Write Bullet Points line by line, character by character
      if (bulletPoints.length > 0 && visibleBulletsCount < bulletPoints.length) {
        const currentBulletText = bulletPoints[visibleBulletsCount] || '';
        if (activeBulletCharIndex < currentBulletText.length) {
          setActiveBulletCharIndex((prev) => {
            const next = prev + 1;
            if (next % 4 === 0) playStrokeSound();
            return next;
          });
          return;
        } else {
          // Current bullet finished, advance to next bullet
          setVisibleBulletsCount((prev) => prev + 1);
          setActiveBulletCharIndex(0);
          chalkAudio.playChalkTap();
          return;
        }
      }

      // Phase 4: Write Equation
      if (equation && !showEquation) {
        setShowEquation(true);
        chalkAudio.playChalkTap();
        return;
      }

      // Phase 5: Draw Diagram with progressive stroke
      if (diagram && diagramProgress < 1) {
        setDiagramProgress((prev) => {
          const next = Math.min(1, prev + 0.15 * writingSpeed);
          if (next >= 1) {
            setShowDiagram(true);
            chalkAudio.playChalkTap();
          }
          return next;
        });
        return;
      }

      // Phase 6: Write Worked Example steps
      if (workedExample && visibleSolutionSteps < workedExample.solutionSteps.length) {
        setVisibleSolutionSteps((prev) => prev + 1);
        chalkAudio.playChalkTap();
        return;
      }

      // All elements written on board!
      setHasCompletedWriting(true);
      if (onWritingComplete) onWritingComplete();
    }, charDelay);

    return () => clearInterval(timer);
  }, [
    isActiveStep,
    hasCompletedWriting,
    isLocalPaused,
    isClassroomPaused,
    visibleCharsHeading,
    heading,
    showUnderline,
    bulletPoints,
    visibleBulletsCount,
    activeBulletCharIndex,
    equation,
    showEquation,
    diagram,
    diagramProgress,
    workedExample,
    visibleSolutionSteps,
    writingSpeed,
    onWritingComplete,
  ]);

  // Controls handlers
  const handleTogglePause = () => {
    setIsLocalPaused((prev) => !prev);
    chalkAudio.playChalkTap();
  };

  const handleReplayWriting = () => {
    chalkAudio.playEraserSweep();
    setHasCompletedWriting(false);
    setVisibleCharsHeading(0);
    setVisibleBulletsCount(0);
    setActiveBulletCharIndex(0);
    setShowUnderline(false);
    setShowEquation(!equation);
    setShowDiagram(!diagram);
    setDiagramProgress(0);
    setVisibleSolutionSteps(0);
    setIsLocalPaused(false);
  };

  const handleCompleteImmediately = () => {
    chalkAudio.playChalkTap();
    setHasCompletedWriting(true);
    setVisibleCharsHeading(heading.length);
    setVisibleBulletsCount(bulletPoints.length);
    setActiveBulletCharIndex(bulletPoints.length > 0 ? bulletPoints[bulletPoints.length - 1].length : 0);
    setShowUnderline(true);
    setShowEquation(true);
    setShowDiagram(true);
    setDiagramProgress(1);
    setVisibleSolutionSteps(workedExample ? workedExample.solutionSteps.length : 0);
    setIsLocalPaused(false);
    if (onWritingComplete) onWritingComplete();
  };

  // Color & typography themes
  const isWhiteboard = boardMode === 'whiteboard';

  const textPrimaryColor = isWhiteboard ? 'text-slate-900' : 'text-[#f8fafc]';
  const textSecondaryColor = isWhiteboard ? 'text-slate-700' : 'text-slate-200';
  const stepBadgeStyle = isWhiteboard
    ? 'bg-blue-100 text-blue-900 border border-blue-300 font-bold'
    : 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 font-bold';
  const headingUnderlineColor = isWhiteboard ? '#2563eb' : '#ffffff';
  const bulletSymbolColor = isWhiteboard ? 'text-blue-700' : 'text-yellow-300';
  const equationBoxStyle = isWhiteboard
    ? 'border-2 border-blue-500 bg-blue-50/60 text-blue-950 shadow-xs'
    : 'border-2 border-dashed border-cyan-300/70 bg-black/30 text-cyan-100 shadow-md';
  const workedBoxStyle = isWhiteboard
    ? 'border border-slate-200 bg-slate-50/90 text-slate-800 shadow-xs'
    : 'border border-white/20 bg-black/35 text-white shadow-md';

  return (
    <div className="w-full space-y-4 pb-6 border-b border-black/10 dark:border-white/10 last:border-b-0 transition-all duration-300">
      {/* Step Header with Step Badge and Mini Writing Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-lg font-mono text-[11px] sm:text-xs uppercase tracking-wider ${stepBadgeStyle}`}>
            Step {stepIndex + 1} of {totalSteps}: {step.stepTitle || 'Notes'}
          </span>
          {isActiveStep && !hasCompletedWriting && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Teacher writing...
            </span>
          )}
        </div>

        {/* Real-time Progressive Writing Controls (Play, Pause, Replay, Skip) */}
        {isActiveStep && (
          <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 backdrop-blur-xs p-1 rounded-xl text-xs">
            <button
              onClick={handleTogglePause}
              className="px-2 py-0.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 font-medium text-[11px] flex items-center gap-1 transition cursor-pointer"
              title={isLocalPaused ? 'Resume Writing Stroke' : 'Pause Writing Stroke'}
            >
              {isLocalPaused ? <Play size={11} className="fill-current" /> : <Pause size={11} className="fill-current" />}
              <span>{isLocalPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={handleReplayWriting}
              className="px-2 py-0.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 font-medium text-[11px] flex items-center gap-1 transition cursor-pointer"
              title="Replay writing animation from start"
            >
              <RotateCcw size={11} />
              <span>Replay</span>
            </button>

            {!hasCompletedWriting && (
              <button
                onClick={handleCompleteImmediately}
                className="px-2 py-0.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 font-bold text-[11px] text-blue-500 dark:text-blue-300 flex items-center gap-1 transition cursor-pointer"
                title="Instant finish (reveal complete notes)"
              >
                <FastForward size={11} />
                <span>Show All</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Topic Heading: Drawn letter by letter with a realistic chalk / marker stroke cursor */}
      <div className="relative inline-block max-w-full">
        <h3
          className={`text-lg sm:text-2xl md:text-3xl font-extrabold tracking-wide ${textPrimaryColor} font-mono`}
          style={{
            textShadow: isWhiteboard
              ? 'none'
              : '0 0 2px rgba(255,255,255,0.7), 0 0 8px rgba(255,255,255,0.2)',
          }}
        >
          <span>{heading.slice(0, visibleCharsHeading)}</span>

          {/* Active Nib / Chalk Cursor while writing heading */}
          {isActiveStep && !hasCompletedWriting && visibleCharsHeading < heading.length && (
            <span
              className={`inline-block w-2.5 h-5 ml-0.5 align-middle rounded-xs shadow-sm ${
                isWhiteboard ? 'bg-blue-600' : 'bg-white shadow-[0_0_8px_#ffffff]'
              } animate-pulse`}
              title="Writing..."
            />
          )}
        </h3>

        {/* Hand-drawn Progressive SVG Underline */}
        {showUnderline && (
          <div className="w-full mt-1 overflow-visible">
            <svg
              className="w-full h-3 overflow-visible"
              viewBox="0 0 400 12"
              preserveAspectRatio="none"
            >
              <path
                d="M 2,6 Q 100,2 200,6 T 398,6"
                fill="none"
                stroke={headingUnderlineColor}
                strokeWidth={isWhiteboard ? '3' : '2.5'}
                strokeDasharray={isWhiteboard ? 'none' : '6 2'}
                strokeLinecap="round"
                className="animate-in fade-in duration-300"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Bullet Points: Progressively written sentence by sentence & visually synchronized with speech */}
      <div className="space-y-3 pt-2">
        {bulletPoints.map((point, bIdx) => {
          // If this bullet is not yet reached, don't show
          if (bIdx > visibleBulletsCount) return null;

          const isCurrentBulletBeingWritten = bIdx === visibleBulletsCount && !hasCompletedWriting;
          const isPointBeingExplained =
            isActiveStep &&
            (isClassroomPlaying || isClassroomPaused) &&
            activeExplainingPointIndex === bIdx;

          const displayedText = isCurrentBulletBeingWritten
            ? point.slice(0, activeBulletCharIndex)
            : point;

          const breakdown = step.explanationBreakdown?.[bIdx];

          let highlightClasses = '';
          if (isCurrentBulletBeingWritten) {
            highlightClasses = isWhiteboard
              ? 'bg-blue-50/70 border border-blue-200/60'
              : 'bg-white/10 ring-1 ring-yellow-300/40';
          } else if (isPointBeingExplained) {
            highlightClasses = isWhiteboard
              ? 'border-l-4 border-blue-600 bg-blue-100/60 shadow-xs ring-1 ring-blue-500/20'
              : 'border-l-4 border-yellow-300 bg-yellow-400/15 shadow-[0_0_15px_rgba(253,224,71,0.25)] ring-1 ring-yellow-300/30';
          }

          return (
            <div
              key={bIdx}
              className={`p-2.5 rounded-xl transition-all duration-300 space-y-1.5 ${highlightClasses}`}
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                <span className={`font-mono font-bold text-base sm:text-lg select-none ${bulletSymbolColor}`}>
                  ☞
                </span>
                <p
                  className={`text-sm sm:text-base md:text-lg font-mono leading-relaxed ${textSecondaryColor} flex-1`}
                  style={{
                    textShadow: !isWhiteboard ? '0 0 1px rgba(255,255,255,0.6)' : 'none',
                  }}
                >
                  <span>{displayedText}</span>

                  {/* Chalk or Marker Tip Cursor on active bullet */}
                  {isCurrentBulletBeingWritten && (
                    <span
                      className={`inline-block w-2 h-4 ml-1 align-middle rounded-xs ${
                        isWhiteboard ? 'bg-blue-700' : 'bg-white shadow-[0_0_6px_#ffffff]'
                      } animate-pulse`}
                    />
                  )}
                </p>

                {/* Teacher Explaining Active Badge */}
                {isPointBeingExplained && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                      isWhiteboard
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-yellow-400/25 text-yellow-300 border border-yellow-300/40'
                    } animate-pulse`}
                    title="Teacher is currently explaining this point aloud"
                  >
                    <Volume2 size={11} />
                    <span className="hidden sm:inline">Teacher Explaining</span>
                  </span>
                )}
              </div>

              {/* In-depth term breakdown & real-world example callout when available */}
              {breakdown && isPointBeingExplained && (
                <div
                  className={`mt-2 p-2.5 rounded-xl text-xs space-y-1.5 animate-fadeIn ${
                    isWhiteboard
                      ? 'bg-white/90 border border-blue-200 text-slate-800'
                      : 'bg-black/45 border border-white/20 text-slate-200'
                  }`}
                >
                  {breakdown.simplifiedTerms && breakdown.simplifiedTerms.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                        <BookOpen size={11} /> Term Meaning:
                      </span>
                      {breakdown.simplifiedTerms.map((st, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 font-mono text-[11px]"
                        >
                          <strong className={isWhiteboard ? 'text-blue-700' : 'text-yellow-300'}>
                            {st.term}
                          </strong>
                          : {st.meaning}
                        </span>
                      ))}
                    </div>
                  )}

                  {breakdown.example && (
                    <div className="text-[11px] flex items-start gap-1 pt-0.5">
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold shrink-0">
                        🌱 Relatable Example:
                      </span>
                      <span>{breakdown.example}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mathematical Law / Equation Box (Revealed with styled borders & highlighted when explained) */}
      {equation && showEquation && (
        <div
          className={`my-4 p-4 rounded-2xl flex flex-col items-center justify-center transition-all animate-fadeIn ${
            isActiveStep && activeExplainingPointIndex >= bulletPoints.length
              ? isWhiteboard
                ? 'border-2 border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-500/20'
                : 'border-2 border-yellow-300 bg-yellow-400/15 shadow-[0_0_20px_rgba(253,224,71,0.3)] ring-1 ring-yellow-300/40'
              : equationBoxStyle
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 flex-wrap justify-center">
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold opacity-80">
              [ MATHEMATICAL LAW / FORMULA / EQUATION ]
            </span>
            {isActiveStep && activeExplainingPointIndex >= bulletPoints.length && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white animate-pulse flex items-center gap-1">
                <Volume2 size={10} /> Explaining Equation
              </span>
            )}
          </div>
          <div className="text-lg sm:text-2xl font-mono font-black text-center tracking-wider px-2">
            {equation}
          </div>
        </div>
      )}

      {/* Progressive Diagram Drawing (Rendered using ChalkboardDiagrams with animated stroke progress) */}
      {diagram && (
        <div className="my-4 transition-all animate-fadeIn">
          <ChalkboardDiagrams
            diagram={diagram}
            progress={diagramProgress}
            boardMode={boardMode}
          />
        </div>
      )}

      {/* Step-by-Step Worked Exam Problem */}
      {workedExample && (
        <div className={`my-4 p-4 sm:p-5 rounded-2xl font-mono text-xs sm:text-sm md:text-base space-y-3 transition-all animate-fadeIn ${workedBoxStyle}`}>
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/15 pb-2 font-bold">
            <span className={isWhiteboard ? 'text-blue-700' : 'text-yellow-300'}>
              ✎ WORKED EXAM PROBLEM:
            </span>
            <span className="text-[11px] opacity-70">Step-by-Step Working</span>
          </div>

          <p className="font-semibold italic">{workedExample.problem}</p>

          {workedExample.given && (
            <div className={`p-2 rounded-xl text-xs sm:text-sm ${isWhiteboard ? 'bg-blue-50 text-blue-900' : 'bg-black/25 text-cyan-200'}`}>
              <strong>Given:</strong> {workedExample.given}
            </div>
          )}

          {/* Solution steps revealed progressively */}
          <div className="space-y-2 pt-1">
            {workedExample.solutionSteps.slice(0, visibleSolutionSteps).map((stepText, sIdx) => (
              <div key={sIdx} className="flex items-start gap-2 animate-fadeIn">
                <span className={`font-bold shrink-0 ${isWhiteboard ? 'text-blue-600' : 'text-emerald-300'}`}>
                  Step {sIdx + 1}:
                </span>
                <span>{stepText}</span>
              </div>
            ))}
          </div>

          {/* Final Answer Highlight */}
          {workedExample.answer && visibleSolutionSteps >= workedExample.solutionSteps.length && (
            <div className="mt-3 pt-2.5 border-t border-dashed border-black/15 dark:border-white/20 flex items-center justify-between flex-wrap gap-2 animate-fadeIn">
              <span className={`font-bold ${isWhiteboard ? 'text-slate-800' : 'text-yellow-300'}`}>
                Final Result:
              </span>
              <span
                className={`px-3 py-1 rounded-xl font-bold text-sm sm:text-base shadow-xs ${
                  isWhiteboard
                    ? 'border-2 border-blue-600 bg-blue-600 text-white'
                    : 'border-2 border-yellow-300 bg-yellow-300/20 text-yellow-200 shadow-[0_0_8px_rgba(254,240,138,0.5)]'
                }`}
              >
                {workedExample.answer}
              </span>
            </div>
          )}
        </div>
      )}

      {/* High-Yield Note / Highlight Hook */}
      {highlightNote && hasCompletedWriting && (
        <div
          className={`my-3 p-3 rounded-xl font-mono text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn ${
            isWhiteboard
              ? 'border border-amber-300 bg-amber-50 text-amber-900'
              : 'border border-pink-400/50 bg-pink-950/30 text-pink-200'
          }`}
        >
          <span className="text-base select-none">⚡</span>
          <span className="leading-snug">{highlightNote}</span>
        </div>
      )}
    </div>
  );
}
