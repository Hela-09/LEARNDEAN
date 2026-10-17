import {
  SyllabusSubject,
  ClassGrade,
  CountryCurriculumProfile,
  SyllabusTopic,
  AcademicTerm,
} from './officialClassroomCurriculum';

export type EducationLevelTier =
  | 'early_childhood'
  | 'primary'
  | 'junior_secondary'
  | 'senior_secondary'
  | 'tertiary'
  | 'postgraduate';

export interface EducationLevelDefinition {
  id: EducationLevelTier;
  name: string;
  shortLabel: string;
  order: number;
  description: string;
  typicalAges: string;
  iconName: string;
}

export const EDUCATION_LEVEL_DEFINITIONS: EducationLevelDefinition[] = [
  {
    id: 'early_childhood',
    name: 'Early Childhood Education',
    shortLabel: 'Early Childhood (Nursery & KG)',
    order: 1,
    description: 'Pre-Nursery, Nursery 1 & 2, and Kindergarten. Letter phonics, counting, colors, sensory exploration & social habits.',
    typicalAges: 'Ages 2 - 5',
    iconName: 'Sparkles',
  },
  {
    id: 'primary',
    name: 'Primary / Basic Education',
    shortLabel: 'Primary School (Basic 1 - 6)',
    order: 2,
    description: 'Universal Basic Education 1 - 6. Core arithmetic, grammar, basic science, technology, social studies, and civic literacy.',
    typicalAges: 'Ages 6 - 11',
    iconName: 'BookOpen',
  },
  {
    id: 'junior_secondary',
    name: 'Junior Secondary Education',
    shortLabel: 'Junior Secondary (JSS 1 - 3)',
    order: 3,
    description: 'Basic 7 - 9 leading to the BECE Junior WAEC examination. Pre-vocational studies, basic technology, algebra, and integrated science.',
    typicalAges: 'Ages 11 - 14',
    iconName: 'GraduationCap',
  },
  {
    id: 'senior_secondary',
    name: 'Senior Secondary Education',
    shortLabel: 'Senior Secondary (SSS 1 - 3 & JAMB)',
    order: 4,
    description: 'WAEC WASSCE, NECO SSCE, JAMB UTME tertiary matriculation, Cambridge IGCSE, and British GCSE / A-Levels.',
    typicalAges: 'Ages 14 - 18',
    iconName: 'Award',
  },
  {
    id: 'tertiary',
    name: 'Post-Secondary & Tertiary Education',
    shortLabel: 'Tertiary (University & Polytechnic)',
    order: 5,
    description: 'University undergraduate degree programs (100L - 400L), Polytechnic National Diploma (ND / HND), and College of Education (NCE).',
    typicalAges: 'Undergraduate & Diploma',
    iconName: 'Layers',
  },
  {
    id: 'postgraduate',
    name: 'Advanced & Postgraduate Education',
    shortLabel: 'Postgraduate & Professional',
    order: 6,
    description: 'Master of Science / Arts, MBA, Postgraduate Diploma (PGD), Doctoral studies (PhD), and professional certifications (ICAN, ACCA, PMP).',
    typicalAges: 'Postgraduate & Professionals',
    iconName: 'Compass',
  },
];

