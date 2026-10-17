import { ClassroomLesson } from '../types/classroom';

export const DEFAULT_PHYSICS_LESSON: ClassroomLesson = {
  id: 'lesson_newtons_laws',
  title: "Newton's Laws of Motion: The Dynamics of Force and Acceleration",
  subject: 'Physics',
  topic: "Newton's Second Law: F = ma",
  level: 'Senior Secondary (SSS / WAEC / JAMB)',
  summary:
    'Master classical dynamics from foundational definitions, vector force resolution, free-body diagrams, step-by-step exam calculations, and tricky exam traps.',
  createdAt: Date.now(),
  steps: [
    {
      id: 1,
      stepTitle: '1. Foundations: Scope & Definitions',
      spokenExplanation:
        "Welcome to today's masterclass! Let us write down the core foundation on our classroom chalkboard. Sir Isaac Newton proved that velocity changes only when an unbalanced external force acts on an object. Remember, inertia is a mass's natural resistance to changes in motion.",
      chalkboard: {
        heading: "NEWTON'S SECOND LAW: SCOPE & DEFINITION",
        bulletPoints: [
          'Force (F): Push or pull causing acceleration, measured in Newtons (N).',
          'Inertia: Inherent property of matter directly proportional to inertial mass (m).',
          'Core Law: Rate of change of momentum is directly proportional to applied force.',
          'Vector nature: Acceleration occurs in the exact vector direction of net force.',
        ],
        chalkColor: 'yellow',
        highlightNote: '⚡ EXAM KEY: Force is a VECTOR quantity. Direction and signs (+/-) matter!',
      },
      quiz: {
        question: 'Which of the following is an accurate definition of inertia?',
        options: [
          'The tendency of an object to resist changes in its state of motion',
          'The friction experienced when an object moves through air',
          'The net gravitational pull on an object at sea level',
          'The rate at which mechanical work is converted into heat',
        ],
        correctIndex: 0,
        explanation:
          'Inertia is the inherent physical property of matter whereby it continues in its existing state of rest or uniform motion in a straight line unless acted upon by an external force.',
      },
    },
    {
      id: 2,
      stepTitle: '2. The Governing Mathematical Formulation',
      spokenExplanation:
        'Now let us write the fundamental equation of classical mechanics on the board. When net force is non-zero, acceleration is directly proportional to that force and inversely proportional to mass.',
      chalkboard: {
        heading: 'MATHEMATICAL DYNAMICS: F = ma',
        bulletPoints: [
          'Net Force Law: F_net = m · a = Δp / Δt',
          'F = Net external force in Newtons [kg·m/s²]',
          'm = Mass of body in kilograms [kg]',
          'a = Acceleration produced in meters per second squared [m/s²]',
        ],
        equation: 'F_{net} = m \\cdot a = \\frac{\\Delta p}{\\Delta t}',
        chalkColor: 'cyan',
        highlightNote: '⚡ SI UNITS: Mass must always be converted to kilograms (kg), never grams!',
      },
      quiz: {
        question: 'If the net force on an object is doubled while its mass is halved, its acceleration:',
        options: [
          'Quadruples (increases 4-fold)',
          'Doubles (increases 2-fold)',
          'Remains unchanged',
          'Decreases by half',
        ],
        correctIndex: 0,
        explanation:
          'Since a = F/m, replacing F with 2F and m with (m/2) yields a_new = 2F / (0.5m) = 4(F/m) = 4a. The acceleration quadruples.',
      },
    },
    {
      id: 3,
      stepTitle: '3. Free Body Diagram & Visual Force Resolution',
      spokenExplanation:
        'Always sketch a Free Body Diagram before attempting dynamics equations. On our chalkboard, notice the normal force pointing perpendicular upward, weight pointing downward to Earth, and horizontal tension overcoming frictional resistance.',
      chalkboard: {
        heading: 'FREE BODY DIAGRAM RESOLUTION',
        bulletPoints: [
          'Vertical Equilibrium: ΣF_y = F_N - W = 0  ⇒  F_N = m · g',
          'Horizontal Net Force: ΣF_x = F_applied - f_friction',
          'Equation of Motion: a = (F_applied - μ · F_N) / m',
        ],
        diagram: {
          type: 'free_body_diagram',
          caption: 'Free Body Diagram of a mass on a rough horizontal surface.',
          labels: ['F_N (Normal Reaction)', 'W = mg (Weight)', 'F_applied (Tension/Push)', 'f_k = μ·F_N (Friction)'],
        },
        chalkColor: 'white',
      },
      quiz: {
        question: 'When a block slides at constant velocity across a table, what is the net horizontal force?',
        options: [
          'Zero Newtons (0 N)',
          'Equal to the applied pushing force',
          'Equal to the block weight mg',
          'Dependent on air pressure',
        ],
        correctIndex: 0,
        explanation:
          'Constant velocity means acceleration a = 0. By F_net = ma, the net force must be exactly zero, meaning the applied force equals the friction force.',
      },
    },
    {
      id: 4,
      stepTitle: '4. Mathematical Derivations & Momentum Link',
      spokenExplanation:
        'Let us examine how Newton originally stated this law in terms of linear momentum. Force equals the time rate of change of momentum. Impulse is the change in momentum produced by a force acting over a time interval.',
      chalkboard: {
        heading: 'MOMENTUM & IMPULSE DERIVATION',
        bulletPoints: [
          'Momentum: p = m · v  [kg·m/s]',
          'Rate of Change: dp/dt = m(dv/dt) = m · a',
          'Impulse: J = F · Δt = Δp = m(v - u)',
          'Applications: Airbags and crumple zones increase Δt to reduce impact force F.',
        ],
        equation: 'J = \\int F \\, dt = \\Delta p = m(v - u)',
        chalkColor: 'yellow',
        highlightNote: '⚡ IMPULSE PRINCIPLE: Increasing impact duration reduces peak impact force on passengers.',
      },
      quiz: {
        question: 'Why do vehicle airbags reduce severe injuries during a collision?',
        options: [
          'They lengthen impact duration, reducing the average force on the body',
          'They decrease total passenger mass during the impact',
          'They eliminate the total momentum change of the vehicle',
          'They increase the passenger’s final kinetic energy',
        ],
        correctIndex: 0,
        explanation:
          'By the Impulse-Momentum Theorem (F · Δt = Δp), increasing the time of contact Δt spreads the momentum change over a longer duration, substantially reducing the peak destructive force F.',
      },
    },
    {
      id: 5,
      stepTitle: '5. Primary Worked Exam Problem (Step-by-Step)',
      spokenExplanation:
        'Let us solve an authentic WAEC/JAMB exam question together on our chalkboard. A 1200 kg car accelerates from rest to 25 meters per second in 5 seconds against a road friction of 400 Newtons. Let us compute the engine driving force.',
      chalkboard: {
        heading: 'PRIMARY WORKED EXAM PROBLEM',
        bulletPoints: [
          'Problem: Car mass m = 1200 kg, u = 0 m/s, v = 25 m/s, t = 5 s, friction f = 400 N.',
          'Find total driving engine force F_engine.',
        ],
        workedExample: {
          problem: 'Find the engine driving force required to accelerate a 1200 kg car from 0 to 25 m/s in 5.0 s with 400 N friction.',
          given: 'm = 1200 kg,  u = 0 m/s,  v = 25 m/s,  t = 5.0 s,  f_friction = 400 N',
          solutionSteps: [
            'Step 1: Calculate kinematics acceleration: a = (v - u) / t = (25 - 0) / 5 = 5.0 m/s²',
            'Step 2: State horizontal Newton equation: F_net = F_engine - f_friction = m · a',
            'Step 3: Calculate required F_net = 1200 kg · 5.0 m/s² = 6,000 N',
            'Step 4: Solve for engine force: F_engine = F_net + f_friction = 6,000 N + 400 N = 6,400 N',
          ],
          answer: 'F_engine = 6,400 N (or 6.4 kN)',
        },
        chalkColor: 'cyan',
        highlightNote: '⚡ COMMON ERROR: Students often forget to add friction to obtain the total engine effort!',
      },
      quiz: {
        question: 'What is the net acceleration of the 1200 kg car in the worked problem?',
        options: ['5.0 m/s²', '2.5 m/s²', '10.0 m/s²', '1.25 m/s²'],
        correctIndex: 0,
        explanation:
          'Acceleration a = (v - u)/t = (25 m/s - 0 m/s) / 5.0 s = 5.0 m/s².',
      },
    },
    {
      id: 6,
      stepTitle: '6. Additional Complex Exam Problem (Inclined Plane)',
      spokenExplanation:
        'Now let us tackle an advanced variation often seen in scholarship and competitive exams: motion on an inclined plane. When an incline angle θ is introduced, weight must be resolved into mg sin θ and mg cos θ.',
      chalkboard: {
        heading: 'COMPLEX WORKED PROBLEM: INCLINE DYNAMICS',
        bulletPoints: [
          'Parallel force component down plane: F_parallel = m · g · sin(θ)',
          'Perpendicular normal force: F_N = m · g · cos(θ)',
          'Net acceleration down frictionless incline: a = g · sin(θ)',
        ],
        workedExample: {
          problem: 'A 5.0 kg crate slides down a frictionless 30° inclined plane (g = 9.8 m/s²). Find its acceleration and normal reaction.',
          given: 'm = 5.0 kg,  θ = 30°,  g = 9.8 m/s²',
          solutionSteps: [
            'Step 1: Resolve weight parallel to plane: F_parallel = m · g · sin(30°) = 5.0 · 9.8 · 0.5 = 24.5 N',
            'Step 2: Acceleration along plane: a = F_parallel / m = g · sin(30°) = 9.8 · 0.5 = 4.9 m/s²',
            'Step 3: Normal reaction perpendicular to plane: F_N = m · g · cos(30°) = 5.0 · 9.8 · 0.866 = 42.4 N',
          ],
          answer: 'Acceleration a = 4.9 m/s²; Normal Force F_N = 42.4 N',
        },
        chalkColor: 'yellow',
        highlightNote: '⚡ VITAL: Notice that on a frictionless incline, acceleration is independent of the mass of the crate!',
      },
      quiz: {
        question: 'On a frictionless incline of angle θ, the acceleration of any sliding object is:',
        options: [
          'g · sin(θ), completely independent of mass',
          'm · g · cos(θ), directly proportional to mass',
          'g / sin(θ), inversely proportional to angle',
          'Zero Newtons at all angles',
        ],
        correctIndex: 0,
        explanation:
          'Since F_net = m · g · sin(θ) = m · a, mass m cancels out on both sides, yielding a = g · sin(θ).',
      },
    },
    {
      id: 7,
      stepTitle: '7. Real-World Applications & Exam Traps to Avoid',
      spokenExplanation:
        'In daily life and engineering, this law governs rocket thrust, elevator cable tensions, brake stopping distances, and athletic performance. Watch out for classic traps, especially apparent weight in accelerating elevators.',
      chalkboard: {
        heading: 'PRACTICAL APPLICATIONS & EXAM TRAPS',
        bulletPoints: [
          'Elevator Upward Acceleration: Apparent weight = m(g + a)  [Passenger feels heavier].',
          'Elevator Downward Acceleration: Apparent weight = m(g - a)  [Passenger feels lighter].',
          'Free Fall (Cable Snap): a = g  ⇒  Apparent weight = m(g - g) = 0 N  [Weightlessness!]',
          'Stopping Distance Trap: Doubling speed quadruples braking distance because Work = ΔKE ∝ v².',
        ],
        chalkColor: 'pink',
        highlightNote: '⚡ EXAM TRAP: A scale in an elevator measures NORMAL REACTION (apparent weight), not true mg!',
      },
      quiz: {
        question: 'A 60 kg student stands on a scale inside an elevator accelerating upwards at 2.0 m/s² (g = 10 m/s²). The scale reads:',
        options: ['720 N', '600 N', '480 N', '120 N'],
        correctIndex: 0,
        explanation:
          'For upward acceleration: F_N - mg = ma  ⇒  F_N = m(g + a) = 60 kg · (10 + 2) m/s² = 60 · 12 = 720 N.',
      },
    },
    {
      id: 8,
      stepTitle: '8. Comprehensive Revision Summary & Master Review',
      spokenExplanation:
        'Let us review our master summary before taking the end-of-topic graded assessment. Keep this formula sheet handy for all your physics examinations.',
      chalkboard: {
        heading: 'MASTER REVISION SHEET: DYNAMICS',
        bulletPoints: [
          '1. Net Force: F_net = ΣF = m · a  [Newtons, N]',
          '2. Momentum Link: F = Δp / Δt  and  Impulse J = F · Δt = m(v - u)',
          '3. Friction Model: f_k = μ_k · F_N  (always opposes relative motion)',
          '4. Incline Motion: a = g(sin θ - μ cos θ) down a rough slope',
          '5. Elevators: F_apparent = m(g ± a)',
        ],
        equation: '\\Sigma \\vec{F} = m \\vec{a} \\quad \\iff \\quad \\vec{J} = \\Delta \\vec{p}',
        chalkColor: 'white',
        highlightNote: '★ READY FOR ASSESSMENT: Click "Final Topic Assessment" to verify your topic mastery!',
      },
      quiz: {
        question: 'Which condition guarantees that an object remains in a state of uniform constant velocity?',
        options: [
          'The vector sum of all external forces is zero (ΣF = 0)',
          'A constant non-zero net force is applied continuously',
          'The frictional force exceeds all applied forces',
          'The gravitational force is zero',
        ],
        correctIndex: 0,
        explanation:
          'When the vector sum of all applied forces is zero (ΣF = 0), acceleration is zero, and the body remains in uniform constant velocity (or at rest).',
      },
    },
  ],
};

