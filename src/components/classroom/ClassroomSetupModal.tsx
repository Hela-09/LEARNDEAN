import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Search,
  GraduationCap,
  X,
  Compass,
} from 'lucide-react';
import { chalkAudio } from '../../utils/chalkAudio';

interface ClassroomSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartLesson: (subject: string, topic: string, level: string) => Promise<void>;
  isLoading: boolean;
}

export const CLASSROOM_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Language',
  'Economics',
  'Government',
  'Computer Studies',
  'Further Mathematics',
  'Literature in English',
  'Commerce',
];

export const CURATED_TOPICS: Record<string, string[]> = {
  Mathematics: [
    'Quadratic Equations: Completing the Square',
    'Differentiation from First Principles',
    'Pythagoras Theorem & Right Triangles',
    'Simultaneous Equations: Elimination & Substitution',
    'Integration: Definite Integrals and Area under Curves',
    'Probability: Combined and Independent Events',
  ],
  Physics: [
    "Newton's Laws of Motion: F = ma & Dynamics",
    "Ohm's Law and Series & Parallel Circuits",
    'Projectile Motion: Trajectory, Height & Range',
    'Work, Energy and Conservation of Energy',
    'Wave Mechanics: Reflection, Refraction & Diffraction',
    'Thermodynamics: Heat Capacity and Latent Heat',
  ],
  Chemistry: [
    'Organic Chemistry: IUPAC Naming of Hydrocarbons',
    'Chemical Bonding: Ionic, Covalent & Metallic',
    'Periodic Table Trends: Electronegativity & Ionization',
    'Redox Reactions and Balancing Equations',
    'Acids, Bases, pH Scale and Neutralization',
    'Stoichiometry and Mole Concept Calculations',
  ],
  Biology: [
    'Photosynthesis: Light & Dark Reactions',
    'Cell Structure: Organelles and Functions',
    "Genetics: Mendel's Laws of Inheritance & Punnett Squares",
    'Human Circulatory System & Double Circulation',
    'Enzymes: Catalysis, Lock-and-Key Mechanism',
    'Ecology: Food Webs, Trophic Levels & Energy Flow',
  ],
  'English Language': [
    'Grammatical Concord: Subject-Verb Agreement Rules',
    'Phonology: Vowel Sounds, Diphthongs & Stress Patterns',
    'Sentence Structure: Clauses & Complex Sentences',
    'Figures of Speech: Metaphor, Simile & Irony',
  ],
  Economics: [
    'Price Mechanism: Demand and Supply Equilibrium',
    'Elasticity of Demand: Price, Income & Cross Elasticity',
    'Fiscal Policy vs Monetary Policy in Economic Stabilization',
    'Inflation: Causes, Types, and National Policies',
  ],
  Government: [
    'Rule of Law & Separation of Powers',
    'Federalism: Concepts, Advantages and Challenges',
    'Electoral Systems: First-Past-The-Post vs Proportional',
  ],
  'Computer Studies': [
    'Binary Arithmetic and Logic Gates (AND, OR, NOT)',
    'Computer Architecture: CPU, Memory and System Bus',
    'Algorithms and Flowcharts: Step-by-Step Problem Solving',
  ],
  'Further Mathematics': [
    'Matrices: Determinants and Cramer’s Rule',
    'Vectors in 2D and 3D: Dot Product & Cross Product',
    'Binomial Theorem and Series Expansion',
  ],
};

export default function ClassroomSetupModal({
  isOpen,
  onClose,
  onStartLesson,
  isLoading,
}: ClassroomSetupModalProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [topicInput, setTopicInput] = useState<string>('');
  const [educationLevel, setEducationLevel] = useState<string>('Senior Secondary (SSS / WAEC / JAMB)');

  if (!isOpen) return null;

  const currentCurated = CURATED_TOPICS[selectedSubject] || CURATED_TOPICS['Physics'];

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
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-5 animate-scaleUp">
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
                AI Classroom Teacher
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[10px]">
                CHALKBOARD
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Choose a subject or question. The AI teacher will teach step by step on a realistic digital chalkboard with natural speech.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              1. Select Subject
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
                        ? 'bg-blue-600 text-white shadow-xs'
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
                2. Quick Syllabus Topics ({selectedSubject})
              </label>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Click to select</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentCurated.slice(0, 4).map((curTopic) => {
                const isSelected = topicInput === curTopic;
                return (
                  <button
                    key={curTopic}
                    type="button"
                    onClick={() => handleSelectCuratedTopic(curTopic)}
                    className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer truncate ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    • {curTopic}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Topic or Educational Question Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              3. Or Enter Any Topic / Homework Problem
            </label>
            <div className="relative">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={`e.g. ${currentCurated[0]} or "Teach me how to..."`}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Target Education Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              4. Target Level
            </label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Junior Secondary (JSS)">Junior Secondary (JSS)</option>
              <option value="Senior Secondary (SSS / WAEC / JAMB)">Senior Secondary (SSS / WAEC / JAMB)</option>
              <option value="University / Pre-Degree">University / Pre-Degree Foundation</option>
            </select>
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