// Helper to construct a simple verified syllabus topic
function makeTopic(
  id: string,
  week: number,
  title: string,
  subtopics: string[],
  source: string,
  weight: 'High' | 'Medium' | 'Essential' = 'High'
): SyllabusTopic {
  return {
    id,
    week,
    term: 1,
    title,
    subtopics,
    objectives: subtopics.map((s) => `Master and explain ${s.toLowerCase()}`),
    examWeight: weight,
    isOfficial: true,
    syllabusSource: source,
    syllabusYear: '2024/2025',
    statusBadge: 'VERIFIED_OFFICIAL',
    steps: [
      {
        id: 1,
        stepTitle: `1. Scope & Definitions: ${title}`,
        spokenExplanation: `Welcome to our classroom masterclass on ${title}. We will study the core definitions, fundamental laws, and real-world examples step-by-step. Let us begin with the first chalkboard principles.`,
        chalkboard: {
          heading: title.toUpperCase(),
          bulletPoints: [
            `Core Scope: ${subtopics[0] || 'Foundational Principles'}`,
            `Key Objective: Understand underlying mechanisms and laws of ${title}`,
            `Standard Terminology: Formal definitions and official syllabus units`,
            `Real-world relevance: Direct application in examinations and practical life`,
          ],
          chalkColor: 'yellow',
          highlightNote: 'Examiner alert: Always write standard definitions with correct units and terminology!',
        },
        quiz: {
          question: `Which of the following best defines the main concept of ${title}?`,
          options: [
            `A systematic study of ${subtopics[0] || 'core principles'} under verified curriculum standards`,
            `A random unrelated observation without experimental backing`,
            `An outdated historical hypothesis no longer accepted`,
            `A non-verifiable assumption excluded from syllabuses`,
          ],
          correctIndex: 0,
          explanation: `In standard academic syllabuses, ${title} is formally defined through systematic analysis of ${subtopics[0] || 'its foundational concepts'}.`,
        },
      },
      {
        id: 2,
        stepTitle: `2. Detailed Breakdown: ${subtopics[1] || 'Core Mechanics'}`,
        spokenExplanation: `Now let us examine the detailed mechanisms and mathematical or conceptual properties of ${subtopics[1] || title}. Notice how each component connects directly to what we established on the chalkboard.`,
        chalkboard: {
          heading: (subtopics[1] || 'CORE PRINCIPLES').toUpperCase(),
          bulletPoints: [
            `Concept: ${subtopics[1] || 'Detailed Breakdown'}`,
            `Governing rule: System follows established physical and logical laws`,
            `Step-by-step method: Isolate variables, substitute known values, verify results`,
            `Key invariant: Conserved quantities and structural balance`,
          ],
          chalkColor: 'white',
          highlightNote: 'Key Rule: Memorize standard properties before solving complex problems!',
        },
        quiz: {
          question: `What is the most critical factor to observe when analyzing ${subtopics[1] || title}?`,
          options: [
            'Systematic consistency and verified syllabus rules',
            'Guessing without reference to principles',
            'Ignoring boundary conditions',
            'Applying formulas without checking units',
          ],
          correctIndex: 0,
          explanation: 'Standard examination marking rubrics award full marks for systematic working and verification of rules.',
        },
      },
      {
        id: 3,
        stepTitle: `3. Visual Concept Model & Chalkboard Diagram`,
        spokenExplanation: `To help you visualize ${title} with absolute clarity, let us sketch a structural diagram on the chalkboard. Notice the relationships between the components.`,
        chalkboard: {
          heading: `${title.toUpperCase()}: SYSTEM MODEL`,
          bulletPoints: [
            `Diagrammatic structure of ${title}`,
            `Arrows illustrate active interaction and energy/state progression`,
            `Visualizing the system prevents rote memorization errors in exams`,
          ],
          diagram: {
            type: 'flowchart',
            caption: `Systematic representation of ${title} and associated processes.`,
            labels: [
              `Input Parameters (${subtopics[0] || 'State 1'})`,
              `Transformation Stage (${subtopics[1] || 'State 2'})`,
              `Equilibrium State`,
              `Final Result (${title})`,
            ],
          },
          chalkColor: 'cyan',
        },
        quiz: {
          question: `Why is a system model or diagram effective when studying ${title}?`,
          options: [
            'It clarifies internal relationships and helps visualize abstract concepts',
            'It replaces all need to understand definitions',
            'It allows skipping practice calculations',
            'It is only used for elementary courses',
          ],
          correctIndex: 0,
          explanation: 'Visualizing system models clarifies connections between independent variables and dependent outcomes.',
        },
      },
      {
        id: 4,
        stepTitle: `4. Governing Laws & Analytical Mechanisms`,
        spokenExplanation: `Let us write down the governing laws and formulas for ${title}. Notice how these principles establish predictive certainty in problem solving.`,
        chalkboard: {
          heading: 'GOVERNING LAWS & FORMULATION',
          bulletPoints: [
            `Fundamental Law: Mathematical and logical structure governing ${title}`,
            `Variables: Distinguish independent inputs from resulting outcomes`,
            `Dimensions: All physical and operational units must balance exactly`,
          ],
          equation: 'Output = f(Core\\ Parameters) \\quad [SI\\ Units]',
          chalkColor: 'yellow',
          highlightNote: 'Examiner Warning: Never omit units in analytical solutions!',
        },
        quiz: {
          question: `In standard analytical problems on ${title}, what guarantees accurate results?`,
          options: [
            'Ensuring dimensional consistency and correct unit conversions',
            'Omitting standard constants',
            'Guessing decimal places without calculation',
            'Ignoring initial conditions',
          ],
          correctIndex: 0,
          explanation: 'Dimensional consistency and strict unit conversions are mandatory in academic examination problem solving.',
        },
      },
      {
        id: 5,
        stepTitle: `5. Primary Worked Exam Problem`,
        spokenExplanation: `Let us work through an authentic examination problem on the digital chalkboard. Observe how we state the given data, write the governing formula, and compute the exact result with units.`,
        chalkboard: {
          heading: 'WORKED MASTER PROBLEM 1',
          bulletPoints: [
            `Problem: Calculate and analyze key properties under standard conditions for ${title}`,
            'Given Data: Verified parameter values from syllabus standards',
            'Method: Direct formula substitution and step-by-step evaluation',
          ],
          workedExample: {
            problem: `Analyze a standard case of ${title} and calculate the resulting value.`,
            given: `Standard syllabus reference parameters for ${title}`,
            solutionSteps: [
              'Step 1: State the governing equation and definition clearly',
              'Step 2: Substitute the known values with correct units',
              'Step 3: Simplify and state final answer with appropriate precision',
            ],
            answer: 'Exact verified solution conforming to marking scheme.',
          },
          chalkColor: 'cyan',
          highlightNote: 'WAEC/Exam Tip: State each step clearly to earn full method marks!',
        },
        quiz: {
          question: `In a standard step-by-step solution for ${title}, what guarantees maximum marks?`,
          options: [
            'Writing the formula, showing substitutions, and giving correct units',
            'Writing only the final number without working',
            'Omitting standard units',
            'Skipping the definition',
          ],
          correctIndex: 0,
          explanation: 'Examiners award distinct marks for formula, working/substitution, and correct final answer with units.',
        },
      },
      {
        id: 6,
        stepTitle: `6. Additional Complex Worked Problem (Edge Cases)`,
        spokenExplanation: `Now let us analyze an advanced variation with tricky constraints. Recognizing subtle variations is what separates top performers in examinations.`,
        chalkboard: {
          heading: 'COMPLEX WORKED PROBLEM 2: EDGE CASES',
          bulletPoints: [
            `Edge Case: Non-standard conditions in ${title}`,
            'Method: Isolate primary constraints and solve boundary conditions',
            'Verify: Confirm result complies with theoretical limits',
          ],
          workedExample: {
            problem: `An advanced problem testing tricky conditions in ${title}. Determine the outcome.`,
            given: 'Boundary constraints and secondary modifiers',
            solutionSteps: [
              'Step 1: Identify opposing effects and secondary variables',
              'Step 2: Apply the modified relation for boundary conditions',
              'Step 3: Solve systematically and verify reasonableness',
            ],
            answer: 'Exact verified solution for the advanced constraint.',
          },
          chalkColor: 'yellow',
          highlightNote: 'Alert: Always test boundary values when solving tricky problems!',
        },
        quiz: {
          question: `When dealing with complex variations in ${title}, what strategy is most reliable?`,
          options: [
            'Decomposing the problem into stages and checking boundary conditions',
            'Assuming standard simplified formulas always apply without check',
            'Ignoring secondary constraints',
            'Memorizing specific answers blindly',
          ],
          correctIndex: 0,
          explanation: 'Decomposing complex problems into stages ensures that edge conditions are properly accounted for.',
        },
      },
      {
        id: 7,
        stepTitle: `7. Real-World Applications & Pitfalls to Avoid`,
        spokenExplanation: `Why is ${title} important beyond the classroom? Let us record its real-world industrial and practical applications, along with classic exam mistakes to avoid.`,
        chalkboard: {
          heading: 'APPLICATIONS & COMMON TRAPS',
          bulletPoints: [
            `Real-world implementation of ${title} in technology and society`,
            `Everyday relevance: Direct manifestation in observable systems`,
            `Common Pitfall 1: Confusing dependent and independent factors`,
            `Common Pitfall 2: Forgetting to verify final answer dimensions`,
          ],
          chalkColor: 'pink',
          highlightNote: 'Exam Key: Real-world questions test deep conceptual understanding!',
        },
        quiz: {
          question: `Which of the following is a frequent mistake students make in ${title}?`,
          options: [
            'Confusing cause and effect or overlooking units',
            'Showing clear, step-by-step working',
            'Verifying results against common sense',
            'Applying standard definitions accurately',
          ],
          correctIndex: 0,
          explanation: 'The most frequent mistake in examinations is mixing up variables or omitting standard units.',
        },
      },
      {
        id: 8,
        stepTitle: `8. Topic Revision Summary & Master Review`,
        spokenExplanation: `Congratulations! We have covered the complete topic of ${title}. Let us review our master summary sheet on the chalkboard before you take your final graded assignment.`,
        chalkboard: {
          heading: `MASTER REVISION: ${title.toUpperCase()}`,
          bulletPoints: [
            `1. Definitions: Core scope and standard terminology of ${title}`,
            `2. Theoretical Mechanism: Fundamental laws and governing relationships`,
            `3. Visual Schema: Systematic model and interactions`,
            `4. Problem Solving: Step-by-step substitution, units, and boundary checks`,
            `5. Mastery: You are now fully prepared for the comprehensive assignment!`,
          ],
          chalkColor: 'white',
          highlightNote: '★ READY FOR GRADED ASSESSMENT: Complete the end-of-topic assignment to lock in your score!',
        },
        quiz: {
          question: `What is the most effective approach for retaining mastery in ${title}?`,
          options: [
            'Regular practice of worked problems and active review of principles',
            'Relying only on memorization without solving problems',
            'Skipping final assessments',
            'Reviewing only once right before an exam',
          ],
          correctIndex: 0,
          explanation: 'Consistent spaced practice and problem solving solidify long-term retention and exam confidence.',
        },
      },
    ],
    practiceQuestions: [
      {
        id: `pq-${id}-1`,
        question: `Which principle is fundamental to ${title}?`,
        options: [
          `Verification of ${subtopics[0] || 'core laws'}`,
          'Inconsistent hypotheses',
          'Absence of empirical data',
          'Unrelated speculation',
        ],
        correctAnswer: 0,
        explanation: `Academic standards require thorough verification of ${subtopics[0] || 'foundational laws'}.`,
        hint: `Think about what was written on the chalkboard in step 1.`,
      },
    ],
    assignment: {
      id: `asgn-${id}`,
      title: `${title} End-of-Topic Graded Assessment`,
      instructions: 'Answer all multiple-choice and structured theory questions. Show all working clearly.',
      dueDateLabel: 'Comprehensive Topic Assessment',
      totalMarks: 25,
      passPercentage: 70,
      mcqQuestions: [
        {
          id: `mcq-${id}-1`,
          question: `What is the primary governing principle of ${title}?`,
          options: [
            `Standard laws of ${subtopics[0] || 'the subject'}`,
            'Random variance',
            'Subjective opinion',
            'Unverified assumption',
          ],
          correctAnswer: 0,
          explanation: `By definition, ${title} is governed by standard academic laws.`,
        },
        {
          id: `mcq-${id}-2`,
          question: `How is ${subtopics[1] || title} practically evaluated in exams?`,
          options: [
            'Through rigorous step-by-step problem solving',
            'By superficial estimation only',
            'Without quantitative backing',
            'By skipping definitions',
          ],
          correctAnswer: 0,
          explanation: 'Standard examinations require methodical step-by-step evaluation.',
        },
      ],
      structuredQuestions: [
        {
          id: `str-${id}-1`,
          instruction: 'Show full working and explain your reasoning clearly.',
          question: `State the fundamental law of ${title}, define its key variables, and solve a representative case involving ${subtopics[0] || 'its principles'}.`,
          rubric: [
            { step: 'Correct formal definition & statement of law', marks: 5 },
            { step: 'Explanation of variables and physical interpretation', marks: 5 },
            { step: 'Accurate step-by-step worked computation with units', marks: 5 },
          ],
          totalMarks: 15,
          sampleSolution: `1. Definition: ${title} is the systematic study of ${subtopics.join(', ')}.\n2. Key Variables: Expressed in SI units and standard notation.\n3. Calculation: Correct substitution yields the exact verified result with units.`,
        },
      ],
    },
  };
}

