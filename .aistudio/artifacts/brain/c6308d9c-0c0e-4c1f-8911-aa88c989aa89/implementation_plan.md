# Implementation Plan: LearnDean AI Classroom School Curriculum Upgrade

## 1. Executive Summary & User Alignment

This upgrade transforms **LearnDean AI Classroom** into a complete, curriculum-aligned digital schoolroom. Students can choose their educational path—prioritizing the **Nigerian National Curriculum (WAEC, JAMB, NECO, NERDC)** as well as **Cambridge / IGCSE** and international standards—and be taught topic-by-topic by an AI teacher writing in chalk on an authentic digital chalkboard with synchronized natural voice explanations.

### User Decisions & Clarifications Incorporated:
- **Curricula & Standards**: "Use all" — Default with prioritized Nigerian examination frameworks (JAMB UTME, WAEC WASSCE, NECO SSCE, Junior BECE, Primary), plus international standards (Cambridge IGCSE, SAT, AP) with transparent syllabus verification.
- **Progression Modes**: "Use both" — Support both **Guided Structured Progression** (sequential unlocking of subtopics and assignments upon completion) and **Flexible Open Exploration** (students can browse and study any topic across terms while tracking completion).
- **Assessment & Practice Formats**: "Use all" — Deliver continuous micro concept checks after subtopic explanations, worked exam problems with step-by-step deduction, interactive independent practice, plus end-of-topic comprehensive graded assignments with marking, scores, and feedback.
- **Bug Fix**: Eliminate the React Rules of Hooks error in `VoiceSelectionModal.tsx` by relocating the conditional early return below all `useMemo` and state declarations.

---

## 2. Visual Architecture & Design Language

Adhering to the **Frontend Design Constitution** and **Education & Interactive Simulations** guidelines:

