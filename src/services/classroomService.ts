import {
  ClassroomLesson,
  ClassroomQA,
  TheoryAssignment,
  StudentAnswerItem,
  TheoryAssignmentSubmissionResult,
} from '../types/classroom';
import {
  DEFAULT_PHYSICS_LESSON,
  DEFAULT_PHOTOSYNTHESIS_LESSON,
  generateCuratedCurriculumLesson,
} from '../utils/classroomDefaults';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  GLOBAL_CLASSROOM_PROFILES,
  SyllabusTopic,
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
  subtopic?: string,
  level: string = 'Secondary Education',
  grade?: string,
  age?: number,
  curriculum?: string
): Promise<ClassroomLesson> {
  // If not a custom subtopic and matches an official verified syllabus topic, we can check for verified steps
  if (!subtopic) {
    const normTop = (topic || '').toLowerCase().trim();
    const normSub = (subject || '').toLowerCase().trim();
    if (
      normTop === 'photosynthesis' ||
      normTop.includes('photosynthesis') ||
      (normSub.includes('bio') && normTop.includes('photo'))
    ) {
      const photoLesson: ClassroomLesson = {
        ...DEFAULT_PHOTOSYNTHESIS_LESSON,
        level: level || 'Secondary Education',
        grade: grade || '',
        age,
        curriculum: curriculum || '',
      };
      saveLessonToHistory(photoLesson);
      return photoLesson;
    }

    const verifiedMatch = findMatchingVerifiedSyllabusTopic(subject, topic);
    if (verifiedMatch && verifiedMatch.steps && verifiedMatch.steps.length > 0) {
      const verifiedLesson: ClassroomLesson = {
        id: `lesson_${verifiedMatch.id}`,
        title: `${verifiedMatch.title}: Digital Chalkboard Masterclass`,
        subject,
        topic: verifiedMatch.title,
        subtopic: '',
        level,
        grade: grade || '',
        age,
        curriculum: curriculum || '',
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
          conversationalCheck: {
            question: `In your own words, what is the core idea of ${st.stepTitle}?`,
            hint: 'Think about how this applies to everyday life or practical problems.',
          },
        })),
        createdAt: Date.now(),
      };
      saveLessonToHistory(verifiedLesson);
      return verifiedLesson;
    }
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
        subtopic,
        level,
        grade,
        age,
        curriculum,
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
    const fallback: ClassroomLesson = generateCuratedCurriculumLesson(subject, topic, level);
    fallback.subtopic = subtopic;
    fallback.grade = grade;
    saveLessonToHistory(fallback);
    return fallback;
  }
}

