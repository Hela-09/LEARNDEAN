import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Sliders,
  Eye,
  GripVertical,
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
  Calculator,
} from 'lucide-react';
import {
  ALL_HOMEPAGE_AVAILABLE_FEATURES,
  DEFAULT_HOMEPAGE_FEATURE_IDS,
  QuickLinkItem,
  saveHomepageQuickLinks,
} from '../../services/homepagePreferencesService';
import { LearnDeanEmblem } from '../Logo';
import { useAuth } from '../../contexts/AuthContext';
import { getSemanticPaletteForFeature, renderThemedFeatureIcon } from '../../utils/iconTokens';

interface CustomizeHomepageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLinks: string[];
  onSaved: (links: string[]) => void;
}

export default function CustomizeHomepageModal({
  isOpen,
  onClose,
  currentLinks,
  onSaved,
}: CustomizeHomepageModalProps) {
  const { user } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(
        currentLinks.length > 0 ? [...currentLinks] : [...DEFAULT_HOMEPAGE_FEATURE_IDS]
      );
    }
  }, [isOpen, currentLinks]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        // Prevent deselecting everything: keep at least 1 feature
        if (prev.length <= 1) return prev;
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSelectedIds((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= selectedIds.length - 1) return;
    setSelectedIds((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
  };

  const handleResetToDefault = () => {
    setSelectedIds([...DEFAULT_HOMEPAGE_FEATURE_IDS]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveHomepageQuickLinks(user?.uid, selectedIds);
      onSaved(selectedIds);
      onClose();
    } catch (e) {
      console.error('Failed to save homepage preferences:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedFeatures = selectedIds
    .map((id) => ALL_HOMEPAGE_AVAILABLE_FEATURES.find((f) => f.id === id))
    .filter((f): f is QuickLinkItem => !!f);

  const unselectedFeatures = ALL_HOMEPAGE_AVAILABLE_FEATURES.filter(
    (f) => !selectedIds.includes(f.id)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-labelledby="customize-homepage-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sliders size={20} />
            </div>
            <div>
              <h2
                id="customize-homepage-title"
                className="text-lg sm:text-xl font-black text-slate-900 dark:text-white"
              >
                Customize Homepage Quick Links
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose, reorder, and preview features shown on your homepage.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Eye size={14} className="text-blue-600 dark:text-blue-400" />
                Live Homepage Preview ({selectedFeatures.length} active)
              </span>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset Defaults</span>
              </button>
            </div>

            {/* Simulated Homepage Grid */}
            <div
              className={`grid gap-2.5 ${
                selectedFeatures.length <= 2
                  ? 'grid-cols-2'
                  : selectedFeatures.length <= 4
                  ? 'grid-cols-2 sm:grid-cols-4'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
              }`}
            >
              {selectedFeatures.map((feat) => {
                const palette = getSemanticPaletteForFeature(feat.iconName);
                return (
                  <div
                    key={feat.id}
                    className="bg-white dark:bg-[#0a0a0a] p-2.5 sm:p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center shadow-2xs aspect-square"
                  >
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 mb-1.5 rounded-xl border ${palette.bg} ${palette.border} flex items-center justify-center shrink-0`}>
                      {renderThemedFeatureIcon(feat.iconName, { size: 18 })}
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-neutral-900 dark:text-white line-clamp-2 leading-tight text-center max-w-full px-0.5">
                      {feat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 1: Active Homepage Features (Reorder & Remove) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Active on Homepage ({selectedFeatures.length}) — Use arrows to reorder
            </h3>

            <div className="space-y-2">
              {selectedFeatures.map((feat, index) => {
                const palette = getSemanticPaletteForFeature(feat.iconName);
                return (
                  <div
                    key={feat.id}
                    className="p-3 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className={`w-8 h-8 rounded-xl border ${palette.bg} ${palette.border} flex items-center justify-center shrink-0`}>
                        {renderThemedFeatureIcon(feat.iconName, { size: 16 })}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                          {feat.label}
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate hidden sm:block">
                          {feat.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Up"
                        aria-label="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === selectedFeatures.length - 1}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Move Down"
                        aria-label="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(feat.id)}
                        disabled={selectedFeatures.length <= 1}
                        className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ml-1"
                        title="Remove from Homepage"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Available Features to Add */}
          {unselectedFeatures.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Available to Add ({unselectedFeatures.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {unselectedFeatures.map((feat) => {
                  const palette = getSemanticPaletteForFeature(feat.iconName);
                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => handleToggle(feat.id)}
                      className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 flex items-center justify-between text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl border ${palette.bg} ${palette.border} flex items-center justify-center shrink-0 transition-colors`}>
                          {renderThemedFeatureIcon(feat.iconName, { size: 16 })}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {feat.label}
                          </p>
                          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                            {feat.shortDescription}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[11px] font-bold shrink-0 ml-2 shadow-2xs group-hover:scale-105 transition-transform">
                        + Add
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3 bg-neutral-50 dark:bg-[#080808] shrink-0">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {user ? 'Saved to your account' : 'Saved to this device'}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
