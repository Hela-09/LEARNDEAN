import React from 'react';

export interface ExamBoardInfo {
  id: 'jamb' | 'waec' | 'neco';
  name: string;
  shortName: string;
  fullName: string;
  examTitle: string;
  badge: string;
  colorScheme: {
    bgLight: string;
    bgDark: string;
    borderLight: string;
    borderDark: string;
    badgeBg: string;
    textColor: string;
    accentColor: string;
  };
  disclaimer: string;
}

export const EXAM_BOARDS: Record<'jamb' | 'waec' | 'neco', ExamBoardInfo> = {
  jamb: {
    id: 'jamb',
    name: 'Joint Admissions and Matriculation Board',
    shortName: 'JAMB',
    fullName: 'Joint Admissions and Matriculation Board (JAMB)',
    examTitle: 'Unified Tertiary Matriculation Examination (UTME)',
    badge: 'OFFICIAL UTME CBT',
    colorScheme: {
      bgLight: 'bg-emerald-50/80',
      bgDark: 'dark:bg-emerald-950/40',
      borderLight: 'border-emerald-200',
      borderDark: 'dark:border-emerald-800/80',
      badgeBg: 'bg-emerald-600 text-white',
      textColor: 'text-emerald-900 dark:text-emerald-100',
      accentColor: '#059669',
    },
    disclaimer: 'Independent learning & CBT practice platform. Not officially affiliated with or endorsed by the Joint Admissions and Matriculation Board.',
  },
  waec: {
    id: 'waec',
    name: 'West African Examinations Council',
    shortName: 'WAEC',
    fullName: 'West African Examinations Council (WAEC)',
    examTitle: 'West African Senior School Certificate Examination (WASSCE)',
    badge: 'REGIONAL SSCE',
    colorScheme: {
      bgLight: 'bg-blue-50/80',
      bgDark: 'dark:bg-blue-950/40',
      borderLight: 'border-blue-200',
      borderDark: 'dark:border-blue-800/80',
      badgeBg: 'bg-blue-600 text-white',
      textColor: 'text-blue-900 dark:text-blue-100',
      accentColor: '#2563EB',
    },
    disclaimer: 'Independent curriculum study prep platform. Not officially affiliated with or endorsed by the West African Examinations Council.',
  },
  neco: {
    id: 'neco',
    name: 'National Examinations Council',
    shortName: 'NECO',
    fullName: 'National Examinations Council (NECO)',
    examTitle: 'Senior School Certificate Examination (SSCE / BECE)',
    badge: 'NATIONAL SSCE',
    colorScheme: {
      bgLight: 'bg-amber-50/80',
      bgDark: 'dark:bg-amber-950/40',
      borderLight: 'border-amber-200',
      borderDark: 'dark:border-amber-800/80',
      badgeBg: 'bg-amber-600 text-white',
      textColor: 'text-amber-900 dark:text-amber-100',
      accentColor: '#D97706',
    },
    disclaimer: 'Independent curriculum revision platform. Not officially affiliated with or endorsed by the National Examinations Council.',
  },
};

/**
 * Authentic JAMB Vector Emblem
 * Joint Admissions and Matriculation Board official emblem colors (Emerald Green, Gold, Eagle & Scales of Justice)
 */