export async function askClassroomTeacher(
  subject: string,
  topic: string,
  subtopic: string | undefined,
  currentStepTitle: string,
  currentStepContent: string,
  question: string,
  isSimplify: boolean = false,
  previousQAs: Array<{ question: string; spokenAnswer: string }> = [],
  educationLevel: string = 'Secondary Education'
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
        subtopic,
        currentStepTitle,
        currentStepContent,
        question,
        isSimplify,
        previousQAs,
        educationLevel,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to ask teacher (${response.status})`);
    }

    const data = await response.json();
    return {
      id: `qa_${Date.now()}`,
      stepId: 1,
      question,
      status: data.status || 'relevant',
      spokenAnswer: data.spokenAnswer || `Let us address your question regarding ${topic}.`,
      chalkboardNotes: data.chalkboardNotes || [`Analysis of: ${question.slice(0, 45)}...`],
      clarifyingFormula: data.clarifyingFormula,
      miniExample: data.miniExample,
      redirectSubject: data.redirectSubject,
      guideBackToTopic: data.guideBackToTopic,
      timestamp: Date.now(),
    };
  } catch (err) {
    console.warn('Teacher ask API failed, synthesizing contextual pedagogical response:', err);

    // Highly responsive, question-aware pedagogical synthesizer with subject relevance detection
    const cleanQ = question.trim();
    const lowerQ = cleanQ.toLowerCase();
    const normSub = subject.toLowerCase();

    // Check for obvious cross-subject mismatch in fallback (e.g. asking literature in science or accounting in literature)
    const isLitQuery = /literature|romeo|juliet|shakespeare|poetry|poem|novel|sonnet|soliloquy|macbeth/i.test(lowerQ);
    const isScienceClass = /biology|physics|chemistry|mathematics|general science/i.test(normSub);

    if (isLitQuery && isScienceClass) {
      return {
        id: `qa_${Date.now()}`,
        stepId: 1,
        question,
        status: 'unrelated',
        spokenAnswer: `That's an interesting question! However, we're currently in ${subject} class learning about ${topic}. Let's stay focused on this topic for now. You can explore Literature in the appropriate class.`,
        chalkboardNotes: [
          `Classroom Focus: ${subject} — ${topic}`,
          `Current Subtopic: ${currentStepTitle}`,
          `Tip: Save Literature questions for your Literature class session!`,
        ],
        redirectSubject: 'Literature in English',
        guideBackToTopic: `Let's continue with our notes on ${currentStepTitle}.`,
        timestamp: Date.now(),
      };
    }

    const isAmbiguous = cleanQ.length < 15 && /^(what about it\??|why\??|is it\??|can it\??|the other one\??)$/i.test(cleanQ);
    if (isAmbiguous) {
      return {
        id: `qa_${Date.now()}`,
        stepId: 1,
        question,
        status: 'clarification_needed',
        spokenAnswer: `Could you clarify which part of ${topic} you'd like me to explain? For example, are you asking about the formula, the definition, or the worked example?`,
        chalkboardNotes: [
          `Clarification: Please specify the aspect of ${topic} you'd like explained`,
        ],
        timestamp: Date.now(),
      };
    }

    const isDefinition = /what is|what are|define|meaning of|explain the term|stand for/i.test(lowerQ);
    const isCalculation = /how (to|do we|can i) (calculate|solve|find|compute|determine)|steps to/i.test(lowerQ);
    const isWhy = /why does|why do|why is|why are|reason for|cause of/i.test(lowerQ);
    const isDifference = /difference between|distinguish|compare|versus|vs/i.test(lowerQ);
    const isFormula = /formula|equation|law of|relationship between|expression for/i.test(lowerQ);
    const isExample = /example|illustration|instance|sample problem/i.test(lowerQ);

    let spoken = '';
    let notes: string[] = [];
    let formula: string | undefined = undefined;
    let miniEx: string | undefined = undefined;

    if (isSimplify) {
      spoken = `To picture this simply in everyday life: think of ${topic} like a familiar system you interact with daily. When you consider "${cleanQ}", remove the heavy jargon and focus on the primary cause and its direct observable effect.`;
      notes = [
        `Intuitive Model: Relate ${cleanTopic(topic)} to everyday observable reality`,
        `Core Rule: Identify the primary input and the single direct result`,
      ];
    } else if (isDefinition) {
      spoken = `To define this clearly for your ${educationLevel} studies: "${cleanQ.replace(/^(what is|what are|define|explain)\s*/i, '')}" refers to the fundamental concept in ${topic} that establishes the standard behavior under study.`;
      notes = [
        `Definition: ${cleanQ}`,
        `Context: Core terminology within ${topic} (${subject})`,
        `Key rule: Use standard academic terminology and appropriate units`,
      ];
    } else if (isCalculation) {
      spoken = `When calculating this in ${subject}, always follow a systematic 4-step sequence: first, write out all given data with units; second, select the governing formula; third, substitute values step by step; and fourth, state the final answer with its correct unit.`;
      notes = [
        `Step 1: List given parameters & target variable with units`,
        `Step 2: State governing equation from ${topic}`,
        `Step 3: Substitute values and compute step-by-step`,
        `Step 4: Check dimensional consistency and final units`,
      ];
      formula = 'Final Answer = Formula(Known Parameters) [with units]';
      miniEx = 'Always check whether any mass needs conversion to kilograms or seconds!';
    } else if (isWhy) {
      spoken = `That is an insightful question about why this occurs in ${topic}. The underlying reason is governed by the fundamental equilibrium and conservation principles of ${subject}.`;
      notes = [
        `Cause & Effect: Why this phenomenon occurs in ${topic}`,
        `Governing Factor: Conservation and dynamic equilibrium`,
      ];
    } else if (isDifference) {
      spoken = `To clearly distinguish these in your examinations: compare their definitions, their physical or logical behavior, and their operational units. Present your contrast point by point.`;
      notes = [
        `Distinction 1: Differences in definition and origin`,
        `Distinction 2: Differences in properties and mathematical formulation`,
      ];
    } else if (isFormula) {
      spoken = `Regarding the formula for "${cleanQ}": in ${topic}, the mathematical expression anchors directly to the fundamental law on our chalkboard. Remember that all variables must match standard reference units before calculating.`;
      notes = [
        `Governing Relationship: Key equation for ${topic}`,
        `Variable identification: Define each symbol and its unit`,
      ];
      formula = 'Target Variable = f(Independent Variables)';
    } else if (isExample) {
      spoken = `Here is a clear, practical example to illustrate your question about "${cleanQ}": imagine a real-world scenario where the conditions of ${topic} apply directly. Tracing the steps makes the abstract theory concrete.`;
      notes = [
        `Illustrative Example: Real-world manifestation of ${topic}`,
        `Working: Given conditions -> Applied rule -> Concrete outcome`,
      ];
      miniEx = `Practical test: Testing this principle under standard conditions verifies our chalkboard notes.`;
    } else {
      spoken = `Regarding your question on "${cleanQ}": in ${subject} at the ${educationLevel} level, this concept is directly tied to the notes we wrote on the board for ${topic}. Always anchor your answer to the foundational principle.`;
      notes = [
        `Key Principle: ${cleanTopic(topic)}`,
        `Application to your query: "${cleanQ.slice(0, 50)}"`,
      ];
    }

    return {
      id: `qa_${Date.now()}`,
      stepId: 1,
      question,
      status: 'relevant',
      spokenAnswer: spoken,
      chalkboardNotes: notes,
      clarifyingFormula: formula,
      miniExample: miniEx,
      timestamp: Date.now(),
    };
  }
}

