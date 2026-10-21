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
  HelpCircle,
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

  const handleNavigate = (path: string, viewName?: string) => {
    if (setView && viewName) {
      setView(viewName);
    }
    navigate(path);
  };

  const featureCards: StudyFeatureCard[] = [
    {
      id: 'jamb',
      title: 'JAMB CBT Prep',
      subtitle: 'UTME Past Questions & Drills',
      category: 'Exam Board',
      badge: 'Official CBT',
      customIcon: <ExamOfficialLogo board="jamb" className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => {
        if (onSelectExam) {
          onSelectExam('JAMB');
        } else {
          handleNavigate('/jamb', 'jamb');
        }
      },
    },
    {
      id: 'waec',
      title: 'WAEC WASSCE',
      subtitle: 'Senior School Certificate',
      category: 'Exam Board',
      badge: 'SSCE Prep',
      customIcon: <ExamOfficialLogo board="waec" className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => {
        if (onSelectExam) {
          onSelectExam('WAEC');
        } else {
          handleNavigate('/study', 'study');
        }
      },
    },
    {
      id: 'neco',
      title: 'NECO SSCE',
      subtitle: 'National Examination Council',
      category: 'Exam Board',
      badge: 'National',
      customIcon: <ExamOfficialLogo board="neco" className="w-8 h-8 sm:w-9 sm:h-9" />,
      action: () => {
        if (onSelectExam) {
          onSelectExam('NECO');
        } else {
          handleNavigate('/study', 'study');
        }
      },
    },
    {
      id: 'classroom',
      title: 'AI Classroom',
      subtitle: 'Digital Chalkboard & Voice',
      category: 'Learning',
      badge: 'Chalkboard',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
          <LearnDeanEmblem className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/classroom', 'classroom'),
    },
    {
      id: 'journey',
      title: 'Study Journey',
      subtitle: '6-Step Topic Mastery',
      category: 'Learning',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
          <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/study-journey', 'journey'),
    },
    {
      id: 'practice',
      title: 'Practice Drills',
      subtitle: 'Instant Answers & Solutions',
      category: 'Practice',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
          <PenTool className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/practice', 'practice'),
    },
    {
      id: 'library',
      title: 'Syllabus Library',
      subtitle: 'Official Topics & Notes',
      category: 'Curriculum',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/subjects', 'subjects'),
    },
    {
      id: 'flashcards',
      title: 'Active Recall',
      subtitle: 'Formula & Fact Cards',
      category: 'Practice',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
          <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/flashcards', 'flashcards'),
    },
    {
      id: 'upload_notes',
      title: 'Upload Notes',
      subtitle: 'AI Notes & Study Sheets',
      category: 'Tools',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
          <FileUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/upload-notes', 'upload_notes'),
    },
    {
      id: 'novels',
      title: 'Literature Novels',
      subtitle: 'Set Books & Questions',
      category: 'Curriculum',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
          <BookMarked className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/novels', 'novels'),
    },
    {
      id: 'weak_topics',
      title: 'Diagnostic Review',
      subtitle: 'Target Past Mistakes',
      category: 'Practice',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
          <Target className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => handleNavigate('/weak-topics', 'weak_topics'),
    },
    {
      id: 'offline_hub',
      title: 'Offline Hub',
      subtitle: 'Study Without Internet',
      category: 'Tools',
      customIcon: (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
          <WifiOff className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      ),
      action: () => {
        if (onOpenOfflineHub) {
          onOpenOfflineHub();
        } else {
          sessionStorage.setItem('open_offline_hub', 'true');
          handleNavigate('/home', 'home');
        }
      },
    },
  ];

  return (
    <div className="space-y-3 w-full min-w-0" id="study-features-grid-section">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Study Features & Exam Standards
        </h2>
        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">12 Connected Features</span>
      </div>

      {/* Responsive Two-Column Mobile Grid, 3-col on sm, 4-col on md, 6-col on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5 w-full min-w-0">
        {featureCards.map((card) => (
          <button
            key={card.id}
            id={`study-feature-card-${card.id}`}
            type="button"
            onClick={card.action}
            className="bg-white dark:bg-[#0a0a0a] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col items-center justify-center text-center group cursor-pointer min-h-[115px] sm:min-h-[125px] w-full min-w-0 shadow-2xs relative overflow-hidden active:scale-[0.98]"
          >
            {card.badge && (
              <span className="absolute top-2 right-2 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                {card.badge}
              </span>
            )}
            <div className="mb-2 shrink-0 group-hover:scale-105 transition-transform">
              {card.customIcon}
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white transition-colors line-clamp-1 max-w-full">
              {card.title}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5 max-w-full">
              {card.subtitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
