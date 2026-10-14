import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { chalkAudio } from '../../utils/chalkAudio';
import { GLOBAL_CLASSROOM_PROFILES } from '../../data/officialClassroomCurriculum';

interface ClassroomSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLesson: (subject: string, topic: string, level: string) => Promise<void>;
  isLoading: boolean;
}

export const CLASSROOM_SUBJECTS = [
  'General Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Language',
  'Economics',
  'Government',
  'Further Mathematics',
  'Literature in English',
  'Commerce',
];

export const CURATED_TOPICS: Record<string, string[]> = {
  'General Mathematics': [
    'Number Bases & Conversions',
    'Modular Arithmetic & Congruences',
    'Indices, Logarithms & Surds',
    'Quadratic Equations: Completing the Square',
    'Pythagoras Theorem & Right Triangles',
    'Simultaneous Equations: Elimination & Substitution',
  ],
  Physics: [
    'Kinematics: Rectilinear Motion & Velocity-Time Graphs',
    "Newton's Laws of Motion & Momentum",
    "Ohm's Law and Series & Parallel Circuits",
    'Projectile Motion: Trajectory, Height & Range',
    'Work, Energy and Conservation of Energy',
    'Wave Mechanics: Reflection, Refraction & Diffraction',
  ],
  Chemistry: [
    'Atomic Structure & Chemical Bonding',
    'Organic Chemistry: IUPAC Naming of Hydrocarbons',
    'Periodic Table Trends: Electronegativity & Ionization',
    'Redox Reactions and Balancing Equations',
    'Acids, Bases, pH Scale and Neutralization',
    'Stoichiometry and Mole Concept Calculations',
  ],
  Biology: [
    'Cell Biology: Organization, Organelles & Microscopy',
    'Photosynthesis: Light & Dark Reactions',
    "Genetics: Mendel's Laws of Inheritance & Punnett Squares",
    'Human Circulatory System & Double Circulation',
    'Enzymes: Catalysis, Lock-and-Key Mechanism',
    'Ecology: Food Webs, Trophic Levels & Energy Flow',
  ],
  'English Language': [
    'Grammatical Concord & Rules of Agreement',
    'Sentence Structure: Clauses & Complex Sentences',
    'Phonology: Vowel Sounds, Diphthongs & Stress Patterns',
    'Lexis and Structure: Idioms and Collocations',
    'Reading Comprehension: Summary and Central Themes',
  ],
};

export default function ClassroomSetupModal({
  isOpen,
  onClose,
  onStartLesson,
  isLoading,
}: ClassroomSetupModalProps) {
  // All hooks must be unconditional at the top level
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('NG');
  const [selectedSubject, setSelectedSubject] = useState<string>('General Mathematics');
  const [topicInput, setTopicInput] = useState<string>('');
  const [educationLevel, setEducationLevel] = useState<string>('Senior Secondary (SSS / WAEC / JAMB)');
  const [academicTerm, setAcademicTerm] = useState<number>(1);

  const currentCountry = useMemo(() => {
    return (
      GLOBAL_CLASSROOM_PROFILES.find((c) => c.countryCode === selectedCountryCode) ||
      GLOBAL_CLASSROOM_PROFILES[0]
    );
  }, [selectedCountryCode]);

  const currentCurated = useMemo(() => {
    return CURATED_TOPICS[selectedSubject] || CURATED_TOPICS['General Mathematics'];
  }, [selectedSubject]);

  // Early return is placed AFTER all hooks
  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalTopic = topicInput.trim() || currentCurated[0];
    chalkAudio.playChalkTap();
    await onStartLesson(selectedSubject, finalTopic, educationLevel);
  };

  const handleSelectCuratedTopic = (t: string) => {
    setTopicInput(t);
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
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shrink-0">
            <GraduationCap size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Classroom Setup
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[10px]">
                OFFICIAL SYLLABUS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Select your curriculum, subject, and term. The AI teacher explains step by step on a realistic multi-page chalkboard with synchronized speech.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Country & Curriculum Framework */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Country & National System
              </label>
              <select
                value={selectedCountryCode}
                onChange={(e) => {
                  setSelectedCountryCode(e.target.value);
                  chalkAudio.playChalkTap();
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {GLOBAL_CLASSROOM_PROFILES.map((c) => (
                  <option key={c.countryCode} value={c.countryCode}>
                    {c.flag} {c.countryName} ({c.educationMinistry})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Target Level / Examination
              </label>
              <select
                value={educationLevel}
                onChange={(e) => {
                  setEducationLevel(e.target.value);
                  chalkAudio.playChalkTap();
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Senior Secondary (SSS / WAEC / JAMB)">Senior Secondary (SSS / WAEC / JAMB)</option>
                <option value="JAMB UTME (IBASS Direct)">JAMB UTME (IBASS Direct)</option>
                <option value="Junior Secondary (JSS / BECE)">Junior Secondary (JSS / BECE)</option>
                <option value="Cambridge IGCSE / GCSE">Cambridge IGCSE / GCSE</option>
                <option value="Cambridge A-Levels / AP">Cambridge A-Levels / College Prep AP</option>
              </select>
            </div>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Subject
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-850/50">
              {CLASSROOM_SUBJECTS.map((subj) => {
                const isSelected = selectedSubject === subj;
                return (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(subj);
                      chalkAudio.playChalkTap();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/60'
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>
          </div>

          {/* High-Yield Topics Quick Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Verified Syllabus Topics ({selectedSubject})
              </label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle size={12} />
                <span>Verified Official</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentCurated.map((curTopic) => {
                const isSelected = topicInput === curTopic;
                return (
                  <button
                    key={curTopic}
                    type="button"
                    onClick={() => handleSelectCuratedTopic(curTopic)}
                    className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    • {curTopic}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Topic Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Or Type Any Specific Topic / Past Question
            </label>
            <div className="relative">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={`e.g. ${currentCurated[0]} or "Explain step-by-step how to..."`}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Preparing Chalkboard & Lesson Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Start Chalkboard Classroom Lesson</span>
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
