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
  Calendar,
  User,
} from 'lucide-react';
import { chalkAudio } from '../../utils/chalkAudio';
import {
  GLOBAL_CLASSROOM_PROFILES,
  CountryCurriculumProfile,
  searchClassroomCurriculumTopics,
  SyllabusTopic,
} from '../../data/officialClassroomCurriculum';

export interface ClassroomSetupData {
  subject: string;
  topic: string;
  subtopic?: string;
  level: string; // 'Primary / Basic Education' | 'Secondary Education' | 'Tertiary / University Education'
  grade: string;
  age?: number;
  curriculum?: string;
}

interface ClassroomSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLesson: (setup: ClassroomSetupData) => Promise<void>;
  isLoading: boolean;
  initialSubject?: string;
  initialTopic?: string;
}

const COMMON_SUBJECT_SUGGESTIONS = [
  'Biology',
  'Mathematics',
  'Literature in English',
  'Physics',
  'Chemistry',
  'Accounting',
  'Economics',
  'Government',
  'Computer Science',
  'English Language',
  'Geography',
  'Agricultural Science',
  'Commerce',
  'Further Mathematics',
  'Civic Education',
];

const CURRICULUM_OPTIONS = [
  { id: 'Nigeria', label: 'Nigeria (NERDC / WAEC / JAMB / NECO)', countryCode: 'NG' },
  { id: 'UK', label: 'United Kingdom (National Curriculum / GCSE / A-Levels)', countryCode: 'UK' },
  { id: 'USA', label: 'United States (K-12 / AP / College Board)', countryCode: 'US' },
  { id: 'Ghana', label: 'Ghana (WAEC / GES / BECE / WASSCE)', countryCode: 'GH' },
  { id: 'IB', label: 'International Baccalaureate (IB PYP / MYP / DP)', countryCode: 'IB' },
  { id: 'South Africa', label: 'South Africa (CAPS / NSC)', countryCode: 'ZA' },
  { id: 'General', label: 'Global / Standard International Curriculum', countryCode: 'GEN' },
];

