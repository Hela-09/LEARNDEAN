import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  GraduationCap,
  FileUp,
  Compass,
  BookOpen,
  PenTool,
  Layers,
  Zap,
  BookMarked,
  WifiOff,
  Target,
  School,
  Calculator,
} from 'lucide-react';
import { LearnDeanEmblem } from '../components/Logo';

export interface QuickLinkItem {
  id: string;
  label: string;
  shortDescription: string;
  destination: string;
  iconName: string;
  category: 'core' | 'exam' | 'tool';
}

export const ALL_HOMEPAGE_AVAILABLE_FEATURES: QuickLinkItem[] = [
  {
    id: 'classroom',
    label: 'AI Classroom',
    shortDescription: 'Chalkboard teacher with voice & theory assignments',
    destination: 'classroom',
    iconName: 'classroom',
    category: 'core',
  },
  {
    id: 'upload_notes',
    label: 'Upload Notes',
    shortDescription: 'Convert notes into summaries & flashcards',
    destination: 'upload_notes',
    iconName: 'upload',
    category: 'tool',
  },
  {
    id: 'journey',
    label: 'Study Journey',
    shortDescription: '6-step structured curriculum mastery roadmap',
    destination: 'journey',
    iconName: 'journey',
    category: 'core',
  },
  {
    id: 'library',
    label: 'Library & Syllabus',
    shortDescription: 'Official textbooks, curriculum topics & notes',
    destination: 'subjects',
    iconName: 'library',
    category: 'core',
  },
  {
    id: 'practice',
    label: 'Practice & Quizzes',
    shortDescription: 'Single & multi-subject custom exam practice',
    destination: 'practice',
    iconName: 'practice',
    category: 'core',
  },
  {
    id: 'study_hub',
    label: 'Study & Exam Hub',
    shortDescription: 'Global curriculum explorer & exam drill center',
    destination: 'study',
    iconName: 'study_hub',
    category: 'exam',
  },
  {
    id: 'flashcards',
    label: 'Active Recall',
    shortDescription: 'Curriculum flashcards with smart spaced repetition',
    destination: 'flashcards',
    iconName: 'flashcards',
    category: 'tool',
  },
  {
    id: 'jamb',
    label: 'JAMB CBT Prep',
    shortDescription: 'Official UTME past questions with timer & calculator',
    destination: 'jamb',
    iconName: 'jamb',
    category: 'exam',
  },
  {
    id: 'novels',
    label: 'Novels & Literature',
    shortDescription: 'Prescribed JAMB & WAEC prose, drama & questions',
    destination: 'novels',
    iconName: 'novels',
    category: 'core',
  },
  {
    id: 'offline_hub',
    label: 'Offline Learning Hub',
    shortDescription: 'Download study packages and practice without internet',
    destination: 'offline_hub',
    iconName: 'offline',
    category: 'tool',
  },
  {
    id: 'weak_topics',
    label: 'Weak Topic Mastery',
    shortDescription: 'Diagnostic mistake review and remedial practice',
    destination: 'weak_topics',
    iconName: 'weak_topics',
    category: 'tool',
  },
  {
    id: 'daily_challenge',
    label: 'Daily Challenge',
    shortDescription: '10-question timed daily streak practice',
    destination: 'daily_challenge',
    iconName: 'challenge',
    category: 'tool',
  },
];

export const DEFAULT_HOMEPAGE_FEATURE_IDS: string[] = [
  'classroom',
  'upload_notes',
  'journey',
  'library',
  'practice',
];

const LOCAL_STORAGE_KEY_PREFIX = 'learndean_homepage_quick_links_';

/**
 * Get user quick links:
 * Checks localStorage first for fast hydration, and asynchronously loads from Firestore.
 */
export async function getHomepageQuickLinks(userId?: string | null): Promise<string[]> {
  const storageKey = userId ? `${LOCAL_STORAGE_KEY_PREFIX}${userId}` : `${LOCAL_STORAGE_KEY_PREFIX}guest`;

  // 1. Check local storage
  let localLinks: string[] | null = null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localLinks = parsed;
      }
    }
  } catch (_) {}

  // 2. If user is authenticated, query Firestore
  if (userId) {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (Array.isArray(data.homepageQuickLinks) && data.homepageQuickLinks.length > 0) {
          // Sync to localStorage
          localStorage.setItem(storageKey, JSON.stringify(data.homepageQuickLinks));
          return data.homepageQuickLinks;
        }
      }
    } catch (e) {
      console.warn('Failed to load homepage quick links from Firestore:', e);
    }
  }

  // 3. Fallback to localLinks or sensible defaults
  if (localLinks && localLinks.length > 0) {
    return localLinks;
  }

  return [...DEFAULT_HOMEPAGE_FEATURE_IDS];
}

/**
 * Save user quick links:
 * Writes to localStorage and persists to Firestore for authenticated user.
 */
export async function saveHomepageQuickLinks(userId: string | null | undefined, selectedIds: string[]): Promise<void> {
  const sanitized = selectedIds.filter((id) =>
    ALL_HOMEPAGE_AVAILABLE_FEATURES.some((f) => f.id === id)
  );

  const finalLinks = sanitized.length > 0 ? sanitized : [...DEFAULT_HOMEPAGE_FEATURE_IDS];
  const storageKey = userId ? `${LOCAL_STORAGE_KEY_PREFIX}${userId}` : `${LOCAL_STORAGE_KEY_PREFIX}guest`;

  // Save to local storage
  try {
    localStorage.setItem(storageKey, JSON.stringify(finalLinks));
  } catch (_) {}

  // Save to Firestore if signed in
  if (userId) {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { homepageQuickLinks: finalLinks }, { merge: true });
    } catch (e) {
      console.warn('Failed to persist homepage quick links to Firestore:', e);
    }
  }

  // Broadcast event for active views
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('learndean-homepage-links-updated', { detail: { links: finalLinks } })
    );
  }
}
