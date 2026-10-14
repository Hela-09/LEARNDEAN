import { ClassroomLesson, ClassroomQA } from '../types/classroom';
import { DEFAULT_PHYSICS_LESSON } from '../utils/classroomDefaults';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  GLOBAL_CLASSROOM_PROFILES,
  SyllabusTopic,
  findSyllabusTopicById,
} from '../data/officialClassroomCurriculum';

const CACHE_KEY = 'learndean_classroom_recent_lessons';

// Check if a topic query matches a verified syllabus topic
export function findMatchingVerifiedSyllabusTopic(subject: string, topic: string): SyllabusTopic | null {
  const normTop = (topic || '').toLowerCase().trim();
  const normSub = (subject || '').toLowerCase().trim();

  for (const country of GLOBAL_CLASSROOM_PROFILES) {
    for (const grade of country.grades) {
      for (const subj of grade.subjects) {
        if (
          subj.id.toLowerCase() === normSub ||
          subj.name.toLowerCase().includes(normSub) ||
          normSub.includes(subj.name.toLowerCase())
        ) {
          for (const term of subj.terms) {
            for (const t of term.topics) {
              if (
                t.title.toLowerCase().includes(normTop) ||
                normTop.includes(t.title.toLowerCase()) ||
                t.id.toLowerCase() === normTop
              ) {
                return t;
              }
            }
          }
        }
      }
    }
  }
  return null;
}

export async function fetchClassroomLesson(
  subject: string,
  topic: string,
  level: string = 'Senior Secondary (SSS / WAEC / JAMB)'
): Promise<ClassroomLesson> {
  // Check if we have verified official syllabus steps for this topic
  const verifiedMatch = findMatchingVerifiedSyllabusTopic(subject, topic);
  if (verifiedMatch && verifiedMatch.steps && verifiedMatch.steps.length > 0) {
    const verifiedLesson: ClassroomLesson = {
      id: `lesson_${verifiedMatch.id}`,
      title: `${verifiedMatch.title}: Digital Chalkboard Masterclass`,
      subject,
      topic: verifiedMatch.title,
      level,
      summary: `Official ${verifiedMatch.syllabusSource} lesson covering ${verifiedMatch.subtopics.join(', ')}.`,
      steps: verifiedMatch.steps.map((st) => ({
        id: st.id,
        stepTitle: st.stepTitle,
        spokenExplanation: st.spokenExplanation,
        chalkboard: {
          heading: st.chalkboard.heading,
          bulletPoints: st.chalkboard.bulletPoints,
          equation: st.chalkboard.equation,
          workedExample: st.chalkboard.workedExample,
          diagram: st.chalkboard.diagram,
          chalkColor: st.chalkboard.chalkColor || 'yellow',
          highlightNote: st.chalkboard.highlightNote,
        },
        quiz: st.quiz,
      })),
      createdAt: Date.now(),
    };
    saveLessonToHistory(verifiedLesson);
    return verifiedLesson;
  }

  // Otherwise, invoke the AI classroom backend generator
  try {
    let token = '';
    if (auth && auth.currentUser) {
      try {
        token = await auth.currentUser.getIdToken();
      } catch {}
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/ai/classroom-lesson', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        subject,
        topic,
        level,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to generate classroom lesson: ${response.status}`);
    }

    const data = await response.json();
    if (data.lesson && data.lesson.steps && data.lesson.steps.length > 0) {
      saveLessonToHistory(data.lesson);
      return data.lesson;
    }
    throw new Error('Invalid lesson structure returned');
  } catch (err) {
    console.warn('API Classroom Lesson generation error, using rich curated lesson:', err);
    const fallback: ClassroomLesson = {
      ...DEFAULT_PHYSICS_LESSON,
      id: `lesson_${Date.now()}`,
      subject,
      topic,
      title: `${topic}: Digital Chalkboard Masterclass`,
      createdAt: Date.now(),
    };
    saveLessonToHistory(fallback);
    return fallback;
  }
}

export async function askClassroomTeacher(
  subject: string,
  topic: string,
  currentStepTitle: string,
  currentStepContent: string,
  question: string,
  isSimplify: boolean = false
): Promise<ClassroomQA> {
  try {
    let token = '';
    if (auth && auth.currentUser) {
      try {
        token = await auth.currentUser.getIdToken();
      } catch {}
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/ai/classroom-ask', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        subject,
        topic,
        currentStepTitle,
        currentStepContent,
        question,
        isSimplify,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to ask teacher');
    }

    const data = await response.json();
    return {
      id: `qa_${Date.now()}`,
      stepId: 1,
      question,
      spokenAnswer: data.spokenAnswer || 'Let us clarify this step on the chalkboard.',
      chalkboardNotes: data.chalkboardNotes || ['Key concept clarified.'],
      clarifyingFormula: data.clarifyingFormula,
      miniExample: data.miniExample,
      timestamp: Date.now(),
    };
  } catch (err) {
    console.warn('Teacher ask API failed, using smart pedagogical answer:', err);
    return {
      id: `qa_${Date.now()}`,
      stepId: 1,
      question,
      spokenAnswer: isSimplify
        ? 'Think of this concept like pushing a heavy shopping cart. If the cart is empty, a light push makes it accelerate quickly. But if it is fully loaded with groceries, you need much more force to achieve that same acceleration!'
        : `Great question about ${topic}! In ${subject}, every formula connects directly to physical reality. Look at the balance of the variables: when one side increases, the other must balance it.`,
      chalkboardNotes: [
        'Analogy: Push a shopping cart (Light cart = high acceleration; Heavy cart = low acceleration)',
        'Core takeaway: Unbalanced force is the sole cause of acceleration!',
      ],
      clarifyingFormula: 'F ∝ a  and  a ∝ 1/m',
      timestamp: Date.now(),
    };
  }
}

export async function saveLessonToHistory(lesson: ClassroomLesson) {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      const list: ClassroomLesson[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter((l) => l.topic !== lesson.topic);
      filtered.unshift(lesson);
      localStorage.setItem(CACHE_KEY, JSON.stringify(filtered.slice(0, 15)));
    } catch {}
  }

  if (auth && auth.currentUser) {
    try {
      const lessonRef = doc(db, 'users', auth.currentUser.uid, 'classroom_lessons', lesson.id);
      await setDoc(lessonRef, {
        ...lesson,
        uid: auth.currentUser.uid,
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (e) {
      console.warn('Could not sync lesson to Firestore:', e);
    }
  }
}

export function getRecentLessons(): ClassroomLesson[] {
  if (typeof window === 'undefined') return [DEFAULT_PHYSICS_LESSON];
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [DEFAULT_PHYSICS_LESSON];
    const list: ClassroomLesson[] = JSON.parse(raw);
    return list.length > 0 ? list : [DEFAULT_PHYSICS_LESSON];
  } catch {
    return [DEFAULT_PHYSICS_LESSON];
  }
}
