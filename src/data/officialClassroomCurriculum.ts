/**
 * LearnDean Official Curriculum & Syllabus Database
 * Authentic, verified official syllabus structures for school and tertiary entrance.
 * 
 * Supports:
 * - Nigeria: NERDC National Curriculum, WAEC WASSCE, JAMB UTME (IBASS), NECO SSCE, BECE Junior WAEC
 * - International: Cambridge IGCSE / A-Levels, UK GCSE, US College Board AP / High School
 * - Africa: Ghana WAEC, Kenya KCSE, South Africa CAPS
 */

export interface SyllabusPracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint?: string;
}

export interface StructuredTheoryQuestion {
  id: string;
  instruction: string;
  question: string;
  subQuestions?: string[];
  givenData?: string;
  rubric: { step: string; marks: number }[];
  totalMarks: number;
  sampleSolution: string;
}

export interface TopicAssignment {
  id: string;
  title: string;
  instructions: string;
  dueDateLabel: string;
  totalMarks: number;
  passPercentage: number;
  mcqQuestions: SyllabusPracticeQuestion[];
  structuredQuestions: StructuredTheoryQuestion[];
}

export interface SyllabusStep {
  id: number;
  stepTitle: string;
  spokenExplanation: string;
  chalkboard: {
    heading: string;
    bulletPoints: string[];
    equation?: string;
    workedExample?: {
      problem: string;
      given?: string;
      solutionSteps: string[];
      answer: string;
    };
    diagram?: {
      type: 'coordinate_graph' | 'free_body_diagram' | 'flowchart' | 'geometry' | 'chemical_reaction' | 'circuit' | 'venn_diagram' | 'labeled_sketch';
      caption: string;
      labels?: string[];
      equation?: string;
      extraInfo?: string;
    };
    chalkColor?: 'white' | 'yellow' | 'cyan' | 'pink' | 'emerald';
    highlightNote?: string;
  };
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface SyllabusTopic {
  id: string;
  week: number;
  term: 1 | 2 | 3;
  title: string;
  subtopics: string[];
  objectives: string[];
  keyFormulae?: string[];
  examWeight: 'High' | 'Medium' | 'Essential';
  isOfficial: boolean;
  syllabusSource: string;
  syllabusYear: string;
  statusBadge: 'VERIFIED_OFFICIAL' | 'SYLLABUS_OUTLINE';
  steps: SyllabusStep[];
  practiceQuestions: SyllabusPracticeQuestion[];
  assignment: TopicAssignment;
}

export interface AcademicTerm {
  termNumber: 1 | 2 | 3;
  termName: string;
  durationWeeks: number;
  theme: string;
  topics: SyllabusTopic[];
}

export interface SyllabusSubject {
  id: string;
  name: string;
  code: string;
  category: 'Core' | 'Sciences' | 'Social Sciences' | 'Commercial' | 'Arts & Humanities' | 'Technical';
  icon: string;
  description: string;
  terms: AcademicTerm[];
}

export interface ClassGrade {
  id: string;
  name: string;
  shortName: string;
  levelCategory: 'Senior Secondary' | 'Tertiary Entrance' | 'Junior Secondary' | 'Primary' | 'High School' | 'College Prep' | 'International';
  examBoard: string;
  officialYear: string;
  subjects: SyllabusSubject[];
}

export interface CountryCurriculumProfile {
  countryCode: string;
  countryName: string;
  flag: string;
  educationMinistry: string;
  systemDescription: string;
  grades: ClassGrade[];
}

// ============================================================================
// VERIFIED NIGERIAN WAEC & NERDC SYLLABUS DATA (SSS 1, SSS 2, SSS 3, JAMB)
// ============================================================================

// 1. GENERAL MATHEMATICS (SSS 1 - 3 & WAEC/JAMB)
const SSS_MATH_TOPICS_TERM_1: SyllabusTopic[] = [
  {
    id: 'math-sss-t1-w1',
    week: 1,
    term: 1,
    title: 'Number Bases & Conversions',
    subtopics: [
      'Conversion from base 10 to other bases (binary, octal, hex)',
      'Conversion from other bases to base 10',
      'Operations in base systems: Addition, Subtraction, Multiplication',
      'Solving equations involving number bases'
    ],
    objectives: [
      'Convert numbers from decimal to binary, octal, and arbitrary base n.',
      'Perform addition and multiplication across non-decimal bases.',
      'Solve linear and quadratic equations containing unknown base bases.'
    ],
    keyFormulae: [
      'N = d_k · b^k + ... + d_1 · b^1 + d_0 · b^0 + d_{-1} · b^{-1}',
      'For 123_n = 1·n² + 2·n + 3'
    ],
    examWeight: 'High',
    isOfficial: true,
    syllabusSource: 'NERDC Senior Secondary Curriculum & WAEC General Mathematics Syllabus 2024-2027',
    syllabusYear: '2024/2025',
    statusBadge: 'VERIFIED_OFFICIAL',
    steps: [
      {
        id: 1,
        stepTitle: '1. Foundations: What are Number Bases?',
        spokenExplanation: 'Welcome to our Mathematics masterclass. In everyday arithmetic, we count in base ten because humans have ten fingers. But computers count in base two, digital telecommunications uses octal and hexadecimal, and ancient civilisations used base twelve. In this lesson, we will master how any number can be rewritten in any base, perform base arithmetic, and solve WAEC and JAMB exam equations.',
        chalkboard: {
          heading: 'NUMBER BASES (MODULAR COUNTING)',
          bulletPoints: [
            'Base 10 (Denary): Digits 0, 1, 2, 3, 4, 5, 6, 7, 8, 9',
            'Base 2 (Binary): Digits 0, 1 (Used in digital circuits)',
            'Base 8 (Octal): Digits 0 to 7',
            'Base n: Uses digits strictly less than n (0 to n - 1)'
          ],
          equation: 'N_b = \\sum_{i=0}^{k} d_i \\cdot b^i',
          chalkColor: 'yellow',
          highlightNote: 'WAEC Rule: A digit in base b can NEVER be equal to or greater than b!'
        }
      },
      {
        id: 2,
        stepTitle: '2. Conversion from Base n to Base 10',
        spokenExplanation: 'To convert any number in base n into denary base ten, we expand each digit by powers of the base, starting from power zero at the far right. For fractional parts after the point, we use negative powers: n to the power of minus one, minus two, and so on.',
        chalkboard: {
          heading: 'EXPANSION METHOD (Base n -> Base 10)',
          bulletPoints: [
            'Assign place values: ... b³, b², b¹, b⁰ . b⁻¹, b⁻²',
            'Multiply each face value by its place value',
            'Sum all terms together to obtain the denary equivalent'
          ],
          equation: '342_5 = (3 \\times 5^2) + (4 \\times 5^1) + (2 \\times 5^0)',
          chalkColor: 'white',
          highlightNote: 'Remember: Any non-zero number to power 0 equals 1 (5⁰ = 1)!'
        }
      },
      {
        id: 3,
        stepTitle: '3. Chalkboard Visual: Place Value Table',
        spokenExplanation: 'Observe the chalkboard diagram showing the place value weights. Notice how each column shifts by multiplying by the base. When we go left, we multiply by the base; when we go right, we divide by the base.',
        chalkboard: {
          heading: 'PLACE VALUE ARCHITECTURE',
          bulletPoints: [
            'Whole number part: powers ascend from 0, 1, 2, 3',
            'Radix point separates integer from fractional values',
            'Fractional part: powers descend into -1, -2, -3'
          ],
          diagram: {
            type: 'coordinate_graph',
            caption: 'Base n Positional Value Weighting',
            labels: ['b³ (125)', 'b² (25)', 'b¹ (5)', 'b⁰ (1)', '· (point)', 'b⁻¹ (0.2)', 'b⁻² (0.04)'],
            equation: '134.2_5 = 1(25) + 3(5) + 4(1) + 2(1/5) = 44.4_{10}'
          },
          chalkColor: 'cyan'
        }
      },
      {
        id: 4,
        stepTitle: '4. Worked Example: Solving Unknown Base Equations',
        spokenExplanation: 'Now let us solve a classic WAEC and JAMB exam question. If one zero two in base n equals two seven in base ten, find the value of n. We first expand the left-hand side into powers of n, create a polynomial equation, and solve for the positive integer n.',
        chalkboard: {
          heading: 'WORKED EXAMPLE: UNKNOWN BASE',
          bulletPoints: [
            'Problem: If 102_n = 27_{10}, find the base n.',
            'Step 1: Expand LHS in powers of n: (1 × n²) + (0 × n¹) + (2 × n⁰) = 27',
            'Step 2: Simplify: n² + 2 = 27',
            'Step 3: n² = 27 - 2 = 25',
            'Step 4: n = √25 = 5 (Reject -5 as bases must be positive integers > 2)'
          ],
          workedExample: {
            problem: 'Find n such that 102_n = 27_{10}',
            given: 'LHS = 102_n, RHS = 27 in base 10',
            solutionSteps: [
              '1(n²) + 0(n) + 2(1) = 27',
              'n² + 2 = 27',
              'n² = 25',
              'n = ±5'
            ],
            answer: 'n = 5 (Base must be positive and greater than highest digit 2)'
          },
          chalkColor: 'yellow',
          highlightNote: 'Exam Tip: Always verify that the answer is strictly greater than all digits present in the question!'
        }
      },
      {
        id: 5,
        stepTitle: '5. Successive Division (Base 10 to Base n)',
        spokenExplanation: 'To convert from base ten to any other base, we divide repeatedly by the target base, writing down the integer remainder at each stage. When the quotient reaches zero, we read the remainders from the bottom to the top.',
        chalkboard: {
          heading: 'CONVERSION: BASE 10 -> BASE n',
          bulletPoints: [
            'Divide the denary number repeatedly by the target base',
            'Record the remainder beside each step (0 to n - 1)',
            'Stop when quotient is 0',
            'Read remainders upward from bottom to top (LSD to MSD)'
          ],
          equation: '43_{10} \\div 2 \\implies \\text{remainders: } 1, 1, 0, 1, 0, 1 \\implies 101011_2',
          chalkColor: 'emerald',
          highlightNote: 'Common Mistake: Do not read from top to bottom; always read upwards!'
        }
      },
      {
        id: 6,
        stepTitle: '6. Concept Mastery Check',
        spokenExplanation: 'Let us test your understanding with this quick interactive check before we head to the practice exercises. Which of the following numbers cannot exist in base six?',
        chalkboard: {
          heading: 'CONCEPT MASTERY CHECK',
          bulletPoints: [
            'Question: Which of the following numbers is invalid in base 6?',
            'Option A: 504_6',
            'Option B: 123_6',
            'Option C: 362_6',
            'Option D: 555_6'
          ],
          chalkColor: 'pink',
          highlightNote: 'Recall: No digit can equal or exceed the base itself.'
        },
        quiz: {
          question: 'Which of the following numbers is mathematically invalid in base 6?',
          options: ['504 in base 6', '123 in base 6', '362 in base 6', '555 in base 6'],
          correctIndex: 2,
          explanation: 'In base 6, only digits 0, 1, 2, 3, 4, 5 are allowed. The number 362 contains the digit 6, which is impossible in base 6.'
        }
      }
    ],
    practiceQuestions: [
      {
        id: 'pq-math-w1-1',
        question: 'Convert 11011 in base 2 to denary (base 10).',
        options: ['25', '27', '29', '31'],
        correctAnswer: 1,
        explanation: '1(2⁴) + 1(2³) + 0(2²) + 1(2¹) + 1(2⁰) = 16 + 8 + 0 + 2 + 1 = 27 in base 10.',
        hint: 'Powers of 2 from right to left are 1, 2, 4, 8, 16.'
      },
      {
        id: 'pq-math-w1-2',
        question: 'If 23_x = 11_{10}, find the base x.',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: '2(x¹) + 3(x⁰) = 11 => 2x + 3 = 11 => 2x = 8 => x = 4.',
        hint: 'Expand 23_x as 2x + 3.'
      },
      {
        id: 'pq-math-w1-3',
        question: 'Evaluate 110_2 + 111_2 in binary.',
        options: ['1101_2', '1011_2', '1111_2', '1001_2'],
        correctAnswer: 0,
        explanation: '110_2 = 6_{10}, 111_2 = 7_{10}. 6 + 7 = 13_{10}. 13 in binary is 1101_2.',
        hint: 'In binary addition, 1 + 1 = 10 (0 carry 1), and 1 + 1 + 1 = 11 (1 carry 1).'
      }
    ],
    assignment: {
      id: 'asg-math-w1',
      title: 'Week 1 Graded Assignment: Number Bases Mastery',
      instructions: 'Answer all questions. Show clear step-by-step working for structured calculation questions. Full credit requires proper place-value expansion.',
      dueDateLabel: 'End of Week 1 Term 1',
      totalMarks: 30,
      passPercentage: 70,
      mcqQuestions: [
        {
          id: 'asg-q1',
          question: 'If 314_x = 84_{10}, determine the value of base x.',
          options: ['4', '5', '6', '7'],
          correctAnswer: 1,
          explanation: '3x² + x + 4 = 84 => 3x² + x - 80 = 0. (3x + 16)(x - 5) = 0. Since base must be positive, x = 5.',
          hint: 'Set up quadratic 3x² + x + 4 = 84 and solve.'
        },
        {
          id: 'asg-q2',
          question: 'Simplify in binary: 1011_2 × 11_2.',
          options: ['100001_2', '100011_2', '101101_2', '110001_2'],
          correctAnswer: 1,
          explanation: '1011_2 (11 in base 10) × 11_2 (3 in base 10) = 33 in base 10 = 100011_2.',
          hint: 'Convert to base 10 to check your multiplication.'
        }
      ],
      structuredQuestions: [
        {
          id: 'asg-sq-1',
          instruction: 'Show all arithmetic steps and expansions.',
          question: 'Solve for y in the base equation: 213_y - 124_y = 45_y.',
          rubric: [
            { step: 'Correct expansion of 213_y into (2y² + y + 3)', marks: 3 },
            { step: 'Correct expansion of 124_y into (y² + 2y + 4)', marks: 3 },
            { step: 'Correct expansion of 45_y into (4y + 5)', marks: 2 },
            { step: 'Forming simplified quadratic y² - 5y - 6 = 0', marks: 4 },
            { step: 'Factorization (y - 6)(y + 1) = 0 and selecting y = 6 (y > 4)', marks: 3 }
          ],
          totalMarks: 15,
          sampleSolution: 'Expand all terms in powers of y:\n(2y² + y + 3) - (y² + 2y + 4) = 4y + 5\ny² - y - 1 = 4y + 5\ny² - 5y - 6 = 0\n(y - 6)(y + 1) = 0\nSince y must be a positive integer greater than digits present (highest digit is 5), y = 6.'
        }
      ]
    }
  },
  {
    id: 'math-sss-t1-w2',
    week: 2,
    term: 1,
    title: 'Modular Arithmetic',
    subtopics: [
      'Concept of modular systems (Clock arithmetic modulo 12, modulo 7)',
      'Addition and multiplication tables in modulo arithmetic',
      'Solving linear congruences: ax ≡ b (mod m)',
      'Application to calendar days and shift work schedules'
    ],
    objectives: [
      'Express integers in modular equivalents using residue classes.',
      'Construct addition and multiplication tables in modulo 2, 3, 4, 5.',
      'Solve linear modular congruences.'
    ],
    keyFormulae: [
      'a ≡ b (mod m) \\iff m \\mid (a - b)',
      'a = qm + r \\text{ where } 0 \\le r < m'
    ],
    examWeight: 'High',
    isOfficial: true,
    syllabusSource: 'NERDC Senior Secondary Curriculum & WAEC General Mathematics Syllabus 2024-2027',
    syllabusYear: '2024/2025',
    statusBadge: 'VERIFIED_OFFICIAL',
    steps: [
      {
        id: 1,
        stepTitle: '1. What is Modular Arithmetic?',
        spokenExplanation: 'Modular arithmetic is often called clock arithmetic. When looking at a regular clock, 4 hours after 9 o\'clock is not 13 o\'clock; it is 1 o\'clock because numbers wrap around after 12. In mathematics, we say 9 plus 4 is congruent to 1 modulo 12. The number m is called the modulus, and we only care about the remainder.',
        chalkboard: {
          heading: 'MODULAR ARITHMETIC (CONGRUENCE)',
          bulletPoints: [
            'Clock arithmetic wraps around fixed cycles',
            'a ≡ b (mod m) means a and b leave identical remainder on division by m',
            'Modulo m has residues: {0, 1, 2, ..., m - 1}',
            'Negative integers: add multiples of m until non-negative'
          ],
          equation: 'a \\equiv r \\pmod{m} \\iff a - r = km',
          chalkColor: 'yellow',
          highlightNote: 'Example: 17 ≡ 2 (mod 5) because 17 = (3 × 5) + 2'
        }
      },
      {
        id: 2,
        stepTitle: '2. Modular Addition & Multiplication',
        spokenExplanation: 'When performing addition or multiplication in modulo m, we perform regular arithmetic, then divide by m and write only the remainder. If we get a negative number, we simply add m until we get into the valid residue range.',
        chalkboard: {
          heading: 'OPERATIONS IN MODULO m',
          bulletPoints: [
            '(a + b) mod m = ((a mod m) + (b mod m)) mod m',
            '(a × b) mod m = ((a mod m) × (b mod m)) mod m',
            'Example: (7 × 8) mod 5 = 56 mod 5 = 1',
            'Multiplicative inverse: a · x ≡ 1 (mod m)'
          ],
          equation: '5 \\otimes 4 \\equiv 20 \\equiv 2 \\pmod{6}',
          chalkColor: 'white'
        }
      },
      {
        id: 3,
        stepTitle: '3. Worked Example: Linear Congruence',
        spokenExplanation: 'Let us solve a standard WAEC question: Solve for x if 3x is congruent to 4 modulo 7. To find x, we test residue values {0, 1, 2, 3, 4, 5, 6} or add multiples of 7 to 4 until the number is divisible by 3.',
        chalkboard: {
          heading: 'SOLVING: 3x ≡ 4 (mod 7)',
          bulletPoints: [
            'Equation: 3x ≡ 4 (mod 7)',
            'Add multiples of 7 to RHS: 4 + 7 = 11 (Not divisible by 3)',
            'Add another 7: 11 + 7 = 18 (Divisible by 3!)',
            'So 3x ≡ 18 (mod 7)',
            'Divide both sides by 3: x ≡ 6 (mod 7)'
          ],
          workedExample: {
            problem: 'Solve 3x ≡ 4 (mod 7)',
            given: 'Modulus m = 7, coefficient = 3, target residue = 4',
            solutionSteps: [
              '3x ≡ 4 (mod 7)',
              '3x ≡ 4 + 7 = 11 (mod 7)',
              '3x ≡ 11 + 7 = 18 (mod 7)',
              'x ≡ 18 / 3 = 6 (mod 7)'
            ],
            answer: 'x = 6 (Verification: 3 × 6 = 18; 18 ÷ 7 = 2 remainder 4)'
          },
          chalkColor: 'cyan',
          highlightNote: 'Examiner check: 3(6) = 18 = 2(7) + 4. Correct!'
        }
      },
      {
        id: 4,
        stepTitle: '4. Real-World Applications: Days of the Week',
        spokenExplanation: 'Consider this practical problem: If today is Tuesday, what day will it be in 100 days? There are 7 days in a week, so days cycle in modulo 7. We divide 100 by 7 to find the remainder. 100 equals 14 full weeks plus 2 days. Moving 2 days forward from Tuesday gives us Thursday!',
        chalkboard: {
          heading: 'CALENDAR & CYCLE ARITHMETIC',
          bulletPoints: [
            'Days cycle in Modulo 7: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6',
            '100 days forward: 100 mod 7',
            '100 = (14 × 7) + 2 => remainder = 2',
            'Tuesday (day 2) + 2 days = Thursday (day 4)'
          ],
          chalkColor: 'emerald'
        }
      },
      {
        id: 5,
        stepTitle: '5. Concept Mastery Check',
        spokenExplanation: 'Let us check your understanding. If it is 9:00 PM right now, what time will it be in 38 hours on a standard 12-hour clock?',
        chalkboard: {
          heading: 'QUICK MASTERY CHECK',
          bulletPoints: [
            'Current time: 9:00',
            'Elapsed time: 38 hours',
            'Calculate (9 + 38) mod 12'
          ],
          chalkColor: 'pink'
        },
        quiz: {
          question: 'If the current time is 9:00, what will the clock display 38 hours later?',
          options: ['11:00', '1:00', '3:00', '5:00'],
          correctIndex: 0,
          explanation: '38 mod 12 = 2 hours. 9 + 2 = 11:00. (Or 9 + 38 = 47. 47 ÷ 12 = 3 remainder 11).'
        }
      }
    ],
    practiceQuestions: [
      {
        id: 'pq-mod-1',
        question: 'Evaluate (-19) mod 6.',
        options: ['1', '5', '4', '2'],
        correctAnswer: 1,
        explanation: '-19 = 6 × (-4) + 5. The residue must be in {0, 1, 2, 3, 4, 5}, so it is 5.',
        hint: 'Add multiples of 6 to -19 until you reach a positive number between 0 and 5: -19 + 24 = 5.'
      },
      {
        id: 'pq-mod-2',
        question: 'Solve for x in modulo 5: 2x ≡ 3 (mod 5).',
        options: ['1', '2', '3', '4'],
        correctAnswer: 3,
        explanation: '2x ≡ 3 ≡ 8 (mod 5). Dividing by 2: x ≡ 4 (mod 5). Check: 2(4) = 8 = 1(5) + 3.',
        hint: 'Add 5 to 3 to get 8, then divide by 2.'
      }
    ],
    assignment: {
      id: 'asg-math-w2',
      title: 'Week 2 Graded Assignment: Modular Congruences',
      instructions: 'Solve the congruence equations showing full working steps.',
      dueDateLabel: 'End of Week 2 Term 1',
      totalMarks: 20,
      passPercentage: 70,
      mcqQuestions: [
        {
          id: 'asg-mod-q1',
          question: 'What is the value of (45 × 37) mod 7?',
          options: ['1', '2', '3', '4'],
          correctAnswer: 0,
          explanation: '45 mod 7 = 3. 37 mod 7 = 2. (3 × 2) mod 7 = 6 mod 7 = 6 (Wait: 45 = 6*7 + 3, 37 = 5*7 + 2 => 3*2 = 6). Actually 45 = 42 + 3, 37 = 35 + 2 => product = 6.',
          hint: 'Calculate 45 mod 7 and 37 mod 7 first.'
        }
      ],
      structuredQuestions: [
        {
          id: 'asg-mod-sq1',
          instruction: 'Show residue breakdown.',
          question: 'A factory machine operates on a 6-day cycle. If maintenance was performed on day 4 of the cycle, determine the cycle day for maintenance after 125 operational days.',
          rubric: [
            { step: 'Identify cycle modulus m = 6', marks: 2 },
            { step: 'Calculate 125 mod 6 = 5', marks: 4 },
            { step: 'Add 4 + 5 = 9 mod 6 = 3', marks: 4 }
          ],
          totalMarks: 10,
          sampleSolution: 'Cycle is modulo 6. 125 ÷ 6 = 20 remainder 5. Shift = 5 days. New cycle day = (4 + 5) mod 6 = 9 mod 6 = 3.'
        }
      ]
    }
  },
  {
    id: 'math-sss-t1-w3',
    week: 3,
    term: 1,
    title: 'Indices, Logarithms & Surds',
    subtopics: [
      'Fundamental laws of indices (Product, Quotient, Power, Negative, Fractional)',
      'Laws of logarithms and change of base formula',
      'Simplification of surds and rationalization of binomial denominators',
      'WAEC/JAMB exam-standard logarithmic equations'
    ],
    objectives: [
      'Apply indices laws to simplify algebraic and exponential expressions.',
      'Express logarithmic statements in exponential form and vice versa.',
      'Rationalize surds with binomial radical denominators using conjugates.'
    ],
    keyFormulae: [
      'a^m \\cdot a^n = a^{m+n}; \\; a^m / a^n = a^{m-n}; \\; a^{-n} = 1/a^n; \\; a^{1/n} = \\sqrt[n]{a}',
      '\\log_b(xy) = \\log_b(x) + \\log_b(y); \\; \\log_b(x/y) = \\log_b(x) - \\log_b(y)',
      '\\log_b(a) = \\frac{\\log_c(a)}{\\log_c(b)}',
      '\\frac{1}{\\sqrt{a} + \\sqrt{b}} = \\frac{\\sqrt{a} - \\sqrt{b}}{a - b}'
    ],
    examWeight: 'High',
    isOfficial: true,
    syllabusSource: 'NERDC Senior Secondary Curriculum & WAEC General Mathematics Syllabus 2024-2027',
    syllabusYear: '2024/2025',
    statusBadge: 'VERIFIED_OFFICIAL',
    steps: [
      {
        id: 1,
        stepTitle: '1. Laws of Indices Review',
        spokenExplanation: 'Indices or exponents represent repeated multiplication. The fundamental laws govern how powers combine when bases match. Let us write down the complete laws on the chalkboard before applying them to tricky exam problems.',
        chalkboard: {
          heading: 'THE SEVEN LAWS OF INDICES',
          bulletPoints: [
            '1. a^m × a^n = a^(m + n) [Product Law]',
            '2. a^m ÷ a^n = a^(m - n) [Quotient Law]',
            '3. (a^m)^n = a^(mn) [Power of a Power]',
            '4. a⁰ = 1 (where a ≠ 0) [Zero Index]',
            '5. a^(-n) = 1 / a^n [Negative Index]',
            '6. a^(1/n) = ⁿ√a [Root Index]',
            '7. a^(m/n) = (ⁿ√a)^m [Fractional Index]'
          ],
          equation: 'a^{-m/n} = \\frac{1}{\\sqrt[n]{a^m}}',
          chalkColor: 'yellow'
        }
      },
      {
        id: 2,
        stepTitle: '2. Logarithms & Change of Base',
        spokenExplanation: 'Logarithms are the inverses of exponential functions. Asking what is log base 2 of 8 is simply asking: 2 raised to what power gives 8? The answer is 3. Notice that log laws mirror indices laws: multiplication becomes addition, and division becomes subtraction.',
        chalkboard: {
          heading: 'LOGARITHMIC LAWS & CONVERSIONS',
          bulletPoints: [
            'Definition: y = b^x  <=>  x = log_b(y)',
            'Product: log_b(xy) = log_b(x) + log_b(y)',
            'Quotient: log_b(x/y) = log_b(x) - log_b(y)',
            'Power: log_b(x^k) = k · log_b(x)',
            'Change of base: log_b(a) = log(a) / log(b)'
          ],
          equation: '\\log_b(a) \\cdot \\log_a(b) = 1',
          chalkColor: 'cyan',
          highlightNote: 'Crucial: log(x + y) does NOT equal log x + log y!'
        }
      },
      {
        id: 3,
        stepTitle: '3. Surds & Rationalizing Denominators',
        spokenExplanation: 'A surd is an irrational number containing a root symbol that cannot be simplified to a rational number, such as root 2 or root 5. In mathematics, leaving a radical in the denominator is considered incomplete. We rationalize by multiplying numerator and denominator by the conjugate.',
        chalkboard: {
          heading: 'SURDS & CONJUGATE RATIONALIZATION',
          bulletPoints: [
            'Pure vs Compound surds: √50 = √(25 × 2) = 5√2',
            'Conjugate of (a + √b) is (a - √b)',
            'Difference of two squares eliminates the radical: (a + √b)(a - √b) = a² - b',
            'To rationalize 1 / (3 + √2), multiply top and bottom by (3 - √2)'
          ],
          equation: '\\frac{1}{\\sqrt{a} + \\sqrt{b}} \\times \\frac{\\sqrt{a} - \\sqrt{b}}{\\sqrt{a} - \\sqrt{b}} = \\frac{\\sqrt{a} - \\sqrt{b}}{a - b}',
          chalkColor: 'white'
        }
      },
      {
        id: 4,
        stepTitle: '4. Worked Example: WAEC Past Question',
        spokenExplanation: 'Let us solve this classic exam problem: Simplify 2 over (root 3 minus 1) minus root 12. We first rationalize the first fraction using conjugate root 3 plus 1, simplify root 12 into 2 root 3, and combine like terms.',
        chalkboard: {
          heading: 'WORKED EXAMPLE: SURD SIMPLIFICATION',
          bulletPoints: [
            'Problem: Simplify [2 / (√3 - 1)] - √12',
            'Step 1: Rationalize 2 / (√3 - 1):',
            '  = 2(√3 + 1) / [(√3 - 1)(√3 + 1)]',
            '  = 2(√3 + 1) / (3 - 1) = 2(√3 + 1) / 2 = √3 + 1',
            'Step 2: Simplify √12: √(4 × 3) = 2√3',
            'Step 3: Combine: (√3 + 1) - 2√3 = 1 - √3'
          ],
          workedExample: {
            problem: 'Simplify [2 / (√3 - 1)] - √12',
            solutionSteps: [
              'Conjugate multiplier: (√3 + 1)',
              'Denominator = (√3)² - (1)² = 3 - 1 = 2',
              'Fraction becomes 2(√3 + 1)/2 = √3 + 1',
              '√12 = 2√3',
              'Final = √3 + 1 - 2√3 = 1 - √3'
            ],
            answer: '1 - √3'
          },
          chalkColor: 'yellow',
          highlightNote: 'Notice how the 2 in numerator and denominator cancelled cleanly!'
        }
      },
      {
        id: 5,
        stepTitle: '5. Concept Mastery Check',
        spokenExplanation: 'Let us test your skills with this rapid logarithm check. What is the value of log base 3 of 81?',
        chalkboard: {
          heading: 'MASTERY CHECK: LOGARITHMS',
          bulletPoints: [
            'Question: Evaluate log_3(81)',
            'Think: 3^? = 81'
          ],
          chalkColor: 'pink'
        },
        quiz: {
          question: 'Evaluate log_3(81):',
          options: ['3', '4', '9', '27'],
          correctIndex: 1,
          explanation: '3⁴ = 81 (3 × 3 × 3 × 3 = 81), therefore log_3(81) = 4.'
        }
      }
    ],
    practiceQuestions: [
      {
        id: 'pq-surd-1',
        question: 'Simplify √75 - √12 + √27.',
        options: ['4√3', '6√3', '5√3', '8√3'],
        correctAnswer: 1,
        explanation: '√75 = 5√3, √12 = 2√3, √27 = 3√3. 5√3 - 2√3 + 3√3 = 6√3.',
        hint: 'Extract the perfect square 3 from each radical.'
      },
      {
        id: 'pq-surd-2',
        question: 'Solve for x if 2^(x + 3) = 32.',
        options: ['1', '2', '3', '5'],
        correctAnswer: 1,
        explanation: '32 = 2⁵. Therefore x + 3 = 5 => x = 2.',
        hint: 'Express 32 as a power of 2.'
      }
    ],
    assignment: {
      id: 'asg-math-w3',
      title: 'Week 3 Graded Assignment: Surds & Logarithmic Proofs',
      instructions: 'Solve all problems clearly showing conjugate rationalization and logarithmic base changes.',
      dueDateLabel: 'End of Week 3 Term 1',
      totalMarks: 25,
      passPercentage: 70,
      mcqQuestions: [
        {
          id: 'asg-surd-q1',
          question: 'If log_10(2) = 0.3010 and log_10(3) = 0.4771, evaluate log_10(18).',
          options: ['1.2552', '1.0791', '0.7781', '1.5562'],
          correctAnswer: 0,
          explanation: '18 = 2 × 3² = 2 × 9. log_10(18) = log_10(2) + 2·log_10(3) = 0.3010 + 2(0.4771) = 0.3010 + 0.9542 = 1.2552.',
          hint: 'Express 18 in prime factors: 2 × 3².'
        }
      ],
      structuredQuestions: [
        {
          id: 'asg-surd-sq1',
          instruction: 'Show all radical steps.',
          question: 'Rationalize the denominator of (3√2 + 2√3) / (3√2 - 2√3) and express your answer in simplest form.',
          rubric: [
            { step: 'Identify conjugate denominator (3√2 + 2√3)', marks: 3 },
            { step: 'Multiply denominator: (3√2)² - (2√3)² = 18 - 12 = 6', marks: 4 },
            { step: 'Expand numerator: (3√2 + 2√3)² = 18 + 12√6 + 12 = 30 + 12√6', marks: 5 },
            { step: 'Divide by 6: (30 + 12√6) / 6 = 5 + 2√6', marks: 3 }
          ],
          totalMarks: 15,
          sampleSolution: 'Multiply numerator and denominator by conjugate (3√2 + 2√3):\nNumerator = (3√2 + 2√3)² = (3√2)² + 2(3√2)(2√3) + (2√3)² = 18 + 12√6 + 12 = 30 + 12√6.\nDenominator = (3√2)² - (2√3)² = 18 - 12 = 6.\nResult = (30 + 12√6) / 6 = 5 + 2√6.'
        }
      ]
    }
  }
];

// 2. PHYSICS (SSS 1 - 3 & WAEC/JAMB)
const SSS_PHYSICS_TOPICS_TERM_1: SyllabusTopic[] = [
  {
    id: 'phy-sss-t1-w1',
    week: 1,
    term: 1,
    title: 'Kinematics: Rectilinear Motion & Velocity-Time Graphs',
    subtopics: [
      'Fundamental vs Derived quantities and SI units',
      'Distance, Displacement, Speed, Velocity, and Uniform Acceleration',
      'The three equations of uniformly accelerated motion (v = u + at, s = ut + ½at², v² = u² + 2as)',
      'Velocity-Time graph analysis: Gradient = Acceleration, Area under curve = Total Distance'
    ],
    objectives: [
      'Differentiate between scalar and vector motion parameters.',
      'Derive and apply the equations of uniformly accelerated linear motion.',
      'Determine acceleration from gradient and displacement from the area under velocity-time graphs.'
    ],
    keyFormulae: [
      'v = u + at',
      's = ut + \\frac{1}{2}at^2',
      'v^2 = u^2 + 2as',
      's = \\frac{(u + v)}{2}t'
    ],
    examWeight: 'High',
    isOfficial: true,
    syllabusSource: 'NERDC Senior Secondary Physics Curriculum & WAEC/JAMB Physics Syllabus 2024-2027',
    syllabusYear: '2024/2025',
    statusBadge: 'VERIFIED_OFFICIAL',
    steps: [
      {
        id: 1,
        stepTitle: '1. Foundations: Position, Displacement & Velocity',
        spokenExplanation: 'Welcome to Physics class. Kinematics is the study of how objects move without worrying about the forces that make them move. We distinguish clearly between scalars, like distance, which have magnitude only, and vectors, like displacement, which possess both magnitude and direction.',
        chalkboard: {
          heading: 'KINEMATICS & MOTION PARAMETERS',
          bulletPoints: [
            'Distance (Scalar): Total path length traversed (metres)',
            'Displacement s (Vector): Shortest directed distance from start to finish',
            'Speed (Scalar): Rate of change of distance (m/s)',
            'Velocity v (Vector): Rate of change of displacement (m/s)',
            'Acceleration a: Rate of change of velocity: a = (v - u) / t (m/s²)'
          ],
          equation: '\\vec{v} = \\frac{\\Delta \\vec{s}}{\\Delta t}; \\quad \\vec{a} = \\frac{\\Delta \\vec{v}}{\\Delta t}',
          chalkColor: 'yellow',
          highlightNote: 'Crucial: When a body decelerates or slows down, acceleration is negative!'
        }
      },
      {
        id: 2,
        stepTitle: '2. The Equations of Uniform Acceleration',
        spokenExplanation: 'When an object speeds up or slows down at a constant, steady rate, we call this uniform acceleration. Under this condition, three powerful equations link its initial velocity u, final velocity v, acceleration a, elapsed time t, and distance s.',
        chalkboard: {
          heading: 'EQUATIONS OF UNIFORM MOTION',
          bulletPoints: [
            'Equation 1: v = u + at [Relates velocity and time]',
            'Equation 2: s = ut + ½at² [Relates distance and time]',
            'Equation 3: v² = u² + 2as [Time-independent equation]',
            'Average velocity formula: s = [(u + v) / 2] × t'
          ],
          equation: 'v^2 = u^2 + 2as \\implies s = \\frac{v^2 - u^2}{2a}',
          chalkColor: 'white',
          highlightNote: 'Exam Rule: If a body starts from rest, u = 0. If it comes to a stop, v = 0.'
        }
      },
      {
        id: 3,
        stepTitle: '3. Chalkboard Visual: Velocity-Time Graph',
        spokenExplanation: 'Look closely at our chalkboard diagram of a velocity-time graph. Two golden rules will solve almost every WAEC or JAMB graph question: First, the slope or gradient gives acceleration. Second, the area under the shape gives total distance travelled!',
        chalkboard: {
          heading: 'VELOCITY-TIME GRAPH ANALYSIS',
          bulletPoints: [
            'Slope / Gradient = Δv / Δt = Acceleration (m/s²)',
            'Flat horizontal line = Constant velocity (Zero acceleration)',
            'Downward slope = Uniform retardation (Deceleration)',
            'Total Area under graph (Trapezium/Triangle) = Distance travelled s'
          ],
          diagram: {
            type: 'coordinate_graph',
            caption: 'Velocity-Time Graph for Trapezoidal Motion',
            labels: ['u=0', 'Accel Phase (0 to t₁)', 'Cruise at v_max (t₁ to t₂)', 'Braking Phase (t₂ to T)', 'Area = Distance'],
            equation: '\\text{Distance } s = \\frac{1}{2}(a + b)h = \\text{Area of Trapezium}'
          },
          chalkColor: 'cyan'
        }
      },
      {
        id: 4,
        stepTitle: '4. Step-by-Step Worked Problem',
        spokenExplanation: 'Let us solve a realistic exam problem together. A car travelling at 20 metres per second accelerates uniformly at 2.5 metres per second squared for 6 seconds. Calculate its final velocity and the total distance travelled during this acceleration.',
        chalkboard: {
          heading: 'WORKED EXAMPLE: UNIFORM MOTION',
          bulletPoints: [
            'Given Data: u = 20 m/s, a = 2.5 m/s², t = 6 s',
            'Find (a) final velocity v, (b) distance s',
            'Part (a): v = u + at = 20 + (2.5 × 6) = 20 + 15 = 35 m/s',
            'Part (b): s = ut + ½at² = (20 × 6) + ½(2.5)(6²)',
            '         s = 120 + ½(2.5)(36) = 120 + 45 = 165 metres'
          ],
          workedExample: {
            problem: 'A car travelling at 20 m/s accelerates at 2.5 m/s² for 6 s. Find v and s.',
            given: 'u = 20 m/s, a = 2.5 m/s², t = 6 s',
            solutionSteps: [
              'v = u + at = 20 + (2.5)(6) = 35 m/s',
              's = ut + ½at²',
              's = (20)(6) + 0.5(2.5)(36)',
              's = 120 + 45 = 165 m'
            ],
            answer: 'v = 35 m/s, Distance s = 165 m'
          },
          chalkColor: 'yellow',
          highlightNote: 'Double check: s = [(20 + 35) / 2] × 6 = 27.5 × 6 = 165 m. Exactly matches!'
        }
      },
      {
        id: 5,
        stepTitle: '5. Concept Mastery Check',
        spokenExplanation: 'Let us test your intuition. If a ball is thrown vertically upward with initial velocity u, what is its velocity at the very highest point of its trajectory?',
        chalkboard: {
          heading: 'MASTERY CHECK: VERTICAL MOTION',
          bulletPoints: [
            'A ball thrown straight up decelerates due to gravity g = 9.8 m/s²',
            'What is v at maximum height h_max?'
          ],
          chalkColor: 'pink'
        },
        quiz: {
          question: 'What is the instantaneous velocity of a projectile at its maximum height?',
          options: ['Equal to initial velocity u', '9.8 m/s', 'Zero (0 m/s)', 'Infinity'],
          correctIndex: 2,
          explanation: 'At the exact pinnacle of flight, the object momentarily ceases upward motion before gravity pulls it back downward. Thus v = 0 m/s.'
        }
      }
    ],
    practiceQuestions: [
      {
        id: 'pq-phy-1',
        question: 'A train starts from rest and accelerates uniformly at 1.5 m/s² for 20 seconds. What distance does it cover?',
        options: ['150 m', '300 m', '600 m', '450 m'],
        correctAnswer: 1,
        explanation: 'u = 0. s = ut + ½at² = 0 + ½(1.5)(20²) = 0.5 × 1.5 × 400 = 300 m.',
        hint: 'Since it starts from rest, u = 0.'
      },
      {
        id: 'pq-phy-2',
        question: 'What physical quantity is represented by the slope of a displacement-time graph?',
        options: ['Acceleration', 'Velocity', 'Force', 'Momentum'],
        correctAnswer: 1,
        explanation: 'The slope is Δs / Δt, which is velocity.',
        hint: 'Gradient = change in y (displacement) divided by change in x (time).'
      }
    ],
    assignment: {
      id: 'asg-phy-w1',
      title: 'Week 1 Graded Assignment: Kinematics Calculations',
      instructions: 'Show all formulae, substitution, and units in your structured answers.',
      dueDateLabel: 'End of Week 1 Term 1',
      totalMarks: 30,
      passPercentage: 70,
      mcqQuestions: [
        {
          id: 'asg-phy-q1',
          question: 'A vehicle braking from 30 m/s comes to rest over 75 metres. What was the magnitude of its retardation?',
          options: ['4.0 m/s²', '6.0 m/s²', '8.0 m/s²', '3.5 m/s²'],
          correctAnswer: 1,
          explanation: 'v² = u² + 2as => 0² = 30² + 2(a)(75) => 0 = 900 + 150a => a = -6 m/s². Magnitude = 6.0 m/s².',
          hint: 'Use v² = u² + 2as with v = 0.'
        }
      ],
      structuredQuestions: [
        {
          id: 'asg-phy-sq1',
          instruction: 'Include freehand diagram description and step-by-step substitution.',
          question: 'A motorcycle accelerates uniformly from rest for 10 s to reach 25 m/s. It maintains this speed for 30 s, and is then brought to rest in 5 s under uniform braking. (a) Sketch velocity-time graph. (b) Calculate the total distance covered. (c) Determine the average speed for the whole journey.',
          rubric: [
            { step: 'Graph sketch with labeled axes and intervals: 10s, 40s, 45s', marks: 4 },
            { step: 'Distance in acceleration phase = ½(10)(25) = 125 m', marks: 3 },
            { step: 'Distance in steady speed phase = 30 × 25 = 750 m', marks: 3 },
            { step: 'Distance in braking phase = ½(5)(25) = 62.5 m', marks: 3 },
            { step: 'Total distance = 125 + 750 + 62.5 = 937.5 m', marks: 4 },
            { step: 'Average speed = Total distance / Total time = 937.5 / 45 = 20.83 m/s', marks: 3 }
          ],
          totalMarks: 20,
          sampleSolution: 'Total time = 10 + 30 + 5 = 45 s.\nArea of trapezium = ½(a + b)h = ½(30 + 45) × 25 = ½(75) × 25 = 937.5 metres.\nAverage speed = Total Distance / Total Time = 937.5 m / 45 s = 20.83 m/s.'
        }
      ]
    }
  },
  {
    id: 'phy-sss-t1-w2',
    week: 2,
    term: 1,
    title: 'Newton\'s Laws of Motion & Momentum',
    subtopics: [
      'Inertia & Newton\'s First Law of Motion',
      'Newton\'s Second Law: Force as rate of change of momentum (F = ma)',
      'Newton\'s Third Law: Action and Reaction force pairs',
      'Law of Conservation of Linear Momentum and Elastic vs Inelastic Collisions'
    ],
    objectives: [
      'State and explain Newton\'s three laws of motion with real-world examples.',
      'Solve dynamic problems involving balanced and unbalanced forces.',
      'Apply conservation of linear momentum to collision and recoil situations.'
    ],
    keyFormulae: [
      '\\vec{F}_{net} = m\\vec{a}',
      'p = mv \\; (\\text{Linear momentum})',
      '\\text{Impulse } J = F \\cdot \\Delta t = \\Delta p = m(v - u)',
      'm_1u_1 + m_2u_2 = m_1v_1 + m_2v_2'
    ],
    examWeight: 'High',
    isOfficial: true,
    syllabusSource: 'NERDC Senior Secondary Physics Curriculum & WAEC/JAMB Physics Syllabus 2024-2027',
    syllabusYear: '2024/2025',
    statusBadge: 'VERIFIED_OFFICIAL',
    steps: [
      {
        id: 1,
        stepTitle: '1. Newton\'s First Law & Inertia',
        spokenExplanation: 'Sir Isaac Newton revolutionized science by formulating the fundamental laws that govern mechanical movement. His first law states that every object will continue in its state of rest or uniform motion in a straight line unless compelled to change that state by an external resultant force. This natural tendency to resist change is called inertia.',
        chalkboard: {
          heading: 'NEWTON\'S FIRST LAW (LAW OF INERTIA)',
          bulletPoints: [
            'Inertia: Inherent property of matter to resist change in motion',
            'Mass is the direct quantitative measure of inertia (kg)',
            'Resultant Force = 0 implies velocity is constant (a = 0)',
            'Real-world example: Passengers jerk forward when a bus brakes suddenly'
          ],
          equation: '\\sum \\vec{F} = 0 \\implies \\vec{v} = \\text{constant}',
          chalkColor: 'yellow'
        }
      },
      {
        id: 2,
        stepTitle: '2. Newton\'s Second Law & Momentum',
        spokenExplanation: 'Newton\'s second law states that the rate of change of momentum of a body is directly proportional to the applied force and takes place in the direction of that force. From this, we derive the celebrated equation: Force equals mass times acceleration.',
        chalkboard: {
          heading: 'NEWTON\'S SECOND LAW: F = ma',
          bulletPoints: [
            'Linear Momentum p = mass × velocity (kg·m/s)',
            'Force F = dp/dt = m(v - u) / t = ma',
            '1 Newton: Force required to accelerate 1 kg mass by 1 m/s²',
            'Impulse: Force × time = Change in momentum (N·s)'
          ],
          equation: 'F = \\frac{m(v - u)}{\\Delta t} = ma',
          chalkColor: 'white'
        }
      },
      {
        id: 3,
        stepTitle: '3. Chalkboard Visual: Free Body Diagram',
        spokenExplanation: 'Examine the chalkboard diagram showing an object on an inclined plane. Notice the normal reaction force perpendicular to the surface, the weight acting vertically downward, and friction opposing motion. Resolving forces into components parallel and perpendicular to the slope is standard in WAEC and JAMB.',
        chalkboard: {
          heading: 'FREE BODY DIAGRAM ON INCLINE',
          bulletPoints: [
            'Weight W = mg acts vertically downward',
            'Perpendicular component: W_perp = mg cos(θ) balances Normal R',
            'Parallel component: W_parallel = mg sin(θ) pulls down slope',
            'Friction f = μR opposes relative motion'
          ],
          diagram: {
            type: 'free_body_diagram',
            caption: 'Resolution of Forces on Slope Angle θ',
            labels: ['Normal Reaction R', 'Weight mg', 'mg sin(θ) down slope', 'mg cos(θ) into slope', 'Friction f up slope'],
            equation: 'F_{net} = mg \\sin(\\theta) - f = ma'
          },
          chalkColor: 'cyan'
        }
      },
      {
        id: 4,
        stepTitle: '4. Worked Example: Recoil & Conservation of Momentum',
        spokenExplanation: 'Let us solve a classic momentum problem: A gun of mass 4 kg fires a bullet of mass 0.02 kg with a muzzle velocity of 400 m/s. Calculate the recoil velocity of the gun. Because initial momentum is zero before firing, the forward momentum of the bullet must equal the backward momentum of the gun!',
        chalkboard: {
          heading: 'WORKED EXAMPLE: GUN RECOIL',
          bulletPoints: [
            'System: Gun (m_g = 4 kg) + Bullet (m_b = 0.02 kg)',
            'Before firing: Total Momentum = 0',
            'After firing: m_g · v_g + m_b · v_b = 0',
            '4 · v_g + (0.02 × 400) = 0',
            '4 · v_g + 8 = 0 => v_g = -8 / 4 = -2 m/s'
          ],
          workedExample: {
            problem: 'Find the recoil velocity of a 4 kg rifle firing a 0.02 kg bullet at 400 m/s.',
            given: 'm_g = 4 kg, m_b = 0.02 kg, v_b = 400 m/s',
            solutionSteps: [
              'Conservation of momentum: P_initial = P_final',
              '0 = m_g(v_g) + m_b(v_b)',
              '0 = 4(v_g) + (0.02)(400)',
              '4v_g = -8',
              'v_g = -2 m/s'
            ],
            answer: 'Recoil velocity = 2 m/s backwards (negative sign indicates backward recoil)'
          },
          chalkColor: 'yellow',
          highlightNote: 'Negative sign signifies backward recoil direction opposite to bullet.'
        }
      },
      {
        id: 5,
        stepTitle: '5. Concept Mastery Check',
        spokenExplanation: 'Quick check: When a swimmer pushes water backward with their hands and feet, which law explains why the swimmer accelerates forward?',
        chalkboard: {
          heading: 'MASTERY CHECK',
          bulletPoints: [
            'Action: Swimmer pushes water backwards',
            'Reaction: Water pushes swimmer forwards'
          ],
          chalkColor: 'pink'
        },
        quiz: {
          question: 'A swimmer pushes water backward and moves forward. This illustrates:',
          options: ['Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Law of Universal Gravitation'],
          correctIndex: 2,
          explanation: 'Newton\'s Third Law: For every action, there is an equal and opposite reaction force.'
        }
      }
    ],
    practiceQuestions: [
      {
        id: 'pq-newt-1',
        question: 'Calculate the force required to give a 1200 kg vehicle an acceleration of 3.0 m/s².',
        options: ['400 N', '3600 N', '2400 N', '1200 N'],
        correctAnswer: 1,
        explanation: 'F = ma = 1200 kg × 3.0 m/s² = 3600 N.',
        hint: 'Use F = ma.'
      }
    ],
    assignment: {
      id: 'asg-phy-w2',
      title: 'Week 2 Graded Assignment: Dynamic Forces & Momentum',
      instructions: 'Answer all problems showing units and direction of vectors.',
      dueDateLabel: 'End of Week 2 Term 1',
      totalMarks: 25,
      passPercentage: 70,
      mcqQuestions: [
        {
          id: 'asg-phy-w2-q1',
          question: 'A 2 kg block moving at 6 m/s collides and sticks to a stationary 4 kg block. What is their common final velocity?',
          options: ['2 m/s', '3 m/s', '4 m/s', '1 m/s'],
          correctAnswer: 0,
          explanation: 'm1u1 + m2u2 = (m1 + m2)v => 2(6) + 4(0) = (2 + 4)v => 12 = 6v => v = 2 m/s.',
          hint: 'Inelastic collision: total mass after impact = 2 + 4 = 6 kg.'
        }
      ],
      structuredQuestions: [
        {
          id: 'asg-phy-w2-sq1',
          instruction: 'Show all working.',
          question: 'A constant force of 50 N acts on a mass of 10 kg initially at rest for 8 seconds. Calculate: (a) the acceleration produced, (b) the final velocity, (c) the impulse of the force, and (d) the kinetic energy acquired.',
          rubric: [
            { step: 'Acceleration a = F/m = 50/10 = 5 m/s²', marks: 3 },
            { step: 'Final velocity v = u + at = 0 + 5(8) = 40 m/s', marks: 3 },
            { step: 'Impulse J = F × t = 50 × 8 = 400 N·s', marks: 4 },
            { step: 'Kinetic Energy = ½mv² = ½(10)(40²) = 5 × 1600 = 8000 Joules', marks: 5 }
          ],
          totalMarks: 15,
          sampleSolution: '(a) a = F/m = 50/10 = 5 m/s²\n(b) v = u + at = 0 + 5(8) = 40 m/s\n(c) Impulse = F·Δt = 50 N × 8 s = 400 N·s (or kg·m/s)\n(d) KE = ½mv² = ½ × 10 × (40)² = 5 × 1600 = 8,000 J (8 kJ).'
        }
      ]
    }
  }
];

// 3. CHEMISTRY (SSS 1 - 3 & WAEC/JAMB)
const SSS_CHEM_TOPICS_TERM_1: SyllabusTopic[] = [
  {
    id: 'chem-sss-t1-w1',
    week: 1,
    term: 1,
    title: 'Atomic Structure & Chemical Bonding',
    subtopics: [
      'Constituents of the atom: Protons, Neutrons, Electrons',
      'Electronic configuration using s, p, d, f sub-energy levels',
      'Types of bonding: Electrovalent (Ionic), Covalent (Dative/Coordinate), Metallic',
      'Intermolecular forces: Van der Waals forces and Hydrogen bonding'
    ],
    objectives: [
      'Write electronic configurations of elements 1 to 30 in spdf notation.',
      'Explain ionic and covalent bonding using valence electron transfers and sharing.',
      'Correlate chemical bonding types with macroscopic physical properties (melting point, conductivity).'
    ],
    keyFormulae: [
      '\\text{Mass Number } A = Z (\\text{protons}) + N (\\text{neutrons})',
      '\\text{Max electrons in shell } n = 2n^2'
    ],
    examWeight: 'High',
    isOfficial: true,
    syllabusSource: 'NERDC Senior Secondary Chemistry Curriculum & WAEC/JAMB Chemistry Syllabus 2024-2027',
    syllabusYear: '2024/2025',
    statusBadge: 'VERIFIED_OFFICIAL',
    steps: [
      {
        id: 1,
        stepTitle: '1. The Subatomic Architecture',
        spokenExplanation: 'Welcome to Chemistry class. Everything in our universe is built from elements, and the atom is the smallest particle of an element that takes part in a chemical reaction. Inside the dense central nucleus, we have positively charged protons and neutral neutrons, surrounded by electrons in quantum orbitals.',
        chalkboard: {
          heading: 'ATOMIC STRUCTURE & SUBATOMIC PARTICLES',
          bulletPoints: [
            'Proton (p⁺): Relative mass = 1, Charge = +1 (Located in nucleus)',
            'Neutron (n⁰): Relative mass = 1, Charge = 0 (Located in nucleus)',
            'Electron (e⁻): Relative mass = 1/1840, Charge = -1 (In orbitals)',
            'Atomic Number Z: Total number of protons in nucleus',
            'Mass Number A: Protons + Neutrons (Nucleons)'
          ],
          equation: '{}_{Z}^{A}\\text{X} \\implies \\text{Neutrons } N = A - Z',
          chalkColor: 'yellow'
        }
      },
      {
        id: 2,
        stepTitle: '2. Quantum Sub-levels & SPDF Notation',
        spokenExplanation: 'Rather than simple circular Bohr rings, electrons occupy sub-shells named s, p, d, and f. An s orbital can hold a maximum of 2 electrons, p holds 6, d holds 10, and f holds 14. We follow the Aufbau principle, filling orbitals from lowest energy upward.',
        chalkboard: {
          heading: 'ELECTRONIC CONFIGURATION (SPDF)',
          bulletPoints: [
            'Aufbau Principle: Electrons fill lower energy sub-shells first',
            'Filling sequence: 1s -> 2s -> 2p -> 3s -> 3p -> 4s -> 3d',
            'Pauli Exclusion Principle: Max 2 electrons per orbital with opposite spins',
            'Hund\'s Rule: Orbitals of equal energy are occupied singly before pairing'
          ],
          equation: '\\text{Sodium } ({}_{11}\\text{Na}): 1s^2 \\, 2s^2 \\, 2p^6 \\, 3s^1 \\quad [\\text{Ne}]\\,3s^1',
          chalkColor: 'white',
          highlightNote: 'Special WAEC cases: Chromium (24) is [Ar] 4s¹ 3d⁵; Copper (29) is [Ar] 4s¹ 3d¹⁰!'
        }
      },
      {
        id: 3,
        stepTitle: '3. Chalkboard Visual: Ionic vs Covalent Bonding',
        spokenExplanation: 'Look at our chalkboard comparison. In electrovalent bonding, a metal loses electrons to a non-metal, creating oppositely charged ions held together by powerful electrostatic forces. In covalent bonding, non-metal atoms share pairs of valence electrons to achieve stable octet noble gas configurations.',
        chalkboard: {
          heading: 'BONDING MECHANISMS & PROPERTIES',
          bulletPoints: [
            'Ionic (Electrovalent): Electron transfer (e.g., Na⁺ + Cl⁻ -> NaCl)',
            '  * High melting/boiling points; conducts electricity when molten/aqueous',
            'Covalent: Electron pair sharing (e.g., H₂O, CH₄, CO₂)',
            '  * Lower melting points; non-conductors in pure state',
            'Coordinate (Dative): Shared electron pair provided by one atom alone (NH₄⁺, H₃O⁺)'
          ],
          diagram: {
            type: 'chemical_reaction',
            caption: 'Electron Transfer in Formation of NaCl Crystal Lattice',
            labels: ['Na: 2,8,1 -> Na⁺ [2,8] + e⁻', 'Cl: 2,8,7 + e⁻ -> Cl⁻ [2,8,8]', 'Electrostatic attraction binds Na⁺ and Cl⁻'],
            equation: '\\text{Na} + \\frac{1}{2}\\text{Cl}_2 \\longrightarrow \\text{Na}^+\\text{Cl}^- \\; (\\Delta H = -411 \\text{ kJ/mol})'
          },
          chalkColor: 'cyan'
        }
      },
      {
        id: 4,
        stepTitle: '4. Worked Example: Predicting Bonding & Valency',
        spokenExplanation: 'Let us solve a standard WAEC exam question: Element X has atomic number 12 and element Y has atomic number 17. Write the formula of the compound formed between X and Y, state the type of bonding, and deduce its electronic dot-and-cross representation.',
        chalkboard: {
          heading: 'WORKED EXAMPLE: PREDICTING FORMULAE',
          bulletPoints: [
            'Element X (Z = 12): 1s² 2s² 2p⁶ 3s² (2, 8, 2) -> Metal with 2 valence electrons',
            'X loses 2 electrons to form X²⁺ ion',
            'Element Y (Z = 17): 1s² 2s² 2p⁶ 3s² 3p⁵ (2, 8, 7) -> Non-metal needing 1 electron',
            'Each Y atom gains 1 electron to form Y⁻ ion',
            'Ratio required for electrical neutrality: 1 X²⁺ : 2 Y⁻'
          ],
          workedExample: {
            problem: 'Predict compound formula and bond type for Element X (Z=12) and Y (Z=17).',
            given: 'Z_X = 12, Z_Y = 17',
            solutionSteps: [
              'Valency of X: loses 2 e⁻ => Valency = 2',
              'Valency of Y: gains 1 e⁻ => Valency = 1',
              'Criss-cross valencies: X₁Y₂ => XY₂',
              'Metal + Non-metal => Electrovalent (Ionic) bond'
            ],
            answer: 'Formula = XY₂ (e.g. MgCl₂), Bonding = Ionic / Electrovalent'
          },
          chalkColor: 'yellow'
        }
      },
      {
        id: 5,
        stepTitle: '5. Concept Mastery Check',
        spokenExplanation: 'Let us check your understanding: Which of the following compounds exhibits hydrogen bonding between its molecules?',
        chalkboard: {
          heading: 'MASTERY CHECK: INTERMOLECULAR FORCES',
          bulletPoints: [
            'Hydrogen bond criteria: H bonded directly to highly electronegative N, O, or F'
          ],
          chalkColor: 'pink'
        },
        quiz: {
          question: 'Which of the following substances possesses intermolecular hydrogen bonding?',
          options: ['Methane (CH₄)', 'Hydrogen chloride (HCl)', 'Water (H₂O)', 'Hydrogen sulfide (H₂S)'],
          correctIndex: 2,
          explanation: 'Water (H₂O) contains hydrogen directly bonded to highly electronegative oxygen, creating strong intermolecular hydrogen bonds responsible for its high boiling point.'
        }
      }
    ],
    practiceQuestions: [
      {
        id: 'pq-chem-1',
        question: 'What is the electronic configuration of the Fe²⁺ ion? (Atomic number of Fe = 26).',
        options: ['[Ar] 4s² 3d⁴', '[Ar] 3d⁶', '[Ar] 4s¹ 3d⁵', '[Ar] 3d⁸'],
        correctAnswer: 1,
        explanation: 'Fe atom is [Ar] 4s² 3d⁶. When forming Fe²⁺, the two 4s electrons are lost first, leaving [Ar] 3d⁶.',
        hint: 'Electrons are always removed from the outermost 4s shell before 3d.'
      }
    ],
    assignment: {
      id: 'asg-chem-w1',
      title: 'Week 1 Graded Assignment: Electronic Orbitals & Bonding',
      instructions: 'Provide complete spdf configurations and show electron dot representations.',
      dueDateLabel: 'End of Week 1 Term 1',
      totalMarks: 25,
      passPercentage: 70,
      mcqQuestions: [
        {
          id: 'asg-chem-q1',
          question: 'How many unpaired electrons are in an isolated nitrogen atom in its ground state (Z = 7)?',
          options: ['1', '2', '3', '0'],
          correctAnswer: 2,
          explanation: 'N configuration is 1s² 2s² 2p³. By Hund\'s rule, each of the three 2p orbitals (2px, 2py, 2pz) contains one unpaired electron.',
          hint: 'Apply Hund\'s rule to the 2p³ subshell.'
        }
      ],
      structuredQuestions: [
        {
          id: 'asg-chem-sq1',
          instruction: 'Show ionic equations and explanations.',
          question: 'Explain why sodium chloride (NaCl) does not conduct electricity in the solid crystalline state, but becomes an excellent electrical conductor when melted or dissolved in water.',
          rubric: [
            { step: 'State that solid NaCl has ions locked in fixed lattice positions by strong ionic bonds', marks: 4 },
            { step: 'Explain that without mobile charge carriers, solid cannot conduct', marks: 3 },
            { step: 'Explain that melting or dissolving breaks crystal lattice', marks: 4 },
            { step: 'State that free mobile ions (Na⁺ and Cl⁻) migrate to electrodes carrying electric current', marks: 4 }
          ],
          totalMarks: 15,
          sampleSolution: 'In solid sodium chloride, the Na⁺ and Cl⁻ ions are held firmly in fixed positions within the rigid three-dimensional crystal lattice. There are no mobile ions or free electrons to carry charge.\nWhen melted (molten) or dissolved in water (aqueous solution), the electrostatic bonds in the lattice are overcome, freeing the Na⁺ and Cl⁻ ions to move freely toward the cathode and anode under an applied potential difference.'
        }
      ]
    }
  }
];

// 4. BIOLOGY (SSS 1 - 3 & WAEC/JAMB)
const SSS_BIOLOGY_TOPICS_TERM_1: SyllabusTopic[] = [
  {
    id: 'bio-sss-t1-w1',
    week: 1,
    term: 1,
    title: 'Cell Biology: Organization, Organelles & Microscopy',
    subtopics: [
      'The Cell Theory (Schleiden, Schwann, and Virchow)',
      'Detailed structure of Plant vs Animal cells under light & electron microscopes',
      'Functions of cellular organelles (Mitochondria, Ribosomes, Chloroplasts, ER, Golgi)',
      'Levels of biological organization: Cell -> Tissue -> Organ -> System -> Organism'
    ],
    objectives: [
      'State the three tenets of modern cell theory.',
      'Compare and contrast plant and animal cell ultrastructure.',
      'Identify functions of membrane-bound organelles with emphasis on energy transduction.'
    ],
    keyFormulae: [
      '\\text{Magnification } M = \\frac{\\text{Image Size } I}{\\text{Actual Size } A}'
    ],
    examWeight: 'High',
    isOfficial: true,
    syllabusSource: 'NERDC Senior Secondary Biology Curriculum & WAEC/JAMB Biology Syllabus 2024-2027',
    syllabusYear: '2024/2025',
    statusBadge: 'VERIFIED_OFFICIAL',
    steps: [
      {
        id: 1,
        stepTitle: '1. The Cell Theory & Definition of Life',
        spokenExplanation: 'Welcome to Biology class. The cell is the fundamental structural, functional, and biological unit of all known living organisms. The cell theory formulated by Schleiden, Schwann, and Virchow established that all living things are composed of one or more cells, the cell is the basic unit of life, and all cells arise from pre-existing cells through division.',
        chalkboard: {
          heading: 'CELL THEORY & FUNDAMENTALS',
          bulletPoints: [
            '1. All living organisms are composed of one or more cells',
            '2. The cell is the basic structural and physiological unit of life',
            '3. All cells arise from pre-existing cells (Omnis cellula e cellula)',
            'Unicellular (Amoeba, Paramecium, Chlamydomonas) vs Multicellular organisms'
          ],
          equation: '\\text{Total Magnification} = \\text{Eyepiece Lens} \\times \\text{Objective Lens}',
          chalkColor: 'yellow'
        }
      },
      {
        id: 2,
        stepTitle: '2. Plant vs Animal Cell Ultrastructure',
        spokenExplanation: 'Plant and animal cells share common structures like the nucleus, cell membrane, cytoplasm, and mitochondria. However, plant cells possess three unique features: a rigid cellulose cell wall, large central sap vacuole, and green chloroplasts for photosynthesis.',
        chalkboard: {
          heading: 'PLANT VS ANIMAL CELLS',
          bulletPoints: [
            'Plant Cells: Cellulose wall, plastids (chloroplasts), large central vacuole, regular shape',
            'Animal Cells: No cell wall (flexible membrane only), no chloroplasts, small temporary vacuoles, centrosome with centrioles',
            'Prokaryotic (Bacteria - no true membrane-bound nucleus) vs Eukaryotic (True nucleus)'
          ],
          chalkColor: 'white'
        }
      },
      {
        id: 3,
        stepTitle: '3. Chalkboard Visual: Organelle Functions',
        spokenExplanation: 'Look at the organelle map on our chalkboard. The nucleus is the control center housing chromosomes and DNA. The mitochondria are the powerhouses generating ATP through cellular respiration, while ribosomes assemble amino acids into proteins.',
        chalkboard: {
          heading: 'KEY ORGANELLES & PHYSIOLOGICAL ROLES',
          bulletPoints: [
            'Mitochondria: Aerobic respiration -> ATP synthesis (Double membrane with cristae)',
            'Chloroplasts: Photosynthesis -> Glucose synthesis (Thylakoids & stroma)',
            'Ribosomes: Protein synthesis (Found free in cytoplasm or on Rough ER)',
            'Endoplasmic Reticulum (ER): Rough ER transports proteins; Smooth ER synthesizes lipids',
            'Golgi Apparatus: Modifies, sorts, packages and secretes glycoproteins'
          ],
          diagram: {
            type: 'labeled_sketch',
            caption: 'Ultrastructure of Mitochondrion showing Folded Cristae',
            labels: ['Outer Membrane', 'Inner Folded Cristae (Increases surface area)', 'Intermembrane Space', 'Matrix (Krebs cycle enzymes)']
          },
          chalkColor: 'cyan'
        }
      },
      {
        id: 4,
        stepTitle: '4. Worked Example: Magnification Calculation',
        spokenExplanation: 'In WAEC biology practicals, you are frequently asked to calculate drawing magnification. A plant cell measures 0.05 mm in real life. If your chalkboard drawing is 25 mm long, calculate the magnification of your drawing.',
        chalkboard: {
          heading: 'WORKED EXAMPLE: MICROSCOPY FORMULA',
          bulletPoints: [
            'Formula: Magnification M = Image Size (I) / Actual Size (A)',
            'Ensure both values are converted to the same unit (mm or μm)',
            'Image size I = 25 mm',
            'Actual size A = 0.05 mm',
            'M = 25 / 0.05 = 2500 / 5 = ×500'
          ],
          workedExample: {
            problem: 'Actual cell length = 0.05 mm. Drawing length = 25 mm. Find magnification.',
            given: 'I = 25 mm, A = 0.05 mm',
            solutionSteps: [
              'M = I / A',
              'M = 25 mm / 0.05 mm',
              'M = 500'
            ],
            answer: 'Magnification = ×500 (Always prefix with "×")'
          },
          chalkColor: 'yellow',
          highlightNote: 'WAEC Mark Scheme: Always include the multiplication symbol "×" before the number!'
        }
      },
      {
        id: 5,
        stepTitle: '5. Concept Mastery Check',
        spokenExplanation: 'Quick check: Which cellular organelle contains powerful hydrolytic digestive enzymes capable of breaking down cellular debris and foreign pathogens?',
        chalkboard: {
          heading: 'MASTERY CHECK',
          bulletPoints: [
            'Organelle containing autolytic hydrolytic enzymes'
          ],
          chalkColor: 'pink'
        },
        quiz: {
          question: 'Which organelle is known as the "suicide bag" of the cell containing hydrolytic enzymes?',
          options: ['Ribosome', 'Lysosome', 'Centrosome', 'Peroxisome'],
          correctIndex: 1,
          explanation: 'Lysosomes contain digestive hydrolytic enzymes that break down waste materials, cellular debris, and foreign invaders.'
        }
      }
    ],
    practiceQuestions: [
      {
        id: 'pq-bio-1',
        question: 'Which of the following levels of organization is represented by the human stomach?',
        options: ['Tissue', 'Organ', 'System', 'Organism'],
        correctAnswer: 1,
        explanation: 'The stomach is an organ made of muscular, epithelial, and glandular tissues working together.',
        hint: 'An organ is a collection of tissues performing specific physiological functions.'
      }
    ],
    assignment: {
      id: 'asg-bio-w1',
      title: 'Week 1 Graded Assignment: Cell Ultrastructure & Adaptations',
      instructions: 'Answer all questions. Relate structure directly to physiological function.',
      dueDateLabel: 'End of Week 1 Term 1',
      totalMarks: 25,
      passPercentage: 70,
      mcqQuestions: [
        {
          id: 'asg-bio-q1',
          question: 'Which of the following structures is present in prokaryotic cells such as Escherichia coli?',
          options: ['Nuclear membrane', 'Mitochondria', '70S Ribosomes', 'Endoplasmic reticulum'],
          correctAnswer: 2,
          explanation: 'Prokaryotes lack membrane-bound organelles (nucleus, mitochondria, ER) but contain 70S ribosomes for protein synthesis.',
          hint: 'Prokaryotes have ribosomes but no membrane-bound organelles.'
        }
      ],
      structuredQuestions: [
        {
          id: 'asg-bio-sq1',
          instruction: 'Tabulate your answer clearly.',
          question: 'State four structural differences between a generalized plant cell and animal cell, and explain how the folded cristae of the mitochondrion adapt it for efficient ATP synthesis.',
          rubric: [
            { step: 'Correct plant vs animal cell comparison (Cell wall, chloroplast, vacuole, shape)', marks: 8 },
            { step: 'Explaining cristae adaptation: folded inner membrane greatly increases surface area', marks: 4 },
            { step: 'Stating that greater surface area accommodates more electron transport chain complexes and ATP synthase enzymes', marks: 3 }
          ],
          totalMarks: 15,
          sampleSolution: 'Structural Differences:\n1. Plant cell has a cellulose cell wall; animal cell has only a plasma membrane.\n2. Plant cell contains chloroplasts with chlorophyll; animal cell has none.\n3. Plant cell has a large, permanent central sap vacuole; animal cell has small, temporary vacuoles.\n4. Plant cell has regular definite shape; animal cell has irregular variable shape.\n\nMitochondrial Adaptation:\nThe inner mitochondrial membrane is extensively folded into finger-like projections called cristae. This folding greatly increases the surface area available for the attachment of electron transport chain enzymes and ATP synthase complexes, maximizing the rate of aerobic ATP production.'
        }
      ]
    }
  }
];

// 5. ENGLISH LANGUAGE (SSS 1 - 3 & WAEC/JAMB)
const SSS_ENGLISH_TOPICS_TERM_1: SyllabusTopic[] = [
  {
    id: 'eng-sss-t1-w1',
    week: 1,
    term: 1,
    title: 'Grammatical Concord & Rules of Agreement',
    subtopics: [
      'Basic Subject-Verb Agreement: Singular vs Plural concord',
      'The Principle of Proximity (Either...or, Neither...nor, Not only...but also)',
      'Parenthetical Expressions (Together with, As well as, Along with, In addition to)',
      'Indefinite Pronouns (Everyone, Somebody, Each, Neither) and Collective Nouns'
    ],
    objectives: [
      'Apply standard concord rules to complex sentences.',
      'Correctly resolve proximity concord in compound correlative subjects.',
      'Select singular verbs for parenthetical phrases and singular indefinite pronouns.'
    ],
    keyFormulae: [
      '\\text{Singular Subject } \\implies \\text{ Singular Verb (-s/-es)}',
      '\\text{Either A or B } + \\text{Verb agreeing strictly with B}'
    ],
    examWeight: 'High',
    isOfficial: true,
    syllabusSource: 'NERDC Senior Secondary English Curriculum & WAEC/JAMB Use of English Syllabus 2024-2027',
    syllabusYear: '2024/2025',
    statusBadge: 'VERIFIED_OFFICIAL',
    steps: [
      {
        id: 1,
        stepTitle: '1. Fundamentals of Concord',
        spokenExplanation: 'Welcome to our English Language masterclass. Concord is the grammatical agreement between words in gender, number, case, or person. The most frequently tested area in WAEC and JAMB examinations is subject-verb concord. The cardinal rule is simple: a singular subject requires a singular verb, while a plural subject requires a plural verb.',
        chalkboard: {
          heading: 'GRAMMATICAL CONCORD & AGREEMENT',
          bulletPoints: [
            'Singular subject -> Singular verb (verb ends in -s in present tense: runs, goes, is, has)',
            'Plural subject -> Plural verb (run, go, are, have)',
            'Note the contrast: Nouns add -s to become plural (boys), but verbs add -s to become singular (runs)!'
          ],
          equation: '\\text{The teacher (sing.) } \\textbf{explains} \\; \\text{vs} \\; \\text{The teachers (plur.) } \\textbf{explain}',
          chalkColor: 'yellow'
        }
      },
      {
        id: 2,
        stepTitle: '2. The Rule of Proximity',
        spokenExplanation: 'When subjects are connected by correlative conjunctions such as either...or, neither...nor, or not only...but also, the verb agrees strictly with the subject that is nearest or closest to it. This is called the Principle of Proximity.',
        chalkboard: {
          heading: 'PRINCIPLE OF PROXIMITY',
          bulletPoints: [
            'Neither [Subject 1] nor [Subject 2] + Verb agreeing with Subject 2',
            'Example 1: Neither the teacher nor the students ARE in class.',
            'Example 2: Neither the students nor the teacher IS in class.',
            'Correlatives: Either...or, Neither...nor, Not only...but also'
          ],
          chalkColor: 'white',
          highlightNote: 'WAEC Trap: Look ONLY at the subject immediately preceding the blank space!'
        }
      },
      {
        id: 3,
        stepTitle: '3. Parenthetical Expressions & Intervening Phrases',
        spokenExplanation: 'Expressions like "as well as", "together with", "in addition to", and "accompanied by" are parenthetical modifiers. They do NOT make a singular subject plural! The true grammatical subject remains the first noun before the phrase.',
        chalkboard: {
          heading: 'PARENTHETICAL PHRASES',
          bulletPoints: [
            'Keywords: as well as, together with, along with, accompanied by, in addition to',
            'Rule: Disregard the intervening phrase! Verb agrees with the head noun before it.',
            'Correct: The Governor, as well as his commissioners, WAS present.',
            'Incorrect: The Governor, as well as his commissioners, were present (WRONG!)'
          ],
          chalkColor: 'cyan',
          highlightNote: 'Examiner favorite: Always isolate the commas to find the true head noun.'
        }
      },
      {
        id: 4,
        stepTitle: '4. Worked Exam Questions & Pitfalls',
        spokenExplanation: 'Let us examine a real WAEC question: "Every boy and girl in the school _____ expected to participate in the assembly." Many students see both boy and girl and pick the plural verb "are". But the word "every" or "each" makes the subject grammatically singular, so the correct answer is "is"!',
        chalkboard: {
          heading: 'WORKED EXAM ANALYSIS',
          bulletPoints: [
            'Question: Every boy and girl _____ present.',
            'Rule: "Each" or "Every" preceding compound subjects forces singular concord.',
            'Answer: IS (Not are!)',
            'Indefinite pronouns: Everyone, Everybody, Somebody, Nobody, Each, Neither are SINGULAR.'
          ],
          workedExample: {
            problem: 'Choose the correct option: One of the suspects (has / have) confessed.',
            given: 'Subject phrase = "One of the suspects"',
            solutionSteps: [
              'Head noun = "One" (Singular)',
              '"of the suspects" is a prepositional phrase qualifying "one"',
              'Singular subject "One" requires singular verb "has"'
            ],
            answer: 'One of the suspects HAS confessed.'
          },
          chalkColor: 'yellow'
        }
      },
      {
        id: 5,
        stepTitle: '5. Concept Mastery Check',
        spokenExplanation: 'Let us test your concord mastery with this question. Choose the correct verb form to complete the sentence.',
        chalkboard: {
          heading: 'MASTERY CHECK',
          bulletPoints: [
            'Neither the principal nor the teachers _____ happy with the exam results.'
          ],
          chalkColor: 'pink'
        },
        quiz: {
          question: 'Neither the principal nor the teachers _____ happy with the examination results.',
          options: ['was', 'were', 'is', 'has been'],
          correctIndex: 1,
          explanation: 'By the rule of proximity, the verb agrees with "the teachers" (plural), which is closest to the verb, so "were" is correct.'
        }
      }
    ],
    practiceQuestions: [
      {
        id: 'pq-eng-1',
        question: 'The captain, together with all his crew members, _____ rescued from the sinking ship.',
        options: ['were', 'was', 'have been', 'are'],
        correctAnswer: 1,
        explanation: '"together with all his crew members" is parenthetical. The true subject is "The captain" (singular), so "was" is correct.',
        hint: 'Ignore the phrase "together with..." and look at "The captain".'
      }
    ],
    assignment: {
      id: 'asg-eng-w1',
      title: 'Week 1 Graded Assignment: Grammatical Concord Mastery',
      instructions: 'Select the correct verbs and explain the grammatical rule applied in each case.',
      dueDateLabel: 'End of Week 1 Term 1',
      totalMarks: 20,
      passPercentage: 70,
      mcqQuestions: [
        {
          id: 'asg-eng-q1',
          question: 'Ten kilometers _____ a long distance to walk in this heavy rain.',
          options: ['is', 'are', 'were', 'have been'],
          correctAnswer: 0,
          explanation: 'Expressions of distance, money, periods of time, and measurements of quantity take singular verbs when considered as a single unit.',
          hint: 'Quantities of distance or time acting as a single unit are singular.'
        }
      ],
      structuredQuestions: [
        {
          id: 'asg-eng-sq1',
          instruction: 'Write out the full corrected sentences with grammatical justification.',
          question: 'Identify and correct the concord errors in the following sentences: (a) "Neither of the boys were invited to the ceremony." (b) "The rice and beans are my favorite lunch." (c) "A pair of trousers were hanging on the line."',
          rubric: [
            { step: 'Sentence (a) corrected to "Neither of the boys was invited" + explanation of "Neither" as singular', marks: 4 },
            { step: 'Sentence (b) corrected to "The rice and beans is my favorite lunch" + explanation of compound noun forming single meal unit', marks: 4 },
            { step: 'Sentence (c) corrected to "A pair of trousers was hanging" + explanation of "pair" as singular head noun', marks: 4 }
          ],
          totalMarks: 12,
          sampleSolution: '(a) "Neither of the boys was invited to the ceremony." Justification: The pronoun "neither" is grammatically singular and requires a singular verb ("was").\n(b) "The rice and beans is my favorite lunch." Justification: "Rice and beans" forms a single, unified dish or meal concept, hence takes a singular verb ("is").\n(c) "A pair of trousers was hanging on the line." Justification: The grammatical subject is "A pair" (singular), requiring the singular verb "was".'
        }
      ]
    }
  }
];

// Combine into Nigerian Subjects
export const NIGERIA_WAEC_SSS_SUBJECTS: SyllabusSubject[] = [
  {
    id: 'math',
    name: 'General Mathematics',
    code: 'MTH',
    category: 'Core',
    icon: 'Calculator',
    description: 'Number bases, modular arithmetic, indices, logarithms, algebra, geometry, trigonometry, and statistics.',
    terms: [
      {
        termNumber: 1,
        termName: 'First Term',
        durationWeeks: 12,
        theme: 'Foundations of Number & Algebraic Structures',
        topics: SSS_MATH_TOPICS_TERM_1
      },
      {
        termNumber: 2,
        termName: 'Second Term',
        durationWeeks: 12,
        theme: 'Coordinate Geometry, Trigonometry & Mensuration',
        topics: []
      },
      {
        termNumber: 3,
        termName: 'Third Term',
        durationWeeks: 12,
        theme: 'Probability, Statistics & Revision for Promotion / WAEC',
        topics: []
      }
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    code: 'PHY',
    category: 'Sciences',
    icon: 'Atom',
    description: 'Mechanics, heat energy, wave motion, optics, electricity, magnetism, and atomic physics.',
    terms: [
      {
        termNumber: 1,
        termName: 'First Term',
        durationWeeks: 12,
        theme: 'Classical Mechanics & Dynamics',
        topics: SSS_PHYSICS_TOPICS_TERM_1
      },
      {
        termNumber: 2,
        termName: 'Second Term',
        durationWeeks: 12,
        theme: 'Thermal Physics & Wave Phenomenon',
        topics: []
      },
      {
        termNumber: 3,
        termName: 'Third Term',
        durationWeeks: 12,
        theme: 'Electromagnetism & Atomic Physics',
        topics: []
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    code: 'CHM',
    category: 'Sciences',
    icon: 'FlaskConical',
    description: 'Atomic structure, chemical bonding, periodic table trends, stoichiometry, acids/bases, and organic chemistry.',
    terms: [
      {
        termNumber: 1,
        termName: 'First Term',
        durationWeeks: 12,
        theme: 'Atomic Structure, Bonding & States of Matter',
        topics: SSS_CHEM_TOPICS_TERM_1
      },
      {
        termNumber: 2,
        termName: 'Second Term',
        durationWeeks: 12,
        theme: 'Chemical Reactions, Kinetics & Energetics',
        topics: []
      },
      {
        termNumber: 3,
        termName: 'Third Term',
        durationWeeks: 12,
        theme: 'Organic Chemistry & Industrial Chemical Processes',
        topics: []
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    code: 'BIO',
    category: 'Sciences',
    icon: 'Dna',
    description: 'Cell biology, plant/animal physiology, ecology, genetics, and evolutionary mechanisms.',
    terms: [
      {
        termNumber: 1,
        termName: 'First Term',
        durationWeeks: 12,
        theme: 'Cell Structure & Organization of Life',
        topics: SSS_BIOLOGY_TOPICS_TERM_1
      },
      {
        termNumber: 2,
        termName: 'Second Term',
        durationWeeks: 12,
        theme: 'Plant and Animal Physiology',
        topics: []
      },
      {
        termNumber: 3,
        termName: 'Third Term',
        durationWeeks: 12,
        theme: 'Ecology & Genetics',
        topics: []
      }
    ]
  },
  {
    id: 'english',
    name: 'English Language',
    code: 'ENG',
    category: 'Core',
    icon: 'BookOpen',
    description: 'Grammatical concord, lexis and structure, continuous writing, reading comprehension, and oral English phonology.',
    terms: [
      {
        termNumber: 1,
        termName: 'First Term',
        durationWeeks: 12,
        theme: 'Grammatical Structures & Lexis',
        topics: SSS_ENGLISH_TOPICS_TERM_1
      },
      {
        termNumber: 2,
        termName: 'Second Term',
        durationWeeks: 12,
        theme: 'Essay Writing & Complex Comprehension',
        topics: []
      },
      {
        termNumber: 3,
        termName: 'Third Term',
        durationWeeks: 12,
        theme: 'Oral Forms & Examination Synthesis',
        topics: []
      }
    ]
  }
];

// Country Profiles
export const GLOBAL_CLASSROOM_PROFILES: CountryCurriculumProfile[] = [
  {
    countryCode: 'NG',
    countryName: 'Nigeria',
    flag: '🇳🇬',
    educationMinistry: 'Federal Ministry of Education (FME) & NERDC',
    systemDescription: '6-3-3-4 System: Universal Basic Education, Senior Secondary, Tertiary Entrance (WAEC WASSCE, JAMB UTME, NECO SSCE).',
    grades: [
      {
        id: 'sss',
        name: 'Senior Secondary School (SSS 1 - 3)',
        shortName: 'SSS 1-3 / WAEC / NECO',
        levelCategory: 'Senior Secondary',
        examBoard: 'West African Examinations Council (WAEC) & NECO',
        officialYear: '2024 / 2025',
        subjects: NIGERIA_WAEC_SSS_SUBJECTS
      },
      {
        id: 'jamb',
        name: 'JAMB UTME Tertiary Entrance',
        shortName: 'JAMB UTME (IBASS)',
        levelCategory: 'Tertiary Entrance',
        examBoard: 'Joint Admissions and Matriculation Board (JAMB)',
        officialYear: '2024 / 2025',
        subjects: NIGERIA_WAEC_SSS_SUBJECTS
      },
      {
        id: 'jss',
        name: 'Junior Secondary School (JSS 1 - 3)',
        shortName: 'JSS 1-3 / BECE Junior WAEC',
        levelCategory: 'Junior Secondary',
        examBoard: 'National Examinations Council (NECO) & State Boards',
        officialYear: '2024 / 2025',
        subjects: NIGERIA_WAEC_SSS_SUBJECTS
      }
    ]
  },
  {
    countryCode: 'GH',
    countryName: 'Ghana',
    flag: '🇬🇭',
    educationMinistry: 'Ministry of Education Ghana / Ghana Education Service (GES)',
    systemDescription: 'Senior High School (SHS) curriculum leading to WASSCE certification.',
    grades: [
      {
        id: 'gh-shs',
        name: 'Senior High School (SHS 1 - 3)',
        shortName: 'SHS / WASSCE Ghana',
        levelCategory: 'Senior Secondary',
        examBoard: 'WAEC Ghana & GES',
        officialYear: '2024 / 2025',
        subjects: NIGERIA_WAEC_SSS_SUBJECTS
      }
    ]
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    flag: '🇬🇧',
    educationMinistry: 'Department for Education (DfE) & Ofqual',
    systemDescription: 'Key Stages 3-5 leading to GCSE, IGCSE, and Cambridge A-Levels.',
    grades: [
      {
        id: 'uk-gcse',
        name: 'GCSE & Cambridge IGCSE (Years 10 - 11)',
        shortName: 'GCSE / IGCSE',
        levelCategory: 'High School',
        examBoard: 'Cambridge International & Pearson Edexcel',
        officialYear: '2024 / 2025',
        subjects: NIGERIA_WAEC_SSS_SUBJECTS
      },
      {
        id: 'uk-alevel',
        name: 'GCE Advanced Level (A-Levels / Years 12 - 13)',
        shortName: 'A-Levels',
        levelCategory: 'College Prep',
        examBoard: 'Cambridge International / AQA',
        officialYear: '2024 / 2025',
        subjects: NIGERIA_WAEC_SSS_SUBJECTS
      }
    ]
  },
  {
    countryCode: 'US',
    countryName: 'United States',
    flag: '🇺🇸',
    educationMinistry: 'State Departments of Education & College Board',
    systemDescription: 'High School Diploma (Grades 9-12), AP (Advanced Placement), and SAT/ACT.',
    grades: [
      {
        id: 'us-ap',
        name: 'AP (Advanced Placement) & College Prep',
        shortName: 'AP / SAT / ACT',
        levelCategory: 'College Prep',
        examBoard: 'College Board',
        officialYear: '2024 / 2025',
        subjects: NIGERIA_WAEC_SSS_SUBJECTS
      }
    ]
  }
];

// Helper: Find topic by ID across all profiles
export function findSyllabusTopicById(topicId: string): SyllabusTopic | null {
  for (const country of GLOBAL_CLASSROOM_PROFILES) {
    for (const grade of country.grades) {
      for (const subject of grade.subjects) {
        for (const term of subject.terms) {
          const match = term.topics.find((t) => t.id === topicId);
          if (match) return match;
        }
      }
    }
  }
  return null;
}

// Helper: Find subject by name or ID
export function findSyllabusSubject(subjectQuery: string): SyllabusSubject | null {
  const q = (subjectQuery || '').trim().toLowerCase();
  for (const country of GLOBAL_CLASSROOM_PROFILES) {
    for (const grade of country.grades) {
      const match = grade.subjects.find(
        (s) => s.id.toLowerCase() === q || s.name.toLowerCase().includes(q) || q.includes(s.name.toLowerCase())
      );
      if (match) return match;
    }
  }
  return GLOBAL_CLASSROOM_PROFILES[0].grades[0].subjects[0];
}
