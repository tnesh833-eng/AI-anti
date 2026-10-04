import { CurriculumTopic } from '../types.ts';

export const CURRICULUM_DATA: CurriculumTopic[] = [
  {
    id: 'cs-recursion',
    title: 'Recursion & Call Stack Mechanics',
    category: 'Computer Science',
    description: 'Understanding recursive decomposition, activation records on the stack, base case guarantees, and avoiding stack overflow.',
    estimatedHours: 4,
    keyConcepts: [
      'Base cases vs recursive cases',
      'Activation records & Call stack frames',
      'Tail call optimization (TCO)',
      'Divide and conquer recurrence relations',
    ],
    sampleQuestions: [
      'Why does recursion without a base case cause a stack overflow?',
      'How does the call stack preserve local variables across nested invocations?',
      'Can any recursive function be rewritten using an explicit stack iteratively?',
    ],
  },
  {
    id: 'cs-complexity',
    title: 'Asymptotic Analysis & Big-O',
    category: 'Computer Science',
    description: 'Evaluating algorithm runtime efficiency, space bounds, best/average/worst case notation, and analyzing nested loops.',
    estimatedHours: 5,
    keyConcepts: [
      'Big-O, Big-Omega, Big-Theta definitions',
      'Dominant terms and constant suppression',
      'Logarithmic vs Quadratic complexity',
      'Space-time tradeoffs in hash maps',
    ],
    sampleQuestions: [
      'Why is O(n log n) considered optimal for comparison-based sorting?',
      'How do I calculate the time complexity of two nested loops with dependent indices?',
      'What is the difference between worst-case complexity and amortized complexity?',
    ],
  },
  {
    id: 'phys-newton',
    title: "Newtonian Mechanics & Force Equilibrium",
    category: 'Physics',
    description: "Fundamental laws of motion, free-body diagrams, friction coefficients, and translational equilibrium.",
    estimatedHours: 6,
    keyConcepts: [
      "Newton's 1st, 2nd, and 3rd Laws of Motion",
      'Static vs Kinetic Friction',
      'Normal force on inclined planes',
      'Action-reaction pair discrimination',
    ],
    sampleQuestions: [
      "Why isn't normal force the reaction pair to gravity according to Newton's 3rd Law?",
      'How do you decompose forces on a 30-degree inclined plane with friction?',
      'What happens to tension in a rope pulling an accelerating elevator upwards?',
    ],
  },
  {
    id: 'phys-rotational',
    title: 'Rotational Dynamics & Torque',
    category: 'Physics',
    description: 'Angular acceleration, moment of inertia, conservation of angular momentum, and rolling without slipping.',
    estimatedHours: 7,
    keyConcepts: [
      'Torque (τ = r × F) and lever arms',
      'Moment of Inertia (I) for common geometries',
      'Parallel Axis Theorem',
      'Angular momentum conservation (L = Iω)',
    ],
    sampleQuestions: [
      'Why does a solid cylinder roll down an incline faster than a hollow hoop of the same mass?',
      'How does a figure skater increase rotational speed by pulling their arms in?',
      'What is the physical interpretation of the Parallel Axis Theorem?',
    ],
  },
  {
    id: 'math-calc-integration',
    title: 'Techniques of Integration & Applications',
    category: 'Mathematics',
    description: 'U-substitution, Integration by Parts, Partial Fractions, and calculating volumes of solids of revolution.',
    estimatedHours: 8,
    keyConcepts: [
      'Integration by Parts (LIATE heuristic)',
      'Trigonometric substitution',
      'Partial fraction decomposition',
      'Definite integrals as Riemann sums',
    ],
    sampleQuestions: [
      'How does the LIATE rule guide the choice of u and dv in Integration by Parts?',
      'How do you integrate ∫ x * e^(2x) dx step-by-step?',
      'What is the geometric difference between the disk method and washer method?',
    ],
  },
  {
    id: 'ai-ml-foundations',
    title: 'Machine Learning & Neural Foundations',
    category: 'Artificial Intelligence',
    description: 'Supervised vs unsupervised learning, gradient descent optimization, loss functions, and evaluation metrics.',
    estimatedHours: 6,
    keyConcepts: [
      'Loss functions: MSE vs Cross-Entropy',
      'Gradient Descent & Learning Rate schedules',
      'Overfitting, regularization (L1/L2), and dropout',
      'Precision, Recall, and F1-Score trade-offs',
    ],
    sampleQuestions: [
      'Why is Cross-Entropy preferred over Mean Squared Error for classification tasks?',
      'How does the learning rate affect convergence in gradient descent?',
      'What is the bias-variance tradeoff and how does regularization address it?',
    ],
  },
];