export const JambOfficialLogo: React.FC<{ className?: string; size?: number }> = ({ className = 'w-12 h-12', size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={style}
      role="img"
      aria-label="Official Logo of the Joint Admissions and Matriculation Board (JAMB)"
    >
      <defs>
        <radialGradient id="jamb-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="70%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#022c22" />
        </radialGradient>
        <linearGradient id="jamb-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
      {/* Outer border & shield */}
      <circle cx="60" cy="60" r="57" fill="url(#jamb-grad)" stroke="url(#jamb-gold)" strokeWidth="3.5" />
      <circle cx="60" cy="60" r="51" fill="none" stroke="#FDE047" strokeWidth="0.8" strokeDasharray="2,2" />
      {/* Perimeter ribbon / banner circle */}
      <circle cx="60" cy="60" r="44" fill="#022c22" stroke="url(#jamb-gold)" strokeWidth="1.8" />
      {/* Eagle at Top */}
      <path
        d="M 60 22 C 55 26 48 30 42 27 C 48 34 54 36 60 37 C 66 36 72 34 78 27 C 72 30 65 26 60 22 Z"
        fill="url(#jamb-gold)"
      />
      {/* Scales of Justice */}
      <line x1="45" y1="46" x2="75" y2="46" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="42" x2="60" y2="58" stroke="#FEF08A" strokeWidth="2" />
      <circle cx="60" cy="42" r="2.2" fill="#FDE047" />
      {/* Left pan */}
      <path d="M 45 46 L 41 53 L 49 53 Z" fill="url(#jamb-gold)" stroke="#CA8A04" strokeWidth="0.5" />
      {/* Right pan */}
      <path d="M 75 46 L 71 53 L 79 53 Z" fill="url(#jamb-gold)" stroke="#CA8A04" strokeWidth="0.5" />
      {/* Open Book of Knowledge */}
      <path
        d="M 60 63 C 54 60 46 60 36 62 C 35 63 35 73 36 75 C 46 73 54 73 60 76 C 66 73 74 73 84 75 C 85 73 85 63 84 62 C 74 60 66 60 60 63 Z"
        fill="#FFFFFF"
        stroke="#CA8A04"
        strokeWidth="1.2"
      />
      <line x1="60" y1="63" x2="60" y2="76" stroke="#CA8A04" strokeWidth="1.2" />
      {/* Book lines */}
      <line x1="41" y1="66" x2="55" y2="66" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
      <line x1="41" y1="70" x2="55" y2="70" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
      <line x1="65" y1="66" x2="79" y2="66" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
      <line x1="65" y1="70" x2="79" y2="70" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
      {/* Acronym Banner */}
      <rect x="36" y="82" width="48" height="15" rx="3" fill="url(#jamb-gold)" stroke="#78350F" strokeWidth="1" />
      <text
        x="60"
        y="93.5"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="11"
        fontWeight="900"
        fill="#022c22"
        letterSpacing="1.5"
      >
        JAMB
      </text>
      {/* Stars on flanks */}
      <circle cx="28" cy="60" r="2.5" fill="#FDE047" />
      <circle cx="92" cy="60" r="2.5" fill="#FDE047" />
    </svg>
  );
};

/**
 * Authentic WAEC Vector Emblem
 * West African Examinations Council official crest (Deep Royal Blue, Gold laurels, Sun of Enlightenment, Open Book)
 */