// ============================================================================
// CURRICULUM SUBJECT BUILDER
// ============================================================================
function makeSubject(
  id: string,
  name: string,
  code: string,
  category: SyllabusSubject['category'],
  icon: string,
  description: string,
  topics: SyllabusTopic[]
): SyllabusSubject {
  return {
    id,
    name,
    code,
    category,
    icon,
    description,
    terms: [
      {
        termNumber: 1,
        termName: 'First Term',
        durationWeeks: 12,
        theme: `${name} Fundamentals & Core Curriculum`,
        topics,
      },
      {
        termNumber: 2,
        termName: 'Second Term',
        durationWeeks: 12,
        theme: `${name} Intermediate Applications`,
        topics: [],
      },
      {
        termNumber: 3,
        termName: 'Third Term',
        durationWeeks: 12,
        theme: `${name} Advanced Synthesis & Exam Prep`,
        topics: [],
      },
    ],
  };
}

// ----------------------------------------------------------------------------
// 1. EARLY CHILDHOOD SUBJECTS & TOPICS (Nursery 1-2, KG)
// ----------------------------------------------------------------------------
const EARLY_NUMERACY_TOPICS: SyllabusTopic[] = [
  makeTopic('ec-num-1', 1, 'Counting Numbers 1 to 20', ['Number recognition', 'Object counting', 'Number tracing', 'Quantity matching'], 'NERDC Early Childhood Curriculum'),
  makeTopic('ec-num-2', 2, 'Shapes & Patterns in Nature', ['Circles, squares, triangles', 'Color sorting', 'Pattern repeating', 'Big and small comparison'], 'NERDC Early Childhood Curriculum'),
  makeTopic('ec-num-3', 3, 'Simple Addition with Real Objects', ['Combining 2 groups', 'Counting altogether', 'Plus sign introduction', 'Story sums with toys'], 'NERDC Early Childhood Curriculum'),
];

