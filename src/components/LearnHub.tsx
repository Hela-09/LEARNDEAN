import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewType } from '../types';
import { appNavigateBack } from '../utils/navigationHistory';
import {
  MessageSquare,
  BrainCircuit,
  Layers,
  Compass,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Target,
  Flame,
  Zap,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LearnHubProps {
  setView: (view: ViewType | string, options?: { replace?: boolean; subState?: Record<string, any> }) => void;
}

export default function LearnHub({ setView }: LearnHubProps) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const learningFeatures = [
    {
      id: 'classroom',
      title: 'AI Classroom',
      badge: 'Chalkboard & Voice',
      description: 'Step-by-step educational AI teacher that writes equations, diagrams, and worked examples on a digital chalkboard while explaining aloud.',
      icon: GraduationCap,
      badgeBg: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700',
      borderColor: 'hover:border-neutral-400 dark:hover:border-neutral-600',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
      ctaText: 'Enter AI Classroom',
      onClick: () => setView('classroom'),
    },
    {
      id: 'practice',
      title: 'AI Practice',
      badge: 'UTME CBT & Quizzes',
      description: 'Test your knowledge with authentic past questions, realistic timed exam modes, and instant syllabus explanations.',
      icon: BrainCircuit,
      badgeBg: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700',
      borderColor: 'hover:border-neutral-400 dark:hover:border-neutral-600',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
      ctaText: 'Start AI Practice',
      onClick: () => setView('practice'),
    },
    {
      id: 'flashcards',
      title: 'AI Flashcards',
      badge: 'Spaced Repetition',
      description: 'Master key definitions, formulas, and high-yield concepts using active recall flashcard decks customized to your syllabus.',
      icon: Layers,
      badgeBg: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700',
      borderColor: 'hover:border-neutral-400 dark:hover:border-neutral-600',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
      ctaText: 'Study Flashcards',
      onClick: () => setView('flashcards'),
    },
    {
      id: 'journey',
      title: 'Study Journey',
      badge: 'Topic Mastery Roadmap',
      description: 'Follow guided, milestone-based learning paths with XP points, streak rewards, and targeted topic completion.',
      icon: Compass,
      badgeBg: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700',
      borderColor: 'hover:border-neutral-400 dark:hover:border-neutral-600',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
      ctaText: 'Continue Journey',
      onClick: () => setView('journey'),
    },
    {
      id: 'history',
      title: 'History',
      badge: 'Scores & Attempt Review',
      description: 'Review your past test scores, inspect question explanations, track weak areas, and verify your learning gains.',
      icon: Clock,
      badgeBg: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700',
      borderColor: 'hover:border-neutral-400 dark:hover:border-neutral-600',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
      ctaText: 'View History',
      onClick: () => {
        try {
          localStorage.setItem('zetadu_profile_section', 'practice_history');
          window.dispatchEvent(
            new CustomEvent('open-profile-section', { detail: { section: 'practice_history' } })
          );
        } catch (e) {
          console.warn('History navigation trigger:', e);
        }
        setView('profile');
      },
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 dark:bg-black text-white p-6 sm:p-8 border border-neutral-800 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => appNavigateBack(navigate, { fallback: '/home' })}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-colors cursor-pointer border border-white/15"
              title="Go back"
              aria-label="Back"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold tracking-wide">
              <Sparkles size={14} className="text-neutral-400" />
              <span>LEARNDEAN AI STUDY SUITE</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
            What would you like to learn today?
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Select a learning tool below to chat with your Socratic AI Tutor, simulate CBT exams, drill spaced-repetition flashcards, or track your mastery journey.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold">
              <Flame size={14} className="text-amber-400" />
              <span>Streak: {userProfile?.streak || 0} Days</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold">
              <Zap size={14} className="text-neutral-200" />
              <span>Level: {userProfile?.level || 1}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold">
              <Target size={14} className="text-emerald-400" />
              <span>Target: UTME 300+</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 5 Core Learning Tools in clean, modern card grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Learning Tools</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              5 Core Features
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningFeatures.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                id={`learn-tool-card-${tool.id}`}
                onClick={tool.onClick}
                className={`group p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 ${tool.borderColor} shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`p-3 rounded-2xl ${tool.iconBg} shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon size={24} strokeWidth={2.2} />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${tool.badgeBg} shrink-0`}>
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-neutral-900 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-1.5">
                    <span>{tool.title}</span>
                    <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors">
                    {tool.ctaText}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complementary Library Banner (Preserves All Existing Library & Novels Features) */}
      <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              Subject Curriculum & Prescribed JAMB Novels
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Access the complete syllabus library, official literature texts (*The Life Changer*, *Second Class Citizen*, etc.), and subject outlines.
            </p>
          </div>
        </div>

        <button
          id="learn-hub-library-btn"
          onClick={() => setView('subjects')}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 text-neutral-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
        >
          <span>Open Library</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
