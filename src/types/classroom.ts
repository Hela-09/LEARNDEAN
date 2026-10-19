export type ChalkColor = 'white' | 'yellow' | 'cyan' | 'pink' | 'emerald';

export type ChalkboardDiagramType =
  | 'coordinate_graph'
  | 'free_body_diagram'
  | 'flowchart'
  | 'geometry'
  | 'chemical_reaction'
  | 'venn_diagram'
  | 'labeled_sketch'
  | 'circuit';

export interface ChalkboardDiagram {
  type: ChalkboardDiagramType;
  caption: string;
  labels?: string[];
  equation?: string;
  extraInfo?: string;
}

export interface ChalkboardWorkedExample {
  problem: string;
  given?: string;
  solutionSteps: string[];
  answer: string;
}

export interface ChalkboardContent {
  heading: string;
  bulletPoints: string[];
  equation?: string;
  workedExample?: ChalkboardWorkedExample;
  diagram?: ChalkboardDiagram;
  chalkColor?: ChalkColor;
  highlightNote?: string;
}

export interface ClassroomQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ConversationalCheck {
  question: string;
  hint?: string;
  expectedConcept?: string;
}

export interface SimplifiedTerm {
  term: string;
  meaning: string;
}

export interface StepExplanationBreakdown {
  point: string;
  explanation: string;
  example?: string;
  simplifiedTerms?: SimplifiedTerm[];
}

export interface ClassroomStep {
  id: number;
  stepTitle: string;
  spokenExplanation: string;
  chalkboard: ChalkboardContent;
  quiz?: ClassroomQuiz;
  conversationalCheck?: ConversationalCheck;
  explanationBreakdown?: StepExplanationBreakdown[];
}

export interface ClassroomLesson {
  id: string;
  title: string;
  subject: string;
  topic: string;
  subtopic?: string;
  level: string;
  grade?: string;
  age?: number;
  curriculum?: string;
  summary: string;
  steps: ClassroomStep[];
  createdAt: number;
}

export interface BoardPage {
  pageNumber: number;
  stepIndices: number[];
}

export interface ClassroomQA {
  id: string;
  stepId: number;
  question: string;
  status?: 'relevant' | 'unrelated' | 'clarification_needed';
  spokenAnswer: string;
  chalkboardNotes: string[];
  clarifyingFormula?: string;
  miniExample?: string;
  redirectSubject?: string;
  guideBackToTopic?: string;
  timestamp: number;
}

export interface TeacherVoiceOption {
  id: string;
  name: string;
  lang: string;
  gender: 'female' | 'male';
}

// ---------------------------------------------------------------------------
// Theory Assignment & Multimodal (Text, Voice, Handwritten Image) Submission Types
// ---------------------------------------------------------------------------

export interface TheoryAssignmentQuestion {
  id: string;
  questionNumber: number;
  question: string;
  marks: number;
  markingCriteria: string[];
  sampleAnswer?: string;
  hint?: string;
}

export interface TheoryAssignment {
  id: string;
  title: string;
  instructions: string;
  totalMarks: number;
  passPercentage: number;
  questions: TheoryAssignmentQuestion[];
}

export interface StudentAnswerItem {
  type: 'text' | 'voice' | 'image';
  textContent: string;
  images: Array<{ url: string; name?: string }>;
}

export interface QuestionMarkResult {
  questionId: string;
  transcribedAnswer?: string;
  marksAwarded: number;
  marksAvailable: number;
  feedback: string;
  strengths: string[];
  missingPoints: string[];
  suggestedCorrections?: string;
  isHandwritten?: boolean;
  isUnclear?: boolean;
}

export interface TheoryAssignmentSubmissionResult {
  id?: string;
  uid?: string;
  assignmentId: string;
  topicTitle: string;
  subject: string;
  questionResults: Record<string, QuestionMarkResult>;
  totalScore: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  overallFeedback: string;
  areasForRevision: string[];
  isProvisional: boolean;
  submittedAt: number;
  studentAnswers?: Record<string, StudentAnswerItem>;
}