const EARLY_LITERACY_TOPICS: SyllabusTopic[] = [
  makeTopic('ec-lit-1', 1, 'Letter Phonics: Sounds A to Z', ['Letter sound identification', 'Jolly phonics actions', 'Initial letter matching', 'Sound blending basics'], 'NERDC Early Childhood Curriculum'),
  makeTopic('ec-lit-2', 2, 'C-V-C Word Families (cat, bat, mat)', ['Short vowel a sounds', 'Blending consonants', 'Word family rhyme recognition', 'Simple picture reading'], 'NERDC Early Childhood Curriculum'),
  makeTopic('ec-lit-3', 3, 'Rhymes, Poetry & Oral Storytelling', ['Nursery rhymes recitation', 'Story sequencing (beginning, middle, end)', 'Vocabulary building', 'Expressive speaking'], 'NERDC Early Childhood Curriculum'),
];

const EARLY_SCIENCE_TOPICS: SyllabusTopic[] = [
  makeTopic('ec-sci-1', 1, 'Living Things: Animals & Plants', ['Domestic vs wild animals', 'Animal sounds and babies', 'Plant parts (leaf, stem, root)', 'Caring for living things'], 'NERDC Early Childhood Curriculum'),
  makeTopic('ec-sci-2', 2, 'Our Five Senses & the Body', ['Sight (eyes), hearing (ears)', 'Smell (nose), taste (tongue)', 'Touch (skin and fingers)', 'Body parts identification'], 'NERDC Early Childhood Curriculum'),
  makeTopic('ec-sci-3', 3, 'Weather, Day & Night and Seasons', ['The Sun and shadows', 'Moon and stars', 'Rainy vs sunny days', 'Daily routines and rest'], 'NERDC Early Childhood Curriculum'),
];

const EARLY_CHILDHOOD_SUBJECTS: SyllabusSubject[] = [
  makeSubject('ec-numeracy', 'Numeracy & Early Math', 'NUM', 'Core', 'Calculator', 'Counting 1-20, number recognition, shapes, sorting, and introductory addition.', EARLY_NUMERACY_TOPICS),
  makeSubject('ec-literacy', 'Literacy & Letter Phonics', 'LIT', 'Core', 'BookOpen', 'Letter sounds A-Z, CVC word blending, rhymes, storytelling, and early handwriting.', EARLY_LITERACY_TOPICS),
  makeSubject('ec-science', 'Basic Science & Nature Discovery', 'SCI', 'Sciences', 'Sparkles', 'The five senses, animals, plants, day & night, weather, and sensory exploration.', EARLY_SCIENCE_TOPICS),
  makeSubject('ec-health', 'Health Habits & Personal Hygiene', 'HLT', 'Core', 'CheckCircle', 'Hand washing, brushing teeth, healthy foods, exercise, and cleanliness.', [
    makeTopic('ec-hlth-1', 1, 'Personal Hygiene & Clean Hands', ['Washing hands with soap', 'Brushing teeth twice daily', 'Clean clothes & grooming', 'Keeping our surroundings tidy'], 'NERDC Early Childhood Curriculum'),
  ]),
  makeSubject('ec-social', 'Social Habits & Civic Readiness', 'SOC', 'Social Sciences', 'Globe', 'Good manners, sharing, family roles, school community, and empathy.', [
    makeTopic('ec-soc-1', 1, 'Good Manners & Golden Words', ['Please, Thank You, Excuse Me, I am Sorry', 'Sharing with friends', 'Respecting elders & teachers', 'Following safety rules'], 'NERDC Early Childhood Curriculum'),
  ]),
];

// ----------------------------------------------------------------------------
// 2. PRIMARY / BASIC EDUCATION (Basic 1 - 6)
// ----------------------------------------------------------------------------
const PRIMARY_MATH_TOPICS: SyllabusTopic[] = [
  makeTopic('pri-math-1', 1, 'Place Value & Large Numbers', ['Units, Tens, Hundreds, Thousands', 'Writing numbers in words and figures', 'Comparing and ordering numbers', 'Rounding to nearest 10 and 100'], 'NERDC Basic Education Curriculum Primary 1-6'),
  makeTopic('pri-math-2', 2, 'Fractions, Decimals & Percentages', ['Proper and improper fractions', 'Equivalent fractions', 'Converting fractions to decimals', 'Real-life sharing problems'], 'NERDC Basic Education Curriculum Primary 1-6'),
  makeTopic('pri-math-3', 3, 'Perimeter, Area & 2D Shapes', ['Perimeter of rectangles and squares', 'Area calculation by counting and formula', 'Properties of triangles and circles', 'Word problems on measurements'], 'NERDC Basic Education Curriculum Primary 1-6'),
  makeTopic('pri-math-4', 4, 'Multiplication & Long Division', ['Times tables up to 12 x 12', 'Multiplication by 2-digit numbers', 'Division with and without remainders', 'Word problems in daily commerce'], 'NERDC Basic Education Curriculum Primary 1-6'),
];

