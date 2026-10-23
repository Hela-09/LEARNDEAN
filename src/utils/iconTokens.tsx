import React from 'react';
import {
  BookOpen,
  GraduationCap,
  FileUp,
  Compass,
  PenTool,
  Layers,
  Zap,
  BookMarked,
  WifiOff,
  Target,
  School,
  Sparkles,
  Sliders,
  Bookmark,
  TrendingUp,
  User,
  Settings,
  HelpCircle,
  Shield,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Flame,
  Award,
} from 'lucide-react';
import { LearnDeanEmblem } from '../components/Logo';

export interface IconColorToken {
  text: string;
  bg: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  accentHex: string;
}

export const SEMANTIC_ICON_PALETTES: Record<string, IconColorToken> = {
  // Academic / Curriculum / Library
  academic: {
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50/90 dark:bg-blue-950/50',
    border: 'border-blue-200/70 dark:border-blue-800/60',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
    badgeText: 'text-blue-700 dark:text-blue-300',
    accentHex: '#2563EB',
  },
  // Official Exam / UTME / Certification
  exam: {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/50',
    border: 'border-emerald-200/70 dark:border-emerald-800/60',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    accentHex: '#059669',
  },
  // Practice / Drill / Test Engine
  practice: {
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50/90 dark:bg-indigo-950/50',
    border: 'border-indigo-200/70 dark:border-indigo-800/60',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    accentHex: '#4F46E5',
  },
  // Active Recall / Flashcards
  recall: {
    text: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50/90 dark:bg-sky-950/50',
    border: 'border-sky-200/70 dark:border-sky-800/60',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/60',
    badgeText: 'text-sky-700 dark:text-sky-300',
    accentHex: '#0284C7',
  },
  // Streaks / XP / Daily Challenge
  energy: {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50/90 dark:bg-amber-950/50',
    border: 'border-amber-200/70 dark:border-amber-800/60',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    accentHex: '#D97706',
  },
  // Diagnostics / Weak Topics / Mistakes
  diagnostic: {
    text: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50/90 dark:bg-rose-950/50',
    border: 'border-rose-200/70 dark:border-rose-800/60',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-700 dark:text-rose-300',
    accentHex: '#E11D48',
  },
  // Growth / Study Journey / Progress
  growth: {
    text: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50/90 dark:bg-violet-950/50',
    border: 'border-violet-200/70 dark:border-violet-800/60',
    badgeBg: 'bg-violet-100 dark:bg-violet-900/60',
    badgeText: 'text-violet-700 dark:text-violet-300',
    accentHex: '#7C3AED',
  },
  // Upload Notes / Document Processing
  document: {
    text: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50/90 dark:bg-teal-950/50',
    border: 'border-teal-200/70 dark:border-teal-800/60',
    badgeBg: 'bg-teal-100 dark:bg-teal-900/60',
    badgeText: 'text-teal-700 dark:text-teal-300',
    accentHex: '#0D9488',
  },
  // Literature / Prescribed Novels
  literature: {
    text: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50/90 dark:bg-amber-950/50',
    border: 'border-amber-200/70 dark:border-amber-800/60',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    accentHex: '#B45309',
  },
  // Offline & Data Connectivity
  offline: {
    text: 'text-slate-600 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800/80',
    border: 'border-slate-200/80 dark:border-slate-700/80',
    badgeBg: 'bg-slate-200 dark:bg-slate-700',
    badgeText: 'text-slate-700 dark:text-slate-300',
    accentHex: '#475569',
  },
  // Saved Bookmarks
  bookmark: {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50/90 dark:bg-amber-950/50',
    border: 'border-amber-200/70 dark:border-amber-800/60',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    accentHex: '#D97706',
  },
  // System / Neutral / Tools
  neutral: {
    text: 'text-slate-700 dark:text-slate-200',
    bg: 'bg-slate-100 dark:bg-slate-800/80',
    border: 'border-slate-200/80 dark:border-slate-700/80',
    badgeBg: 'bg-slate-200 dark:bg-slate-700',
    badgeText: 'text-slate-700 dark:text-slate-300',
    accentHex: '#334155',
  },
  // Admin & Security
  security: {
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50/90 dark:bg-purple-950/50',
    border: 'border-purple-200/70 dark:border-purple-800/60',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    accentHex: '#9333EA',
  },
};

