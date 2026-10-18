import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Send,
  BookOpen,
  Mic,
  MicOff,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  Check,
  Save,
  Clock,
} from 'lucide-react';
import {
  TheoryAssignment,
  StudentAnswerItem,
  TheoryAssignmentSubmissionResult,
} from '../../types/classroom';
import { submitTheoryAssignmentForMarking } from '../../services/classroomService';
import { chalkAudio } from '../../utils/chalkAudio';

interface TopicAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: TheoryAssignment;
  topicTitle: string;
  subject: string;
  educationLevel?: string;
  grade?: string;
  onAssignmentCompleted?: (result: TheoryAssignmentSubmissionResult) => void;
}

export default function TopicAssignmentModal({
  isOpen,
  onClose,
  assignment,
  topicTitle,
  subject,
  educationLevel = 'Secondary Education',
  grade = 'Senior Secondary',
  onAssignmentCompleted,
}: TopicAssignmentModalProps) {
  // Answer state per question: textContent, type, images
  const [answers, setAnswers] = useState<Record<string, StudentAnswerItem>>(() => {
    const initial: Record<string, StudentAnswerItem> = {};
    if (assignment && assignment.questions) {
      assignment.questions.forEach((q) => {
        initial[q.id] = { type: 'text', textContent: '', images: [] };
      });
    }
    return initial;
  });

  const [activeTabPerQuestion, setActiveTabPerQuestion] = useState<Record<string, 'text' | 'voice' | 'image'>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<TheoryAssignmentSubmissionResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false);

  // Speech Recognition state for voice answers
  const [isRecordingQId, setIsRecordingQId] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Load existing draft from local storage
  useEffect(() => {
    if (typeof window !== 'undefined' && assignment?.id) {
      try {
        const draftKey = `learndean_draft_${assignment.id}`;
        const raw = localStorage.getItem(draftKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            setAnswers((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch {}
    }
  }, [assignment?.id]);

  // Check Web Speech Recognition support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Cleanup active voice recording on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  if (!isOpen || !assignment) return null;

  const handleTextChange = (qId: string, text: string) => {
    if (submissionResult) return;
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || { type: 'text', images: [] }),
        textContent: text,
      },
    }));
    setIsDraftSaved(false);
  };

  const handleSaveDraft = () => {
    if (typeof window !== 'undefined' && assignment?.id) {
      try {
        localStorage.setItem(`learndean_draft_${assignment.id}`, JSON.stringify(answers));
        setIsDraftSaved(true);
        chalkAudio.playChalkTap();
        setTimeout(() => setIsDraftSaved(false), 3000);
      } catch {}
    }
  };

  // Voice recording toggle
  const handleToggleVoiceRecord = (qId: string) => {
    if (submissionResult) return;

    if (!speechSupported) {
      setSpeechNotice(
        'Speech recognition is not supported in your current browser. You can type your answer or upload a photo of your handwritten paper.'
      );
      setTimeout(() => setSpeechNotice(null), 5000);
      return;
    }

    if (isRecordingQId === qId) {
      // Stop recording
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsRecordingQId(null);
      chalkAudio.playChalkTap();
    } else {
      // Start recording
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = 'en-US';

        recognizer.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setAnswers((prev) => {
              const prevText = prev[qId]?.textContent || '';
              const newText = prevText
                ? `${prevText.trim()} ${currentTranscript.trim()}`
                : currentTranscript.trim();
              return {
                ...prev,
                [qId]: {
                  ...(prev[qId] || { images: [] }),
                  type: 'voice',
                  textContent: newText,
                },
              };
            });
          }
        };

        recognizer.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecordingQId(null);
          setSpeechNotice(`Microphone notice: ${event.error}. You can also type your answer directly.`);
          setTimeout(() => setSpeechNotice(null), 4000);
        };

        recognizer.onend = () => {
          setIsRecordingQId(null);
        };

        recognizer.start();
        recognitionRef.current = recognizer;
        setIsRecordingQId(qId);
        chalkAudio.playChalkTap();
      } catch (e: any) {
        console.warn('Failed to start speech recognition:', e);
        setIsRecordingQId(null);
      }
    }
  };

  // Image upload handling for handwritten answers
  const handleImageUpload = (qId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (submissionResult || !e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setAnswers((prev) => {
          const currentImages = prev[qId]?.images || [];
          return {
            ...prev,
            [qId]: {
              ...(prev[qId] || { textContent: '' }),
              type: 'image',
              images: [...currentImages, { url: dataUrl, name: file.name }],
            },
          };
        });
        chalkAudio.playChalkTap();
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveImage = (qId: string, imageIndex: number) => {
    if (submissionResult) return;
    setAnswers((prev) => {
      const currentImages = prev[qId]?.images || [];
      const updated = currentImages.filter((_, idx) => idx !== imageIndex);
      return {
        ...prev,
        [qId]: {
          ...(prev[qId] || { textContent: '' }),
          type: updated.length > 0 ? 'image' : 'text',
          images: updated,
        },
      };
    });
    chalkAudio.playChalkTap();
  };

  // Submit complete assignment for AI marking
  const handleSubmitAssignment = async () => {
    chalkAudio.playChalkTap();
    setIsSubmitting(true);
    setSubmitError(null);

    // Stop any voice recorder
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsRecordingQId(null);
    }

    try {
      const result = await submitTheoryAssignmentForMarking(
        subject,
        topicTitle,
        educationLevel,
        grade,
        assignment,
        answers
      );

      setSubmissionResult(result);
      if (onAssignmentCompleted) {
        onAssignmentCompleted(result);
      }
    } catch (err: any) {
      console.error('Error submitting theory assignment:', err);
      setSubmitError(err.message || 'Failed to submit assignment for AI marking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForRetake = () => {
    chalkAudio.playChalkTap();
    setSubmissionResult(null);
    setSubmitError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-5 animate-scaleUp max-h-[92dvh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close assignment modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <FileText size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-bold text-[10px] uppercase">
                  THEORY ASSIGNMENT
                </span>
                <span className="text-xs text-slate-400 font-semibold">{subject}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {assignment.title}
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {!submissionResult && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100 transition cursor-pointer"
              >
                <Save size={14} className={isDraftSaved ? 'text-emerald-500' : ''} />
                <span>{isDraftSaved ? 'Draft Saved' : 'Save Draft'}</span>
              </button>
            )}
            <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
              Total: {assignment.totalMarks} Marks
            </span>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              Submission Guidelines (3 Ways to Answer):
            </span>
            <p className="leading-relaxed">
              {assignment.instructions} You can <strong>type your answer</strong>, <strong>speak into the microphone</strong> to transcribe your explanation, or <strong>photograph handwritten answers on paper</strong> using your camera or file upload. Multimodal AI marks your working against official grading rubrics.
            </p>
          </div>
        </div>

        {/* Speech Notice Alert if any */}
        {speechNotice && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{speechNotice}</span>
          </div>
        )}

        {/* Submit Error Alert if any */}
        {submitError && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-center gap-2">
            <XCircle size={15} className="shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Results Banner (Shown once AI marks the submission) */}
        {submissionResult && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-blue-950 text-white shadow-xl space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {submissionResult.isProvisional ? 'Provisional AI Mark' : 'Official AI Verified Assessment'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  Overall Score: {submissionResult.totalScore} / {submissionResult.totalMarks} ({submissionResult.percentage}%)
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {submissionResult.overallFeedback}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-300">Grade</span>
                  <span className="text-2xl font-black text-amber-300">{submissionResult.grade}</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetForRetake}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Retake</span>
                </button>
              </div>
            </div>

            {submissionResult.areasForRevision && submissionResult.areasForRevision.length > 0 && (
              <div className="text-xs space-y-1">
                <span className="font-bold text-amber-300">Recommended Revision Focus:</span>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                  {submissionResult.areasForRevision.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {(assignment.questions || []).map((q) => {
            const studentAns = answers[q.id] || { type: 'text', textContent: '', images: [] };
            const qResult = submissionResult?.questionResults?.[q.id];
            const isRecordingThis = isRecordingQId === q.id;
            const currentTab = activeTabPerQuestion[q.id] || studentAns.type || 'text';

            return (
              <div
                key={q.id}
                className="p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                      Question {q.questionNumber}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs shrink-0">
                    {q.marks} Marks
                  </span>
                </div>

                {/* Marking Rubric disclosure */}
                {q.markingCriteria && q.markingCriteria.length > 0 && (
                  <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-[11px] text-blue-950 dark:text-blue-200 space-y-1">
                    <span className="font-bold block uppercase tracking-wider text-[10px] text-blue-700 dark:text-blue-300">
                      Marking Criteria:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {q.markingCriteria.map((crit, cIdx) => (
                        <li key={cIdx}>{crit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* If result already received, show feedback alongside */}
                {qResult && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle size={15} className="text-emerald-500" />
                        AI Marking Feedback
                      </span>
                      <span className="font-black text-sm text-blue-600 dark:text-blue-400">
                        {qResult.marksAwarded} / {qResult.marksAvailable} Marks
                      </span>
                    </div>

                    {qResult.transcribedAnswer && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 italic font-mono text-[11px]">
                        <strong>Your Transcribed Answer:</strong> "{qResult.transcribedAnswer}"
                      </div>
                    )}

                    {qResult.isUnclear && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-900 dark:text-amber-200 font-semibold text-xs">
                        ⚠️ Handwriting was partially unclear or blurry in the photo. Please take a clearer photo or type the unclear section to receive full marks.
                      </div>
                    )}

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {qResult.feedback}
                    </p>

                    {qResult.suggestedCorrections && (
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-xs">
                        <strong>Correction:</strong> {qResult.suggestedCorrections}
                      </div>
                    )}
                  </div>
                )}

                {/* 3 Input Tabs: Type Text | Speak Voice | Upload Paper Photo */}
                {!submissionResult && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl text-xs font-bold w-fit">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTabPerQuestion((prev) => ({ ...prev, [q.id]: 'text' }));
                          chalkAudio.playChalkTap();
                        }}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                          currentTab === 'text'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <FileText size={13} />
                        <span>Type Text</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTabPerQuestion((prev) => ({ ...prev, [q.id]: 'voice' }));
                          chalkAudio.playChalkTap();
                        }}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                          currentTab === 'voice'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Mic size={13} />
                        <span>Voice Answer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTabPerQuestion((prev) => ({ ...prev, [q.id]: 'image' }));
                          chalkAudio.playChalkTap();
                        }}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                          currentTab === 'image'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Camera size={13} />
                        <span>Photo of Paper ({studentAns.images.length})</span>
                      </button>
                    </div>

                    {/* Tab A: Typed Text Input */}
                    {currentTab === 'text' && (
                      <div className="space-y-1">
                        <textarea
                          rows={4}
                          value={studentAns.textContent}
                          onChange={(e) => handleTextChange(q.id, e.target.value)}
                          placeholder="Type your essay/theory answer here in full sentences. Include definitions, explanations, formulas, or examples..."
                          className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                        />
                        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                          <span>{studentAns.textContent.length} characters</span>
                          {q.hint && <span>Hint: {q.hint}</span>}
                        </div>
                      </div>
                    )}

                    {/* Tab B: Voice Answer Input */}
                    {currentTab === 'voice' && (
                      <div className="space-y-2 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Speak your answer:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleVoiceRecord(q.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                              isRecordingThis
                                ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                            }`}
                          >
                            {isRecordingThis ? <MicOff size={14} /> : <Mic size={14} />}
                            <span>{isRecordingThis ? 'Stop Recording' : 'Record Voice Answer'}</span>
                          </button>
                        </div>

                        <textarea
                          rows={3}
                          value={studentAns.textContent}
                          onChange={(e) => handleTextChange(q.id, e.target.value)}
                          placeholder={
                            isRecordingThis
                              ? 'Listening to your speech... Speak clearly into the microphone...'
                              : 'Your spoken answer will appear here transcribed. You can also edit and refine it manually.'
                          }
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                        />
                      </div>
                    )}

                    {/* Tab C: Handwritten Photo / Image Upload */}
                    {currentTab === 'image' && (
                      <div className="space-y-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                              Photograph of Handwritten Paper
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Write on real paper, snap photos with your phone camera or upload images. Multimodal AI reads your handwriting.
                            </span>
                          </div>

                          <label className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition">
                            <Camera size={14} />
                            <span>Add Photo / Page</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/jpg"
                              multiple
                              capture="environment"
                              onChange={(e) => handleImageUpload(q.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Image Previews */}
                        {studentAns.images.length === 0 ? (
                          <div className="py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center text-xs text-slate-400 space-y-1">
                            <ImageIcon size={24} className="mx-auto text-slate-300" />
                            <p>No handwritten photos attached yet.</p>
                            <p className="text-[10px]">Tap "Add Photo / Page" above to photograph your working.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                            {studentAns.images.map((img, imgIdx) => (
                              <div
                                key={imgIdx}
                                className="relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group bg-black/5"
                              >
                                <img
                                  src={img.url}
                                  alt={`Handwritten answer page ${imgIdx + 1}`}
                                  className="w-full h-28 object-cover"
                                />
                                <div className="absolute top-1 right-1 flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(q.id, imgIdx)}
                                    className="p-1 rounded-lg bg-rose-600 text-white shadow-xs hover:bg-rose-700 cursor-pointer"
                                    title="Remove this page photo"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white">
                                  Page {imgIdx + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {submissionResult ? 'Close' : 'Cancel'}
          </button>

          {!submissionResult && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitAssignment}
              className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Marking Theory & Handwritten Work...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Assignment for AI Marking</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