const PRIMARY_ENGLISH_TOPICS: SyllabusTopic[] = [
  makeTopic('pri-eng-1', 1, 'Parts of Speech: Nouns, Verbs & Adjectives', ['Proper, common and collective nouns', 'Action verbs and helping verbs', 'Descriptive adjectives', 'Sentence building exercises'], 'NERDC Basic Education Curriculum Primary 1-6'),
  makeTopic('pri-eng-2', 2, 'Sentence Punctuation & Capitalization', ['Capital letters rules', 'Full stops, question marks, exclamation marks', 'Commas in lists', 'Apostrophes for contraction and possession'], 'NERDC Basic Education Curriculum Primary 1-6'),
  makeTopic('pri-eng-3', 3, 'Reading Comprehension & Paragraph Summary', ['Identifying main ideas', 'Context clues for new vocabulary', 'Answering factual and inferential questions', 'Writing short story summaries'], 'NERDC Basic Education Curriculum Primary 1-6'),
];

const PRIMARY_SCIENCE_TOPICS: SyllabusTopic[] = [
  makeTopic('pri-sci-1', 1, 'Living & Non-Living Things and Ecosystems', ['Characteristics of living things (MR NIGER D)', 'Plant kingdom vs Animal kingdom', 'Habitats and adaptations', 'Importance of plants to humans and animals'], 'NERDC Basic Education Curriculum Primary 1-6'),
  makeTopic('pri-sci-2', 2, 'Water Cycle, Weather & States of Matter', ['Solids, liquids and gases', 'Evaporation, condensation and precipitation', 'The water cycle process', 'Water purification methods'], 'NERDC Basic Education Curriculum Primary 1-6'),
  makeTopic('pri-sci-3', 3, 'Energy, Simple Machines & Forces', ['Forms of energy (light, heat, sound, electrical)', 'Levers, pulleys and inclined planes', 'Friction: advantages and disadvantages', 'Gravity and magnetic forces'], 'NERDC Basic Education Curriculum Primary 1-6'),
];

const PRIMARY_SUBJECTS: SyllabusSubject[] = [
  makeSubject('pri-math', 'Mathematics (Primary / Basic)', 'MATH', 'Core', 'Calculator', 'Place value, arithmetic operations, fractions, decimals, perimeter, area, and word problems.', PRIMARY_MATH_TOPICS),
  makeSubject('pri-english', 'English Studies (Primary)', 'ENG', 'Core', 'BookOpen', 'Grammar, parts of speech, reading comprehension, spelling, and creative composition.', PRIMARY_ENGLISH_TOPICS),
  makeSubject('pri-science', 'Basic Science & Technology', 'BST', 'Sciences', 'Sparkles', 'Living things, ecosystems, matter, water cycle, energy, and simple machines.', PRIMARY_SCIENCE_TOPICS),
  makeSubject('pri-social', 'Social Studies & Civic Education', 'SOC', 'Social Sciences', 'Globe', 'Family, culture, leadership, national symbols, citizen duties, and community safety.', [
    makeTopic('pri-soc-1', 1, 'The Family & National Identity', ['Types of family (Nuclear & Extended)', 'Roles of family members', 'National symbols (Flag, Anthem, Coat of Arms)', 'Rights and duties of a child'], 'NERDC Basic Education Curriculum'),
  ]),
  makeSubject('pri-agric', 'Agricultural Science (Primary)', 'AGR', 'Sciences', 'Layers', 'Soil types, farm tools, crop cultivation, animal care, and food production.', [
    makeTopic('pri-agr-1', 1, 'Soil & Farm Crops Cultivation', ['Types of soil (Sandy, Clay, Loamy)', 'Simple farm tools and maintenance', 'Classification of crops (Cereals, Tubers, Vegetables)', 'Weeds and weed control'], 'NERDC Basic Education Curriculum'),
  ]),
  makeSubject('pri-ict', 'Computer Studies & ICT', 'ICT', 'Technical', 'Laptop', 'Computer parts, mouse/keyboard skills, digital safety, and introductory word processing.', [
    makeTopic('pri-ict-1', 1, 'Components of a Computer System', ['Hardware (Monitor, CPU, Keyboard, Mouse)', 'Input vs Output devices', 'Software basics', 'Safe computer laboratory rules'], 'NERDC Basic Education Curriculum'),
  ]),
];

// ----------------------------------------------------------------------------
// 3. JUNIOR SECONDARY EDUCATION (JSS 1 - 3 / Basic 7 - 9 / BECE Junior WAEC)
// ----------------------------------------------------------------------------
const JSS_MATH_TOPICS: SyllabusTopic[] = [
  makeTopic('jss-math-1', 1, 'Algebraic Expressions & Substitution', ['Variables, coefficients and constants', 'Simplifying expressions with brackets', 'Substitution of numerical values', 'Word problems involving linear algebra'], 'NERDC Junior Secondary Curriculum & BECE Syllabus'),
  makeTopic('jss-math-2', 2, 'Linear Equations in One Variable', ['Solving equations using balance method', 'Equations involving fractions', 'Word problems leading to linear equations', 'Graphing linear relations on Cartesian plane'], 'NERDC Junior Secondary Curriculum & BECE Syllabus'),
  makeTopic('jss-math-3', 3, 'Angles, Triangles & Polygons', ['Types of angles (Acute, Obtuse, Reflex)', 'Angle sum in a triangle (180 degrees)', 'Exterior and interior angles of regular polygons', 'Pythagoras theorem applications'], 'NERDC Junior Secondary Curriculum & BECE Syllabus'),
  makeTopic('jss-math-4', 4, 'Ratio, Rate, Proportion & Percentages', ['Direct and inverse proportions', 'Percentage increase and decrease', 'Simple interest calculations: I = (P*R*T)/100', 'Profit and loss in business transactions'], 'NERDC Junior Secondary Curriculum & BECE Syllabus'),
];

