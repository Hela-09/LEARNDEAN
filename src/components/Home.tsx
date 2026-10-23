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
import { getSemanticPaletteForFeature, renderThemedFeatureIcon } from '../utils/iconTokens';

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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 sm:gap-7 pb-10 sm:pb-12 min-w-0">
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
            className="px-3.5 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            title="Download JAMB content and novels for offline study"
          >
            <Download className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            <span>Prepare for Offline</span>
          </button>

          {/* Offline Hub Preview Button */}
          <button
            id="home-offline-hub-preview-btn"
            onClick={() => setShowOfflineHubPreview(true)}
            className="px-3 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Preview Offline Learning Hub"
          >
            <WifiOff className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
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
              <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-[#0a0a0a] p-2.5 sm:p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs max-w-full">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs sm:text-base shrink-0 shadow-2xs">
                  Lvl {levelInfo.level}
                </div>
                <div className="pr-1 sm:pr-2 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {levelInfo.title}
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 dark:text-neutral-400 shrink-0">
                      {xp} / {levelInfo.nextXp} XP
                    </span>
                  </div>
                  <div className="h-2 w-24 sm:w-32 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full transition-all duration-500"
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
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Quick Links
            </h2>
            <span className="text-xs text-neutral-400">({activeFeatures.length})</span>
          </div>

          <button
            id="home-customize-quick-links-btn"
            type="button"
            onClick={() => setIsCustomizeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs border border-neutral-200 dark:border-neutral-800"
            title="Choose which features appear on your homepage and change their order"
          >
            <Sliders size={13} className="text-neutral-700 dark:text-neutral-300" />
            <span>Customize Homepage</span>
          </button>
        </div>

        {/* Dynamic Customizable Feature Layouts - Square aspect ratio cards */}
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
          {activeFeatures.map((feat) => {
            const palette = getSemanticPaletteForFeature(feat.iconName);
            return (
              <button
                key={feat.id}
                id={`quick-action-${feat.id}`}
                onClick={() => handleFeatureClick(feat)}
                className="bg-white dark:bg-[#0a0a0a] p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50/80 dark:hover:bg-neutral-900/50 transition-all flex flex-col items-center justify-center text-center group cursor-pointer aspect-square min-w-0 shadow-2xs active:scale-[0.98]"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 mb-2 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 border ${palette.bg} ${palette.border}`}
                >
                  {renderThemedFeatureIcon(feat.iconName, { size: 23 })}
                </div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm line-clamp-2 leading-snug text-center max-w-full px-1">
                  {feat.label}
                </h3>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Study Section */}
      <div className="w-full min-w-0">
        <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full min-w-0 shadow-2xs">
          <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-blue-600 dark:text-blue-400" /> Continue Study
          </h3>
          {activeJourney && activeJourney.status === 'in_progress' ? (
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/50 rounded-lg">
                    <Compass size={16} />
                  </div>
                  <span className="font-bold text-xs uppercase text-neutral-700 dark:text-neutral-300">
                    Study Journey
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  Step {activeJourney.step} of 6
                </span>
              </div>
              <h4 className="font-bold text-neutral-900 dark:text-white truncate text-base mb-0.5">
                {activeJourney.topic}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                {activeJourney.subject} • {activeJourney.examType}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('journey')}
                  className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : recentPractice ? (
            <div
              onClick={() => setView('practice')}
              className="group p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 rounded-lg">
                  <PenTool size={16} />
                </div>
                <span className="font-bold text-sm text-neutral-900 dark:text-white">
                  Unfinished Practice
                </span>
              </div>
              <h4 className="font-bold text-neutral-900 dark:text-white truncate">
                {recentPractice.subject || 'General'}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Pick up where you left off</p>
            </div>
          ) : (
            <div
              onClick={() => setView('classroom')}
              className="group p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 rounded-lg">
                  <LearnDeanEmblem className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-neutral-900 dark:text-white">AI Classroom</span>
              </div>
              <h4 className="font-bold text-neutral-900 dark:text-white truncate">
                Digital Chalkboard Lesson
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Interactive step-by-step teaching with voice
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Guaranteed Permanent Bottom Space */}
      <div
        id="home-page-bottom-clearance"
        className="w-full h-20 sm:h-24 shrink-0 pointer-events-none select-none"
        aria-hidden="true"
      />

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