1. **Two-Zone Classroom Layout**:
   - **Main Stage (Chalkboard Canvas)**: 65%–70% of viewport. Realistic chalkboard texture (Blackboard Green `#122319` or Slate Charcoal `#14181c`), deep wood molding, top wall mounting brackets, lower chalk rail with color-coded chalk pieces and felt eraser.
   - **Classroom Deck**: Dedicated control bar (Play, Pause, Resume, Replay Step, Prev, Next, Restart, Speed, Voice) and student interaction dock (Teacher's Words, Ask Question, Explain Simpler, Subtopic Practice, Topic Assignment).
2. **Anti-AI Slop & Zero-Pill Discipline**:
   - No generic colored capsule pill badges. Educational metadata (Curriculum code, Class, Term, Exam Board) is rendered as clean, unboxed typography with semantic middle dots (`·`) and subtle borders.
   - Formatted mathematical formulas use dedicated chalk math styling (`KaTeX`/serif math rendering) and SVG chalk sketches for geometric and scientific diagrams.
3. **Multi-Page Chalkboard Memory**:
   - Everything already written on the board stays visible as the lesson proceeds.
   - When the chalkboard capacity is filled, it automatically moves to a new page (`Board Page 2`, `Board Page 3`), preserving previous pages.
   - Instant tab navigation allows students to flip back to earlier board pages at any time.

---

## 3. System Architecture & Data Modeling

### A. Curriculum & Syllabus Hierarchy (`src/types/curriculum.ts` & `src/data/educationCurricula.ts`)
- **Country**: Nigeria, United Kingdom, United States, International, India.
- **Level & Exam Track**: Senior Secondary (SSS 1–3, WAEC, NECO), Tertiary Entrance (JAMB UTME), Junior Secondary (JSS 1–3, BECE), Primary.
- **Term Structure**: Term 1, Term 2, Term 3, or Full Syllabus Track.
- **Syllabus Module**:
  - `id`, `title`, `term`, `orderIndex`
  - `objectives`: Specific behavioral learning objectives
  - `subtopics`: Breakdown of key units
  - `workedExamples`: Step-by-step problems
  - `practiceQuestions`: Self-test questions
  - `assignment`: Formal end-of-topic assignment (multi-part, marked out of 100)

### B. Classroom Step & Board Pages (`src/types/classroom.ts`)
- `ClassroomStep`:
  - `id`: number
  - `subtopicId`: string
  - `stepTitle`: string
  - `spokenExplanation`: natural conversational classroom explanation
  - `chalkboard`: `{ heading, bulletPoints, equation?, diagram?, workedExample?, chalkColor, highlightNote? }`
  - `microCheck?`: single question comprehension test

### C. Student Progress & Firebase Storage Schema
Collection: `users/{userId}/classroom_progress/{subject_curriculum_id}`
- `curriculumId`: e.g., `'ng_waec_physics'`
- `currentTerm`: 1 | 2 | 3
- `currentTopicId`: string
- `currentStepIndex`: number
- `completedTopics`: string[]
- `completedSubtopics`: string[]
- `assignmentScores`: Record<string, { score: number; maxScore: number; submittedAt: number; feedback: string }>
- `mode`: `'guided'` | `'open'`
- `voicePreference`: `{ voiceName: string; speed: number; isMuted: boolean }`

---

## 4. Component & Integration Breakdown

### Phase 1: Fix React Rules of Hooks Bug
- **File**: `src/components/classroom/VoiceSelectionModal.tsx`
- **Issue**: `if (!isOpen) return null;` occurs on line 63, prior to `useMemo` on line 65.
- **Fix**: Move `filteredVoices = useMemo(...)` to the top level of the component before any early return statement. Ensure zero conditional Hook calls.

### Phase 2: Curriculum & Syllabus Navigation System
- **New Component**: `src/components/classroom/CurriculumSyllabusSelector.tsx`
  - Country, Education Level, Class, Curriculum, Subject, and Academic Term selector.
  - Full Course Outline accordion showing terms, topics, subtopics, learning objectives, and completion status.
  - Mode toggle: **Guided Progression** (unlocking as assignments are passed) vs. **Flexible Open Syllabus**.
  - Direct launch: "Teach Topic in Classroom".

### Phase 3: Realistic Chalkboard & Audio Pacing Engine
- **File**: `src/components/classroom/ChalkboardView.tsx`
  - Preserve all earlier step text on the current page while rendering new steps with chalk handwriting animations.
  - Page overflow detection creates and preserves `Board Page 1`, `Board Page 2`, etc.
  - Direct page navigation tabs with indicators showing which page is actively being written.
- **File**: `src/hooks/useChalkboardSpeech.ts`
  - Web Speech API integration that filters and presents genuine supported browser voices.
  - Real-time word/sentence boundary synchronization with chalk stroke sound effects.
  - Graceful audio error handling and offline fallback pacing.

### Phase 4: Subtopic Practice & Topic Assignment System
- **Component**: `src/components/classroom/ClassroomPracticeModal.tsx`
  - Independent student practice after subtopic explanations.
  - Step-by-step correction and explanation on incorrect answers without revealing answers prematurely.
- **Component**: `src/components/classroom/ClassroomAssignmentModal.tsx`
  - End-of-topic homework and assessment with submission, marking, percentage score, XP award, and personalized teacher remarks.
  - Retest option with revision guidance for weak areas.

### Phase 5: Student Progress Persistence & Resume
- **File**: `src/services/classroomProgressService.ts`
  - Two-way sync: Firestore (`users/{uid}/classroom_progress`) with automatic local fallback in `localStorage`.
  - Seamless resumption: preserves current term, topic, board page, and step when navigating or refreshing.

### Phase 6: Old AI Tutor Replacement & Link Cleanup
- Verify that all AI Tutor references throughout LearnDean (Sidebar, BottomNav, LearnHub, Home, Subjects, Study Journey, Profile) seamlessly open AI Classroom.
- Maintain legacy conversation records drawer for students who had old AI Tutor sessions.

---

## 5. Verification & Testing Plan

1. **Compilation & Linting**:
   - Run `compile_applet` and `lint_applet` to ensure 0 TypeScript or build errors.
2. **Hook Testing**:
   - Repeatedly open and close `VoiceSelectionModal`, change voices, search voices, and verify no "Rendered more hooks" errors occur.
3. **Curriculum Journey**:
   - Choose Nigeria -> Senior Secondary (SSS 2) -> WAEC WASSCE -> Physics -> Term 1.
   - Verify topics load in syllabus order with verified objectives and course outline.
4. **Chalkboard & Audio Sync**:
   - Start a lesson; test Play, Pause, Resume, Replay Step, Prev Step, Next Step.
   - Verify handwriting animation progresses with spoken audio.
   - Trigger page overflow and navigate between Board Page 1 and Board Page 2.
5. **Practice & Assignment**:
   - Complete subtopic practice; verify correct and incorrect feedback.
   - Submit end-of-topic assignment; verify grading score and teacher comments.
6. **Progress Persistence**:
   - Refresh the browser; verify that student curriculum, topic position, and completed tasks are restored from Firestore/localStorage.
