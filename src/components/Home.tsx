import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  PenTool,
  Search,
  Clock,
  ChevronRight,
  Sliders,
  Compass,
  FileUp,
  GraduationCap,
  Download,
  WifiOff,
  Layers,
  Zap,
  BookMarked,
  Target,
  School,
} from 'lucide-react';
import { ViewType, StudyJourneyState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getLevelInfo } from '../lib/achievements';
import { LearnDeanEmblem } from './Logo';
import OfflineLearningHub from './offline/OfflineLearningHub';
import PrepareForOfflineModal from './offline/PrepareForOfflineModal';
import CustomizeHomepageModal from './home/CustomizeHomepageModal';
import {
  ALL_HOMEPAGE_AVAILABLE_FEATURES,
  DEFAULT_HOMEPAGE_FEATURE_IDS,
  getHomepageQuickLinks,
  QuickLinkItem,
} from '../services/homepagePreferencesService';

interface HomeProps {
  setView: (view: ViewType) => void;
}

export default function Home({ setView }: HomeProps) {
  const { user, userProfile, loading: authLoading } = useAuth();

  // Fast hydration from local cache
  const [cachedHome] = useState(() => {
    if (!user) return null;
    try {
      const saved = localStorage.getItem(`zetadu_home_cache_${user.uid}`);
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  const [activeJourney, setActiveJourney] = useState<StudyJourneyState | null>(
    () => cachedHome?.activeJourney || null
  );
  const [recentPractice, setRecentPractice] = useState<any | null>(
    () => cachedHome?.recentPractice || null
  );

  // Quick Links State
  const [quickLinkIds, setQuickLinkIds] = useState<string[]>(() => {
    if (!user) return [...DEFAULT_HOMEPAGE_FEATURE_IDS];
    try {
      const raw = localStorage.getItem(`learndean_homepage_quick_links_${user.uid}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [...DEFAULT_HOMEPAGE_FEATURE_IDS];
  });
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  // Offline Learning Hub states
  const [isOffline, setIsOffline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [showOfflineHubPreview, setShowOfflineHubPreview] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('open_offline_hub') === 'true') {
      sessionStorage.removeItem('open_offline_hub');
      return true;
    }
    return false;
  });
  const [isPrepareModalOpen, setIsPrepareModalOpen] = useState<boolean>(false);
  const [onlineNotification, setOnlineNotification] = useState<string | null>(null);

  // Load and subscribe to customized quick links
  useEffect(() => {
    let active = true;
    getHomepageQuickLinks(user?.uid).then((links) => {
      if (active && links.length > 0) {
        setQuickLinkIds(links);
      }
    });

    const handleLinksUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ links: string[] }>;
      if (customEvent.detail && Array.isArray(customEvent.detail.links)) {
        setQuickLinkIds(customEvent.detail.links);
      }
    };

    window.addEventListener('learndean-homepage-links-updated', handleLinksUpdated);
    return () => {
      active = false;
      window.removeEventListener('learndean-homepage-links-updated', handleLinksUpdated);
    };
  }, [user?.uid]);

  useEffect(() => {
    const handleOpenOfflineHub = () => {
      setShowOfflineHubPreview(true);
      window.scrollTo(0, 0);
    };
    window.addEventListener('open-offline-hub', handleOpenOfflineHub);
    return () => window.removeEventListener('open-offline-hub', handleOpenOfflineHub);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowOfflineHubPreview(false);
      setOnlineNotification('Connection restored. Returned to live Home dashboard.');
      setTimeout(() => setOnlineNotification(null), 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setOnlineNotification('Offline mode detected. LearnDean Offline Learning Hub is active.');
      setTimeout(() => setOnlineNotification(null), 4000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Student';

  // If user is offline or previewing the offline hub, show OfflineLearningHub
  if (isOffline || showOfflineHubPreview) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-28 sm:pb-32">
        <div className="flex items-center justify-between bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <WifiOff className="text-amber-500" size={24} />
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white">
                {isOffline ? 'Offline Mode Active' : 'Offline Hub Preview'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Study downloaded syllabi, JAMB questions, and literature without an active internet connection.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOfflineHubPreview(false)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
        <OfflineLearningHub setView={setView} />
      </div>
    );
  }

  const renderFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'classroom':
        return <LearnDeanEmblem className="w-6 h-6" />;
      case 'upload':
        return <FileUp size={24} />;
      case 'journey':
        return <Compass size={24} />;
      case 'library':
        return <BookOpen size={24} />;
      case 'practice':
        return <PenTool size={22} />;
      case 'study_hub':
        return <School size={24} />;
      case 'flashcards':
        return <Layers size={24} />;
      case 'jamb':
        return <GraduationCap size={24} />;
      case 'novels':
        return <BookMarked size={24} />;
      case 'offline':
        return <WifiOff size={22} />;
      case 'weak_topics':
        return <Target size={24} />;
      case 'challenge':
        return <Zap size={24} />;
      default:
        return <Sparkles size={24} />;
    }
  };

  const handleFeatureClick = (feat: QuickLinkItem) => {
    if (feat.destination === 'offline_hub') {
      setShowOfflineHubPreview(true);
    } else {
      setView(feat.destination as ViewType);
    }
  };

  // Resolve active quick link items in order
  const activeFeatures = quickLinkIds
    .map((id) => ALL_HOMEPAGE_AVAILABLE_FEATURES.find((f) => f.id === id))
    .filter((f): f is QuickLinkItem => !!f);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 sm:gap-7 pb-6 sm:pb-8 min-w-0">
      {/* Online Notification Banner */}
      {onlineNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs">
          <span>{onlineNotification}</span>
          <button
            onClick={() => setOnlineNotification(null)}
            className="text-white/80 hover:text-white ml-2 text-xs uppercase font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hello, {userName}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
            Welcome back to your personalized study dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Prepare for Offline Button */}
          <button
            id="home-prepare-offline-btn"
            onClick={() => setIsPrepareModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            title="Download JAMB content and novels for offline study"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Prepare for Offline</span>
          </button>

          {/* Offline Hub Preview Button */}
          <button
            id="home-offline-hub-preview-btn"
            onClick={() => setShowOfflineHubPreview(true)}
            className="px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Preview Offline Learning Hub"
          >
            <WifiOff className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Offline Hub</span>
          </button>

          {/* Level & XP Stats */}
          {(() => {
            const xp = userProfile?.xp || 0;
            const levelInfo = getLevelInfo(xp);
            const currentLevelBaseXp =
              levelInfo.level === 1
                ? 0
                : levelInfo.level === 2
                ? 100
                : levelInfo.level === 3
                ? 250
                : levelInfo.level === 4
                ? 500
                : levelInfo.level === 5
                ? 1000
                : levelInfo.level === 6
                ? 2500
                : 5000;

            const progressPct =
              levelInfo.level >= 7
                ? 100
                : Math.min(
                    100,
                    Math.max(0, ((xp - currentLevelBaseXp) / (levelInfo.nextXp - currentLevelBaseXp)) * 100)
                  );

            return (
              <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs max-w-full">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-xs sm:text-base shadow-md shrink-0">
                  Lvl {levelInfo.level}
                </div>
                <div className="pr-1 sm:pr-2 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                      {levelInfo.title}
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium text-blue-600 dark:text-blue-400 shrink-0">
                      {xp} / {levelInfo.nextXp} XP
                    </span>
                  </div>
                  <div className="h-2 w-24 sm:w-32 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Quick Links Section Header with Customize Button */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Links
            </h2>
            <span className="text-xs text-slate-400">({activeFeatures.length})</span>
          </div>

          <button
            id="home-customize-quick-links-btn"
            type="button"
            onClick={() => setIsCustomizeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs border border-slate-200/80 dark:border-slate-700/80"
            title="Choose which features appear on your homepage and change their order"
          >
            <Sliders size={13} className="text-blue-600 dark:text-blue-400" />
            <span>Customize Homepage</span>
          </button>
        </div>

        {/* Dynamic Customizable Feature Layouts */}
        <div
          id="home-top-feature-layouts"
          className={`grid gap-3 sm:gap-4 w-full min-w-0 ${
            activeFeatures.length <= 2
              ? 'grid-cols-2'
              : activeFeatures.length <= 4
              ? 'grid-cols-2 sm:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
          }`}
        >
          {activeFeatures.map((feat) => (
            <button
              key={feat.id}
              id={`quick-action-${feat.id}`}
              onClick={() => handleFeatureClick(feat)}
              className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-11 h-11 mb-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                {renderFeatureIcon(feat.iconName)}
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">
                {feat.label}
              </h3>
            </button>
          ))}
        </div>
      </div>

      {/* AI Classroom Chalkboard Feature Banner */}
      <div
        id="home-classroom-banner"
        onClick={() => setView('classroom')}
        className="w-full bg-gradient-to-r from-[#182920] to-[#1e3a2d] p-4 sm:p-5 rounded-3xl border-2 border-[#5c3a21] shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group text-white relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent)] pointer-events-none" />
        <div className="flex items-center gap-3.5 min-w-0 z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#4a2e18] border border-amber-600/40 text-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md">
            <GraduationCap size={26} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">
                ACTIVE
              </span>
              <span className="text-amber-200/80 font-mono text-xs">Digital Chalkboard</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-mono tracking-wide text-white group-hover:text-amber-200 transition-colors truncate mt-0.5">
              AI Classroom: Step-by-Step Chalkboard Teacher
            </h3>
            <p className="text-xs text-emerald-100/70 truncate max-w-xl">
              Watch formulas, diagrams, and worked problems written in chalk while the AI teacher explains aloud.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 z-10 shrink-0 self-end sm:self-auto">
          <span className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all group-hover:translate-x-0.5">
            <span>Enter Classroom</span>
            <ArrowRight size={15} />
          </span>
        </div>
      </div>

      {/* Quick Search Bar Banner on Home */}
      <div
        id="home-search-banner"
        onClick={() => {
          const event = new CustomEvent('open-zetadu-search');
          window.dispatchEvent(event);
        }}
        className="w-full bg-white dark:bg-slate-800/90 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-blue-100 dark:border-blue-900/40">
            <Search size={18} />
          </div>
          <div className="truncate">
            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Find Subjects, Topics, Flashcards & Practice Questions
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Type to search any subject syllabus, flashcards, or practice questions instantly...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <kbd className="hidden md:inline-block px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-600">
            ⌘K
          </kbd>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            Search <ArrowRight size={14} />
          </span>
        </div>
      </div>

      {/* Main Content Grid: Continue Study & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full min-w-0">
        {/* Left Column: Quick Navigation Cards */}
        <div className="lg:col-span-8 flex flex-col gap-5 sm:gap-6 min-w-0">
          {/* Study Hub Shortcut Card */}
          <div
            onClick={() => setView('study')}
            className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all cursor-pointer group shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <School size={26} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 uppercase">
                    CURRICULUM & EXAMS
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5">
                  Explore Study & Exam Hub
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  WAEC, NECO, and JAMB UTME syllabus questions and comprehensive study guides.
                </p>
              </div>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-xs gap-1 group-hover:translate-x-1 transition-transform shrink-0">
              <span>Open Hub</span>
              <ChevronRight size={16} />
            </div>
          </div>

          {/* Practice & Active Recall Shortcut Card */}
          <div
            onClick={() => setView('practice')}
            className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all cursor-pointer group shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <PenTool size={24} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 uppercase">
                    PRACTICE QUESTIONS
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-0.5">
                  Interactive Practice & Quizzes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Test your understanding with instant solutions and detailed explanations.
                </p>
              </div>
            </div>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-xs gap-1 group-hover:translate-x-1 transition-transform shrink-0">
              <span>Start Practice</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>

        {/* Right Column: Continue Study */}
        <div className="lg:col-span-4 flex flex-col gap-6 min-w-0">
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full min-w-0 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" /> Continue Study
            </h3>
            {activeJourney && activeJourney.status === 'in_progress' ? (
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-800 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                      <Compass size={14} />
                    </div>
                    <span className="font-bold text-xs uppercase text-blue-700 dark:text-blue-300">
                      Study Journey
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                    Step {activeJourney.step} of 6
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate text-base mb-0.5">
                  {activeJourney.topic}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {activeJourney.subject} • {activeJourney.examType}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setView('journey')}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : recentPractice ? (
              <div
                onClick={() => setView('practice')}
                className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <PenTool size={16} />
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">
                    Unfinished Practice
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate">
                  {recentPractice.subject || 'General'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pick up where you left off</p>
              </div>
            ) : (
              <div
                onClick={() => setView('classroom')}
                className="group p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                    <GraduationCap size={16} />
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">AI Classroom</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate">
                  Digital Chalkboard Lesson
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Interactive step-by-step teaching with voice
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prepare for Offline Modal */}
      <PrepareForOfflineModal
        isOpen={isPrepareModalOpen}
        onClose={() => setIsPrepareModalOpen(false)}
      />

      {/* Customize Homepage Modal */}
      <CustomizeHomepageModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        currentLinks={quickLinkIds}
        onSaved={(newLinks) => setQuickLinkIds(newLinks)}
      />
    </div>
  );
}
