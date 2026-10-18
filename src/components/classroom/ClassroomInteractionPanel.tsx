import React, { useState } from 'react';
import {
  MessageSquare,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Send,
  Sparkles,
  Volume2,
  RotateCcw,
  BookOpen,
  Square,
} from 'lucide-react';
import { ClassroomStep, ClassroomQuiz, ClassroomQA } from '../../types/classroom';
import { chalkAudio } from '../../utils/chalkAudio';

interface ClassroomInteractionPanelProps {
  currentStep: ClassroomStep;
  qaHistory: ClassroomQA[];
  onAskQuestion: (question: string, isSimplify: boolean) => Promise<void>;
  onStopAsking?: () => void;
  isAsking: boolean;
  onSpeakAnswer?: (text: string) => void;
  onQuizAnswered?: (isCorrect: boolean) => void;
  onNextStep?: () => void;
  isLastStep?: boolean;
  onOpenFinalAssessment?: () => void;
}

export default function ClassroomInteractionPanel({
  currentStep,
  qaHistory,
  onAskQuestion,
  onStopAsking,
  isAsking,
  onSpeakAnswer,
  onQuizAnswered,
  onNextStep,
  isLastStep = false,
  onOpenFinalAssessment,
}: ClassroomInteractionPanelProps) {
  const [activeTab, setActiveTab] = useState<'transcript' | 'ask' | 'quiz'>('transcript');
  const [questionInput, setQuestionInput] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Reset quiz state when step changes
  React.useEffect(() => {
    setSelectedOption(null);
    setQuizSubmitted(false);
  }, [currentStep.id]);

  const handleSendQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!questionInput.trim() || isAsking) return;
    const q = questionInput.trim();
    setQuestionInput('');
    chalkAudio.playChalkTap();
    await onAskQuestion(q, false);
  };

  const handleExplainSimpler = async () => {
    if (isAsking) return;
    chalkAudio.playChalkTap();
    await onAskQuestion('Please explain this step more simply using an everyday intuitive analogy.', true);
  };

  const handleQuizSubmit = (optIdx: number) => {
    if (quizSubmitted || !currentStep.quiz) return;
    setSelectedOption(optIdx);
    setQuizSubmitted(true);
    const isCorrect = optIdx === currentStep.quiz.correctIndex;

    if (isCorrect) {
      chalkAudio.playChalkTap();
    } else {
      chalkAudio.playEraserSweep();
    }

    if (onQuizAnswered) {
      onQuizAnswered(isCorrect);
    }
  };

  const currentStepQAs = qaHistory.filter((item) => item.stepId === currentStep.id);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all">
      {/* Top Tab Bar */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-1 sm:p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('transcript')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'transcript'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen size={15} />
          <span>Teacher's Words</span>
        </button>

        <button
          onClick={() => setActiveTab('ask')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
            activeTab === 'ask'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <HelpCircle size={15} />
          <span>Ask Teacher</span>
          {currentStepQAs.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
              {currentStepQAs.length}
            </span>
          )}
        </button>

        {currentStep.quiz && (
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={15} className="text-amber-500" />
            <span>Step Quiz</span>
            {quizSubmitted && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        )}
      </div>

      {/* Tab 1: Spoken Explanation Transcript */}
      {activeTab === 'transcript' && (
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Volume2 size={16} />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Teacher's Spoken Explanation
              </h3>
            </div>
            <button
              onClick={handleExplainSimpler}
              disabled={isAsking}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
            >
              <Lightbulb size={13} />
              <span>Explain Simpler</span>
            </button>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
            "{currentStep.spokenExplanation}"
          </div>

          {/* Conversational Understanding Check (Conversational question, not multiple choice) */}
          {currentStep.conversationalCheck && (
            <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2">
              <div className="flex items-center gap-1.5 text-blue-900 dark:text-blue-300 font-bold text-xs">
                <Sparkles size={14} className="text-blue-500" />
                <span>Teacher's Conversational Check:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                {currentStep.conversationalCheck.question}
              </p>
              {currentStep.conversationalCheck.hint && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  <strong className="text-blue-700 dark:text-blue-400">Hint:</strong> {currentStep.conversationalCheck.hint}
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('ask');
                  setQuestionInput(`In response to your check: "${currentStep.conversationalCheck?.question}", here is what I understand: `);
                }}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
              >
                <MessageSquare size={12} />
                <span>Discuss My Understanding with Teacher</span>
              </button>
            </div>
          )}

          <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
            Tip: Press Play on the chalkboard controls to listen to this step aloud with synchronized writing.
          </p>
        </div>
      )}

      {/* Tab 2: Ask Teacher & Follow-up Q&A */}
      {activeTab === 'ask' && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Got a Question About This Step?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ask your AI teacher anything without losing your lesson progress.
              </p>
            </div>
            <button
              onClick={handleExplainSimpler}
              disabled={isAsking}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:from-amber-600 hover:to-orange-600 flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
            >
              <Lightbulb size={13} />
              <span>Explain Simpler</span>
            </button>
          </div>

          {/* Question Input Form */}
          <form onSubmit={handleSendQuestion} className="flex gap-2">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="e.g. Why does acceleration increase when force doubles?"
              disabled={isAsking}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
            />
            {isAsking ? (
              <button
                type="button"
                onClick={onStopAsking}
                className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-rose-600 dark:hover:bg-rose-600 text-white dark:text-slate-900 hover:text-white dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                title="Stop generation"
                aria-label="Stop generation"
              >
                <Square size={14} className="fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!questionInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                title="Send question"
                aria-label="Send question"
              >
                <Send size={15} />
                <span>Ask</span>
              </button>
            )}
          </form>

          {isAsking && (
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                Teacher is preparing a chalkboard explanation...
              </span>
            </div>
          )}

          {/* Q&A List for this step */}
          <div className="space-y-3 pt-1">
            {currentStepQAs.map((qa) => (
              <div
                key={qa.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2.5"
              >
                <div className="flex items-start gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  <span className="text-blue-600">Q:</span>
                  <span>{qa.question}</span>
                </div>

                <div className="pl-3 border-l-2 border-blue-500 space-y-2">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {qa.spokenAnswer}
                  </p>

                  {qa.chalkboardNotes && qa.chalkboardNotes.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 font-mono text-xs space-y-1">
                      <div className="font-bold text-[10px] text-yellow-300 uppercase">
                        [ Chalkboard Note ]
                      </div>
                      {qa.chalkboardNotes.map((note, nIdx) => (
                        <div key={nIdx}>• {note}</div>
                      ))}
                    </div>
                  )}

                  {qa.clarifyingFormula && (
                    <div className="p-2 rounded bg-black/40 text-cyan-200 font-mono text-xs">
                      {qa.clarifyingFormula}
                    </div>
                  )}

                  {onSpeakAnswer && (
                    <button
                      onClick={() => onSpeakAnswer(qa.spokenAnswer)}
                      className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 size={13} />
                      <span>Hear Teacher Explain This</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Step Quiz */}
      {activeTab === 'quiz' && currentStep.quiz && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              Quick Concept Check
            </span>
            {quizSubmitted && (
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setQuizSubmitted(false);
                }}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Retry Quiz</span>
              </button>
            )}
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
            {currentStep.quiz.question}
          </h4>

          {/* Options */}
          <div className="space-y-2">
            {currentStep.quiz.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrect = optIdx === currentStep.quiz?.correctIndex;

              let btnStyle =
                'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200';

              if (quizSubmitted) {
                if (isCorrect) {
                  btnStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 font-medium';
                } else {
                  btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                }
              } else if (isSelected) {
                btnStyle = 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 font-bold';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleQuizSubmit(optIdx)}
                  disabled={quizSubmitted}
                  className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between gap-3 transition-all cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {quizSubmitted && isCorrect && (
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  )}
                  {quizSubmitted && isSelected && !isCorrect && (
                    <XCircle size={18} className="text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Correction after answer */}
          {quizSubmitted && (
            <div
              className={`p-3.5 sm:p-4 rounded-xl border space-y-2 animate-fadeIn ${
                selectedOption === currentStep.quiz.correctIndex
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                {selectedOption === currentStep.quiz.correctIndex ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Correct! +20 Learning XP</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="text-rose-600" />
                    <span>Teacher Correction & Feedback:</span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm leading-relaxed">
                {currentStep.quiz.explanation}
              </p>

              {/* Action to proceed after subtopic assessment */}
              <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-end">
                {isLastStep ? (
                  <button
                    type="button"
                    onClick={onOpenFinalAssessment}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-xs"
                  >
                    <span>Final Topic Assessment</span>
                    <Sparkles size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onNextStep}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-xs"
                  >
                    <span>Continue to Next Subtopic</span>
                    <CheckCircle2 size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