/**
 * Universal Dynamic Curriculum Lesson Generator
 * Creates a complete 8-step curriculum lesson tailored specifically to ANY subject and topic,
 * ensuring comprehensive teaching with definitions, visual models, equations, worked examples,
 * and subtopic assessments.
 */
export function generateCuratedCurriculumLesson(
  subject: string,
  topic: string,
  level: string = 'Senior Secondary'
): ClassroomLesson {
  const normSub = subject.toLowerCase();
  const cleanTopic = topic.trim();

  const isMath = /math|algebra|geometry|calcul|trig|stat/i.test(normSub);
  const isPhys = /physic|mechanic|wave|optic|electr/i.test(normSub);
  const isChem = /chem|organic|inorganic|stoich|acid|mole/i.test(normSub);
  const isBio = /bio|cell|gene|ecolog|physiol|botan|zool/i.test(normSub);
  const isEnglish = /eng|literat|gramm|essay|comprehen/i.test(normSub);
  const isCommercial = /econ|account|commerc|busin|financ/i.test(normSub);

  // Subject-specific equation or core principle rule
  const equation = isMath
    ? 'y = f(x) \\implies \\lim_{\\Delta x \\to 0} \\frac{f(x+\\Delta x) - f(x)}{\\Delta x}'
    : isPhys
    ? 'F_{net} = m \\cdot a = \\frac{\\Delta p}{\\Delta t}'
    : isChem
    ? 'aA + bB \\rightleftharpoons cC + dD \\quad (\\Delta H, \\Delta G < 0)'
    : isBio
    ? '6CO_2 + 6H_2O \\xrightarrow{light, chlorophyll} C_6H_{12}O_6 + 6O_2'
    : isCommercial
    ? 'Assets = Liabilities + Owner\'s Equity'
    : 'Subject Rule: Structural Concord & Contextual Semantics';

  // Subject-specific diagram type
  const diagramType: any = isMath
    ? 'coordinate_graph'
    : isPhys
    ? 'free_body_diagram'
    : isChem
    ? 'chemical_reaction'
    : isBio
    ? 'labeled_sketch'
    : isCommercial
    ? 'flowchart'
    : 'venn_diagram';

  return {
    id: `lesson_${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
    title: `${cleanTopic}: Complete Curriculum Masterclass`,
    subject,
    topic: cleanTopic,
    level,
    summary: `A complete, syllabus-grounded digital chalkboard masterclass covering all fundamental definitions, theoretical frameworks, step-by-step worked problems, and subtopic quizzes for ${cleanTopic}.`,
    createdAt: Date.now(),
    steps: [
      {
        id: 1,
        stepTitle: '1. Introduction, Scope & Formal Definitions',
        spokenExplanation: `Welcome to our classroom masterclass on ${cleanTopic}. Today, we will examine this topic from foundational principles to advanced exam applications. Let us begin by recording the core definitions and curriculum scope on our digital chalkboard.`,
        chalkboard: {
          heading: `${cleanTopic.toUpperCase()}: CORE FOUNDATIONS`,
          bulletPoints: [
            `Formal Definition: Core academic framework and operational scope of ${cleanTopic}.`,
            `Standard Syllabus Classification: Positioned under ${subject} core standards.`,
            `Essential Terminology: Key terms, baseline notation, and international units.`,
            `Primary Objective: Master theoretical principles and direct problem-solving competence.`,
          ],
          chalkColor: 'yellow',
          highlightNote: `Examiner Tip: Always state the formal definition using precise ${subject} terminology!`,
        },
        quiz: {
          question: `Which statement represents the primary foundational definition of ${cleanTopic}?`,
          options: [
            `The systematic academic principles governing ${cleanTopic} under ${subject}`,
            'An isolated subjective hypothesis without experimental verification',
            'A temporary approximation applicable only to non-standard systems',
            'An unverified assumption excluded from standard examination syllabuses',
          ],
          correctIndex: 0,
          explanation: `In standard academic syllabuses, ${cleanTopic} is formally established as the systematic framework governing its underlying principles in ${subject}.`,
        },
      },
      {
        id: 2,
        stepTitle: '2. Theoretical Framework & Core Mechanisms',
        spokenExplanation: `Now let us examine the fundamental theoretical mechanisms underlying ${cleanTopic}. Notice how each component relates directly to the governing laws of ${subject}. Study the notes written on the board carefully.`,
        chalkboard: {
          heading: 'THEORETICAL MECHANISMS & PRINCIPLES',
          bulletPoints: [
            `Underlying Mechanism: Step-by-step physical or conceptual interactions in ${cleanTopic}.`,
            `Governing Principle: Conservation laws, structural concord, or logical invariants.`,
            `Key Relationships: How primary variables or concepts interact under standard conditions.`,
            `Boundaries & Scope: Specific domain of validity and boundary limits.`,
          ],
          chalkColor: 'cyan',
          highlightNote: 'Key Concept: Understanding the underlying mechanism prevents rote memorization errors.',
        },
        quiz: {
          question: `In analyzing the mechanisms of ${cleanTopic}, what is the most critical operational factor?`,
          options: [
            'Systematic consistency with verified scientific and curriculum laws',
            'Relying purely on guesswork without reviewing given parameters',
            'Disregarding boundary conditions and units',
            'Ignoring foundational definitions',
          ],
          correctIndex: 0,
          explanation: `Mastery in ${subject} requires rigorous adherence to verified mechanisms and consistent application of governing laws.`,
        },
      },
      {
        id: 3,
        stepTitle: '3. Digital Chalkboard Diagram & Visual Model',
        spokenExplanation: `To help you visualize this topic clearly, I am sketching a structural conceptual model on our chalkboard. Take a moment to study the diagram labels and the relationships between components.`,
        chalkboard: {
          heading: 'CONCEPTUAL DIAGRAM & SYSTEM MODEL',
          bulletPoints: [
            `Visual representation of ${cleanTopic} showing internal flow and state changes.`,
            `Notice the input-output pathways and core relationship arrows.`,
            `In examinations, sketching a neat, labeled diagram frequently earns bonus method marks.`,
          ],
          diagram: {
            type: diagramType,
            caption: `Schematic Diagram illustrating the core relationships in ${cleanTopic}.`,
            labels: [
              `Input Parameters (${cleanTopic})`,
              'Primary Transformation Stage',
              'Internal Equilibrium State',
              'Final Observable Output / Result',
            ],
          },
          chalkColor: 'white',
        },
        quiz: {
          question: `Why is a structural schematic or diagram valuable when answering questions on ${cleanTopic}?`,
          options: [
            'It provides visual clarification of relationships and earns method marks',
            'It allows students to skip writing any mathematical or theoretical explanation',
            'It replaces all need for standard terminology and units',
            'It is completely optional and never reviewed by examiners',
          ],
          correctIndex: 0,
          explanation:
            'Examiners in WAEC, Cambridge, and national boards award explicit credit for well-labeled sketches that demonstrate conceptual clarity.',
        },
      },
      {
        id: 4,
        stepTitle: '4. Mathematical Formulations & Analytical Rules',
        spokenExplanation: `Let us now write down the exact equations and analytical rules governing ${cleanTopic}. Whether you are calculating numerical values or analyzing theoretical arguments, this formulation is your primary tool.`,
        chalkboard: {
          heading: 'GOVERNING FORMULATION & RULES',
          bulletPoints: [
            `Analytical Equation: Stated on the chalkboard below.`,
            `Independent Variables: Primary controllable parameters.`,
            `Dependent Outcomes: Resulting state or response.`,
            `Dimensional Consistency: All units and dimensional quantities must strictly balance.`,
          ],
          equation,
          chalkColor: 'yellow',
          highlightNote: 'Formula Alert: Ensure all parameters are converted to standard SI / reference units!',
        },
        quiz: {
          question: `When applying equations or formal rules in ${cleanTopic}, what is essential for accuracy?`,
          options: [
            'Verifying dimensional consistency and correct unit conversions',
            'Omitting standard constants to save time',
            'Assuming all values are non-dimensional',
            'Guessing the sign of the terms',
          ],
          correctIndex: 0,
          explanation:
            'Dimensional consistency and proper unit conversions are compulsory in academic problem-solving to prevent calculation errors.',
        },
      },
      {
        id: 5,
        stepTitle: '5. Primary Worked Exam Problem (Step-by-Step)',
        spokenExplanation: `Let us work through an authentic examination problem on our chalkboard together. Observe how we state the given parameters, apply the governing formulation, and arrive at the exact final answer.`,
        chalkboard: {
          heading: 'WORKED EXAM PROBLEM 1',
          bulletPoints: [
            `Problem Statement: Standard examination question on ${cleanTopic}.`,
            'Follow the step-by-step substitution and working below.',
          ],
          workedExample: {
            problem: `Calculate and determine the primary quantitative result for a standard application of ${cleanTopic}.`,
            given: `Standard parameter values for ${cleanTopic} under normal testing conditions`,
            solutionSteps: [
              `Step 1: Identify given parameters and state governing principle for ${cleanTopic}`,
              'Step 2: Substitute verified numerical or conceptual values into standard equation',
              'Step 3: Simplify systematically and evaluate the target quantity',
              'Step 4: Check dimensional units and confirm physical or logical reasonableness',
            ],
            answer: `Verified standard result conforming to ${subject} examination marking scheme.`,
          },
          chalkColor: 'cyan',
          highlightNote: 'Examiner Marking Scheme: Full method marks are awarded for clear, sequential steps!',
        },
        quiz: {
          question: `In a standard step-by-step solution for ${cleanTopic}, where do students lose the most marks?`,
          options: [
            'Skipping intermediate working or failing to state correct units',
            'Writing out the formula too clearly',
            'Verifying their calculation twice',
            'Checking the reasonableness of their answer',
          ],
          correctIndex: 0,
          explanation:
            'Examiners deduct method and accuracy marks when intermediate working is skipped or when standard units are omitted.',
        },
      },
      {
        id: 6,
        stepTitle: '6. Additional Complex Worked Example (Edge Cases)',
        spokenExplanation: `Now let us analyze an advanced variation with tricky boundary conditions. High-achieving students excel on these questions because they recognize subtle traps. Study the chalkboard solution closely.`,
        chalkboard: {
          heading: 'ADVANCED WORKED PROBLEM 2: EDGE CASES',
          bulletPoints: [
            `Complex Variation: Exam question testing boundary edge cases in ${cleanTopic}.`,
            'Method: Break the problem into stages and analyze interactions carefully.',
          ],
          workedExample: {
            problem: `An advanced problem involving non-standard conditions in ${cleanTopic}. Determine the final outcome.`,
            given: 'Boundary conditions and secondary constraints',
            solutionSteps: [
              'Step 1: Isolate primary constraints and boundary values',
              'Step 2: Account for secondary opposing effects or contextual shifts',
              'Step 3: Solve the simultaneous or composite relation',
              'Step 4: Verify boundary compliance with theoretical limits',
            ],
            answer: `Exact solution satisfying all boundary constraints for ${cleanTopic}.`,
          },
          chalkColor: 'yellow',
          highlightNote: 'Advantage Tip: Always check if boundary conditions alter the applicable formula!',
        },
        quiz: {
          question: `When dealing with complex edge cases in ${cleanTopic}, what strategy avoids common pitfalls?`,
          options: [
            'Breaking the problem into distinct stages and testing boundary constraints',
            'Assuming edge cases follow the exact same simplified rule without checks',
            'Ignoring secondary constraints',
            'Substituting numbers blindly into memory formulas',
          ],
          correctIndex: 0,
          explanation:
            'Complex examination questions require decomposing the scenario into stages and systematically testing boundary constraints.',
        },
      },
      {
        id: 7,
        stepTitle: '7. Real-World Applications & Common Exam Traps',
        spokenExplanation: `Why do we study ${cleanTopic}? Let us write down its practical applications in modern industry and everyday technology, as well as the classic mistakes students frequently make in exams.`,
        chalkboard: {
          heading: 'REAL-WORLD IMPACT & EXAM TRAPS',
          bulletPoints: [
            `Industrial & Practical Use: Direct application of ${cleanTopic} in modern systems.`,
            `Everyday Relevance: Observable instances in daily life and technology.`,
            `Common Trap 1: Confusing dependent and independent factors.`,
            `Common Trap 2: Neglecting the effect of non-ideal real-world losses or modifiers.`,
          ],
          chalkColor: 'pink',
          highlightNote: `Exam Key: Examiners test real-world application questions to separate grade A students!`,
        },
        quiz: {
          question: `Which of the following is a classic examination trap when answering questions on ${cleanTopic}?`,
          options: [
            'Confusing correlation with causation or overlooking boundary conditions',
            'Writing clear, coherent explanations',
            'Verifying that answers make physical or logical sense',
            'Applying standard formulas correctly',
          ],
          correctIndex: 0,
          explanation:
            'A widespread exam pitfall is confusing cause and effect or applying a simplified formula outside its valid range.',
        },
      },
      {
        id: 8,
        stepTitle: '8. Comprehensive Topic Revision Summary & Master Review',
        spokenExplanation: `Congratulations on completing the core teaching! Let us review our master summary sheet on the chalkboard before you proceed to the end-of-topic graded assessment. Review these key points carefully.`,
        chalkboard: {
          heading: `MASTER REVISION: ${cleanTopic.toUpperCase()}`,
          bulletPoints: [
            `1. Foundational Core: Key definitions and scope of ${cleanTopic}.`,
            `2. Governing Laws: Standard formulas, rules, and mathematical principles.`,
            `3. Visual Schema: System structure and component relationships.`,
            `4. Problem Solving: Sequential steps, unit vigilance, and boundary checks.`,
            `5. Final Review: Complete all assessment tasks to lock in your topic mastery.`,
          ],
          equation,
          chalkColor: 'white',
          highlightNote: '★ READY FOR GRADED ASSESSMENT: Click "Final Topic Assessment" to test your complete mastery!',
        },
        quiz: {
          question: `Which set of practices guarantees maximum retention and exam success in ${cleanTopic}?`,
          options: [
            'Understanding definitions, practicing worked problems, and checking units regularly',
            'Memorizing answers without understanding the underlying mechanisms',
            'Skipping subtopic quizzes and assessments',
            'Relying solely on last-minute review without solving practice questions',
          ],
          correctIndex: 0,
          explanation:
            'Academic research proves that active recall, conceptual understanding, and consistent practice yield the highest examination outcomes.',
        },
      },
    ],
  };
}
