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
  const keepAliveTimerRef = useRef<any>(null);
  const chalkSoundIntervalRef = useRef<any>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);
  const sentenceQueueRef = useRef<string[]>([]);
  const currentSentenceIdxRef = useRef<number>(0);
  const isCancelledRef = useRef<boolean>(false);
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
    isCancelledRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
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

  // Play spoken explanation using sentence queueing to eliminate browser cutoff on long explanations
  const play = useCallback(
    (text: string, onComplete?: () => void) => {
      clearSpeechAndTimers();
      isCancelledRef.current = false;
      setCurrentText(text);
      setProgress(0);
      setIsPlaying(true);
      setIsPaused(false);
      onCompleteRef.current = onComplete || null;

      // Split text into natural sentences (. ! ? or newlines)
      const rawSentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g);
      const sentences = rawSentences && rawSentences.length > 0
        ? rawSentences.map((s) => s.trim()).filter((s) => s.length > 0)
        : [text.trim()];

      sentenceQueueRef.current = sentences;
      currentSentenceIdxRef.current = 0;

      // Estimate speaking duration based on ~140 words per minute
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const estimatedSec = Math.max(6, wordCount / 2.3);

      // If user has muted voice or speech synthesis is not supported:
      if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        startFallbackAnimation(text, estimatedSec, 0);
        return;
      }

      // Chrome keep-alive ping: periodic pause/resume to prevent browser speech garbage collection stall
      keepAliveTimerRef.current = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }
      }, 7000);

      const totalSentences = sentences.length;
      let soundCounter = 0;

      const speakSentence = (index: number) => {
        if (isCancelledRef.current) return;
        if (index >= totalSentences) {
          // All sentences finished speaking!
          if (keepAliveTimerRef.current) {
            clearInterval(keepAliveTimerRef.current);
            keepAliveTimerRef.current = null;
          }
          setProgress(1);
          setIsPlaying(false);
          setIsPaused(false);
          if (onCompleteRef.current) {
            const cb = onCompleteRef.current;
            onCompleteRef.current = null;
            cb();
          }
          return;
        }

        currentSentenceIdxRef.current = index;
        const sentenceText = sentences[index];
        const sentenceLen = Math.max(1, sentenceText.length);

        const utterance = new SpeechSynthesisUtterance(sentenceText);
        utteranceRef.current = utterance;
        utterance.rate = speed;
        utterance.pitch = 1.0;
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
          if (isCancelledRef.current) return;
          setIsPlaying(true);
          setIsPaused(false);
        };

        utterance.onboundary = (event) => {
          if (isCancelledRef.current) return;
          if (event.name === 'word' || event.name === 'sentence') {
            const charIdx = event.charIndex || 0;
            const intraProgress = Math.min(0.98, charIdx / sentenceLen);
            const totalProgress = Math.min(
              0.99,
              Math.max(0.02, (index + intraProgress) / totalSentences)
            );
            setProgress(totalProgress);

            soundCounter++;
            if (soundCounter % 2 === 0) {
              triggerChalkStrokeSound();
            }
          }
        };

        utterance.onend = () => {
          if (isCancelledRef.current) return;
          const nextIdx = index + 1;
          const progressAfterSentence = Math.min(0.99, nextIdx / totalSentences);
          setProgress(progressAfterSentence);
          speakSentence(nextIdx);
        };

        utterance.onerror = (e) => {
          if (isCancelledRef.current) return;
          if (e.error === 'interrupted' || e.error === 'canceled') return;
          // On non-fatal error, try next sentence or fallback
          const nextIdx = index + 1;
          if (nextIdx < totalSentences) {
            speakSentence(nextIdx);
          } else {
            startFallbackAnimation(text, estimatedSec, index / totalSentences);
          }
        };

        try {
          window.speechSynthesis.speak(utterance);
        } catch {
          startFallbackAnimation(text, estimatedSec, index / totalSentences);
        }
      };

      // Begin with first sentence
      speakSentence(0);
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