// ---------------------------------------------------------------------------
// Theory Assignment API Services
// ---------------------------------------------------------------------------

export async function fetchTheoryAssignment(
  subject: string,
  topic: string,
  subtopic?: string,
  level: string = 'Secondary Education',
  grade?: string,
  curriculum?: string,
  questionCount: number = 3
): Promise<TheoryAssignment> {
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

    const response = await fetch('/api/ai/classroom-assignment', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        subject,
        topic,
        subtopic,
        level,
        grade,
        curriculum,
        questionCount,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate theory assignment: ${response.status}`);
    }

    const data = await response.json();
    if (data.assignment && Array.isArray(data.assignment.questions)) {
      return data.assignment;
    }
    throw new Error('Invalid assignment structure returned');
  } catch (err) {
    console.warn('API theory assignment generation error, falling back to rich curated theory:', err);
    return {
      id: `asg_${Date.now()}`,
      title: `Theory Examination: ${topic}`,
      instructions: 'Answer all theory questions in detail. You can type your answers, record spoken answers, or photograph your handwritten working on paper.',
      totalMarks: 30,
      passPercentage: 60,
      questions: [
        {
          id: 'q1',
          questionNumber: 1,
          question: `State the fundamental principles and definition of ${topic} in ${subject}. Explain why this concept is essential.`,
          marks: 10,
          markingCriteria: [
            'Comprehensive and accurate definition (4 marks)',
            'Explanation of core mechanism and scope (3 marks)',
            'Standard terminology and units (3 marks)',
          ],
          sampleAnswer: `The concept of ${topic} describes the fundamental behavior and governing relations in ${subject}. Full understanding requires correct terminology and units.`,
          hint: 'State the formal definition first, then outline its significance.',
        },
        {
          id: 'q2',
          questionNumber: 2,
          question: `Describe a practical, real-world application or worked scenario illustrating ${topic}. Explain step by step how the principles apply.`,
          marks: 10,
          markingCriteria: [
            'Identification of relevant scenario (3 marks)',
            'Step-by-step application of principles (4 marks)',
            'Logical conclusion and accuracy (3 marks)',
          ],
          sampleAnswer: `In everyday applications, ${topic} manifests directly through observable changes and measurable parameters.`,
          hint: 'Think of an everyday scenario where this concept is demonstrated in action.',
        },
        {
          id: 'q3',
          questionNumber: 3,
          question: `Contrast the main factors influencing ${topic} and discuss common misconceptions or errors students make in examinations.`,
          marks: 10,
          markingCriteria: [
            'Clear contrast of factors (4 marks)',
            'Analysis of examination traps or misconceptions (3 marks)',
            'Proposed corrective guidelines (3 marks)',
          ],
          sampleAnswer: `A common error is confusing the primary cause with secondary effects. Proper distinction ensures full marks.`,
          hint: 'Highlight what examiners frequently check and where mistakes occur.',
        },
      ],
    };
  }
}

export async function submitTheoryAssignmentForMarking(
  subject: string,
  topic: string,
  level: string,
  grade: string,
  assignment: TheoryAssignment,
  answers: Record<string, StudentAnswerItem>
): Promise<TheoryAssignmentSubmissionResult> {
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

    const response = await fetch('/api/ai/classroom-mark-theory', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        subject,
        topic,
        level,
        grade,
        assignment,
        answers,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Failed to mark theory assignment: ${response.status}`);
    }

    const data: TheoryAssignmentSubmissionResult = await response.json();
    data.assignmentId = assignment.id;
    data.topicTitle = topic;
    data.subject = subject;
    data.submittedAt = Date.now();
    data.studentAnswers = answers;

    // Persist to Firebase / Firestore securely
    if (auth && auth.currentUser) {
      data.uid = auth.currentUser.uid;
      const subId = `sub_${assignment.id}_${Date.now()}`;
      data.id = subId;
      try {
        const subRef = doc(db, 'classroom_submissions', subId);
        await setDoc(subRef, {
          ...data,
          uid: auth.currentUser.uid,
          updatedAt: Date.now(),
        }, { merge: true });
      } catch (e) {
        console.warn('Failed to sync theory submission to Firestore:', e);
      }
    }

    // Save to local storage cache for instant offline retrieval
    if (typeof window !== 'undefined') {
      try {
        const key = `learndean_theory_submissions_${auth?.currentUser?.uid || 'guest'}`;
        const raw = localStorage.getItem(key);
        const list: TheoryAssignmentSubmissionResult[] = raw ? JSON.parse(raw) : [];
        list.unshift(data);
        localStorage.setItem(key, JSON.stringify(list.slice(0, 20)));
      } catch {}
    }

    return data;
  } catch (err: any) {
    console.error('Error submitting theory assignment:', err);
    throw err;
  }
}