/**
 * Returns the semantic palette corresponding to a feature key or category.
 */
export function getSemanticPaletteForFeature(featureIdOrIcon: string): IconColorToken {
  const key = featureIdOrIcon.toLowerCase();

  if (key === 'classroom' || key === 'ai-classroom' || key === 'tutor') {
    return SEMANTIC_ICON_PALETTES.academic;
  }
  if (key === 'jamb' || key === 'study' || key === 'study_hub' || key === 'waec' || key === 'neco') {
    return SEMANTIC_ICON_PALETTES.exam;
  }
  if (key === 'practice' || key === 'quiz' || key === 'drills') {
    return SEMANTIC_ICON_PALETTES.practice;
  }
  if (key === 'flashcards' || key === 'recall') {
    return SEMANTIC_ICON_PALETTES.recall;
  }
  if (key === 'challenge' || key === 'daily-challenge' || key === 'streak') {
    return SEMANTIC_ICON_PALETTES.energy;
  }
  if (key === 'weak_topics' || key === 'weak-topics' || key === 'diagnostic' || key === 'mistakes') {
    return SEMANTIC_ICON_PALETTES.diagnostic;
  }
  if (key === 'journey' || key === 'study-journey' || key === 'progress') {
    return SEMANTIC_ICON_PALETTES.growth;
  }
  if (key === 'upload' || key === 'upload-notes' || key === 'upload_notes') {
    return SEMANTIC_ICON_PALETTES.document;
  }
  if (key === 'library' || key === 'learn' || key === 'subjects') {
    return SEMANTIC_ICON_PALETTES.academic;
  }
  if (key === 'novels' || key === 'literature') {
    return SEMANTIC_ICON_PALETTES.literature;
  }
  if (key === 'offline' || key === 'offline_hub' || key === 'download') {
    return SEMANTIC_ICON_PALETTES.offline;
  }
  if (key === 'bookmarks' || key === 'saved') {
    return SEMANTIC_ICON_PALETTES.bookmark;
  }
  if (key === 'admin' || key === 'security') {
    return SEMANTIC_ICON_PALETTES.security;
  }

  return SEMANTIC_ICON_PALETTES.neutral;
}

/**
 * Renders a standardized, professionally styled feature icon with semantic color tokens.
 */
export function renderThemedFeatureIcon(
  iconName: string,
  options?: {
    size?: number;
    className?: string;
  }
): React.ReactNode {
  const size = options?.size || 22;
  const strokeWidth = 1.95;
  const palette = getSemanticPaletteForFeature(iconName);
  const colorClass = palette.text;

  switch (iconName) {
    case 'classroom':
      return <LearnDeanEmblem className="w-6 h-6" />;
    case 'upload':
    case 'upload_notes':
    case 'upload-notes':
      return <FileUp size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'journey':
    case 'study-journey':
      return <Compass size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'library':
    case 'learn':
    case 'subjects':
      return <BookOpen size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'practice':
      return <PenTool size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'study_hub':
    case 'study':
      return <School size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'flashcards':
      return <Layers size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'jamb':
      return <GraduationCap size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'novels':
      return <BookMarked size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'offline':
    case 'offline_hub':
      return <WifiOff size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'weak_topics':
    case 'weak-topics':
      return <Target size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'challenge':
    case 'daily-challenge':
      return <Zap size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'bookmarks':
      return <Bookmark size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'progress':
      return <TrendingUp size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'settings':
      return <Settings size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'help':
      return <HelpCircle size={size} strokeWidth={strokeWidth} className={colorClass} />;
    case 'admin':
      return <Shield size={size} strokeWidth={strokeWidth} className={colorClass} />;
    default:
      return <Sparkles size={size} strokeWidth={strokeWidth} className={colorClass} />;
  }
}
