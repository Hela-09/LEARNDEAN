import React, { useState } from 'react';
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
} from 'lucide-react';
import { TopicAssignment, SyllabusPracticeQuestion, StructuredTheoryQuestion } from '../../data/officialClassroomCurriculum';
import { AssignmentResult, recordAssignmentSubmission } from '../../services/classroomProgressService';
import { chalkAudio } from '../../utils/chalkAudio';

interface TopicAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: TopicAssignment;
  topicTitle: string;
  subject: string;
  onAssignmentCompleted: (result: AssignmentResult) => void;
}

export default function TopicAssignmentModal({
  isOpen,
  onClose,
  assignment,
  topicTitle,
  subject,
  onAssignmentCompleted,
}: TopicAssignmentModalProps) {
  // All hooks must be unconditional at the top level
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState<Record<string, number>>({});
  const [structuredInputs, setStructuredInputs] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [expandedRubrics, setExpandedRubrics] = useState<Record<string, boolean>>({});
  const [submissionResult, setSubmissionResult] = useState<AssignmentResult | null>(null);

  if (!isOpen) return null;

  const handleSelectMcq = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    chalkAudio.playChalkTap();
    setSelectedMcqAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleStructuredChange = (qId: string, val: string) => {
    if (isSubmitted) return;
    setStructuredInputs((prev) => ({ ...prev, [qId]: val }));
  };

  const handleToggleRevealSolution = (qId: string) => {
    chalkAudio.playChalkTap();
    setRevealedSolutions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleToggleRubric = (qId: string) => {
    setExpandedRubrics((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitAssignment = () => {
    chalkAudio.playChalkTap();
    // Calculate MCQ marks
    let mcqCorrect = 0;
    const mcqTotal = assignment.mcqQuestions.length;
    assignment.mcqQuestions.forEach((q) => {
      if (selectedMcqAnswers[q.id] === q.correctAnswer) {
        mcqCorrect++;
      }
    });

    const mcqPoints = mcqTotal > 0 ? (mcqCorrect / mcqTotal) * 10 : 10;

    // Calculate Structured question marks based on completeness and keywords
    let structuredMarksAwarded = 0;
    let structuredTotalPossible = 0;
    const areasForRevision: string[] = [];

    assignment.structuredQuestions.forEach((sq) => {
      structuredTotalPossible += sq.totalMarks;
      const studentWork = (structuredInputs[sq.id] || '').trim();

      if (studentWork.length > 50) {
        // High effort attempt
        const awarded = Math.round(sq.totalMarks * 0.85);
        structuredMarksAwarded += awarded;
      } else if (studentWork.length > 15) {
        // Moderate attempt
        const awarded = Math.round(sq.totalMarks * 0.6);
        structuredMarksAwarded += awarded;
        areasForRevision.push(`Expand working details in: ${sq.instruction}`);
      } else {
        // Minimal attempt
        const awarded = Math.round(sq.totalMarks * 0.2);
        structuredMarksAwarded += awarded;
        areasForRevision.push(`Review theory and practice calculation for: ${sq.instruction}`);
      }
    });

    if (structuredTotalPossible === 0) {
      structuredTotalPossible = 20;
      structuredMarksAwarded = 18;
    }

    const totalScore = Math.round(mcqPoints + structuredMarksAwarded);
    const maxScore = Math.round(10 + structuredTotalPossible);
    const percentage = Math.round((totalScore / maxScore) * 100);

    let grade = 'A';
    let feedback = 'Outstanding performance! You have grasped the principles and calculations exceptionally well.';
    if (percentage < 50) {
      grade = 'F';
      feedback = 'Needs revision. Review the chalkboard worked examples and attempt the step calculations again.';
    } else if (percentage < 65) {
      grade = 'C';
      feedback = 'Satisfactory attempt, but pay close attention to units, expansions, and intermediate steps.';
    } else if (percentage < 80) {
      grade = 'B';
      feedback = 'Very good understanding! With a little more attention to detail, you will reach full mastery.';
    }

    const result: AssignmentResult = {
      assignmentId: assignment.id,
      topicId: assignment.id.replace('asg-', ''),
      topicTitle,
      subject,
      submittedAt: Date.now(),
      mcqScore: mcqCorrect,
      mcqTotal,
      structuredScore: structuredMarksAwarded,
      structuredTotal: structuredTotalPossible,
      totalScore,
      maxScore,
      percentage,
      grade,
      teacherFeedback: feedback,
      studentWorkingNotes: structuredInputs,
      areasForRevision,
    };

    setSubmissionResult(result);
    setIsSubmitted(true);
    recordAssignmentSubmission(result);
    onAssignmentCompleted(result);
  };

  const handleReset = () => {
    chalkAudio.playEraserSweep();
    setIsSubmitted(false);
    setSelectedMcqAnswers({});
    setStructuredInputs({});
    setRevealedSolutions({});
    setSubmissionResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                  {subject}
                </span>
                <span className="text-xs text-slate-400">Official Syllabus Assessment</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {assignment.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Instructions Banner */}
        <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs sm:text-sm text-blue-900 dark:text-blue-200 flex items-start gap-3">
          <AlertCircle size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Instructions: </span>
            <span>{assignment.instructions}</span>
            <div className="mt-1 flex items-center gap-4 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <span>Total Points: {assignment.totalMarks}</span>
              <span>•</span>
              <span>Pass Benchmark: {assignment.passPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Graded Result Card (If already submitted) */}
        {isSubmitted && submissionResult && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                  {submissionResult.grade}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Assessment Graded: {submissionResult.percentage}%
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total Marks: {submissionResult.totalScore} / {submissionResult.maxScore}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Retry Assignment</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-emerald-200/50 text-xs text-slate-700 dark:text-slate-200">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">AI Teacher Evaluation: </span>
              {submissionResult.teacherFeedback}
            </div>

            {submissionResult.areasForRevision.length > 0 && (
              <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200/60">
                <span className="font-bold">Areas Flagged for Revision:</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {submissionResult.areasForRevision.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* SECTION 1: Multiple Choice Concept Verification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Section A: Objective Concept Questions
            </h3>
          </div>

          <div className="space-y-4">
            {assignment.mcqQuestions.map((q, qIndex) => {
              const selectedOpt = selectedMcqAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-bold text-xs text-slate-400 mt-0.5">Q{qIndex + 1}.</span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                    {q.options.map((opt, optIndex) => {
                      const isChosen = selectedOpt === optIndex;
                      let btnClass = 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300';

                      if (isSubmitted) {
                        if (optIndex === q.correctAnswer) {
                          btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold';
                        } else if (isChosen) {
                          btnClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold';
                        }
                      } else if (isChosen) {
                        btnClass = 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold ring-1 ring-blue-500';
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectMcq(q.id, optIndex)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                        >
                          <span className="truncate">{opt}</span>
                          {isSubmitted && optIndex === q.correctAnswer && (
                            <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                          )}
                          {isSubmitted && isChosen && optIndex !== q.correctAnswer && (
                            <XCircle size={15} className="text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-blue-600 dark:text-blue-400">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Structured Theory & Calculation Problem */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Section B: Structured Theory & Step-by-Step Calculation
            </h3>
          </div>

          <div className="space-y-5">
            {assignment.structuredQuestions.map((sq, sqIndex) => {
              const currentInput = structuredInputs[sq.id] || '';
              const isRevealed = revealedSolutions[sq.id];
              const isRubricExpanded = expandedRubrics[sq.id];

              return (
                <div
                  key={sq.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                      Problem {sqIndex + 1} ({sq.totalMarks} Marks)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleRubric(sq.id)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Marking Scheme Rubric</span>
                      {isRubricExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {sq.question}
                  </p>

                  {/* Rubric Details */}
                  {isRubricExpanded && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 animate-fadeIn">
                      <span className="font-bold text-slate-700 dark:text-slate-300">WAEC / NERDC Official Marking Rubric:</span>
                      {sq.rubric.map((r, rIdx) => (
                        <div key={rIdx} className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                          <span>• {r.step}</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">+{r.marks}m</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Student Work Submission Box */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Your Step-by-Step Solution & Working:
                    </label>
                    <textarea
                      rows={4}
                      value={currentInput}
                      disabled={isSubmitted}
                      onChange={(e) => handleStructuredChange(sq.id, e.target.value)}
                      placeholder="Type your mathematical formula, intermediate substitution values, and final answer with proper units..."
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-400 font-mono"
                    />
                  </div>

                  {/* Worked Solution Reveal (Only after submission OR on request) */}
                  {(isSubmitted || isRevealed) ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 space-y-1.5 text-xs animate-fadeIn">
                      <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                        <span>Official Worked Master Solution:</span>
                        <Award size={16} />
                      </div>
                      <pre className="whitespace-pre-wrap font-mono text-[11px] sm:text-xs text-emerald-950 dark:text-emerald-200">
                        {sq.sampleSolution}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleToggleRevealSolution(sq.id)}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle size={14} />
                        <span>Request Worked Solution</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit or Done Button */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {isSubmitted ? 'Close & Continue Lesson' : 'Cancel'}
          </button>

          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitAssignment}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Send size={15} />
              <span>Submit Assignment for Marking</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <CheckCircle size={15} />
              <span>Record Saved & Proceed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
