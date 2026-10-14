import React, { useState, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Check,
  Search,
  X,
  Sparkles,
  Gauge,
  User,
  Radio,
} from 'lucide-react';
import { chalkAudio } from '../../utils/chalkAudio';

interface VoiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelectVoice: (voice: SpeechSynthesisVoice) => void;
  onPreviewVoice: (voice: SpeechSynthesisVoice) => void;
  speed: number;
  onSetSpeed: (speed: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

// Helper to format language tags into human-friendly accents
export function getFriendlyAccentLabel(lang: string): string {
  const code = (lang || '').toLowerCase();
  if (code.startsWith('en-us')) return 'American English';
  if (code.startsWith('en-gb')) return 'British English';
  if (code.startsWith('en-ng')) return 'Nigerian English';
  if (code.startsWith('en-au')) return 'Australian English';
  if (code.startsWith('en-in')) return 'Indian English';
  if (code.startsWith('en-ca')) return 'Canadian English';
  if (code.startsWith('en-ie')) return 'Irish English';
  if (code.startsWith('en-za')) return 'South African English';
  if (code.startsWith('en-nz')) return 'New Zealand English';
  if (code.startsWith('en')) return 'English';
  if (code.startsWith('fr')) return 'French';
  if (code.startsWith('es')) return 'Spanish';
  if (code.startsWith('de')) return 'German';
  return lang;
}

export default function VoiceSelectionModal({
  isOpen,
  onClose,
  voices,
  selectedVoice,
  onSelectVoice,
  onPreviewVoice,
  speed,
  onSetSpeed,
  isMuted,
  onToggleMute,
}: VoiceSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewingVoiceName, setPreviewingVoiceName] = useState<string | null>(null);

  const filteredVoices = useMemo(() => {
    if (!searchQuery.trim()) return voices;
    const q = searchQuery.toLowerCase();
    return voices.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.lang.toLowerCase().includes(q) ||
        getFriendlyAccentLabel(v.lang).toLowerCase().includes(q)
    );
  }, [voices, searchQuery]);

  if (!isOpen) return null;

  const handlePreview = (e: React.MouseEvent, voice: SpeechSynthesisVoice) => {
    e.stopPropagation();
    setPreviewingVoiceName(voice.name);
    chalkAudio.playChalkTap();
    onPreviewVoice(voice);
    setTimeout(() => {
      setPreviewingVoiceName(null);
    }, 3200);
  };

  const handleSelect = (voice: SpeechSynthesisVoice) => {
    chalkAudio.playChalkTap();
    onSelectVoice(voice);
  };

  const speeds = [0.75, 1.0, 1.25, 1.5];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 animate-scaleUp max-h-[92dvh] flex flex-col my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Volume2 size={22} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              AI Teacher Voice & Speech
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose your preferred voice, accent, and pacing. Your selection is automatically saved.
            </p>
          </div>
        </div>

        {/* Speaking Speed & Audio Mute Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Speed Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
              <Gauge size={14} className="text-blue-500" />
              <span>Speed:</span>
            </span>
            <div className="flex items-center gap-1">
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => onSetSpeed(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    speed === s
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Mute toggle */}
          <button
            onClick={onToggleMute}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isMuted ? 'Voice Muted (Reading Mode)' : 'Voice Enabled'}</span>
          </button>
        </div>

        {/* Voice Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search voices by name or accent (e.g. American, British, Google)..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>

        {/* Available Voices List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {filteredVoices.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching voices found. Showing available system voices.
            </div>
          ) : (
            filteredVoices.map((voice) => {
              const isSelected = selectedVoice?.name === voice.name;
              const accent = getFriendlyAccentLabel(voice.lang);
              const isPreviewing = previewingVoiceName === voice.name;

              return (
                <div
                  key={voice.name}
                  onClick={() => handleSelect(voice)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isSelected ? <Check size={16} /> : <User size={16} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {voice.name.replace(/Google|Microsoft/gi, '').trim() || voice.name}
                        </span>
                        {voice.default && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-blue-600 dark:text-blue-400">{accent}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">{voice.lang}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preview Voice Button */}
                  <button
                    type="button"
                    onClick={(e) => handlePreview(e, voice)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                      isPreviewing
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                    }`}
                    title="Click to hear a sample of this voice"
                  >
                    <Play size={12} />
                    <span>{isPreviewing ? 'Playing...' : 'Preview'}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Done Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all cursor-pointer"
          >
            Apply & Return to Classroom
          </button>
        </div>
      </div>
    </div>
  );
}