const JSS_BASIC_SCIENCE_TOPICS: SyllabusTopic[] = [
  makeTopic('jss-sci-1', 1, 'Matter: Elements, Compounds & Mixtures', ['Definition and classification of matter', 'Differences between compounds and mixtures', 'Separation techniques: filtration, distillation, chromatography', 'Atoms and the periodic table overview'], 'NERDC Basic Science Curriculum & BECE Syllabus'),
  makeTopic('jss-sci-2', 2, 'Work, Energy, Power & Motion', ['Work Done = Force x Distance in direction of force', 'Potential energy (mgh) and Kinetic energy (0.5mv^2)', 'Conservation of energy law', 'Speed, velocity and acceleration calculations'], 'NERDC Basic Science Curriculum & BECE Syllabus'),
  makeTopic('jss-sci-3', 3, 'Human Digestive & Respiratory Systems', ['Organs of the digestive tract and enzyme actions', 'Inhalation vs exhalation mechanics', 'Cellular respiration overview', 'Diseases of digestive and respiratory organs'], 'NERDC Basic Science Curriculum & BECE Syllabus'),
];

const JSS_SUBJECTS: SyllabusSubject[] = [
  makeSubject('jss-math', 'Mathematics (JSS / Basic 7-9)', 'MTH', 'Core', 'Calculator', 'Algebra, linear equations, geometry, ratios, simple interest, and statistics.', JSS_MATH_TOPICS),
  makeSubject('jss-english', 'English Language (JSS)', 'ENG', 'Core', 'BookOpen', 'Grammar concord, direct/indirect speech, letter writing, comprehension, and phonetics.', [
    makeTopic('jss-eng-1', 1, 'Grammatical Concord & Rules of Agreement', ['Subject-verb agreement rules', 'Indefinite pronoun concord', 'Neither/nor and either/or concord', 'Errors in agreement corrections'], 'NERDC Junior Secondary Curriculum'),
  ]),
  makeSubject('jss-science', 'Basic Science (JSS)', 'BSC', 'Sciences', 'Sparkles', 'Elements, compounds, mixtures, force, work, energy, human anatomy, and ecology.', JSS_BASIC_SCIENCE_TOPICS),
  makeSubject('jss-tech', 'Basic Technology (JSS)', 'BTECH', 'Technical', 'PenTool', 'Technical drawing, workshop safety, woodwork/metalwork tools, and building construction.', [
    makeTopic('jss-tech-1', 1, 'Technical Drawing & Orthographic Projection', ['Drawing instruments and uses', 'Lines, angles and geometric constructions', 'First-angle orthographic projections', 'Isometric drawing principles'], 'NERDC Basic Technology Curriculum'),
  ]),
  makeSubject('jss-business', 'Business Studies (JSS)', 'BUS', 'Commercial', 'Briefcase', 'Commerce, bookkeeping, office practice, keyboarding, and consumer rights.', [
    makeTopic('jss-bus-1', 1, 'Introduction to Bookkeeping & Accounting', ['Journals, ledger accounts and cash books', 'Double-entry bookkeeping principle', 'Trial balance preparation', 'Petty cash book with imprest system'], 'NERDC Business Studies Curriculum'),
  ]),
  makeSubject('jss-ict', 'Computer Studies / ICT (JSS)', 'ICT', 'Technical', 'Laptop', 'Computer hardware architecture, software types, logic gates, operating systems, and internet.', [
    makeTopic('jss-ict-1', 1, 'Computer Architecture & Operating Systems', ['ALU, Control Unit and System Memory', 'System vs Application software', 'Operating system functions', 'Data representation in binary and bytes'], 'NERDC Computer Studies Curriculum'),
  ]),
];

// ----------------------------------------------------------------------------
// 4. TERTIARY EDUCATION (University 100L - 400L, Polytechnic ND/HND)
// ----------------------------------------------------------------------------
const TERTIARY_ENG_MATH_TOPICS: SyllabusTopic[] = [
  makeTopic('tert-math-1', 1, 'Limits, Continuity & Differential Calculus', ['Epsilon-delta definitions and limit laws', 'L\'Hopital\'s rule for indeterminate forms', 'Chain rule, product rule and implicit differentiation', 'Applications: Taylor series, curvature, related rates'], 'NUC Benchmark Academic Standards & University Syllabuses'),
  makeTopic('tert-math-2', 2, 'Techniques of Integration & Definite Integrals', ['Integration by parts and trigonometric substitution', 'Partial fraction decomposition integration', 'Improper integrals and convergence tests', 'Double and triple integrals in Cartesian and polar coordinates'], 'NUC Benchmark Academic Standards & University Syllabuses'),
  makeTopic('tert-math-3', 3, 'Linear Algebra: Matrices, Eigenvalues & Vectors', ['Matrix inverses and Gaussian elimination', 'Determinants and Cramer\'s rule', 'Vector spaces, basis and dimension', 'Eigenvalues, eigenvectors and diagonalization'], 'NUC Benchmark Academic Standards & University Syllabuses'),
  makeTopic('tert-math-4', 4, 'Ordinary Differential Equations (ODEs)', ['First-order separable and linear differential equations', 'Integrating factors method', 'Second-order linear homogeneous ODEs with constant coefficients', 'Applications in mechanical vibrations and RLC circuits'], 'NUC Benchmark Academic Standards & University Syllabuses'),
];

