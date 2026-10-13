import { ClassroomLesson } from '../types/classroom';

export const DEFAULT_PHYSICS_LESSON: ClassroomLesson = {
  id: 'lesson_newtons_laws',
  title: "Newton's Laws of Motion: The Dynamics of Force and Acceleration",
  subject: 'Physics',
  topic: "Newton's Second Law: F = ma",
  level: 'Senior Secondary (SSS / WAEC / JAMB)',
  summary:
    'Explore how unbalanced forces cause masses to accelerate, master the vector formulation F = ma, and solve real-world dynamics problems step-by-step.',
  createdAt: Date.now(),
  steps: [
    {
      id: 1,
      stepTitle: '1. Foundations of Force & Motion',
      spokenExplanation:
        "Welcome to today's physics classroom! Today, we are unlocking the secret behind why things move and change speed. Sir Isaac Newton showed that an object will continue in its natural state unless acted on by an external net force. Let us write down the core definition on our board.",
      chalkboard: {
        heading: "NEWTON'S SECOND LAW OF MOTION",
        bulletPoints: [
          'Force is an external push or pull measured in Newtons (N).',
          'Inertia is the natural resistance of any mass to changes in motion.',
          'Acceleration (a) is directly proportional to Net Force (F_net).',
          'Acceleration is inversely proportional to mass (m).',
        ],
        chalkColor: 'yellow',
        highlightNote: '⚡ EXAM KEY: Force is a VECTOR quantity. Direction matters!',
      },
    },
    {
      id: 2,
      stepTitle: '2. The Governing Mathematical Law',
      spokenExplanation:
        'Now let us write the fundamental equation of classical dynamics on the chalkboard. When the net force acting on a body is non-zero, it accelerates in the exact direction of that net force. Watch the mathematical formulation closely.',
      chalkboard: {
        heading: 'THE MATHEMATICAL FORMULATION',
        bulletPoints: [
          'Equation: F_net = m · a',
          'Where F = Net force in Newtons [kg·m/s²]',
          'm = Mass of the object in kilograms [kg]',
          'a = Resulting acceleration in meters per second squared [m/s²]',
        ],
        equation: 'F_{net} = m \\cdot a = \\frac{\\Delta p}{\\Delta t}',
        chalkColor: 'cyan',
        highlightNote: '⚡ SI UNITS: Mass MUST be converted to kg, not grams!',
      },
    },
    {
      id: 3,
      stepTitle: '3. Free Body Diagram & Force Resolution',
      spokenExplanation:
        'To solve any dynamics problem in your exams, always sketch a Free Body Diagram first! Let me draw the block on our digital chalkboard. Notice the normal force pointing upward, the weight pointing downward toward the center of the earth, and the horizontal applied force overcoming friction.',
      chalkboard: {
        heading: 'FREE BODY DIAGRAM RESOLUTION',
        bulletPoints: [
          'Vertical balance: F_N - W = 0  ⇒  F_N = m · g',
          'Horizontal motion: F_net = F_applied - f_friction',
          'Net Acceleration: a = (F_applied - f_friction) / m',
        ],
        diagram: {
          type: 'free_body_diagram',
          caption: 'Free Body Diagram of a mass on a rough horizontal plane.',
          labels: ['F_N (Normal Force)', 'W = mg (Weight)', 'F_applied (Pulling Force)', 'f_k (Kinetic Friction)'],
        },
        chalkColor: 'white',
      },
    },
    {
      id: 4,
      stepTitle: '4. Step-by-Step Worked Problem',
      spokenExplanation:
        'Let us work through a classic exam question together on the board. A 1200 kilogram car accelerates from rest to 20 meters per second in 5 seconds. Let us calculate the net engine force required to produce this motion.',
      chalkboard: {
        heading: 'WORKED EXAM PROBLEM',
        bulletPoints: [
          'Problem: A car of mass 1200 kg accelerates from 0 to 20 m/s in 5 s.',
          'Find the net force exerted by the engine.',
        ],
        workedExample: {
          problem: 'Find the net force acting on a 1200 kg car that accelerates from rest to 20 m/s in 5.0 seconds.',
          given: 'm = 1200 kg,  u = 0 m/s,  v = 20 m/s,  t = 5.0 s',
          solutionSteps: [
            'Find acceleration using kinematics: a = (v - u) / t = (20 - 0) / 5 = 4.0 m/s²',
            'Apply Newton’s Second Law: F = m · a',
            'Substitute values: F = 1200 kg · 4.0 m/s²',
          ],
          answer: 'F = 4,800 N (or 4.8 kN)',
        },
        chalkColor: 'yellow',
        highlightNote: '⚡ CHECK: The answer has the correct unit (Newtons)!',
      },
    },
    {
      id: 5,
      stepTitle: '5. Real-World Applications & Exam Pitfalls',
      spokenExplanation:
        'In the real world, this law governs rocket propulsion, car safety airbags, elevator cable tensions, and athletic sprinters. Beware of common exam pitfalls, such as forgetting that acceleration drops to zero when velocity is constant!',
      chalkboard: {
        heading: 'REAL-WORLD INSIGHT & COMMON TRAPS',
        bulletPoints: [
          'Terminal Velocity: When air resistance equals weight, F_net = 0, so acceleration a = 0!',
          'Constant Speed Trap: Constant velocity does NOT mean zero force, it means ZERO NET FORCE.',
          'Elevator Tension: When an elevator accelerates upward, apparent weight = m(g + a).',
        ],
        chalkColor: 'pink',
        highlightNote: '⚡ REMEMBER: If velocity is constant, F_net = 0 always!',
      },
    },
    {
      id: 6,
      stepTitle: '6. Quick Mastery Check',
      spokenExplanation:
        'Now it is time to test your understanding! Look at the question on the chalkboard and select the correct option. Let us see if you can apply Newton’s law correctly.',
      chalkboard: {
        heading: 'CLASSROOM MASTERY CHECK',
        bulletPoints: [
          'Test your grasp of force, mass, and acceleration relationships.',
          'Select your answer below to receive immediate feedback.',
        ],
        chalkColor: 'white',
      },
      quiz: {
        question:
          'If the net force acting on a cart is tripled while its mass is doubled, what is the new acceleration compared to the original acceleration a_0?',
        options: [
          'It becomes 1.5 times the original acceleration (1.5 a_0)',
          'It becomes 6 times the original acceleration (6 a_0)',
          'It becomes 0.67 times the original acceleration (2/3 a_0)',
          'The acceleration remains unchanged',
        ],
        correctIndex: 0,
        explanation:
          'Correct! According to F = ma, a = F/m. If force becomes 3F and mass becomes 2m, the new acceleration is a = 3F / (2m) = (3/2) · (F/m) = 1.5 a_0.',
      },
    },
  ],
};
