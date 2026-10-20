import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  FileUp,
  Compass,
  BookOpen,
  PenTool,
  Layers,
  Zap,
  BookMarked,
  WifiOff,
  Target,
  School,
  Sparkles,
} from 'lucide-react';
import { ExamOfficialLogo } from '../common/ExamBranding';
import { LearnDeanEmblem } from '../Logo';

interface StudyFeaturesGridProps {
  onSelectExam?: (examShortName: 'JAMB' | 'WAEC' | 'NECO') => void;
  onOpenOfflineHub?: () => void;
  setView?: (view: any) => void;
}

export interface StudyFeatureCard {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge?: string;
  action: () => void;
  customIcon?: React.ReactNode;
}

export default function StudyFeaturesGrid({
  onSelectExam,
  onOpenOfflineHub,
  setView,
}: StudyFeaturesGridProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const featureCards: StudyFeatureCard[] = [
    {
      id: 'jamb',
      title: 'JAMB CBT Prep',
      subtitle: 'UTME Past Questions & Timer',
      category: 'Exam Board',
      badge: 'Official CBT',
      customIcon: <ExamOfficialLogo board="jamb" className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => {
        if (onSelectExam) {
          onSelectExam('JAMB');
        } else {
          handleNavigate('/jamb');
        }
      },
    },
    {
      id: 'waec',
      title: 'WAEC WASSCE',
      subtitle: 'Senior Certificate Exam',
      category: 'Exam Board',
      badge: 'SSCE Prep',
      customIcon: <ExamOfficialLogo board="waec" className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => {
        if (onSelectExam) {
          onSelectExam('WAEC');
        } else {
          handleNavigate('/study');
        }
      },
    },
    {
      id: 'neco',
      title: 'NECO SSCE',
      subtitle: 'National Certificate Exam',
      category: 'Exam Board',
      badge: 'National',
      customIcon: <ExamOfficialLogo board="neco" className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => {
        if (onSelectExam) {
          onSelectExam('NECO');
        } else {
          handleNavigate('/study');
        }
      },
    },
    {
      id: 'classroom',
      title: 'AI Classroom',
      subtitle: 'Chalkboard Teacher & Voice',
      category: 'Learning',
      badge: 'Chalkboard',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <LearnDeanEmblem className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/classroom'),
    },
    {
      id: 'journey',
      title: 'Study Journey',
      subtitle: '6-Step Mastery Roadmap',
      category: 'Learning',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/study-journey'),
    },
    {
      id: 'library',
      title: 'Syllabus Library',
      subtitle: 'Official Textbooks & Notes',
      category: 'Curriculum',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/subjects'),
    },
    {
      id: 'flashcards',
      title: 'Active Recall',
      subtitle: 'Curriculum Flashcards',
      category: 'Practice',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
          <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/flashcards'),
    },
    {
      id: 'upload_notes',
      title: 'Upload Notes',
      subtitle: 'AI Notes & Flashcards',
      category: 'Tools',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <FileUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/upload-notes'),
    },
    {
      id: 'daily_challenge',
      title: 'Daily Challenge',
      subtitle: '10-Question Streak Drill',
      category: 'Practice',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/daily-challenge'),
    },
    {
      id: 'novels',
      title: 'Literature & Novels',
      subtitle: 'Prescribed Books & Tests',
      category: 'Curriculum',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
          <BookMarked className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/novels'),
    },
    {
      id: 'weak_topics',
      title: 'Weak Topics',
      subtitle: 'Diagnostic Error Drills',
      category: 'Practice',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <Target className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/weak-topics'),
    },
    {
      id: 'offline_hub',
      title: 'Offline Hub',
      subtitle: 'Study Without Internet',
      category: 'Tools',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
          <WifiOff className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => {
        if (onOpenOfflineHub) {
          onOpenOfflineHub();
        } else {
          sessionStorage.setItem('open_offline_hub', 'true');
          handleNavigate('/home');
        }
      },
    },
  ];

  return (
    <div className="space-y-3 w-full min-w-0" id="study-features-grid-section">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
          Study Features & Practice Tools
        </h2>
        <span className="text-[11px] font-semibold text-slate-400">12 Connected Features</span>
      </div>

      {/* Responsive Two-Column Mobile Grid, 3-col on sm, 4-col on md, 6-col on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5 w-full min-w-0">
        {featureCards.map((card) => (
          <button
            key={card.id}
            id={`study-feature-card-${card.id}`}
            type="button"
            onClick={card.action}
            className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group cursor-pointer min-h-[115px] sm:min-h-[125px] w-full min-w-0 shadow-2xs relative overflow-hidden active:scale-[0.98]"
          >
            {card.badge && (
              <span className="absolute top-2 right-2 text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                {card.badge}
              </span>
            )}
            <div className="mb-2 shrink-0 group-hover:scale-105 transition-transform">
              {card.customIcon}
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 max-w-full">
              {card.title}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 max-w-full">
              {card.subtitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