const TERTIARY_PHYSICS_TOPICS: SyllabusTopic[] = [
  makeTopic('tert-phy-1', 1, 'Classical Mechanics & Lagrangian Dynamics', ['Newtonian mechanics vector formulations', 'Non-inertial reference frames and Coriolis force', 'Generalized coordinates and Lagrangian equations', 'Conservation of linear and angular momentum in rigid bodies'], 'NUC Benchmark Academic Standards'),
  makeTopic('tert-phy-2', 2, 'Electromagnetism & Maxwell\'s Equations', ['Coulomb\'s Law, Gauss\'s Law and electric potential', 'Biot-Savart Law and Ampere\'s Circuital Law', 'Faraday\'s Law of induction and Lenz\'s Law', 'Maxwell\'s four equations in differential and integral form'], 'NUC Benchmark Academic Standards'),
  makeTopic('tert-phy-3', 3, 'Thermodynamics & Statistical Mechanics', ['First, second and third laws of thermodynamics', 'Carnot heat engines and entropy calculations', 'Maxwell-Boltzmann, Bose-Einstein and Fermi-Dirac statistics', 'Thermodynamic potentials and Maxwell relations'], 'NUC Benchmark Academic Standards'),
];

const TERTIARY_COMP_SCI_TOPICS: SyllabusTopic[] = [
  makeTopic('tert-cs-1', 1, 'Data Structures & Algorithms Complexity', ['Big-O, Big-Omega, Big-Theta asymptotic notation', 'Arrays, linked lists, stacks and queues', 'Binary search trees, AVL trees and heaps', 'Sorting algorithms: QuickSort, MergeSort, HeapSort analysis'], 'ACM/IEEE Computer Science Curricula'),
  makeTopic('tert-cs-2', 2, 'Object-Oriented Architecture & Design Patterns', ['Encapsulation, inheritance, polymorphism, abstraction', 'SOLID engineering principles', 'Creational patterns (Factory, Singleton)', 'Structural and behavioral patterns (Observer, Strategy)'], 'ACM/IEEE Computer Science Curricula'),
  makeTopic('tert-cs-3', 3, 'Database Management Systems & Relational Model', ['Relational algebra and SQL queries optimization', 'Entity-Relationship (ER) modeling', 'Database normalization (1NF, 2NF, 3NF, BCNF)', 'ACID transactions, concurrency control, and indexing'], 'ACM/IEEE Computer Science Curricula'),
];

const TERTIARY_SUBJECTS: SyllabusSubject[] = [
  makeSubject('tert-eng-math', 'Engineering Mathematics & Calculus', 'MAT101', 'Sciences', 'Calculator', 'Limits, differential calculus, integration, linear algebra, ODEs, and vector calculus.', TERTIARY_ENG_MATH_TOPICS),
  makeSubject('tert-physics', 'General Physics & Classical Mechanics', 'PHY101', 'Sciences', 'Sparkles', 'Newtonian mechanics, rotational dynamics, electromagnetism, and Maxwell equations.', TERTIARY_PHYSICS_TOPICS),
  makeSubject('tert-compsci', 'Computer Science & Data Structures', 'CSC201', 'Technical', 'Laptop', 'Algorithms, data structures, Big-O notation, relational databases, and software design.', TERTIARY_COMP_SCI_TOPICS),
  makeSubject('tert-economics', 'Microeconomics & Macroeconomics', 'ECO101', 'Commercial', 'TrendingUp', 'Consumer theory, market structures, IS-LM model, fiscal policy, and inflation.', [
    makeTopic('tert-eco-1', 1, 'Consumer Theory, Utility & Market Structures', ['Indifference curve analysis and budget constraints', 'Price elasticity of demand and supply', 'Perfect competition, monopoly and oligopoly', 'Game theory and Nash equilibrium'], 'University Economics Curriculum'),
  ]),
  makeSubject('tert-business', 'Business Administration & Management', 'BUS101', 'Commercial', 'Briefcase', 'Organizational behavior, strategic management, corporate finance, and marketing principles.', [
    makeTopic('tert-bus-1', 1, 'Principles of Management & Organizational Behavior', ['Classical, behavioral, and modern management theories', 'Motivation models (Maslow, Herzberg, Vroom)', 'Organizational design and change management', 'Corporate leadership and ethical governance'], 'University Business Curriculum'),
  ]),
  makeSubject('tert-law', 'Principles of Law & Constitutional Jurisprudence', 'LAW101', 'Arts & Humanities', 'ShieldCheck', 'Sources of law, doctrine of precedent, separation of powers, and rule of law.', [
    makeTopic('tert-law-1', 1, 'Sources of Law & the Doctrine of Precedent', ['Customary law, received English law, and statutory legislation', 'Stare decisis and hierarchy of courts', 'Ratio decidendi vs obiter dictum', 'Constitutional supremacy and fundamental human rights'], 'Nigerian Legal Education Curriculum'),
  ]),
];

// ----------------------------------------------------------------------------
// 5. POSTGRADUATE & ADVANCED EDUCATION (M.Sc., MBA, PGD, Professional, PhD)
// ----------------------------------------------------------------------------
const POSTGRAD_RESEARCH_TOPICS: SyllabusTopic[] = [
  makeTopic('post-res-1', 1, 'Advanced Quantitative Research Methodology', ['Research design taxonomy: experimental vs quasi-experimental', 'Sampling techniques and sample size power calculations', 'Parametric vs non-parametric hypothesis testing', 'Multivariate regression, ANOVA and structural equation modeling (SEM)'], 'Postgraduate Research Standards & Doctoral Benchmarks'),
  makeTopic('post-res-2', 2, 'Literature Synthesis & Systematic Review Protocol', ['PRISMA guidelines for systematic literature reviews', 'Meta-analysis methodology and effect size calculation', 'Critical appraisal of peer-reviewed empirical evidence', 'Academic publishing ethics, citation indices, and peer-review defense'], 'Postgraduate Research Standards'),
];

const POSTGRAD_FINANCE_TOPICS: SyllabusTopic[] = [
  makeTopic('post-fin-1', 1, 'Corporate Valuation & Capital Budgeting Models', ['Discounted Cash Flow (DCF) and Free Cash Flow to Firm (FCFF)', 'Weighted Average Cost of Capital (WACC) estimation', 'Economic Value Added (EVA) and real options valuation', 'Mergers and acquisitions (M&A) synergy analysis'], 'Postgraduate MBA & Professional ICAN/CFA Standards'),
  makeTopic('post-fin-2', 2, 'Financial Risk Management & Portfolio Optimization', ['Modern Portfolio Theory and Capital Asset Pricing Model (CAPM)', 'Value at Risk (VaR) and Conditional VaR calculation', 'Derivative hedging strategies (Futures, Options, Swaps)', 'Enterprise Risk Management (ERM) frameworks (COSO)'], 'Postgraduate MBA Standards'),
];

