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

export interface ClassroomStep {
  id: number;
  stepTitle: string;
  spokenExplanation: string;
  chalkboard: ChalkboardContent;
  quiz?: ClassroomQuiz;
}

export interface ClassroomLesson {
  id: string;
  title: string;
  subject: string;
  topic: string;
  level: string;
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
  spokenAnswer: string;
  chalkboardNotes: string[];
  clarifyingFormula?: string;
  miniExample?: string;
  timestamp: number;
}

export interface TeacherVoiceOption {
  id: string;
  name: string;
  lang: string;
  gender: 'female' | 'male';
}