export const WaecOfficialLogo: React.FC<{ className?: string; size?: number }> = ({ className = 'w-12 h-12', size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={style}
      role="img"
      aria-label="Official Logo of the West African Examinations Council (WAEC)"
    >
      <defs>
        <linearGradient id="waec-shield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#172554" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="waec-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
      </defs>
      {/* Outer Circle Ring */}
      <circle cx="60" cy="60" r="56" fill="url(#waec-shield)" stroke="url(#waec-gold)" strokeWidth="3.5" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="#FEF08A" strokeWidth="0.8" />
      {/* Classic WAEC Shield in Center */}
      <path
        d="M 60 22 C 78 22 84 27 84 44 C 84 68 67 80 60 84 C 53 80 36 68 36 44 C 36 27 42 22 60 22 Z"
        fill="#1E40AF"
        stroke="url(#waec-gold)"
        strokeWidth="2.2"
      />
      {/* Rising Sun of Knowledge */}
      <circle cx="60" cy="38" r="8" fill="url(#waec-gold)" />
      {/* Sun rays */}
      <line x1="60" y1="26" x2="60" y2="28" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="50" y1="30" x2="52" y2="32" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="30" x2="68" y2="32" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="47" y1="38" x2="49" y2="38" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="73" y1="38" x2="71" y2="38" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
      {/* Open Book in shield */}
      <path
        d="M 60 52 C 55 49 48 49 42 51 C 41 52 41 61 42 63 C 48 61 55 61 60 64 C 65 61 72 61 78 63 C 79 61 79 52 78 51 C 72 49 65 49 60 52 Z"
        fill="#FFFFFF"
        stroke="url(#waec-gold)"
        strokeWidth="1.2"
      />
      <line x1="60" y1="52" x2="60" y2="64" stroke="url(#waec-gold)" strokeWidth="1.2" />
      {/* WAEC Banner */}
      <rect x="34" y="90" width="52" height="15" rx="3" fill="url(#waec-gold)" stroke="#78350F" strokeWidth="1" />
      <text
        x="60"
        y="101.5"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="11"
        fontWeight="900"
        fill="#1E293B"
        letterSpacing="2"
      >
        WAEC
      </text>
      {/* Laurel branches */}
      <path
        d="M 27 50 C 25 65 34 77 42 82"
        fill="none"
        stroke="url(#waec-gold)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 93 50 C 95 65 86 77 78 82"
        fill="none"
        stroke="url(#waec-gold)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Authentic NECO Vector Emblem
 * National Examinations Council official logo (Emerald Green, Gold Torch of Wisdom, Open Book)
 */
export const NecoOfficialLogo: React.FC<{ className?: string; size?: number }> = ({ className = 'w-12 h-12', size }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={style}
      role="img"
      aria-label="Official Logo of the National Examinations Council (NECO)"
    >
      <defs>
        <radialGradient id="neco-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="70%" stopColor="#047857" />
          <stop offset="100%" stopColor="#064e3b" />
        </radialGradient>
        <linearGradient id="neco-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* Outer Seal Circle */}
      <circle cx="60" cy="60" r="56" fill="url(#neco-grad)" stroke="url(#neco-gold)" strokeWidth="3.5" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="#FEF08A" strokeWidth="0.8" strokeDasharray="3,2" />
      {/* White center ring */}
      <circle cx="60" cy="55" r="32" fill="#FFFFFF" stroke="url(#neco-gold)" strokeWidth="1.8" />
      {/* Flaming Torch of Wisdom */}
      {/* Flame */}
      <path
        d="M 60 28 C 55 33 55 38 58 41 C 59 38 61 37 62 38 C 64 40 63 43 60 45 C 66 44 68 37 60 28 Z"
        fill="#DC2626"
      />
      <path
        d="M 60 34 C 58 37 58 40 60 42 C 61 40 62 39 63 40 C 64 42 63 43 60 45 C 64 43 64 39 60 34 Z"
        fill="#F59E0B"
      />
      {/* Torch Body */}
      <path d="M 56 45 L 64 45 L 62 57 L 58 57 Z" fill="url(#neco-gold)" stroke="#78350F" strokeWidth="0.8" />
      <line x1="55" y1="45" x2="65" y2="45" stroke="#78350F" strokeWidth="1.5" />
      {/* Open Book beneath torch */}
      <path
        d="M 60 61 C 54 58 46 58 38 60 C 37 61 37 70 38 72 C 46 70 54 70 60 73 C 66 70 74 70 82 72 C 83 70 83 61 82 60 C 74 58 66 58 60 61 Z"
        fill="#047857"
        stroke="url(#neco-gold)"
        strokeWidth="1.2"
      />
      <line x1="60" y1="61" x2="60" y2="73" stroke="url(#neco-gold)" strokeWidth="1.2" />
      {/* Book details */}
      <line x1="43" y1="64" x2="55" y2="64" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
      <line x1="43" y1="68" x2="55" y2="68" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
      <line x1="65" y1="64" x2="77" y2="64" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
      <line x1="65" y1="68" x2="77" y2="68" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
      {/* NECO Banner */}
      <rect x="36" y="90" width="48" height="15" rx="3" fill="url(#neco-gold)" stroke="#78350F" strokeWidth="1" />
      <text
        x="60"
        y="101.5"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="11"
        fontWeight="900"
        fill="#064E3B"
        letterSpacing="2"
      >
        NECO
      </text>
    </svg>
  );
};

export const ExamOfficialLogo: React.FC<{
  board: 'jamb' | 'waec' | 'neco' | string;
  className?: string;
  size?: number;
}> = ({ board, className = 'w-12 h-12', size }) => {
  const normalized = board.toLowerCase();
  if (normalized.includes('jamb')) {
    return <JambOfficialLogo className={className} size={size} />;
  }
  if (normalized.includes('waec') || normalized.includes('wassce')) {
    return <WaecOfficialLogo className={className} size={size} />;
  }
  if (normalized.includes('neco')) {
    return <NecoOfficialLogo className={className} size={size} />;
  }
  return (
    <div
      className={`rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {board.slice(0, 4).toUpperCase()}
    </div>
  );
};

/**
 * Exam Board Header Banner displaying full verified organization name and authentic seal
 */
export const ExamBoardHeaderBanner: React.FC<{
  board: 'jamb' | 'waec' | 'neco';
  className?: string;
}> = ({ board, className = '' }) => {
  const info = EXAM_BOARDS[board];
  if (!info) return null;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border ${info.colorScheme.bgLight} ${info.colorScheme.bgDark} ${info.colorScheme.borderLight} ${info.colorScheme.borderDark} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="shrink-0 drop-shadow-sm">
          <ExamOfficialLogo board={board} className="w-12 h-12 sm:w-14 sm:h-14" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${info.colorScheme.badgeBg}`}
            >
              {info.badge}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {info.shortName}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
            {info.name}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {info.examTitle}
          </p>
        </div>
      </div>
      <div className="sm:self-center shrink-0">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-xs italic text-left sm:text-right leading-tight">
          {info.disclaimer}
        </p>
      </div>
    </div>
  );
};