export default function ClassroomSetupModal({
  isOpen,
  onClose,
  onStartLesson,
  isLoading,
  initialSubject = '',
  initialTopic = '',
}: ClassroomSetupModalProps) {
  // 1. Subject (Text input with suggested pills)
  const [subjectInput, setSubjectInput] = useState<string>(initialSubject || 'Biology');

  // 2. Topic (Text input)
  const [topicInput, setTopicInput] = useState<string>(initialTopic || 'Photosynthesis');

  // 3. Subtopic (Optional text input)
  const [subtopicInput, setSubtopicInput] = useState<string>('');

  // 4. Education level: Primary, Secondary, Tertiary
  const [educationLevel, setEducationLevel] = useState<'primary' | 'secondary' | 'tertiary'>('secondary');

  // 5. Grade / Class / Year
  const [gradeInput, setGradeInput] = useState<string>('Senior Secondary 2 (SSS 2)');

  // 6. Age (Optional)
  const [ageInput, setAgeInput] = useState<string>('16');

  // 7. Curriculum or country (Optional)
  const [curriculumInput, setCurriculumInput] = useState<string>('Nigeria (NERDC / WAEC / JAMB / NECO)');

  // Autocomplete topic helper
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState<boolean>(false);

  // Dynamic Grade Suggestions based on Education Level
  const gradeOptions = useMemo(() => {
    if (educationLevel === 'primary') {
      return [
        'Primary 1 / Grade 1',
        'Primary 2 / Grade 2',
        'Primary 3 / Grade 3',
        'Primary 4 / Grade 4',
        'Primary 5 / Grade 5',
        'Primary 6 / Grade 6',
      ];
    } else if (educationLevel === 'tertiary') {
      return [
        '100 Level (Freshman / Year 1)',
        '200 Level (Sophomore / Year 2)',
        '300 Level (Junior / Year 3)',
        '400 Level (Senior / Year 4)',
        '500 Level (Year 5 / Professional)',
        'Postgraduate / Masters Level',
      ];
    } else {
      return [
        'Junior Secondary 1 (JSS 1 / Year 7)',
        'Junior Secondary 2 (JSS 2 / Year 8)',
        'Junior Secondary 3 (JSS 3 / Year 9)',
        'Senior Secondary 1 (SSS 1 / Year 10)',
        'Senior Secondary 2 (SSS 2 / Year 11)',
        'Senior Secondary 3 (SSS 3 / Year 12 / WAEC / JAMB)',
      ];
    }
  }, [educationLevel]);

  // Adjust default grade when level changes
  useEffect(() => {
    if (educationLevel === 'primary') {
      setGradeInput('Primary 5 / Grade 5');
      if (!ageInput || Number(ageInput) > 12) setAgeInput('10');
    } else if (educationLevel === 'tertiary') {
      setGradeInput('200 Level (Sophomore / Year 2)');
      if (!ageInput || Number(ageInput) < 18) setAgeInput('20');
    } else {
      setGradeInput('Senior Secondary 2 (SSS 2 / Year 11)');
      if (!ageInput || Number(ageInput) < 12 || Number(ageInput) > 18) setAgeInput('16');
    }
  }, [educationLevel]);

  // Autocomplete suggestions based on subject and letters entered
  const autocompleteSuggestions = useMemo<SyllabusTopic[]>(() => {
    if (!topicInput || topicInput.length < 2) return [];
    return searchClassroomCurriculumTopics(topicInput, '', subjectInput.toLowerCase(), 'NG');
  }, [topicInput, subjectInput]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanSub = subjectInput.trim();
    const cleanTop = topicInput.trim();
    if (!cleanSub || !cleanTop) return;

    chalkAudio.playChalkTap();

    const levelLabel =
      educationLevel === 'primary'
        ? 'Primary / Basic Education'
        : educationLevel === 'tertiary'
        ? 'Tertiary / University Education'
        : 'Secondary Education';

    const parsedAge = ageInput && !isNaN(Number(ageInput)) ? Number(ageInput) : undefined;

    await onStartLesson({
      subject: cleanSub,
      topic: cleanTop,
      subtopic: subtopicInput.trim() || undefined,
      level: levelLabel,
      grade: gradeInput.trim(),
      age: parsedAge,
      curriculum: curriculumInput,
    });
  };

  const handleSelectTopicSuggestion = (topic: SyllabusTopic) => {
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
                TAILORED TEACHER
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Enter your exact subject, topic, and education level. The teacher adapts the lesson depth, vocabulary, and theory assignments directly to you.
            </p>
          </div>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Subject Text Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                1. Subject <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Type any subject</span>
            </div>
            <input
              type="text"
              required
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="e.g. Biology, Literature in English, Mathematics, Accounting, Physics..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {/* Quick Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1.5">
              <span className="text-[10px] text-slate-400 font-bold shrink-0">Suggestions:</span>
              {COMMON_SUBJECT_SUGGESTIONS.slice(0, 8).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => {
                    setSubjectInput(sub);
                    chalkAudio.playChalkTap();
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                    subjectInput.toLowerCase() === sub.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Topic Text Input */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                2. Topic <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Main topic to teach</span>
            </div>
            <input
              type="text"
              required
              value={topicInput}
              onChange={(e) => {
                setTopicInput(e.target.value);
                setIsAutocompleteOpen(true);
              }}
              onFocus={() => setIsAutocompleteOpen(true)}
              placeholder="e.g. Photosynthesis, Quadratic Equations, Shakespearean Tragedy, Cash Flow Statements..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* Topic Suggestions dropdown if typed */}
            {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-1.5 max-h-44 overflow-y-auto">
                <span className="block px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">
                  Curriculum Topic Suggestions:
                </span>
                {autocompleteSuggestions.slice(0, 5).map((sug) => (
                  <button
                    key={sug.id}
                    type="button"
                    onClick={() => handleSelectTopicSuggestion(sug)}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-800 dark:text-slate-200 font-medium flex items-center justify-between transition cursor-pointer"
                  >
                    <span>{sug.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Week {sug.week}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Subtopic Text Input (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                3. Subtopic <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[11px] text-slate-400">Specific area to prioritize</span>
            </div>
            <input
              type="text"
              value={subtopicInput}
              onChange={(e) => setSubtopicInput(e.target.value)}
              placeholder="e.g. Light-dependent reactions & Calvin cycle (Leave empty to cover all subtopics)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* 4. Education Level Selection: Primary, Secondary, Tertiary */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              4. Education Level <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEducationLevel('primary');
                  chalkAudio.playChalkTap();
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  educationLevel === 'primary'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold">Primary / Basic</span>
                <span className="text-[10px] text-slate-400">Pupils (~6–11 yrs)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEducationLevel('secondary');
                  chalkAudio.playChalkTap();
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  educationLevel === 'secondary'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold">Secondary</span>
                <span className="text-[10px] text-slate-400">Junior & Senior SSS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEducationLevel('tertiary');
                  chalkAudio.playChalkTap();
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  educationLevel === 'tertiary'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold">Tertiary / University</span>
                <span className="text-[10px] text-slate-400">Undergraduate / Masters</span>
              </button>
            </div>
          </div>

          {/* 5. Grade, Class, or Year Selection & 6. Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Grade / Class dropdown + custom */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                5. Grade, Class, or Year <span className="text-rose-500">*</span>
              </label>
              <select
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Age (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                6. Age <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  placeholder="e.g. 16"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">
                  yrs
                </span>
              </div>
            </div>
          </div>

          {/* 7. Curriculum or Country (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              7. Curriculum / Country <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <select
              value={curriculumInput}
              onChange={(e) => setCurriculumInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {CURRICULUM_OPTIONS.map((c) => (
                <option key={c.id} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !subjectInput.trim() || !topicInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-600/25 transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Preparing Masterclass...</span>
                </>
              ) : (
                <>
                  <span>Start Classroom Lesson</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
