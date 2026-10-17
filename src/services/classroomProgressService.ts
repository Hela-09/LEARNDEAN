/**
 * LearnDean Classroom Progress & Activity Service
 * Persists student progress across official syllabuses, terms, weeks, topics,
 * chalkboard activities, practice quizzes, and graded assignments.
 */

import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface AssignmentResult {
  assignmentId: string;
  topicId: string;
  topicTitle: string;
  subject: string;
  submittedAt: number;
  mcqScore: number;
  mcqTotal: number;
  structuredScore: number;
  structuredTotal: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  teacherFeedback: string;
  studentWorkingNotes: Record<string, string>;
  areasForRevision: string[];
}

export interface TopicProgressRecord {
  topicId: string;
  topicTitle: string;
  subject: string;
  term: number;
  week: number;
  completedStepIds: number[];
  isStepsCompleted: boolean;
  practiceAttempts: {
    questionId: string;
    chosenAnswer: number;
    isCorrect: boolean;
  }[];
  isPracticeCompleted: boolean;
  assignmentResult?: AssignmentResult;
  isAssignmentCompleted: boolean;
  isFullyCompleted: boolean;
  lastStudiedAt: number;
  lastStepIndex: number;
  lastPageIndex: number;
  revisionFlagged: boolean;
  revisionNotes?: string;
}

export interface StudentCurriculumProfile {
  countryCode: string;
  educationLevelId: string;
  classGradeId: string;
  curriculumBoard: string;
  subjectId: string;
  selectedTerm: 1 | 2 | 3;
  progressMode: 'sequential' | 'flexible';
}

export interface ClassroomMasterState {
  profile: StudentCurriculumProfile;
  topicsProgress: Record<string, TopicProgressRecord>;
  totalLessonsStudied: number;
  overallAverageScore: number;
  flaggedRevisionTopicIds: string[];
  updatedAt: number;
}

const LOCAL_STORAGE_KEY = 'learndean_classroom_master_progress';

const DEFAULT_PROFILE: StudentCurriculumProfile = {
  countryCode: 'NG',
  educationLevelId: 'Senior Secondary',
  classGradeId: 'sss',
  curriculumBoard: 'WAEC / WASSCE & NERDC',
  subjectId: 'math',
  selectedTerm: 1,
  progressMode: 'sequential',
};

export function loadClassroomProgress(): ClassroomMasterState {
  if (typeof window === 'undefined') {
    return {
      profile: DEFAULT_PROFILE,
      topicsProgress: {},
      totalLessonsStudied: 0,
      overallAverageScore: 0,
      flaggedRevisionTopicIds: [],
      updatedAt: Date.now(),
    };
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return {
        profile: DEFAULT_PROFILE,
        topicsProgress: {},
        totalLessonsStudied: 0,
        overallAverageScore: 0,
        flaggedRevisionTopicIds: [],
        updatedAt: Date.now(),
      };
    }
    const parsed = JSON.parse(raw);
    return {
      profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
      topicsProgress: parsed.topicsProgress || {},
      totalLessonsStudied: parsed.totalLessonsStudied || 0,
      overallAverageScore: parsed.overallAverageScore || 0,
      flaggedRevisionTopicIds: parsed.flaggedRevisionTopicIds || [],
      updatedAt: parsed.updatedAt || Date.now(),
    };
  } catch {
    return {
      profile: DEFAULT_PROFILE,
      topicsProgress: {},
      totalLessonsStudied: 0,
      overallAverageScore: 0,
      flaggedRevisionTopicIds: [],
      updatedAt: Date.now(),
    };
  }
}

export function saveClassroomProgress(state: ClassroomMasterState): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save classroom progress to localStorage:', e);
    }
  }

  // Cloud sync to Firestore securely if authenticated
  if (auth && auth.currentUser) {
    const uid = auth.currentUser.uid;
    try {
      const payload = {
        ...state,
        uid,
        lastCloudSync: Date.now(),
      };
      // Write to both top-level and user subcollection to guarantee sync reliability
      const topRef = doc(db, 'classroom_progress', uid);
      setDoc(topRef, payload, { merge: true }).catch((err) => {
        console.warn('Classroom top-level cloud sync non-fatal notice:', err);
      });
      const subRef = doc(db, 'users', uid, 'classroom_progress', 'master');
      setDoc(subRef, payload, { merge: true }).catch((err) => {
        console.warn('Classroom user subcollection cloud sync non-fatal notice:', err);
      });
    } catch (err) {
      console.warn('Classroom cloud sync exception handled:', err);
    }
  }
}