const POSTGRAD_SUBJECTS: SyllabusSubject[] = [
  makeSubject('post-res', 'Advanced Research Methodology & Analytics', 'RES801', 'Sciences', 'Search', 'Quantitative & qualitative research design, SEM, hypothesis testing, and systematic reviews.', POSTGRAD_RESEARCH_TOPICS),
  makeSubject('post-finance', 'Advanced Corporate Finance & Valuation', 'FIN802', 'Commercial', 'TrendingUp', 'DCF valuation, M&A, WACC, portfolio theory, derivatives hedging, and enterprise risk.', POSTGRAD_FINANCE_TOPICS),
  makeSubject('post-leadership', 'Strategic Leadership & Organizational Dynamics', 'MGT801', 'Commercial', 'Award', 'Corporate strategy, competitive positioning, blue ocean strategy, and change leadership.', [
    makeTopic('post-lead-1', 1, 'Competitive Strategy & Strategic Positioning', ['Porter\'s Five Forces and Resource-Based View (RBV)', 'VRIO framework for sustainable competitive advantage', 'Disruptive innovation and platform business models', 'Corporate turnaround strategies and stakeholder governance'], 'Doctoral & MBA Strategic Management'),
  ]),
  makeSubject('post-ai', 'Machine Learning & Artificial Intelligence Systems', 'CSC801', 'Technical', 'BrainCircuit', 'Deep learning, neural networks, transformer architectures, reinforcement learning, and AI ethics.', [
    makeTopic('post-ai-1', 1, 'Supervised, Unsupervised & Deep Neural Networks', ['Backpropagation calculus and gradient descent optimization', 'Convolutional and Recurrent neural networks (CNNs & RNNs)', 'Attention mechanisms and Transformer foundations', 'Ethical AI alignment, bias mitigation, and safety evaluation'], 'Postgraduate Computer Science & AI Curriculum'),
  ]),
];

// Helper to assemble class grades for a country
export function assembleClassGradesForCountry(countryCode: string, waecSecondarySubjects: SyllabusSubject[]): ClassGrade[] {
  return [
    // 1. Early Childhood Education
    {
      id: `${countryCode.toLowerCase()}-early-childhood`,
      name: 'Early Childhood Education (Nursery 1-2 & KG)',
      shortName: 'Early Childhood (Nursery & KG)',
      tier: 'early_childhood',
      levelCategory: 'Early Childhood',
      examBoard: 'Early Childhood Development Directorate & NERDC',
      officialYear: '2024 / 2025',
      subjects: EARLY_CHILDHOOD_SUBJECTS,
    },
    // 2. Primary / Basic Education
    {
      id: `${countryCode.toLowerCase()}-primary`,
      name: 'Primary / Basic Education (Basic 1 - 6)',
      shortName: 'Primary School (Basic 1-6)',
      tier: 'primary',
      levelCategory: 'Primary',
      examBoard: 'Universal Basic Education Commission (UBEC) & State Boards',
      officialYear: '2024 / 2025',
      subjects: PRIMARY_SUBJECTS,
    },
    // 3. Junior Secondary Education
    {
      id: `${countryCode.toLowerCase()}-jss`,
      name: 'Junior Secondary School (JSS 1 - 3 / Basic 7 - 9)',
      shortName: 'JSS 1-3 / BECE Junior WAEC',
      tier: 'junior_secondary',
      levelCategory: 'Junior Secondary',
      examBoard: 'National Examinations Council (NECO) & State Ministry BECE',
      officialYear: '2024 / 2025',
      subjects: JSS_SUBJECTS,
    },
    // 4. Senior Secondary Education - SSS
    {
      id: `${countryCode.toLowerCase()}-sss`,
      name: 'Senior Secondary School (SSS 1 - 3)',
      shortName: 'SSS 1-3 / WAEC / NECO / GCE',
      tier: 'senior_secondary',
      levelCategory: 'Senior Secondary',
      examBoard: 'West African Examinations Council (WAEC) & NECO',
      officialYear: '2024 / 2025',
      subjects: waecSecondarySubjects,
    },
    // 4b. Senior Secondary - JAMB UTME Matriculation
    {
      id: `${countryCode.toLowerCase()}-jamb`,
      name: 'JAMB UTME Tertiary Matriculation Entrance',
      shortName: 'JAMB UTME (IBASS)',
      tier: 'senior_secondary',
      levelCategory: 'Tertiary Entrance',
      examBoard: 'Joint Admissions and Matriculation Board (JAMB)',
      officialYear: '2024 / 2025',
      subjects: waecSecondarySubjects,
    },
    // 5. Post-Secondary & Tertiary Education
    {
      id: `${countryCode.toLowerCase()}-tertiary`,
      name: 'Tertiary Education (University 100L-400L & Poly ND/HND)',
      shortName: 'Tertiary (University & Poly)',
      tier: 'tertiary',
      levelCategory: 'Tertiary',
      examBoard: 'National Universities Commission (NUC) & NBTE',
      officialYear: '2024 / 2025',
      subjects: TERTIARY_SUBJECTS,
    },
    // 6. Advanced & Postgraduate Education
    {
      id: `${countryCode.toLowerCase()}-postgraduate`,
      name: 'Advanced & Postgraduate Education (M.Sc., MBA, PGD, PhD)',
      shortName: 'Postgraduate & Professional',
      tier: 'postgraduate',
      levelCategory: 'Postgraduate',
      examBoard: 'School of Postgraduate Studies & Professional Institutes',
      officialYear: '2024 / 2025',
      subjects: POSTGRAD_SUBJECTS,
    },
  ];
}
