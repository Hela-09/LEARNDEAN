import { useState, useEffect, useRef, useCallback } from 'react';
import { chalkAudio } from '../utils/chalkAudio';

export const PREFERRED_VOICE_STORAGE_KEY = 'learndean_classroom_preferred_voice';
export const PREFERRED_SPEED_STORAGE_KEY = 'learndean_classroom_preferred_speed';

export interface UseChalkboardSpeechReturn {
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  speed: number;
  progress: number; // 0.0 to 1.0 (synchronized chalk writing progress)
  currentText: string;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  play: (text: string, onComplete?: () => void) => void;
  pause: () => void;
  resume: () => void;
  replay: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  setMuted: (muted: boolean) => void;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  previewVoice: (voice: SpeechSynthesisVoice) => void;
  fastForward: () => void;
}

export function useChalkboardSpeech(): UseChalkboardSpeechReturn {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speed, setSpeedState] = useState<number>(() => {
    if (typeof window === 'undefined') return 1.0;
    try {
      const saved = localStorage.getItem(PREFERRED_SPEED_STORAGE_KEY);
      return saved ? parseFloat(saved) || 1.0 : 1.0;
    } catch {
      return 1.0;
    }
  });
  const [progress, setProgress] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<any>(null);
  const chalkSoundIntervalRef = useRef<any>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);
  const charProgressRef = useRef<number>(0);
  const textLengthRef = useRef<number>(0);

  // Load browser voices & restore saved preference
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      if (!avail || avail.length === 0) return;

      const englishVoices = avail.filter((v) => v.lang.startsWith('en'));
      const sorted = englishVoices.length > 0 ? englishVoices : avail;

      setVoices(sorted);

      const savedName = localStorage.getItem(PREFERRED_VOICE_STORAGE_KEY);
      const savedVoice = savedName ? sorted.find((v) => v.name === savedName) : null;

      if (savedVoice) {
        setSelectedVoiceState(savedVoice);
      } else {
        // Prioritize natural or friendly female/male teacher voices
        const preferred =
          sorted.find((v) => /natural|neural|google|samantha|karen|daniel|moira/i.test(v.name)) ||
          sorted.find((v) => v.lang === 'en-US' || v.lang === 'en-GB') ||
          sorted[0];

        setSelectedVoiceState(preferred || null);
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const setSelectedVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    setSelectedVoiceState(voice);
    if (voice && typeof window !== 'undefined') {
      try {
        localStorage.setItem(PREFERRED_VOICE_STORAGE_KEY, voice.name);
      } catch {}
    }
  }, []);

  const triggerChalkStrokeSound = useCallback(() => {
    chalkAudio.playChalkStroke(60);
  }, []);

  const clearSpeechAndTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (chalkSoundIntervalRef.current) {
      clearInterval(chalkSoundIntervalRef.current);
      chalkSoundIntervalRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Stop everything
  const stop = useCallback(() => {
    clearSpeechAndTimers();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(1); // Set to finished
  }, [clearSpeechAndTimers]);

  // Fast forward (reveal whole board step immediately)
  const fastForward = useCallback(() => {
    stop();
    setProgress(1);
    if (onCompleteRef.current) {
      const cb = onCompleteRef.current;
      onCompleteRef.current = null;
      cb();
    }
  }, [stop]);

  // Start smooth animated pacing (used both as fallback and for muted reading mode)
  const startFallbackAnimation = useCallback(
    (text: string, durationSec: number, startProgress: number = 0) => {
      if (timerRef.current) clearInterval(timerRef.current);

      const startTime = Date.now();
      const totalMs = (durationSec * 1000) / speed;
      const initialP = startProgress;

      let soundCounter = 0;

      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(1, initialP + (1 - initialP) * (elapsed / totalMs));
        setProgress(ratio);

        soundCounter++;
        if (soundCounter % 4 === 0 && ratio < 0.98) {
          triggerChalkStrokeSound();
        }

        if (ratio >= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsPlaying(false);
          setIsPaused(false);
          if (onCompleteRef.current) {
            const cb = onCompleteRef.current;
            onCompleteRef.current = null;
            cb();
          }
        }
      }, 50);
    },
    [speed, triggerChalkStrokeSound]
  );

  // Play spoken explanation
  const play = useCallback(
    (text: string, onComplete?: () => void) => {
      clearSpeechAndTimers();
      setCurrentText(text);
      setProgress(0);
      setIsPlaying(true);
      setIsPaused(false);
      onCompleteRef.current = onComplete || null;
      textLengthRef.current = text.length || 1;
      charProgressRef.current = 0;

      // Estimate speaking duration based on ~145 words per minute
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const estimatedSec = Math.max(5, (wordCount / 2.4));

      // If user has muted voice or speech synthesis is not supported:
      if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        startFallbackAnimation(text, estimatedSec, 0);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      utterance.rate = speed;
      utterance.pitch = 1.0;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      let soundCounter = 0;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word' || event.name === 'sentence') {
          const charIdx = event.charIndex;
          const ratio = Math.min(0.98, Math.max(0.05, charIdx / textLengthRef.current));
          setProgress(ratio);
          charProgressRef.current = ratio;

          soundCounter++;
          if (soundCounter % 2 === 0) {
            triggerChalkStrokeSound();
          }
        }
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utterance.onend = () => {
        setProgress(1);
        setIsPlaying(false);
        setIsPaused(false);
        if (onCompleteRef.current) {
          const cb = onCompleteRef.current;
          onCompleteRef.current = null;
          cb();
        }
      };

      utterance.onerror = (e) => {
        // Fall back to timer animation if speech blocked or error
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          startFallbackAnimation(text, estimatedSec, charProgressRef.current);
        }
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        startFallbackAnimation(text, estimatedSec, 0);
      }
    },
    [clearSpeechAndTimers, isMuted, selectedVoice, speed, startFallbackAnimation, triggerChalkStrokeSound]
  );

  const pause = useCallback(() => {
    if (!isPlaying || isPaused) return;
    setIsPaused(true);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.pause();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [isPlaying, isPaused, isMuted]);

  const resume = useCallback(() => {
    if (!isPaused) return;
    setIsPaused(false);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.resume();
    } else {
      // Resume animated timer
      const wordCount = currentText.split(/\s+/).filter(Boolean).length;
      const estimatedSec = Math.max(5, (wordCount / 2.4));
      startFallbackAnimation(currentText, estimatedSec, progress);
    }
  }, [isPaused, isMuted, currentText, startFallbackAnimation, progress]);

  const replay = useCallback(() => {
    if (currentText) {
      play(currentText, onCompleteRef.current || undefined);
    }
  }, [currentText, play]);

  const setSpeed = useCallback(
    (newSpeed: number) => {
      setSpeedState(newSpeed);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(PREFERRED_SPEED_STORAGE_KEY, newSpeed.toString());
        } catch {}
      }
      if (isPlaying && !isPaused && utteranceRef.current) {
        if (currentText) {
          play(currentText, onCompleteRef.current || undefined);
        }
      }
    },
    [isPlaying, isPaused, currentText, play]
  );

  const setMuted = useCallback(
    (muted: boolean) => {
      setIsMuted(muted);
      if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        if (isPlaying && !isPaused && currentText) {
          const wordCount = currentText.split(/\s+/).filter(Boolean).length;
          const estimatedSec = Math.max(5, (wordCount / 2.4));
          startFallbackAnimation(currentText, estimatedSec, progress);
        }
      } else if (!muted && isPlaying && !isPaused && currentText) {
        play(currentText, onCompleteRef.current || undefined);
      }
    },
    [isPlaying, isPaused, currentText, progress, startFallbackAnimation, play]
  );

  // Preview a voice sample
  const previewVoice = useCallback((voice: SpeechSynthesisVoice) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const sampleText = 'Hello! I am your LearnDean AI Classroom teacher. Welcome to class!';
    const u = new SpeechSynthesisUtterance(sampleText);
    u.voice = voice;
    u.rate = speed;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }, [speed]);

  return {
    isPlaying,
    isPaused,
    isMuted,
    speed,
    progress,
    currentText,
    voices,
    selectedVoice,
    play,
    pause,
    resume,
    replay,
    stop,
    setSpeed,
    setMuted,
    setSelectedVoice,
    previewVoice,
    fastForward,
  };
}
