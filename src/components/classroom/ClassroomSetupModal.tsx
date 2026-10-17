import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Search,
  GraduationCap,
  X,
  Compass,
  CheckCircle,
  Globe,
  Layers,
  ChevronDown,
  Award,
  Check,
} from 'lucide-react';
import { chalkAudio } from '../../utils/chalkAudio';
import {
  GLOBAL_CLASSROOM_PROFILES,
  EDUCATION_LEVEL_DEFINITIONS,
  EducationLevelTier,
  CountryCurriculumProfile,
  ClassGrade,
  SyllabusSubject,
  SyllabusTopic,
  searchClassroomCurriculumTopics,
} from '../../data/officialClassroomCurriculum';

interface ClassroomSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLesson: (subject: string, topic: string, level: string) => Promise<void>;
  isLoading: boolean;
}

export default function ClassroomSetupModal({
  isOpen,
  onClose,
  onStartLesson,
  isLoading,
}: ClassroomSetupModalProps) {
  // 1. Country / National System
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('NG');

  // 2. Education Level Tier (basic to advanced: early_childhood -> postgraduate)
  const [selectedTier, setSelectedTier] = useState<EducationLevelTier>('senior_secondary');

  // 3. Class Grade
  const [selectedGradeId, setSelectedGradeId] = useState<string>('');

  // 4. Subject
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('');

  // 5. Topic search & autocomplete
  const [topicInput, setTopicInput] = useState<string>('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState<boolean>(false);

  // Active country
  const currentCountry = useMemo<CountryCurriculumProfile>(() => {
    return (
      GLOBAL_CLASSROOM_PROFILES.find((c) => c.countryCode === selectedCountryCode) ||
      GLOBAL_CLASSROOM_PROFILES[0]
    );
  }, [selectedCountryCode]);

  // Classes available at the selected education level
  const availableClasses = useMemo<ClassGrade[]>(() => {
    return currentCountry.grades.filter((g) => g.tier === selectedTier);
  }, [currentCountry, selectedTier]);

  // Auto-select first class when tier or country changes
  useEffect(() => {
    if (availableClasses.length > 0) {
      const match = availableClasses.find((c) => c.id === selectedGradeId) || availableClasses[0];
      setSelectedGradeId(match.id);
    } else if (currentCountry.grades.length > 0) {
      setSelectedGradeId(currentCountry.grades[0].id);
    }
  }, [availableClasses, currentCountry]);

  // Current selected class object
  const currentClass = useMemo<ClassGrade | undefined>(() => {
    return currentCountry.grades.find((g) => g.id === selectedGradeId) || availableClasses[0];
  }, [currentCountry, selectedGradeId, availableClasses]);

  // Relevant subjects for the chosen class
  const availableSubjects = useMemo<SyllabusSubject[]>(() => {
    return currentClass ? currentClass.subjects : [];
  }, [currentClass]);

  // Auto-select first subject when class changes
  useEffect(() => {
    if (availableSubjects.length > 0) {
      const existing = availableSubjects.find((s) => s.id === selectedSubjectId);
      if (existing) {
        setSelectedSubjectName(existing.name);
      } else {
        setSelectedSubjectId(availableSubjects[0].id);
        setSelectedSubjectName(availableSubjects[0].name);
      }
    } else {
      setSelectedSubjectId('');
      setSelectedSubjectName('');
    }
    // Reset topic input when subject or class changes so student starts fresh
    setTopicInput('');
    setIsAutocompleteOpen(false);
  }, [availableSubjects, selectedGradeId]);

  // Selected class and subject flag
  const selectedClassAndSubjectChosen = Boolean(selectedGradeId && selectedSubjectId);

  // Autocomplete suggestions based on letters entered, selected class, subject, and syllabus
  const autocompleteSuggestions = useMemo<SyllabusTopic[]>(() => {
    if (!selectedClassAndSubjectChosen) return [];
    return searchClassroomCurriculumTopics(
      topicInput,
      selectedGradeId,
      selectedSubjectId,
      selectedCountryCode
    );
  }, [topicInput, selectedGradeId, selectedSubjectId, selectedCountryCode, selectedClassAndSubjectChosen]);

  // Early return placed AFTER all hooks
  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedClassAndSubjectChosen) return;

    const chosenTopic =
      topicInput.trim() ||
      (autocompleteSuggestions[0] ? autocompleteSuggestions[0].title : `Core Concepts in ${selectedSubjectName}`);

    chalkAudio.playChalkTap();
    const levelLabel = currentClass ? `${currentClass.name} (${currentCountry.countryName})` : selectedTier;
    await onStartLesson(selectedSubjectName, chosenTopic, levelLabel);
  };

  const handleSelectSuggestion = (topic: SyllabusTopic) => {
    setTopicInput(topic.title);
    setIsAutocompleteOpen(false);
    chalkAudio.playChalkTap();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-5 animate-scaleUp max-h-[92dvh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close setup modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Classroom Setup
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold text-[10px]">
                AUTHENTIC CURRICULUM
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Select your education level, class, and subject. The teacher writes notes on the chalkboard first, explains clearly, and assesses each subtopic.
            </p>
          </div>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Country / National Curriculum System */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              1. Country & National Curriculum
            </label>
            <select
              value={selectedCountryCode}
              onChange={(e) => {
                setSelectedCountryCode(e.target.value);
                chalkAudio.playChalkTap();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {GLOBAL_CLASSROOM_PROFILES.map((c) => (
                <option key={c.countryCode} value={c.countryCode}>
                  {c.flag} {c.countryName} — {c.educationMinistry}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Education Level (Basic to Advanced Hierarchy) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              2. Education Level (Basic to Advanced)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EDUCATION_LEVEL_DEFINITIONS.map((tierDef) => {
                const isSelected = selectedTier === tierDef.id;
                return (
                  <button
                    key={tierDef.id}
                    type="button"
                    onClick={() => {
                      setSelectedTier(tierDef.id);
                      chalkAudio.playChalkTap();
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 ring-2 ring-blue-600/30 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 dark:text-slate-400">
                        Level {tierDef.order}
                      </span>
                      {isSelected && <Check size={14} className="text-blue-600 shrink-0" />}
                    </div>
                    <span className="text-xs leading-snug font-semibold">{tierDef.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      {tierDef.typicalAges}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Classes Available at the Selected Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              3. Available Classes at this Level
            </label>
            {availableClasses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableClasses.map((cls) => {
                  const isSelected = selectedGradeId === cls.id;
                  return (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => {
                        setSelectedGradeId(cls.id);
                        chalkAudio.playChalkTap();
                      }}
                      className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate pr-2">{cls.name}</span>
                      <span className={`text-[10px] font-mono shrink-0 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {cls.examBoard}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No specific classes found for this tier.</p>
            )}
          </div>

          {/* Step 4: Relevant Subjects for Selected Class */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              4. Relevant Subjects for {currentClass?.shortName || 'Class'}
            </label>
            {availableSubjects.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/60 dark:bg-slate-850/60">
                {availableSubjects.map((subj) => {
                  const isSelected = selectedSubjectId === subj.id;
                  return (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubjectId(subj.id);
                        setSelectedSubjectName(subj.name);
                        chalkAudio.playChalkTap();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs font-bold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/60'
                      }`}
                    >
                      {subj.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Please select a class first.</p>
            )}
          </div>

          {/* Step 5: Smart Topic Search & Autocomplete (Hidden until class & subject selected!) */}
          {selectedClassAndSubjectChosen ? (
            <div className="space-y-2 pt-1 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  5. Smart Topic Search ({selectedSubjectName})
                </label>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                  <CheckCircle size={12} />
                  <span>Syllabus Autocomplete Active</span>
                </span>
              </div>

              {/* Autocomplete Input */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => {
                      setTopicInput(e.target.value);
                      setIsAutocompleteOpen(true);
                    }}
                    onFocus={() => setIsAutocompleteOpen(true)}
                    placeholder={`Type to search or enter a topic (e.g., "${autocompleteSuggestions[0]?.title || 'Key principles'}")`}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                  />
                  {topicInput && (
                    <button
                      type="button"
                      onClick={() => setTopicInput('')}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown List */}
                {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-20 max-h-56 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-1.5 space-y-1 animate-in fade-in-50 zoom-in-95 duration-100">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700/60">
                      Suggested Official Topics ({autocompleteSuggestions.length})
                    </div>
                    {autocompleteSuggestions.map((sug) => (
                      <button
                        key={sug.id}
                        type="button"
                        onClick={() => handleSelectSuggestion(sug)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-100 transition-colors flex items-start justify-between gap-2 cursor-pointer group"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                            {sug.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {sug.subtopics.slice(0, 3).join(' • ')}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                          Week {sug.week}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Pick: Curated suggestions */}
              {autocompleteSuggestions.length > 0 && !topicInput && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    Featured Syllabus Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {autocompleteSuggestions.slice(0, 6).map((top) => (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => handleSelectSuggestion(top)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs transition cursor-pointer border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[220px]"
                      >
                        • {top.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              Select an education level, class, and subject above to unlock topic search and curriculum syllabus.
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !selectedClassAndSubjectChosen}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Preparing Chalkboard & Lesson Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>
                    Start {selectedSubjectName ? `${selectedSubjectName} Lesson` : 'Classroom Lesson'}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
