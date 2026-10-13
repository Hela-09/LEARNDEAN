import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowLeft,
  RotateCcw,
  Plus,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2,
  Clock,
  Layers,
  History,
  Settings2,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import { ViewType } from '../types';
import { ClassroomLesson, ClassroomStep, ClassroomQA } from '../types/classroom';
import { useChalkboardSpeech } from '../hooks/useChalkboardSpeech';
import ChalkboardView, { calculateStepPages } from './classroom/ChalkboardView';
import ClassroomControls from './classroom/ClassroomControls';
import ClassroomInteractionPanel from './classroom/ClassroomInteractionPanel';
import ClassroomSetupModal from './classroom/ClassroomSetupModal';
import VoiceSelectionModal from './classroom/VoiceSelectionModal';
import ClassroomHistoryDrawer from './classroom/ClassroomHistoryDrawer';
import {
  fetchClassroomLesson,
  askClassroomTeacher,
  getRecentLessons,
  saveLessonToHistory,
} from '../services/classroomService';
import { DEFAULT_PHYSICS_LESSON } from '../utils/classroomDefaults';
import { chalkAudio } from '../utils/chalkAudio';
import { appNavigateBack } from '../utils/navigationHistory';

interface AIClassroomProps {
  setView?: (view: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => void;
}

export default function AIClassroom({ setView }: AIClassroomProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Active Lesson State
  const [lesson, setLesson] = useState<ClassroomLesson>(() => {
    const recents = getRecentLessons();
    return recents[0] || DEFAULT_PHYSICS_LESSON;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [viewingPageIndex, setViewingPageIndex] = useState<number>(0);

  // Modals & Drawers
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState<boolean>(false);
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Q&A State
  const [qaHistory, setQaHistory] = useState<ClassroomQA[]>([]);
  const [isAsking, setIsAsking] = useState<boolean>(false);

  // Recent Lessons List
  const [recentLessons, setRecentLessons] = useState<ClassroomLesson[]>(() => getRecentLessons());

  // Speech Hook
  const speech = useChalkboardSpeech();

  const currentStep: ClassroomStep =
    lesson.steps[currentStepIndex] || lesson.steps[0] || DEFAULT_PHYSICS_LESSON.steps[0];

  // Whenever lesson or step changes, play spoken explanation with voice
  useEffect(() => {
    if (currentStep && currentStep.spokenExplanation) {
      speech.play(currentStep.spokenExplanation, () => {
        // Step finished speaking
        if (autoPlayNext && currentStepIndex < lesson.steps.length - 1) {
          setTimeout(() => {
            setCurrentStepIndex((prev) => Math.min(lesson.steps.length - 1, prev + 1));
          }, 1400);
        }
      });
    }

    return () => {
      speech.stop();
    };
  }, [lesson.id, currentStepIndex]);

  // Handle Starting a New Lesson
  const handleStartLesson = async (subject: string, topic: string, level: string) => {
    setIsLoadingLesson(true);
    speech.stop();
    try {
      const newLesson = await fetchClassroomLesson(subject, topic, level);
      setLesson(newLesson);
      setCurrentStepIndex(0);
      setViewingPageIndex(0);
      setQaHistory([]);
      setRecentLessons(getRecentLessons());
      setIsSetupModalOpen(false);
    } catch (e) {
      console.error('Failed to load lesson:', e);
    } finally {
      setIsLoadingLesson(false);
    }
  };

  // Check for preselected subject/topic from other parts of LearnDean
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(location.search);
    const querySubject = params.get('subject');
    const queryTopic = params.get('topic');

    const storedTopic =
      localStorage.getItem('zetadu_classroom_topic') ||
      localStorage.getItem('zetadu_tutor_initial_query') ||
      localStorage.getItem('zetadu_tutor_prompt');
    const storedSubject = localStorage.getItem('zetadu_target_subject');

    // Clear one-time prompts so they do not loop on reload
    if (storedTopic) {
      localStorage.removeItem('zetadu_classroom_topic');
      localStorage.removeItem('zetadu_tutor_initial_query');
      localStorage.removeItem('zetadu_tutor_prompt');
    }

    const targetSub = querySubject || storedSubject;
    const targetTop = queryTopic || storedTopic;

    if (targetSub || targetTop) {
      const cleanSubject = (targetSub || 'Physics')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const cleanTopic = targetTop
        ? targetTop.length > 80
          ? targetTop.slice(0, 80) + '...'
          : targetTop
        : `Fundamentals of ${cleanSubject}`;

      handleStartLesson(cleanSubject, cleanTopic, 'Senior Secondary (SSS / WAEC / JAMB)');
    }
  }, []);

  // Step Navigation
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      chalkAudio.playEraserSweep();
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      chalkAudio.playEraserSweep();
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleJumpToStep = (index: number) => {
    if (index >= 0 && index < lesson.steps.length && index !== currentStepIndex) {
      chalkAudio.playEraserSweep();
      setCurrentStepIndex(index);
    }
  };

  // Restart Lesson from Beginning
  const handleRestartLesson = () => {
    chalkAudio.playEraserSweep();
    speech.stop();
    setCurrentStepIndex(0);
    setViewingPageIndex(0);
    if (lesson.steps[0]?.spokenExplanation) {
      speech.play(lesson.steps[0].spokenExplanation);
    }
  };

  // Replay Current Step
  const handleReplay = () => {
    if (currentStep) {
      speech.play(currentStep.spokenExplanation);
    }
  };

  // Ask Follow-up Question
  const handleAskQuestion = async (question: string, isSimplify: boolean) => {
    setIsAsking(true);
    try {
      const bulletSummary = currentStep.chalkboard.bulletPoints.join('; ');
      const qaResult = await askClassroomTeacher(
        lesson.subject,
        lesson.topic,
        currentStep.stepTitle,
        bulletSummary,
        question,
        isSimplify
      );
      qaResult.stepId = currentStep.id;

      setQaHistory((prev) => [qaResult, ...prev]);

      // Speak teacher's answer aloud
      speech.play(qaResult.spokenAnswer);
    } catch (e) {
      console.error('Failed to ask question:', e);
    } finally {
      setIsAsking(false);
    }
  };

  const handleBack = () => {
    speech.stop();
    if (setView) {
      setView('learn');
    } else {
      appNavigateBack(navigate, { fallback: '/learn' });
    }
  };

  const stepTitles = lesson.steps.map((s) => s.stepTitle);
  const stepPages = calculateStepPages(lesson.steps);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6 pb-12 sm:pb-16 min-w-0">
      {/* Top Header & Classroom Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Back to Learning Hub"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[10px] uppercase">
                {lesson.subject}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                AI Digital Classroom
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
              {lesson.topic}
            </h1>
          </div>
        </div>

        {/* Action Buttons: Voice Settings, History & Records, New Lesson */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Voice Selector button */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Configure AI Teacher Voice & Speech"
          >
            <Volume2 size={15} className="text-blue-500" />
            <span className="hidden md:inline">Voice:</span>
            <span className="font-bold truncate max-w-[100px]">
              {speech.selectedVoice
                ? speech.selectedVoice.name.replace(/Google|Microsoft/gi, '').trim()
                : 'Default'}
            </span>
          </button>

          {/* History & Records Drawer button */}
          <button
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Saved Lessons & Migrated Tutor Records"
          >
            <History size={15} />
            <span className="hidden sm:inline">Records</span>
          </button>

          {/* New Lesson Button */}
          <button
            onClick={() => setIsSetupModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>New Lesson</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Page Classroom Chalkboard & Controls */}
      <div className="w-full flex flex-col gap-4 sm:gap-6 min-w-0">
        {/* Realistic Digital Chalkboard with Pagination & Preserved Content */}
        <ChalkboardView
          allSteps={lesson.steps}
          currentStepIndex={currentStepIndex}
          totalSteps={lesson.steps.length}
          progress={speech.progress}
          isPlaying={speech.isPlaying}
          isPaused={speech.isPaused}
          lessonTitle={lesson.title}
          subject={lesson.subject}
          topic={lesson.topic}
          viewingPageIndex={viewingPageIndex}
          onSetViewingPage={(page) => setViewingPageIndex(page)}
          onWipeBoard={handleReplay}
          isFullScreen={isFullScreen}
          onToggleFullScreen={() => setIsFullScreen((prev) => !prev)}
        />

        {/* Classroom Controls (Play, Pause, Speed, Replay, Prev/Next Step, Restart) */}
        <ClassroomControls
          isPlaying={speech.isPlaying}
          isPaused={speech.isPaused}
          isMuted={speech.isMuted}
          speed={speech.speed}
          currentStepIndex={currentStepIndex}
          totalSteps={lesson.steps.length}
          autoPlayNext={autoPlayNext}
          onPlay={() => speech.play(currentStep.spokenExplanation)}
          onPause={speech.pause}
          onResume={speech.resume}
          onReplay={handleReplay}
          onPrevStep={handlePrevStep}
          onNextStep={handleNextStep}
          onRestartLesson={handleRestartLesson}
          onSetSpeed={speech.setSpeed}
          onToggleMute={() => speech.setMuted(!speech.isMuted)}
          onToggleAutoPlay={() => setAutoPlayNext((prev) => !prev)}
          onFastForward={speech.fastForward}
          onJumpToStep={handleJumpToStep}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          activeVoiceName={speech.selectedVoice?.name}
          stepTitles={stepTitles}
          viewingPageIndex={viewingPageIndex}
          totalPages={stepPages.length}
        />

        {/* Student Interaction Panel: Spoken Words, Ask Teacher & Step Quiz */}
        <ClassroomInteractionPanel
          currentStep={currentStep}
          qaHistory={qaHistory}
          onAskQuestion={handleAskQuestion}
          isAsking={isAsking}
          onSpeakAnswer={(text) => speech.play(text)}
          onQuizAnswered={(isCorrect) => {
            if (isCorrect) {
              // Quiz feedback handled in panel
            }
          }}
        />
      </div>

      {/* Setup / Topic Selection Modal */}
      <ClassroomSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onStartLesson={handleStartLesson}
        isLoading={isLoadingLesson}
      />

      {/* Voice Selection Modal */}
      <VoiceSelectionModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        voices={speech.voices}
        selectedVoice={speech.selectedVoice}
        onSelectVoice={(v) => speech.setSelectedVoice(v)}
        onPreviewVoice={(v) => speech.previewVoice(v)}
        speed={speech.speed}
        onSetSpeed={(s) => speech.setSpeed(s)}
        isMuted={speech.isMuted}
        onToggleMute={() => speech.setMuted(!speech.isMuted)}
      />

      {/* History & Migrated Records Drawer */}
      <ClassroomHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        recentLessons={recentLessons}
        onSelectLesson={(selLesson) => {
          speech.stop();
          setLesson(selLesson);
          setCurrentStepIndex(0);
          setViewingPageIndex(0);
        }}
        onStartTopicFromRecord={(subj, top) => {
          handleStartLesson(subj, top, 'Senior Secondary (SSS / WAEC / JAMB)');
        }}
      />
    </div>
  );
}