function cleanTopic(t: string): string {
  return t ? t.replace(/[:\-]/g, ' ').trim() : 'this topic';
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

export function convertTopicAssignmentToTheoryAssignment(
  topicAssignment: any,
  topicTitle: string
): TheoryAssignment {
  if (topicAssignment && Array.isArray(topicAssignment.questions) && topicAssignment.questions.length > 0) {
    return topicAssignment as TheoryAssignment;
  }

  if (topicAssignment && Array.isArray(topicAssignment.structuredQuestions) && topicAssignment.structuredQuestions.length > 0) {
    return {
      id: topicAssignment.id || `asg_${Date.now()}`,
      title: topicAssignment.title || `Theory Examination: ${topicTitle}`,
      instructions: topicAssignment.instructions || 'Answer all questions thoroughly showing step-by-step working, principles, and diagrams where required.',
      totalMarks: topicAssignment.totalMarks || 30,
      passPercentage: topicAssignment.passPercentage || 60,
      questions: topicAssignment.structuredQuestions.map((q: any, idx: number) => ({
        id: q.id || `q_${idx + 1}`,
        questionNumber: idx + 1,
        question: q.question,
        marks: q.totalMarks || 10,
        markingCriteria: Array.isArray(q.rubric)
          ? q.rubric.map((r: any) => `${r.step} (${r.marks} marks)`)
          : ['Comprehensive definition and theory (4m)', 'Accurate calculation/derivation (4m)', 'Units and clarity (2m)'],
        sampleAnswer: q.sampleSolution,
        hint: q.givenData ? `Given data: ${q.givenData}` : undefined,
      })),
    };
  }

  return {
    id: `asg_${Date.now()}`,
    title: `Theory Examination: ${topicTitle}`,
    instructions: 'Answer all theory questions in detail. You can type your answers, speak them using your microphone, or upload handwritten notes.',
    totalMarks: 30,
    passPercentage: 60,
    questions: [
      {
        id: 'q1',
        questionNumber: 1,
        question: `State the fundamental definitions, scientific laws, or governing principles of ${topicTitle}. Explain their core significance.`,
        marks: 10,
        markingCriteria: [
          'Comprehensive and accurate definition (4 marks)',
          'Explanation of mechanisms and scope (3 marks)',
          'Standard scientific terminology and units (3 marks)',
        ],
        sampleAnswer: `The study of ${topicTitle} provides the foundational framework for analyzing physical and analytical systems.`,
        hint: 'State the precise definition first, then highlight its key features.',
      },
      {
        id: 'q2',
        questionNumber: 2,
        question: `Present a practical, real-world scenario or worked example illustrating ${topicTitle}. Detail the step-by-step resolution.`,
        marks: 10,
        markingCriteria: [
          'Identification of realistic scenario (3 marks)',
          'Step-by-step problem breakdown (4 marks)',
          'Accurate evaluation and units (3 marks)',
        ],
        sampleAnswer: `In everyday life, ${topicTitle} is observed whenever changes in equilibrium, forces, or reactions take place.`,
        hint: 'Walk through given parameters, applicable formulas, and final outcome.',
      },
      {
        id: 'q3',
        questionNumber: 3,
        question: `Compare the primary factors influencing ${topicTitle} and discuss frequent student pitfalls or misconceptions in examination questions.`,
        marks: 10,
        markingCriteria: [
          'Clear contrast of governing factors (4 marks)',
          'Analysis of examination traps or misconceptions (3 marks)',
          'Prescribed corrective methodology (3 marks)',
        ],
        sampleAnswer: `Examiners frequently penalize confusing scalar with vector quantities or omitting base units.`,
        hint: 'Focus on what markers look for and common points lost.',
      },
    ],
  };
}

