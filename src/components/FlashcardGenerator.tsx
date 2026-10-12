import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Sparkles, BookOpen, Loader2, RotateCcw, Square, Info } from 'lucide-react';
import FlashcardStudyScreen from './flashcards/FlashcardStudyScreen';
import { Flashcard as FlashcardType } from '../types';

interface GeneratedCardItem {
  front: string;
  back: string;
}

export default function Flashcards({ onBack }: { onBack: () => void }) {
  const { user, getToken } = useAuth();
  const [inputText, setInputText] = useState('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<GeneratedCardItem[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setStatusMessage("Flashcard creation stopped by user. Your notes are preserved.");
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setLoading(true);
    setStatusMessage(null);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const token = await getToken();
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          text: inputText,
          count: count
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      if (data.flashcards && data.flashcards.length > 0) {
        setFlashcards(data.flashcards);
      }
    } catch (error: any) {
      if (error?.name === 'AbortError' || controller.signal.aborted) {
        setStatusMessage("Flashcard creation stopped by user. Your notes are preserved.");
        return;
      }
      console.error("Error generating flashcards:", error);
      setStatusMessage("There was an error generating flashcards. Please try again.");
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const resetGenerator = () => {
    setFlashcards([]);
    setInputText('');
  };

  if (flashcards.length > 0) {
    const studyCards: FlashcardType[] = flashcards.map((c, idx) => ({
      id: `gen_fc_${idx}`,
      uid: user?.uid || 'guest',
      subject: 'Flashcards',
      topic: 'Generated Flashcards',
      front: c.front,
      back: c.back,
      reviews: 0
    }));

    return (
      <FlashcardStudyScreen
        deckName="Generated Flashcards"
        subject="Notes"
        topic="Generated Study Deck"
        cards={studyCards}
        onExit={resetGenerator}
        onRateCard={async () => {}}
        onToggleBookmark={async () => {}}
      />
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto pb-12 flex flex-col">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => onBack()} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <p className="text-sm font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase mb-1">
            Flashcard Generator
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Convert Notes to Flashcards</h2>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border-2 border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-2xl">
          <Sparkles size={24} />
          <p className="font-medium text-sm md:text-base">Paste your study notes, lecture transcripts, or any learning material below, and Gemini AI will instantly turn them into interactive flashcards.</p>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Study Material / Notes</label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here (e.g., 'Mitochondria is the powerhouse of the cell...')"
              className="w-full h-48 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Number of Flashcards</label>
            <select 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            >
              <option value={5}>5 Flashcards</option>
              <option value={10}>10 Flashcards</option>
              <option value={20}>20 Flashcards</option>
              <option value={30}>30 Flashcards</option>
              <option value={50}>50 Flashcards</option>
              <option value={75}>75 Flashcards</option>
              <option value={100}>100 Flashcards</option>
            </select>
          </div>

          {statusMessage && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <Info size={18} className="text-amber-600 shrink-0" />
                <span>{statusMessage}</span>
              </div>
              <button type="button" onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600">
                <RotateCcw size={14} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex gap-3 mt-4">
              <div className="flex-1 py-4 bg-purple-600/70 text-white font-bold rounded-2xl flex items-center justify-center gap-3 text-lg select-none">
                <Loader2 size={24} className="animate-spin" />
                <span>Generating Flashcards...</span>
              </div>
              <button 
                type="button" 
                onClick={handleStopGeneration}
                className="px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-base cursor-pointer shrink-0"
                title="Stop flashcard creation"
              >
                <Square size={18} className="fill-current" />
                <span>Stop / Cancel</span>
              </button>
            </div>
          ) : (
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className="w-full py-4 mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-3 text-lg cursor-pointer"
            >
              <Sparkles size={24} />
              <span>Generate Flashcards</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
