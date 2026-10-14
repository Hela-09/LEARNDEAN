import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  GraduationCap,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Globe,
  Award,
  Layers,
  Search,
  Filter,
  Flame,
  ArrowRight,
  Bookmark,
  Calendar,
  AlertTriangle,
  Play,
  RotateCcw,
  FileText,
} from 'lucide-react';
import {
  GLOBAL_CLASSROOM_PROFILES,
  CountryCurriculumProfile,
  ClassGrade,
  SyllabusSubject,
  SyllabusTopic,
} from '../../data/officialClassroomCurriculum';
import {
  ClassroomMasterState,
  StudentCurriculumProfile,
  updateStudentProfile,
  toggleRevisionFlag,
} from '../../services/classroomProgressService';
import { chalkAudio } from '../../utils/chalkAudio';

interface CurriculumSyllabusSelectorProps {
  progressState: ClassroomMasterState;
  onSelectTopic: (topic: SyllabusTopic, subject: SyllabusSubject, grade: ClassGrade) => void;
  onOpenAssignment: (topic: SyllabusTopic, subject: SyllabusSubject) => void;
  onRefreshProgress: () => void;
}

export default function CurriculumSyllabusSelector({
  progressState,
  onSelectTopic,
  onOpenAssignment,
  onRefreshProgress,
}: CurriculumSyllabusSelectorProps) {
  // All hooks must be unconditional at top level
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    progressState.profile.countryCode || 'NG'
  );
  const [selectedGradeId, setSelectedGradeId] = useState<string>(
    progressState.profile.classGradeId || 'sss'
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    progressState.profile.subjectId || 'math'
  );
  const [selectedTermNumber, setSelectedTermNumber] = useState<1 | 2 | 3>(
    progressState.profile.selectedTerm || 1
  );
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [progressMode, setProgressMode] = useState<'sequential' | 'flexible'>(
    progressState.profile.progressMode || 'sequential'
  );

  // Active Country Profile
  const currentCountry = useMemo<CountryCurriculumProfile>(() => {
    return (
      GLOBAL_CLASSROOM_PROFILES.find((c) => c.countryCode === selectedCountryCode) ||
      GLOBAL_CLASSROOM_PROFILES[0]
    );
  }, [selectedCountryCode]);

  // Active Class Grade
  const currentGrade = useMemo<ClassGrade>(() => {
    return (
      currentCountry.grades.find((g) => g.id === selectedGradeId) ||
      currentCountry.grades[0]
    );
  }, [currentCountry, selectedGradeId]);

  // Active Subject
  const currentSubject = useMemo<SyllabusSubject>(() => {
    return (
      currentGrade.subjects.find((s) => s.id === selectedSubjectId) ||
      currentGrade.subjects[0]
    );
  }, [currentGrade, selectedSubjectId]);

  // Active Term
  const currentTerm = useMemo(() => {
    return (
      currentSubject.terms.find((t) => t.termNumber === selectedTermNumber) ||
      currentSubject.terms[0]
    );
  }, [currentSubject, selectedTermNumber]);

  // Filtered Topics
  const filteredTopics = useMemo(() => {
    if (!currentTerm || !currentTerm.topics) return [];
    if (!searchFilter.trim()) return currentTerm.topics;
    const q = searchFilter.toLowerCase();
    return currentTerm.topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtopics.some((st) => st.toLowerCase().includes(q)) ||
        t.objectives.some((ob) => ob.toLowerCase().includes(q))
    );
  }, [currentTerm, searchFilter]);

  // Calculate Term Completion Stats
  const termStats = useMemo(() => {
    const total = currentTerm?.topics?.length || 0;
    if (total === 0) return { total: 0, completed: 0, percentage: 0 };

    let completed = 0;
    currentTerm.topics.forEach((t) => {
      const rec = progressState.topicsProgress[t.id];
      if (rec && rec.isFullyCompleted) {
        completed++;
      }
    });

    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }, [currentTerm, progressState.topicsProgress]);

  const handleCountryChange = (cCode: string) => {
    chalkAudio.playChalkTap();
    setSelectedCountryCode(cCode);
    const country = GLOBAL_CLASSROOM_PROFILES.find((c) => c.countryCode === cCode);
    if (country && country.grades.length > 0) {
      setSelectedGradeId(country.grades[0].id);
      if (country.grades[0].subjects.length > 0) {
        setSelectedSubjectId(country.grades[0].subjects[0].id);
      }
    }
    updateStudentProfile({ countryCode: cCode });
  };

  const handleGradeChange = (gId: string) => {
    chalkAudio.playChalkTap();
    setSelectedGradeId(gId);
    updateStudentProfile({ classGradeId: gId });
  };

  const handleSubjectChange = (sId: string) => {
    chalkAudio.playChalkTap();
    setSelectedSubjectId(sId);
    updateStudentProfile({ subjectId: sId });
  };

  const handleTermChange = (tNum: 1 | 2 | 3) => {
    chalkAudio.playChalkTap();
    setSelectedTermNumber(tNum);
    updateStudentProfile({ selectedTerm: tNum });
  };

  const handleToggleMode = (mode: 'sequential' | 'flexible') => {
    chalkAudio.playChalkTap();
    setProgressMode(mode);
    updateStudentProfile({ progressMode: mode });
  };

  const handleToggleRevision = (e: React.MouseEvent, topicId: string) => {
    e.stopPropagation();
    chalkAudio.playChalkTap();
    toggleRevisionFlag(topicId);
    onRefreshProgress();
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-6">
      {/* Curriculum Selection Bar: Country, Grade, Subject, Term */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentCountry.flag}</span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Official School Curriculum & Syllabus Outline
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified national curricula: {currentGrade.examBoard} ({currentGrade.officialYear})
            </p>
          </div>

          {/* Mode Switcher: Sequential Pathway vs Flexible Explorer */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs">
            <button
              onClick={() => handleToggleMode('sequential')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                progressMode === 'sequential'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Sequential Pathway
            </button>
            <button
              onClick={() => handleToggleMode('flexible')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                progressMode === 'flexible'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Explore Any Topic
            </button>
          </div>
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Country Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Country
            </label>
            <select
              value={selectedCountryCode}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {GLOBAL_CLASSROOM_PROFILES.map((c) => (
                <option key={c.countryCode} value={c.countryCode}>
                  {c.flag} {c.countryName}
                </option>
              ))}
            </select>
          </div>

          {/* Class / Grade Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Level / Class
            </label>
            <select
              value={selectedGradeId}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {currentCountry.grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {currentGrade.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Term Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Academic Term
            </label>
            <select
              value={selectedTermNumber}
              onChange={(e) => handleTermChange(Number(e.target.value) as 1 | 2 | 3)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value={1}>First Term (Weeks 1 - 12)</option>
              <option value={2}>Second Term (Weeks 1 - 12)</option>
              <option value={3}>Third Term (Weeks 1 - 12)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Term Progress & Subject Roadmap Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-blue-600/10 border border-emerald-500/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {currentSubject.name} — {currentTerm.termName}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white">
                {termStats.percentage}% Complete
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Theme: {currentTerm.theme} ({termStats.completed} of {termStats.total} official topics mastered)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Avg Score: <strong className="text-emerald-600 dark:text-emerald-400">{progressState.overallAverageScore}%</strong>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(5, termStats.percentage)}%` }}
          />
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder={`Search ${currentSubject.name} topics, formulas, or objectives...`}
          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-400"
        />
      </div>

      {/* Week-by-Week Syllabus Topics Outline */}
      <div className="space-y-4">
        {filteredTopics.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
            <BookOpen size={32} className="mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold">
              Official syllabus details for this term are compiling in accordance with national education standards.
            </p>
            <p className="text-xs">
              Switch to First Term or select General Mathematics / Physics / Chemistry / Biology / English to view verified curriculum topics.
            </p>
          </div>
        ) : (
          filteredTopics.map((topic, index) => {
            const topicRecord = progressState.topicsProgress[topic.id];
            const isCompleted = topicRecord?.isFullyCompleted;
            const isStepCompleted = topicRecord?.isStepsCompleted;
            const hasAssignment = !!topicRecord?.assignmentResult;
            const isRevision = topicRecord?.revisionFlagged;

            // Sequential lock rule: If in sequential mode, unlock if first topic or previous is completed
            const prevTopic = filteredTopics[index - 1];
            const prevRecord = prevTopic ? progressState.topicsProgress[prevTopic.id] : null;
            const isLocked = progressMode === 'sequential' && index > 0 && !prevRecord?.isStepsCompleted;

            return (
              <div
                key={topic.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : isLocked
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-80'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-300 dark:hover:border-emerald-600'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Topic Metadata & Details */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-xs">
                        Week {topic.week}
                      </span>

                      {topic.statusBadge === 'VERIFIED_OFFICIAL' && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle size={11} />
                          <span>Official Syllabus</span>
                        </span>
                      )}

                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          topic.examWeight === 'High'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                        }`}
                      >
                        {topic.examWeight} Exam Weight
                      </span>

                      {isRevision && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center gap-1">
                          <AlertTriangle size={11} />
                          <span>Flagged for Revision</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {topic.title}
                    </h3>

                    {/* Subtopics */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {topic.subtopics.map((st, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]"
                        >
                          • {st}
                        </span>
                      ))}
                    </div>

                    {/* Learning Objectives summary */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      <strong className="not-italic text-slate-700 dark:text-slate-300">Syllabus Goal: </strong>
                      {topic.objectives[0]}
                    </p>
                  </div>

                  {/* Actions & Launch Buttons */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                    {/* Bookmark / Flag for revision */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleRevision(e, topic.id)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        isRevision
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-950 text-amber-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Flag for revision"
                    >
                      <Bookmark size={16} />
                    </button>

                    {/* End-of-Topic Graded Assignment Button */}
                    <button
                      type="button"
                      onClick={() => onOpenAssignment(topic, currentSubject)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        hasAssignment
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                          : 'border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200'
                      }`}
                      title="Take End-of-Topic Graded Assignment"
                    >
                      <FileText size={14} className="text-amber-500" />
                      <span>{hasAssignment ? `Assignment (${topicRecord.assignmentResult?.percentage}%)` : 'Topic Assignment'}</span>
                    </button>

                    {/* Start Classroom Lesson Button */}
                    <button
                      type="button"
                      onClick={() => onSelectTopic(topic, currentSubject, currentGrade)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Play size={14} />
                      <span>{isCompleted ? 'Review Class' : 'Enter Classroom'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