/**
 * Syncs student classroom progress from Firestore on launch/login
 * and merges with local storage to resume unfinished lessons across devices.
 */
export async function syncClassroomProgressFromCloud(): Promise<ClassroomMasterState> {
  const local = loadClassroomProgress();
  if (!auth || !auth.currentUser) return local;

  const uid = auth.currentUser.uid;
  try {
    const snap1 = await getDoc(doc(db, 'classroom_progress', uid)).catch(() => null);
    const snap2 = !snap1?.exists()
      ? await getDoc(doc(db, 'users', uid, 'classroom_progress', 'master')).catch(() => null)
      : null;
    const cloudDoc = snap1?.exists() ? snap1.data() : snap2?.exists() ? snap2.data() : null;

    if (cloudDoc && cloudDoc.topicsProgress) {
      const mergedTopics = { ...local.topicsProgress };
      for (const [topicId, rec] of Object.entries(
        cloudDoc.topicsProgress as Record<string, TopicProgressRecord>
      )) {
        if (!mergedTopics[topicId] || (rec.lastStudiedAt || 0) > (mergedTopics[topicId].lastStudiedAt || 0)) {
          mergedTopics[topicId] = rec;
        }
      }
      const merged: ClassroomMasterState = {
        ...local,
        profile: cloudDoc.profile ? { ...local.profile, ...cloudDoc.profile } : local.profile,
        topicsProgress: mergedTopics,
        totalLessonsStudied: Math.max(local.totalLessonsStudied || 0, cloudDoc.totalLessonsStudied || 0),
        overallAverageScore: cloudDoc.overallAverageScore || local.overallAverageScore,
        flaggedRevisionTopicIds: Array.from(
          new Set([...(local.flaggedRevisionTopicIds || []), ...(cloudDoc.flaggedRevisionTopicIds || [])])
        ),
        updatedAt: Math.max(local.updatedAt || 0, cloudDoc.updatedAt || 0),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch (err) {
    console.warn('Classroom cloud sync fetch error handled gracefully:', err);
  }
  return local;
}


// Update profile selection
export function updateStudentProfile(profileUpdates: Partial<StudentCurriculumProfile>): ClassroomMasterState {
  const current = loadClassroomProgress();
  const nextProfile = { ...current.profile, ...profileUpdates };
  const updated: ClassroomMasterState = {
    ...current,
    profile: nextProfile,
    updatedAt: Date.now(),
  };
  saveClassroomProgress(updated);
  return updated;
}

// Record step completion
export function recordStepCompleted(
  topicId: string,
  topicTitle: string,
  subject: string,
  term: number,
  week: number,
  stepId: number,
  totalSteps: number,
  pageIndex: number
): ClassroomMasterState {
  const current = loadClassroomProgress();
  const existing = current.topicsProgress[topicId] || {
    topicId,
    topicTitle,
    subject,
    term,
    week,
    completedStepIds: [],
    isStepsCompleted: false,
    practiceAttempts: [],
    isPracticeCompleted: false,
    isAssignmentCompleted: false,
    isFullyCompleted: false,
    lastStudiedAt: Date.now(),
    lastStepIndex: stepId - 1,
    lastPageIndex: pageIndex,
    revisionFlagged: false,
  };

  const stepsSet = new Set(existing.completedStepIds);
  stepsSet.add(stepId);
  const completedStepIds = Array.from(stepsSet);
  const isStepsCompleted = completedStepIds.length >= Math.max(1, totalSteps - 1);

  const isFullyCompleted = isStepsCompleted && existing.isPracticeCompleted && existing.isAssignmentCompleted;

  const updatedRecord: TopicProgressRecord = {
    ...existing,
    completedStepIds,
    isStepsCompleted,
    isFullyCompleted,
    lastStudiedAt: Date.now(),
    lastStepIndex: stepId - 1,
    lastPageIndex: pageIndex,
  };

  const topicsProgress = {
    ...current.topicsProgress,
    [topicId]: updatedRecord,
  };

  const totalLessonsStudied = Object.values(topicsProgress).filter((t) => t.completedStepIds.length > 0).length;

  const nextState: ClassroomMasterState = {
    ...current,
    topicsProgress,
    totalLessonsStudied,
    updatedAt: Date.now(),
  };

  saveClassroomProgress(nextState);
  return nextState;
}

// Record practice answer attempt
export function recordPracticeAttempt(
  topicId: string,
  questionId: string,
  chosenAnswer: number,
  isCorrect: boolean
): ClassroomMasterState {
  const current = loadClassroomProgress();
  const existing = current.topicsProgress[topicId];
  if (!existing) return current;

  const updatedAttempts = existing.practiceAttempts.filter((p) => p.questionId !== questionId);
  updatedAttempts.push({ questionId, chosenAnswer, isCorrect });

  const isPracticeCompleted = updatedAttempts.length >= 2;
  const isFullyCompleted = existing.isStepsCompleted && isPracticeCompleted && existing.isAssignmentCompleted;

  const updatedRecord: TopicProgressRecord = {
    ...existing,
    practiceAttempts: updatedAttempts,
    isPracticeCompleted,
    isFullyCompleted,
    lastStudiedAt: Date.now(),
  };

  const nextState: ClassroomMasterState = {
    ...current,
    topicsProgress: {
      ...current.topicsProgress,
      [topicId]: updatedRecord,
    },
    updatedAt: Date.now(),
  };

  saveClassroomProgress(nextState);
  return nextState;
}

// Record completed assignment
export function recordAssignmentSubmission(result: AssignmentResult): ClassroomMasterState {
  const current = loadClassroomProgress();
  const existing = current.topicsProgress[result.topicId] || {
    topicId: result.topicId,
    topicTitle: result.topicTitle,
    subject: result.subject,
    term: 1,
    week: 1,
    completedStepIds: [1, 2, 3],
    isStepsCompleted: true,
    practiceAttempts: [],
    isPracticeCompleted: true,
    isAssignmentCompleted: false,
    isFullyCompleted: false,
    lastStudiedAt: Date.now(),
    lastStepIndex: 0,
    lastPageIndex: 0,
    revisionFlagged: false,
  };

  const isAssignmentCompleted = result.percentage >= 60;
  const isFullyCompleted = existing.isStepsCompleted && existing.isPracticeCompleted && isAssignmentCompleted;

  // If score is below 65%, automatically flag for revision
  let flagged = existing.revisionFlagged;
  let flaggedList = [...current.flaggedRevisionTopicIds];
  if (result.percentage < 65) {
    flagged = true;
    if (!flaggedList.includes(result.topicId)) {
      flaggedList.push(result.topicId);
    }
  }

  const updatedRecord: TopicProgressRecord = {
    ...existing,
    assignmentResult: result,
    isAssignmentCompleted: true,
    isFullyCompleted,
    revisionFlagged: flagged,
    lastStudiedAt: Date.now(),
  };

  const topicsProgress = {
    ...current.topicsProgress,
    [result.topicId]: updatedRecord,
  };

  // Recalculate average score
  const gradedAssignments = Object.values(topicsProgress)
    .map((t) => t.assignmentResult?.percentage)
    .filter((p): p is number => typeof p === 'number');

  const overallAverageScore = gradedAssignments.length > 0
    ? Math.round(gradedAssignments.reduce((a, b) => a + b, 0) / gradedAssignments.length)
    : result.percentage;

  const nextState: ClassroomMasterState = {
    ...current,
    topicsProgress,
    overallAverageScore,
    flaggedRevisionTopicIds: flaggedList,
    updatedAt: Date.now(),
  };

  saveClassroomProgress(nextState);
  return nextState;
}

// Toggle revision flag
export function toggleRevisionFlag(topicId: string, notes?: string): ClassroomMasterState {
  const current = loadClassroomProgress();
  const existing = current.topicsProgress[topicId];
  if (!existing) return current;

  const nextFlag = !existing.revisionFlagged;
  let flaggedList = current.flaggedRevisionTopicIds.filter((id) => id !== topicId);
  if (nextFlag) flaggedList.push(topicId);

  const updatedRecord: TopicProgressRecord = {
    ...existing,
    revisionFlagged: nextFlag,
    revisionNotes: notes || existing.revisionNotes,
  };

  const nextState: ClassroomMasterState = {
    ...current,
    topicsProgress: {
      ...current.topicsProgress,
      [topicId]: updatedRecord,
    },
    flaggedRevisionTopicIds: flaggedList,
    updatedAt: Date.now(),
  };

  saveClassroomProgress(nextState);
  return nextState;
}
