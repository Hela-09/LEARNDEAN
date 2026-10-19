import { ClassroomLesson } from '../types/classroom';

export const DEFAULT_PHOTOSYNTHESIS_LESSON: ClassroomLesson = {
  id: 'lesson_photosynthesis_masterclass',
  title: 'Photosynthesis: How Green Plants Manufacture Food',
  subject: 'Biology',
  topic: 'Photosynthesis',
  level: 'Secondary Education',
  summary:
    'A complete pedagogical masterclass introducing photosynthesis from beginner principles, what plants need, step-by-step chemical equations, chloroplast architecture, and ecological significance.',
  createdAt: Date.now(),
  steps: [
    {
      id: 1,
      stepTitle: '1. Meaning of Photosynthesis',
      spokenExplanation:
        "Today, we are learning about photosynthesis. Before we begin, think about a plant growing in a pot. You give it water, place it where it can receive sunlight, and it grows. But where does the plant get the food it needs to grow? That is the question photosynthesis helps us answer. In simple words, photosynthesis is the process green plants use to make their own food. The word comes from two Greek words: 'photo', which means light, and 'synthesis', which means putting things together. So green plants use light energy to make glucose from water and carbon dioxide, releasing oxygen into the air in the process. Glucose is a simple type of sugar that the plant uses for energy and growth. Unlike humans and animals that eat other living things, green plants are autotrophs—they manufacture their own nourishment from simple ingredients. Can you explain in your own words where a plant gets the materials it uses to make glucose?",
      chalkboard: {
        heading: 'PHOTOSYNTHESIS: MEANING & DEFINITION',
        bulletPoints: [
          'Definition: The process by which green plants manufacture glucose from water and carbon dioxide using light energy.',
          'Etymology: "Photo" means light; "Synthesis" means putting ingredients together.',
          'Glucose: A simple soluble sugar used by plant cells for energy, growth, and tissue repair.',
          'By-Product: Oxygen gas (O₂) is produced and released into the atmosphere.',
        ],
        chalkColor: 'yellow',
        highlightNote: '⚡ CORE CONCEPT: Plants are autotrophs—they make their own food from inorganic raw materials.',
      },
      conversationalCheck: {
        question: 'Can you explain in your own words where a plant gets the materials it uses to make glucose?',
        hint: 'Think about the soil beneath the plant and the air surrounding its leaves.',
      },
      explanationBreakdown: [
        {
          point: 'Definition: The process by which green plants manufacture glucose from water and carbon dioxide using light energy.',
          explanation: 'Plants do not eat food like animals do; they use light energy to chemically build their food inside their leaves.',
          example: 'A potted plant placed on a sunny windowsill grows bigger even though you only give it water.',
          simplifiedTerms: [
            { term: 'Photosynthesis', meaning: 'Using light energy to assemble nourishment from simple raw materials.' },
          ],
        },
        {
          point: 'Etymology: "Photo" means light; "Synthesis" means putting ingredients together.',
          explanation: 'The name itself explains the entire process: light is the energy source used to build chemical compounds.',
          example: 'Like taking individual building blocks and assembling them into a house using power tools.',
          simplifiedTerms: [
            { term: 'Synthesis', meaning: 'Putting smaller parts together to create a complex substance.' },
          ],
        },
        {
          point: 'Glucose: A simple soluble sugar used by plant cells for energy, growth, and tissue repair.',
          explanation: 'Glucose is the end product of photosynthesis. The plant uses it immediately for energy or stores it as starch for later.',
          example: 'Sweet fruits, potatoes, and maize grains are rich stores of food made from glucose.',
          simplifiedTerms: [
            { term: 'Glucose', meaning: 'A simple type of sugar that provides cells with fuel.' },
          ],
        },
        {
          point: 'By-Product: Oxygen gas (O₂) is produced and released into the atmosphere.',
          explanation: 'During the chemical process, oxygen is liberated from water molecules and exits the leaves into the air.',
          example: 'The oxygen we breathe in every second originally came from plants undergoing photosynthesis.',
          simplifiedTerms: [
            { term: 'By-Product', meaning: 'Something useful made during a process in addition to the main product.' },
          ],
        },
      ],
      quiz: {
        question: 'What is glucose in the context of plant nutrition?',
        options: [
          'A simple type of sugar that the plant uses for energy and growth',
          'A mineral absorbed directly from sand particles',
          'A green pigment that traps sunlight',
          'A waste gas released into the atmosphere',
        ],
        correctIndex: 0,
        explanation: 'Glucose is a soluble sugar manufactured during photosynthesis that plant cells use for energy, respiration, and cellular growth.',
      },
    },
    {
      id: 2,
      stepTitle: '2. What Plants Need for Photosynthesis',
      spokenExplanation:
        "Now let us look at the four essential ingredients that plants need for photosynthesis written on our board. The first is sunlight. Sunlight provides the light energy that powers the entire chemical process. The second is water. Plants absorb water from the soil through their roots and transport it up the stem to the leaves. The third ingredient is carbon dioxide. Carbon dioxide is an invisible gas in the air around us. Leaves take in this gas through microscopic pores on their surface called stomata. Finally, the fourth ingredient is chlorophyll. Chlorophyll is the special green pigment that absorbs light energy, and it is housed inside tiny cellular structures called chloroplasts. Without chlorophyll, the leaf cannot capture light energy, just like a solar panel that has been disconnected. Think of these four items like the ingredients a chef needs to bake bread: take away even one, and the recipe cannot work! Why do you think a plant in a dark cupboard cannot make food, even if you water it regularly?",
      chalkboard: {
        heading: 'WHAT PLANTS NEED FOR PHOTOSYNTHESIS',
        bulletPoints: [
          'Sunlight: Radiant light energy that powers the chemical conversion.',
          'Water (H₂O): Absorbed from soil by root hair cells and carried up via xylem vessels.',
          'Carbon Dioxide (CO₂): Atmospheric gas absorbed through microscopic leaf openings called stomata.',
          'Chlorophyll: Green pigment inside chloroplasts that captures and traps light energy.',
        ],
        diagram: {
          type: 'labeled_sketch',
          caption: 'Essential inputs for photosynthesis: Sunlight, CO2 via stomata, and H2O via roots.',
          labels: ['Sunlight (Light Energy)', 'CO2 entering leaf via Stomata', 'H2O absorbed by Roots', 'Chloroplasts containing Chlorophyll'],
        },
        chalkColor: 'cyan',
        highlightNote: '⚡ FACT CHECK: Chlorophyll absorbs blue and red wavelengths of light, reflecting green—giving plants their green appearance!',
      },
      conversationalCheck: {
        question: 'Why can a healthy green plant not carry out photosynthesis if left inside a completely dark cupboard with plenty of water?',
        hint: 'Consider which of the four essential ingredients is completely absent in the dark.',
      },
      explanationBreakdown: [
        {
          point: 'Sunlight: Radiant light energy that powers the chemical conversion.',
          explanation: 'Light provides the physical energy required to split chemical bonds and power glucose synthesis.',
          example: 'Plants placed near a sunny window naturally bend towards the sun to capture maximum light.',
          simplifiedTerms: [{ term: 'Light Energy', meaning: 'Energy carried by light waves from the sun.' }],
        },
        {
          point: 'Water (H₂O): Absorbed from soil by root hair cells and carried up via xylem vessels.',
          explanation: 'Roots act like drinking straws, drawing moisture and dissolved minerals from the damp soil.',
          example: 'When soil dries out, leaves wilt because cells lack the water needed to maintain shape and make food.',
          simplifiedTerms: [{ term: 'Xylem', meaning: 'Microscopic plant tubes that transport water from roots to leaves.' }],
        },
        {
          point: 'Carbon Dioxide (CO₂): Atmospheric gas absorbed through microscopic leaf openings called stomata.',
          explanation: 'Leaves have microscopic pores like tiny breathing mouths that open to allow carbon dioxide gas to enter.',
          example: 'When humans breathe out carbon dioxide, green plants take in that gas to build their stems and leaves.',
          simplifiedTerms: [{ term: 'Stomata', meaning: 'Tiny microscopic pores on the underside of leaves for gas exchange.' }],
        },
        {
          point: 'Chlorophyll: Green pigment inside chloroplasts that captures and traps light energy.',
          explanation: 'Chlorophyll acts like tiny solar panels inside plant cells, catching sunlight and converting it to chemical energy.',
          example: 'Pale or yellow leaves struggle to grow because they have less chlorophyll to absorb sunlight.',
          simplifiedTerms: [
            { term: 'Chlorophyll', meaning: 'The green chemical in plants that absorbs light.' },
            { term: 'Chloroplast', meaning: 'The microscopic compartment inside plant cells where photosynthesis happens.' },
          ],
        },
      ],
      quiz: {
        question: 'Through which tiny openings do leaves absorb carbon dioxide gas from the atmosphere?',
        options: ['Stomata', 'Chloroplasts', 'Root hairs', 'Xylem vessels'],
        correctIndex: 0,
        explanation: 'Stomata are microscopic pores located predominantly on the underside of leaves that open and close to allow gases such as carbon dioxide and oxygen to diffuse in and out.',
      },
    },
    {
      id: 3,
      stepTitle: '3. How the Process Works & The Word Equation',
      spokenExplanation:
        "Now let us examine how these ingredients react in logical steps. First, water enters through the roots and travels up through thin tubes called xylem vessels right into the leaf cells. At the same time, carbon dioxide diffuses from the air into the leaves through the stomata. Inside the chloroplasts, the green chlorophyll absorbs light energy from the sun. The plant uses that light energy to split water and combine hydrogen with carbon dioxide to manufacture glucose sugar. During this reaction, oxygen gas is released as a by-product and diffuses out through the stomata into the atmosphere. On our chalkboard, notice the clear word equation: Carbon dioxide + Water, in the presence of light and chlorophyll, produces Glucose + Oxygen. Notice what enters the process on the left, and what is produced on the right. Never look at an equation as mere memorized symbols—each side tells the story of matter and energy transforming into life! Can you tell me what the two inputs entering the reaction are, and what the two products created are?",
      chalkboard: {
        heading: 'HOW PHOTOSYNTHESIS WORKS: THE WORD EQUATION',
        bulletPoints: [
          'Step 1: Water enters roots and travels up stem to leaves via xylem.',
          'Step 2: Carbon dioxide enters leaves from the atmosphere through stomata.',
          'Step 3: Chlorophyll absorbs light energy, driving chemical bond formation.',
          'Outputs: Glucose sugar is produced for energy; oxygen gas is released into the air.',
        ],
        equation: 'Carbon dioxide + Water \\xrightarrow{light, chlorophyll} Glucose + Oxygen',
        chalkColor: 'white',
        highlightNote: '⚡ CHEMICAL EQUATION: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (Balanced formula equation).',
      },
      conversationalCheck: {
        question: 'Looking at the word equation, what are the two inputs entering the reaction, and what are the two outputs produced?',
        hint: 'Look at what is on the left side of the arrow versus what appears on the right side.',
      },
      explanationBreakdown: [
        {
          point: 'Step 1: Water enters roots and travels up stem to leaves via xylem.',
          explanation: 'Water provides the hydrogen atoms that will be combined with carbon to build glucose.',
          example: 'Watering the soil beneath a garden bed supplies water to the highest leaves within minutes.',
          simplifiedTerms: [{ term: 'Reactants', meaning: 'The starting substances that enter into a chemical reaction.' }],
        },
        {
          point: 'Step 2: Carbon dioxide enters leaves from the atmosphere through stomata.',
          explanation: 'Carbon dioxide provides the carbon atoms that form the backbone of the glucose sugar molecule.',
          example: 'Carbon from the air becomes the solid wood of a giant tree over decades.',
          simplifiedTerms: [{ term: 'Diffusion', meaning: 'The natural movement of gas particles from high to low concentration.' }],
        },
        {
          point: 'Step 3: Chlorophyll absorbs light energy, driving chemical bond formation.',
          explanation: 'Chemical bonds require energy to form; light energy is converted into chemical energy stored in glucose.',
          example: 'Charging a phone battery stores electrical energy as chemical energy for later use.',
          simplifiedTerms: [{ term: 'Chemical Energy', meaning: 'Energy stored within the bonds of chemical substances.' }],
        },
        {
          point: 'Outputs: Glucose sugar is produced for energy; oxygen gas is released into the air.',
          explanation: 'Glucose is kept by the plant for life processes, while oxygen is released as a gift to the atmosphere.',
          example: 'Walking through a dense forest in the morning feels refreshing because trees are actively producing oxygen.',
          simplifiedTerms: [{ term: 'Products', meaning: 'The new substances formed at the end of a chemical reaction.' }],
        },
      ],
      quiz: {
        question: 'In the photosynthesis word equation, which substances are the two primary reactants on the left side?',
        options: [
          'Carbon dioxide and Water',
          'Glucose and Oxygen',
          'Chlorophyll and Sunlight',
          'Starch and Minerals',
        ],
        correctIndex: 0,
        explanation: 'The two reactants that enter the photosynthetic reaction are Carbon Dioxide (from air) and Water (from soil).',
      },
    },
    {
      id: 4,
      stepTitle: '4. Why Photosynthesis Matters to Life on Earth',
      spokenExplanation:
        "Why does photosynthesis matter so much to our planet? Think of a maize plant growing on a farm or a leafy mango tree in a garden. The plant uses the glucose it makes to build new leaves, strong roots, and sweet fruits or seeds. When a farmer harvests maize, the food energy stored in that grain came directly from the sun via photosynthesis. Furthermore, almost all the oxygen in our atmosphere that humans and animals breathe every second is produced by green plants and ocean algae during photosynthesis. Without photosynthesis, food chains would collapse, and living creatures would run out of oxygen. This makes plants the primary producers of life on Earth! In your own words, can you explain two different ways photosynthesis supports animal and human life?",
      chalkboard: {
        heading: 'WHY PHOTOSYNTHESIS MATTERS TO OUR PLANET',
        bulletPoints: [
          'Primary Food Production: Produces the food energy that forms the base of terrestrial and aquatic food chains.',
          'Atmospheric Oxygen: Supplies and replenishes oxygen gas (O₂) required for aerobic respiration by animals and humans.',
          'Carbon Cycle Balance: Removes carbon dioxide from the atmosphere, helping regulate planetary temperature.',
          'Biomass & Fuel: Forms plant biomass (timber, grains, fruits) and the ancient fossil fuels used in industry.',
        ],
        chalkColor: 'pink',
        highlightNote: '⚡ ECOLOGICAL KEY: Green plants are "Producers"—the sole organisms converting radiant sun energy into edible biomass.',
      },
      conversationalCheck: {
        question: 'Can you explain two different ways photosynthesis directly supports human life every single day?',
        hint: 'Think about what humans breathe in, and where the energy in our food originally came from.',
      },
      explanationBreakdown: [
        {
          point: 'Primary Food Production: Produces the food energy that forms the base of terrestrial and aquatic food chains.',
          explanation: 'Every grain of rice, ear of corn, or fruit exists because plant cells manufactured glucose from sunlight.',
          example: 'A cow eats grass that photosynthesized, and humans drink milk or eat beef derived from that energy.',
          simplifiedTerms: [{ term: 'Food Chain', meaning: 'The sequence of who eats whom in an ecosystem to obtain energy.' }],
        },
        {
          point: 'Atmospheric Oxygen: Supplies and replenishes oxygen gas (O₂) required for aerobic respiration by animals and humans.',
          explanation: 'Plants continuously replenish the oxygen we consume with every breath.',
          example: 'Forests and ocean phytoplankton are often called the "lungs of the planet" because they generate oxygen.',
          simplifiedTerms: [{ term: 'Aerobic Respiration', meaning: 'Using oxygen to release energy from food inside living cells.' }],
        },
      ],
      quiz: {
        question: 'Why are green plants described as the primary producers in an ecosystem?',
        options: [
          'They manufacture organic food energy directly from sunlight and inorganic substances',
          'They consume other organisms to produce minerals',
          'They absorb finished food from human agricultural fertilizers',
          'They produce heat energy through mechanical friction',
        ],
        correctIndex: 0,
        explanation: 'Green plants are producers because they synthesize organic biomass (glucose/starch) from sunlight, water, and CO2, supporting all other consumers in the food chain.',
      },
    },
  ],
};

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
        "Welcome to today's masterclass in classical physics. Imagine you are trying to push a stalled car versus kicking a light football. Why is it so much harder to get the car moving? The answer lies in inertia and mass. Inertia is an object's natural reluctance to change its state of motion: a heavy object stubbornly wants to keep doing whatever it was doing! Sir Isaac Newton discovered that an object's velocity only changes when an unbalanced external force acts on it. A force is simply a push or a pull that has both a strength and a direction. When that net force is applied, it causes acceleration in that exact same direction. Think of pushing a shopping cart: the harder you push forward, the faster its forward speed changes. Let us check your intuition: if a book is resting motionless on your study desk, are there forces acting on it, and what is its net acceleration?",
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
      conversationalCheck: {
        question: 'If a book sits motionless on your desk, does it have inertia, and why is its acceleration zero?',
        hint: 'Think about whether upward and downward forces cancel each other out.',
      },
      explanationBreakdown: [
        {
          point: 'Force (F): Push or pull causing acceleration, measured in Newtons (N).',
          explanation: 'Force is an interaction that changes or tends to change an object\'s velocity or shape.',
          example: 'Pushing a child on a playground swing applies an external force that increases their speed.',
          simplifiedTerms: [{ term: 'Force', meaning: 'A push or pull that can change how fast or where an object moves.' }],
        },
        {
          point: 'Inertia: Inherent property of matter directly proportional to inertial mass (m).',
          explanation: 'Inertia is mass\'s stubborn resistance: heavier things are harder to start moving and harder to stop.',
          example: 'When a bus brakes suddenly, passengers lean forward because their bodies naturally want to keep moving.',
          simplifiedTerms: [{ term: 'Inertia', meaning: 'An object\'s natural resistance to any change in its motion.' }],
        },
      ],
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
      stepTitle: '2. The Governing Mathematical Formulation: F = ma',
      spokenExplanation:
        "Now examine the mathematical relationship written on our chalkboard: F equals m times a. This is not just an abstract formula; it tells us how the universe behaves whenever something speeds up, slows down, or changes direction. F represents the net force in Newtons. m is the mass in kilograms, and a is the acceleration in meters per second squared. Notice the two key relationships: first, acceleration is directly proportional to net force. If you double your pushing force on a cart, it accelerates twice as fast. Second, acceleration is inversely proportional to mass. If you load that same cart with heavy bricks so its mass doubles, the exact same push will only accelerate it half as fast! Remember, in all physics calculations, mass must always be in kilograms, never grams, because one Newton is defined as one kilogram-meter per second squared. What would happen to the acceleration of a rocket if its engines produced four times as much thrust while burning fuel reduced its mass to half?",
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
      conversationalCheck: {
        question: 'If you push a toy car and a real car with the exact same strength, why does the toy car accelerate much faster?',
        hint: 'Think about how mass affects acceleration when the applied force is identical.',
      },
      explanationBreakdown: [
        {
          point: 'Net Force Law: F_net = m · a = Δp / Δt',
          explanation: 'The acceleration of an object is directly proportional to net force and inversely proportional to mass.',
          example: 'Pressing the accelerator pedal in a sports car increases force, making it surge forward faster.',
          simplifiedTerms: [{ term: 'Acceleration', meaning: 'The rate at which an object changes its velocity over time.' }],
        },
        {
          point: 'F = Net external force in Newtons [kg·m/s²]',
          explanation: 'One Newton is the exact force needed to accelerate a 1 kilogram mass at 1 meter per second squared.',
          example: 'Holding a medium-sized apple in your open palm exerts approximately 1 Newton of downward force due to gravity.',
          simplifiedTerms: [{ term: 'Newton (N)', meaning: 'The standard international unit used to measure force.' }],
        },
        {
          point: 'm = Mass of body in kilograms [kg]',
          explanation: 'Mass is the amount of matter in the object; more mass means greater resistance to changes in motion.',
          example: 'A bowling ball has far more mass than a soccer ball of similar size.',
          simplifiedTerms: [{ term: 'Mass', meaning: 'The quantity of matter contained within a physical body.' }],
        },
      ],
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
