import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// SerpApi Key Configuration for Real-Time Question Answering & Web Grounding
const SERPAPI_KEY = process.env.SERPAPI_API_KEY || 'b11626acb748e50db22e798db1187dbe9a317874b75aebcf86bcbcd4ca0267e5';

interface SerpSource {
  title: string;
  link: string;
  snippet: string;
  source?: string;
  date?: string;
}

interface SerpSearchResponse {
  organic: SerpSource[];
  relatedQuestions: string[];
  knowledgeGraph?: string;
}

async function fetchSerpApiSearch(query: string): Promise<SerpSearchResponse | null> {
  try {
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('SerpApi response status error:', res.status);
      return null;
    }
    const data = await res.json();
    const organic: SerpSource[] = (data.organic_results || []).slice(0, 5).map((r: any) => ({
      title: r.title || 'Source Reference',
      link: r.link || '',
      snippet: r.snippet || '',
      source: r.source || (r.displayed_link ? String(r.displayed_link) : ''),
      date: r.date,
    }));

    const relatedQuestions: string[] = (data.related_questions || [])
      .slice(0, 4)
      .map((rq: any) => rq.question)
      .filter(Boolean);

    const knowledgeGraph =
      data.knowledge_graph?.description ||
      data.answer_box?.snippet ||
      data.answer_box?.answer ||
      undefined;

    return { organic, relatedQuestions, knowledgeGraph };
  } catch (err) {
    console.error('Error in fetchSerpApiSearch:', err);
    return null;
  }
}

// Student Mock Database (mimicking SQLite/MySQL tables described in project specs)
interface QuizRecord {
  id: string;
  subject: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  timeSpentSeconds: number;
  missedSubtopics: string[];
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  gradeLevel: string;
  preferredSubject: string;
  streakDays: number;
  xpPoints: number;
  masteryLevels: Record<string, number>; // subject or subtopic -> percentage (0-100)
  weakAreas: {
    topic: string;
    subtopic: string;
    errorCount: number;
    lastIdentified: string;
    severity: 'high' | 'medium' | 'low';
    recommendationSnippet: string;
  }[];
  quizHistory: QuizRecord[];
}

const mockStudents: Record<string, StudentProfile> = {
  'student-1': {
    id: 'student-1',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    gradeLevel: 'Undergraduate (Year 2)',
    preferredSubject: 'Computer Science',
    streakDays: 6,
    xpPoints: 1420,
    masteryLevels: {
      'Algorithms & Data Structures': 68,
      'Object Oriented Programming': 85,
      'Recursion & Dynamic Programming': 42,
      'Computer Networks': 74,
      'Database Systems': 80,
    },
    weakAreas: [
      {
        topic: 'Computer Science',
        subtopic: 'Recursion Base Cases & Call Stack',
        errorCount: 5,
        lastIdentified: 'Yesterday',
        severity: 'high',
        recommendationSnippet: 'Visualizing stack frames and identifying termination conditions before writing recursive calls.',
      },
      {
        topic: 'Computer Science',
        subtopic: 'Time Complexity of Nested Loops',
        errorCount: 3,
        lastIdentified: '2 days ago',
        severity: 'medium',
        recommendationSnippet: 'Differentiating between O(n log n) divide-and-conquer vs O(n^2) nested iterations.',
      },
    ],
    quizHistory: [
      {
        id: 'quiz-101',
        subject: 'Computer Science',
        topic: 'Recursion Fundamentals',
        score: 2,
        totalQuestions: 5,
        percentage: 40,
        date: '2026-10-02',
        timeSpentSeconds: 180,
        missedSubtopics: ['Recursion Base Cases & Call Stack', 'Stack Overflow Conditions'],
      },
      {
        id: 'quiz-102',
        subject: 'Computer Science',
        topic: 'OOP Concepts & Polymorphism',
        score: 4,
        totalQuestions: 5,
        percentage: 80,
        date: '2026-10-03',
        timeSpentSeconds: 140,
        missedSubtopics: ['Abstract Classes vs Interfaces'],
      },
    ],
  },
  'student-2': {
    id: 'student-2',
    name: 'Maya Patel',
    email: 'maya.patel@school.org',
    gradeLevel: 'High School (AP Physics & Calc)',
    preferredSubject: 'Physics & STEM',
    streakDays: 12,
    xpPoints: 2180,
    masteryLevels: {
      'Newtonian Mechanics': 78,
      'Work, Energy & Power': 62,
      'Rotational Kinematics': 45,
      'Differential Calculus': 82,
      'Integral Applications': 55,
    },
    weakAreas: [
      {
        topic: 'Physics',
        subtopic: 'Rotational Inertia & Moment of Inertia',
        errorCount: 4,
        lastIdentified: 'Today',
        severity: 'high',
        recommendationSnippet: 'Practice parallel axis theorem and comparing solid cylinders vs thin hoops.',
      },
      {
        topic: 'Mathematics',
        subtopic: 'Integration by Parts (LIATE rule)',
        errorCount: 3,
        lastIdentified: '3 days ago',
        severity: 'medium',
        recommendationSnippet: 'Applying LIATE mnemonic to pick u and dv methodically without circular algebra.',
      },
    ],
    quizHistory: [
      {
        id: 'quiz-201',
        subject: 'Physics',
        topic: 'Rotational Dynamics',
        score: 3,
        totalQuestions: 5,
        percentage: 60,
        date: '2026-10-01',
        timeSpentSeconds: 210,
        missedSubtopics: ['Rotational Inertia & Moment of Inertia', 'Angular Momentum Conservation'],
      },
    ],
  },
};

let currentStudentId = 'student-1';

// API Endpoints

// 1. Student Profile
app.get('/api/student/profile', (_req: Request, res: Response) => {
  const profile = mockStudents[currentStudentId] || mockStudents['student-1'];
  res.json({ success: true, student: profile, allStudentIds: Object.keys(mockStudents) });
});

app.post('/api/student/switch', (req: Request, res: Response) => {
  const { studentId } = req.body;
  if (mockStudents[studentId]) {
    currentStudentId = studentId;
    return res.json({ success: true, student: mockStudents[currentStudentId] });
  }
  res.status(404).json({ success: false, message: 'Student not found' });
});

app.post('/api/student/reset', (_req: Request, res: Response) => {
  const student = mockStudents[currentStudentId];
  if (student) {
    student.streakDays = 1;
    student.quizHistory = [];
    student.weakAreas = [];
    Object.keys(student.masteryLevels).forEach((k) => {
      student.masteryLevels[k] = 50;
    });
  }
  res.json({ success: true, student });
});

// 2. SerpApi Dedicated Real-Time Search Endpoint
app.post('/api/serpapi/search', async (req: Request, res: Response) => {
  const { query, subject } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query parameter is required' });
  }

  const enhancedQuery = subject ? `${query} ${subject}` : query;
  const results = await fetchSerpApiSearch(enhancedQuery);

  if (!results) {
    return res.status(502).json({
      success: false,
      message: 'Failed to retrieve real-time search results from SerpApi',
    });
  }

  res.json({
    success: true,
    query: enhancedQuery,
    organic: results.organic,
    relatedQuestions: results.relatedQuestions,
    knowledgeGraph: results.knowledgeGraph,
  });
});

// 3. AI Tutor NLP Chat (with Optional Real-Time SerpApi Grounding)
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  const { messages, subject, mode, currentQuestionContext, enableRealTimeSearch } = req.body;
  const student = mockStudents[currentStudentId] || mockStudents['student-1'];

  const lastUserMessage = messages?.[messages.length - 1]?.content || 'Hello';

  // Perform Real-Time SerpApi Search if requested
  let serpData: SerpSearchResponse | null = null;
  if (enableRealTimeSearch) {
    const searchQuery = `${lastUserMessage} ${subject || ''}`.trim();
    serpData = await fetchSerpApiSearch(searchQuery);
  }

  const modeInstructions: Record<string, string> = {
    socratic: 'Adopt the Socratic method: do NOT just give the final direct answer immediately. Guide the student step-by-step with encouraging hints, probing thought questions, and intuitive breakdowns to help them arrive at the realization themselves.',
    deep_dive: 'Provide a comprehensive, rigorous, and technical breakdown. Explain underlying mechanisms, mathematical or logical foundations, edge cases, and real-world engineering or scientific applications. Format with clear Markdown headers, bold terms, and code/math blocks.',
    eli5: 'Explain like I am a curious beginner or high schooler. Use vivid everyday analogies (e.g. cooking, traffic, Legos, video games), zero jargon without immediate translation, and intuitive friendly phrasing.',
    practice: 'Provide a crisp conceptual summary, then present a short, interactive challenge problem with a step-by-step hint if requested. Ask the student to solve it before revealing the complete answer.',
    code_debug: 'Act as a senior software mentor. Analyze code or logic snippets carefully, explain the root cause of common bugs (like off-by-one, memory leak, infinite recursion), and suggest optimal idioms with annotated code blocks.',
  };

  const selectedModePrompt = modeInstructions[mode] || modeInstructions.socratic;
  const weakAreasList = student.weakAreas.map((w) => `${w.subtopic} (${w.topic})`).join(', ');

  let liveSearchPrompt = '';
  if (serpData && serpData.organic.length > 0) {
    liveSearchPrompt = `\n\nReal-Time Web Search Context (via Google Search / SerpApi):\n` +
      serpData.organic.map((s, i) => `[Source ${i + 1}]: "${s.title}" - ${s.snippet} (Link: ${s.link})`).join('\n') +
      (serpData.knowledgeGraph ? `\nKnowledge Summary: ${serpData.knowledgeGraph}` : '') +
      `\nInstructions: Ground your response using this real-time web search context. Mention key findings and reference authoritative URLs where helpful.`;
  }

  const systemInstruction = `You are "Synapse Intelligent Tutor", an advanced AI-powered educational system that provides personalized learning assistance.
Current Student: ${student.name} (${student.gradeLevel})
Subject: ${subject || student.preferredSubject}
Pedagogical Tutoring Style: ${selectedModePrompt}
Identified Weak Areas: [${weakAreasList || 'None currently registered'}]
${currentQuestionContext ? `Context regarding the problem the student is currently studying: ${currentQuestionContext}` : ''}
${liveSearchPrompt}

Key Guidelines:
1. Always be supportive, encouraging, pedagogically sound, and accurate.
2. If the topic intersects with the student's known weak areas, gently reinforce foundational concepts.
3. Structure your response with clean Markdown: use headers (###), bullet points, and code blocks with syntax highlighting where relevant.
4. If real-time search context was provided, synthesize the latest authoritative explanations.
5. Finish with a quick comprehension check question or encouraging reflection to check their understanding.`;

  if (!ai) {
    // Fallback if no API key is provided
    return res.json({
      success: true,
      reply: `### Hello ${student.name}!\n\nI am your **Intelligent AI Tutor** in **${subject || 'General STEM'}**.\n\nYou asked: *"${lastUserMessage}"*\n\nHere is a pedagogical breakdown:\n\n1. **Core Concept**: To master this topic, break it down into fundamental components.\n2. **Intuition**: Think of this like building with blocks—each layer relies on the solid base beneath it.\n3. **Application to Your Studies**: Remember our focus on **${student.weakAreas[0]?.subtopic || 'foundational mastery'}**.\n\n*Interactive Check*: What do you think happens if we test this with edge cases? Let me know your thoughts!`,
      sources: serpData?.organic || [],
      relatedQuestions: serpData?.relatedQuestions || [],
      isRealTimeSearch: !!serpData,
      source: 'fallback',
    });
  }

  try {
    // Format conversation history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I apologize, but I could not formulate a response. Please rephrase your question.';
    res.json({
      success: true,
      reply,
      sources: serpData?.organic || [],
      relatedQuestions: serpData?.relatedQuestions || [],
      isRealTimeSearch: !!serpData,
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Error in /api/tutor/chat:', error);
    // Graceful pedagogical fallback when upstream API experiences temporary high demand
    let fallbackAnswer = `### Pedagogical Concept Breakdown 🎓\n\nRegarding your inquiry: *"**${lastUserMessage}**"*\n\nHere is the key conceptual intuition:\n\n1. **Core Mechanism**: In **${subject || student.preferredSubject}**, this concept hinges on breaking the overall system into well-defined state transformations.\n2. **Common Pitfall to Avoid**: Many students struggling with **${student.weakAreas[0]?.subtopic || 'this area'}** confuse local scope execution with the overall control flow.\n3. **Practical Strategy**: When working through problems of this type, trace edge cases first (e.g., empty inputs, base boundaries, or limits).\n\n*Interactive Self-Check*: Can you describe in your own words what happens when the boundary condition is reached?`;

    if (serpData && serpData.organic.length > 0) {
      fallbackAnswer += `\n\n### 🌐 Real-Time Search Grounding (SerpApi):\n` +
        serpData.organic.slice(0, 3).map(s => `- **[${s.title}](${s.link})**: ${s.snippet}`).join('\n\n');
    }

    res.json({
      success: true,
      reply: fallbackAnswer,
      sources: serpData?.organic || [],
      relatedQuestions: serpData?.relatedQuestions || [],
      isRealTimeSearch: !!serpData,
      source: 'pedagogical_resilience_engine',
    });
  }
});

function getFallbackQuizList(subject?: string, difficulty?: string) {
  const isPhysics = subject && subject.toLowerCase().includes('phys');
  const isMath = subject && subject.toLowerCase().includes('math');

  if (isPhysics) {
    return [
      {
        id: 'q-phys-1',
        question: 'Why does a solid cylinder roll down an incline faster than a hollow cylinder of equal mass and radius?',
        options: [
          'The solid cylinder has greater gravitational potential energy',
          'The hollow cylinder has a larger moment of inertia, consuming more energy in rotational motion',
          'Friction only acts on hollow cylinders',
          'The hollow cylinder experiences greater air resistance'
        ],
        correctAnswerIndex: 1,
        subtopic: 'Rotational Inertia & Moment of Inertia',
        difficulty: difficulty || 'intermediate',
        hint: 'Compare where the mass is distributed relative to the axis of rotation.',
        explanation: 'Because the mass of the hollow cylinder is concentrated at the outer rim (I = MR² vs I = 0.5 MR² for solid), it requires more kinetic energy to rotate at a given speed, leaving less translational kinetic energy.'
      },
      {
        id: 'q-phys-2',
        question: "According to Newton's Third Law, what is the reaction force to the gravitational force pulling a book toward Earth?",
        options: [
          'The normal force exerted by the table upward on the book',
          'The gravitational force exerted by the book upward on the Earth',
          'The air pressure pushing down on the book',
          'The friction between the book and the table'
        ],
        correctAnswerIndex: 1,
        subtopic: "Newton's 3rd Law Discrimination",
        difficulty: difficulty || 'intermediate',
        hint: 'Action-reaction pairs must act on different bodies and be the same fundamental force.',
        explanation: 'If Earth pulls the book downward by gravity, the book pulls the Earth upward with an equal and opposite gravitational force. Normal force is an electromagnetic contact force, not the third law pair to gravity.'
      },
      {
        id: 'q-phys-3',
        question: 'When an ice skater spins and pulls their outstretched arms inward, which quantity is strictly conserved in the absence of external torque?',
        options: ['Rotational kinetic energy', 'Moment of inertia', 'Angular momentum', 'Linear velocity'],
        correctAnswerIndex: 2,
        subtopic: 'Angular Momentum Conservation',
        difficulty: difficulty || 'intermediate',
        hint: 'Net external torque is zero: dL/dt = 0.',
        explanation: 'Because external torque is zero, angular momentum L = Iω remains constant. As the skater pulls in their arms, moment of inertia I decreases, causing angular velocity ω to increase.'
      },
      {
        id: 'q-phys-4',
        question: 'What is the work done by the normal force on a block sliding horizontally across a flat tabletop?',
        options: ['Zero joules', 'Mass × gravity × distance', 'Positive work equal to kinetic energy', 'Negative work equal to friction'],
        correctAnswerIndex: 0,
        subtopic: 'Work, Energy & Force Vectors',
        difficulty: difficulty || 'beginner',
        hint: 'Recall Work = F · d · cos(θ). What is the angle between the normal force and horizontal displacement?',
        explanation: 'The normal force acts perpendicular (90 degrees) to horizontal displacement. Since cos(90°) = 0, the work performed by normal force is 0 Joules.'
      }
    ];
  }

  if (isMath) {
    return [
      {
        id: 'q-math-1',
        question: 'When evaluating ∫ x * e^(2x) dx using Integration by Parts (∫ u dv = uv - ∫ v du), what should be chosen as u following the LIATE rule?',
        options: ['u = e^(2x)', 'u = x', 'u = 2x', 'u = dx'],
        correctAnswerIndex: 1,
        subtopic: 'Integration by Parts (LIATE rule)',
        difficulty: difficulty || 'intermediate',
        hint: 'In LIATE (Logarithmic, Inverse trig, Algebraic, Trig, Exponential), Algebraic comes before Exponential.',
        explanation: 'Following LIATE, the algebraic term x takes priority for u over the exponential term e^(2x). Differentiating u yields du = dx, which simplifies the remaining integral.'
      },
      {
        id: 'q-math-2',
        question: 'What is the limit of (sin x) / x as x approaches 0?',
        options: ['0', '1', 'Infinity', 'Undefined'],
        correctAnswerIndex: 1,
        subtopic: 'Calculus Limits & L’Hôpital’s Rule',
        difficulty: difficulty || 'beginner',
        hint: 'Apply L’Hôpital’s rule to the 0/0 indeterminate form by differentiating numerator and denominator.',
        explanation: 'Using L’Hôpital’s Rule: derivative of sin x is cos x, derivative of x is 1. As x → 0, cos(0)/1 = 1/1 = 1.'
      },
      {
        id: 'q-math-3',
        question: 'What does the First Derivative Test tell us about a critical point where f’(x) changes sign from positive to negative?',
        options: ['f(x) has a local minimum', 'f(x) has an inflection point', 'f(x) has a local maximum', 'f(x) is discontinuous'],
        correctAnswerIndex: 2,
        subtopic: 'Derivative Applications & Curve Sketching',
        difficulty: difficulty || 'intermediate',
        hint: 'If a curve was increasing and then begins decreasing, what kind of peak did it reach?',
        explanation: 'When f’(x) switches from positive (increasing function) to negative (decreasing function), the function reaches a relative local maximum.'
      }
    ];
  }

  // Default Computer Science
  return [
    {
      id: 'q-fb-1',
      question: `In ${subject || 'Computer Science'}, what is the primary role of a base case in a recursive algorithm?`,
      options: [
        'To increase the depth of the call stack until memory is exhausted',
        'To terminate the recursive execution and prevent infinite loops',
        'To convert recursive functions into iterative while loops automatically',
        'To sort the input data before passing it to subsequent invocations'
      ],
      correctAnswerIndex: 1,
      subtopic: 'Recursion Base Cases & Call Stack',
      difficulty: difficulty || 'intermediate',
      hint: 'Consider what would happen if a function never stops calling itself.',
      explanation: 'The base case provides a deterministic condition under which the function returns a concrete value without making further recursive calls, thus unwinding the call stack and preventing a StackOverflowError.'
    },
    {
      id: 'q-fb-2',
      question: `Which asymptotic time complexity represents an algorithm with two nested loops iterating over n elements?`,
      options: ['O(log n)', 'O(n)', 'O(n²)', 'O(2ⁿ)'],
      correctAnswerIndex: 2,
      subtopic: 'Time Complexity of Nested Loops',
      difficulty: difficulty || 'intermediate',
      hint: 'Multiply the outer loop iterations by the inner loop iterations.',
      explanation: 'For each of the n iterations of the outer loop, the inner loop executes n times, yielding roughly n * n = n² operations (quadratic time complexity).'
    },
    {
      id: 'q-fb-3',
      question: `When designing an object-oriented system, what is the key difference between an Interface and an Abstract Class?`,
      options: [
        'Interfaces can contain instance variables with state, while abstract classes cannot',
        'A class can implement multiple interfaces, but typically can inherit from only one abstract class',
        'Abstract classes cannot have method implementations',
        'Interfaces are only resolved at runtime, while classes are strictly static'
      ],
      correctAnswerIndex: 1,
      subtopic: 'Object Oriented Architecture',
      difficulty: difficulty || 'intermediate',
      hint: 'Think about multiple inheritance restrictions in languages like Java or C#.',
      explanation: 'Most mainstream single-inheritance languages permit a class to implement multiple interfaces to adhere to varied contracts, while restricting inheritance to a single parent class (even if abstract).'
    },
    {
      id: 'q-fb-4',
      question: `Which data structure operates on a Last-In, First-Out (LIFO) discipline and is directly mirrored by the execution call stack?`,
      options: ['Queue', 'Binary Search Tree', 'Stack', 'Hash Map'],
      correctAnswerIndex: 2,
      subtopic: 'Data Structures & Call Stack',
      difficulty: difficulty || 'beginner',
      hint: 'Think of a stack of plates where you take off the one placed on top last.',
      explanation: 'A Stack adheres strictly to LIFO. During function execution, each frame is pushed onto the top of the call stack and popped off upon function return.'
    }
  ];
}

function getFallbackRecommendations(subject?: string, targets?: string[]) {
  const weakTopic = targets && targets[0] ? targets[0] : 'Foundational Mastery';
  return {
    flashcards: [
      {
        id: 'fc-1',
        front: `What is the core principle behind overcoming misconceptions in ${weakTopic}?`,
        back: 'Decompose the mechanism into first principles: isolate inputs, transition rules, and boundary termination checks.',
        subtopic: weakTopic,
      },
      {
        id: 'fc-2',
        front: 'What are the two essential components of any valid recursive function?',
        back: '1. Base Case: The condition that terminates recursion.\n2. Recursive Step: The rule that reduces the problem towards the base case.',
        subtopic: 'Recursion Fundamentals',
      },
      {
        id: 'fc-3',
        front: 'Why does an infinite recursion cause a "Stack Overflow" error?',
        back: 'Every function call pushes a stack frame with parameters and local variables onto the call stack. Without a terminating base case, stack memory exceeds its allocated limit.',
        subtopic: 'Call Stack Mechanics',
      },
      {
        id: 'fc-4',
        front: 'What is the Big-O time complexity of Binary Search and why?',
        back: 'O(log n). At each iteration, the search interval is halved, reducing the problem size exponentially.',
        subtopic: 'Algorithm Analysis',
      },
    ],
    studyGuides: [
      {
        title: `Comprehensive Guide to Eliminating Gaps in ${weakTopic}`,
        estimatedMinutes: 6,
        keyTakeaway: 'Always write down the invariant or boundary condition before calculating intermediate values.',
        actionPrompt: 'Work through 2 trace examples step-by-step with pen and paper.',
      },
      {
        title: 'Visualizing Activation Records & Call Stacks',
        estimatedMinutes: 7,
        keyTakeaway: 'Treat each function call as an independent activation record containing its own local state.',
        actionPrompt: 'Trace Fibonacci(3) tree by drawing each stack push and pop.',
      },
    ],
    remedialDrillPlan: [
      `Step 1: Ask the AI Tutor for a Socratic breakdown of ${weakTopic}.`,
      'Step 2: Review the interactive flashcards above and mark key terms mastered.',
      'Step 3: Launch a 3-question adaptive quiz drill to verify retention.',
    ],
  };
}

// 3. Quiz Generation (Adaptive & Personalized)
app.post('/api/quiz/generate', async (req: Request, res: Response) => {
  const { subject, topic, difficulty, questionCount = 4, focusOnWeakAreas } = req.body;
  const student = mockStudents[currentStudentId] || mockStudents['student-1'];

  const studentWeakAreas = student.weakAreas.filter(w => !subject || w.topic.toLowerCase().includes(subject.toLowerCase()));
  const weakSubtopics = studentWeakAreas.map(w => w.subtopic).join(', ');

  if (!ai) {
    const fallbackQuizzes = getFallbackQuizList(subject, difficulty);
    return res.json({
      success: true,
      quiz: {
        id: `quiz-gen-${Date.now()}`,
        subject: subject || 'Computer Science',
        topic: topic || 'Core Fundamentals & Weak Area Diagnostics',
        difficulty: difficulty || 'adaptive',
        questions: fallbackQuizzes.slice(0, questionCount),
        source: 'curated_fallback',
      },
    });
  }

  try {
    const prompt = `Generate a high-quality educational quiz to evaluate a student's knowledge.
Subject: ${subject || 'Computer Science'}
Topic: ${topic || 'General Assessment'}
Target Difficulty: ${difficulty || 'intermediate'}
Number of Questions: ${questionCount}
${focusOnWeakAreas && weakSubtopics ? `CRITICAL FOCUS: The student has diagnosed weak areas in: [${weakSubtopics}]. Prioritize creating questions that diagnose and test these specific concepts!` : ''}

You must return a JSON array of objects conforming to the schema. Make questions conceptually rigorous, realistic, and with clear pedagogical distractors (common student misconceptions).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswerIndex: { type: Type.INTEGER },
              subtopic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              hint: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['id', 'question', 'options', 'correctAnswerIndex', 'subtopic', 'difficulty', 'hint', 'explanation'],
          },
        },
      },
    });

    const questions = JSON.parse(response.text || '[]');
    res.json({
      success: true,
      quiz: {
        id: `quiz-gen-${Date.now()}`,
        subject: subject || 'Computer Science',
        topic: topic || 'Adaptive Diagnostic',
        difficulty: difficulty || 'adaptive',
        questions,
        source: 'gemini',
      },
    });
  } catch (error: any) {
    console.error('Error generating quiz with Gemini, utilizing curated pedagogical fallback:', error);
    // Use curated fallback quizzes
    const fallbackQuizzes = getFallbackQuizList(subject, difficulty);
    res.json({
      success: true,
      quiz: {
        id: `quiz-gen-${Date.now()}`,
        subject: subject || 'Computer Science',
        topic: topic || 'Adaptive Diagnostic Drill',
        difficulty: difficulty || 'adaptive',
        questions: fallbackQuizzes.slice(0, questionCount),
        source: 'curated_resilience_engine',
      },
    });
  }
});

// 4. Quiz Evaluation & Student Performance Analysis (ML/Analytics Engine)
app.post('/api/quiz/evaluate', async (req: Request, res: Response) => {
  const { quizId, subject, topic, answers, timeSpentSeconds = 120 } = req.body;
  const student = mockStudents[currentStudentId] || mockStudents['student-1'];

  // Calculate scores
  let correctCount = 0;
  const missedSubtopics: string[] = [];
  const detailedResults: any[] = [];

  answers.forEach((ans: any) => {
    const isCorrect = ans.selectedAnswerIndex === ans.correctAnswerIndex;
    if (isCorrect) {
      correctCount++;
    } else {
      missedSubtopics.push(ans.subtopic || 'General Concept');
    }
    detailedResults.push({
      ...ans,
      isCorrect,
    });
  });

  const percentage = Math.round((correctCount / answers.length) * 100);

  // Update student profile in memory
  const newQuizRecord: QuizRecord = {
    id: quizId || `quiz-${Date.now()}`,
    subject: subject || 'General',
    topic: topic || 'Diagnostic Quiz',
    score: correctCount,
    totalQuestions: answers.length,
    percentage,
    date: new Date().toISOString().split('T')[0],
    timeSpentSeconds,
    missedSubtopics,
  };

  student.quizHistory.unshift(newQuizRecord);
  student.xpPoints += correctCount * 50 + 20;

  // Update mastery level for subject/topic
  const currentMastery = student.masteryLevels[topic] || student.masteryLevels[subject] || 60;
  const updatedMastery = Math.min(100, Math.max(10, Math.round(currentMastery * 0.7 + percentage * 0.3)));
  student.masteryLevels[topic || subject] = updatedMastery;

  // Machine Learning / Rule-based Weak Area Detection
  // Aggregate errors in missed subtopics
  const detectedWeakSubtopics: string[] = Array.from(new Set(missedSubtopics));
  detectedWeakSubtopics.forEach((sub) => {
    const existing = student.weakAreas.find((w) => w.subtopic.toLowerCase() === sub.toLowerCase());
    if (existing) {
      existing.errorCount += 1;
      existing.lastIdentified = 'Just now';
      existing.severity = existing.errorCount >= 4 ? 'high' : 'medium';
    } else {
      student.weakAreas.unshift({
        topic: subject || 'General',
        subtopic: sub,
        errorCount: 1,
        lastIdentified: 'Just now',
        severity: 'medium',
        recommendationSnippet: `Review core theoretical definitions and practice 3 targeted examples on ${sub}.`,
      });
    }
  });

  // If student scored perfectly in an existing weak area, reduce error count or resolve it
  answers.forEach((ans: any) => {
    if (ans.selectedAnswerIndex === ans.correctAnswerIndex) {
      const existingIdx = student.weakAreas.findIndex((w) => w.subtopic.toLowerCase() === (ans.subtopic || '').toLowerCase());
      if (existingIdx !== -1) {
        student.weakAreas[existingIdx].errorCount = Math.max(0, student.weakAreas[existingIdx].errorCount - 1);
        if (student.weakAreas[existingIdx].errorCount === 0) {
          student.weakAreas.splice(existingIdx, 1);
        }
      }
    }
  });

  let aiFeedback = '';
  if (ai) {
    try {
      const evalPrompt = `You are an expert AI Tutor analyzing a student's quiz performance.
Student Name: ${student.name}
Quiz Subject: ${subject} (${topic})
Score: ${correctCount}/${answers.length} (${percentage}%)
Missed Subtopics: ${missedSubtopics.length > 0 ? missedSubtopics.join(', ') : 'None! Perfect score.'}
Time Spent: ${timeSpentSeconds} seconds

Provide:
1. An encouraging, constructive pedagogical feedback comment (2-3 sentences).
2. Direct insight into what misconception likely caused any missed questions.
3. 2 actionable study recommendations for immediate next steps.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: evalPrompt,
      });
      aiFeedback = aiResponse.text || '';
    } catch (e) {
      console.warn('AI feedback generation failed, using template feedback', e);
    }
  }

  if (!aiFeedback) {
    if (percentage >= 80) {
      aiFeedback = `Outstanding work! You demonstrated strong mastery of ${topic || subject}. Keep up the high focus, and try advancing to higher difficulty challenges.`;
    } else if (percentage >= 50) {
      aiFeedback = `Solid effort! You have a good foundation, but watch out for edge cases in ${missedSubtopics[0] || 'the core subtopics'}. Revisiting step-by-step examples will quickly bridge this gap.`;
    } else {
      aiFeedback = `Don't be discouraged! Quizzes exist to pinpoint exactly where learning happens. We've flagged ${missedSubtopics.join(', ')} in your personalized study plan so you can review bite-sized lessons.`;
    }
  }

  res.json({
    success: true,
    evaluation: {
      score: correctCount,
      totalQuestions: answers.length,
      percentage,
      missedSubtopics,
      detectedWeakSubtopics,
      aiFeedback,
      updatedMastery,
      student,
    },
  });
});

// 5. Personalized Learning Material Recommendations
app.post('/api/recommendations', async (req: Request, res: Response) => {
  const { subject, weakAreas } = req.body;
  const student = mockStudents[currentStudentId] || mockStudents['student-1'];
  const targets = weakAreas || student.weakAreas.map((w) => w.subtopic);

  if (!ai || targets.length === 0) {
    return res.json({
      success: true,
      recommendations: {
        flashcards: [
          {
            id: 'fc-1',
            front: 'What are the two essential components of any valid recursive function?',
            back: '1. Base Case: The condition that terminates recursion.\n2. Recursive Step: The rule that reduces the problem towards the base case.',
            subtopic: 'Recursion Fundamentals',
          },
          {
            id: 'fc-2',
            front: 'Why does an infinite recursion cause a "Stack Overflow" error?',
            back: 'Every function call pushes a stack frame with parameters and local variables onto the call stack. Without a terminating base case, stack memory exceeds its allocated limit.',
            subtopic: 'Call Stack Mechanics',
          },
          {
            id: 'fc-3',
            front: 'What is the Big-O time complexity of Binary Search and why?',
            back: 'O(log n). At each iteration, the search interval is halved, reducing the problem size exponentially.',
            subtopic: 'Algorithm Analysis',
          },
        ],
        studyGuides: [
          {
            title: 'Visualizing Call Stacks & Avoiding Recursion Pitfalls',
            estimatedMinutes: 6,
            keyTakeaway: 'Always write and test your base case first. Trace with n=0 and n=1 before larger inputs.',
            actionPrompt: 'Practice with Fibonacci vs Factorial recursive tracing tree.',
          },
          {
            title: 'Mastering Asymptotic Notation (Big-O, Big-Theta, Big-Omega)',
            estimatedMinutes: 8,
            keyTakeaway: 'Big-O describes upper bound worst-case growth rate as input size n approaches infinity.',
            actionPrompt: 'Identify nested loop dependencies where the inner loop runs j < i iterations.',
          },
        ],
        remedialDrillPlan: [
          'Step 1: Ask the AI Tutor to walk through a call stack visualization.',
          'Step 2: Solve 3 targeted beginner quiz questions focused strictly on base case termination.',
          'Step 3: Review the flashcards above once in the morning and once in the evening for spaced repetition.',
        ],
      },
    });
  }

  try {
    const prompt = `Generate tailored remedial learning materials for a student struggling in these areas: [${targets.join(', ')}].
Subject: ${subject || student.preferredSubject}

Return a JSON object containing:
- flashcards: array of 3-4 objects with { id, front, back, subtopic }
- studyGuides: array of 2-3 objects with { title, estimatedMinutes, keyTakeaway, actionPrompt }
- remedialDrillPlan: array of 3-4 sequential action steps (strings) to achieve mastery.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  subtopic: { type: Type.STRING },
                },
                required: ['id', 'front', 'back', 'subtopic'],
              },
            },
            studyGuides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  estimatedMinutes: { type: Type.INTEGER },
                  keyTakeaway: { type: Type.STRING },
                  actionPrompt: { type: Type.STRING },
                },
                required: ['title', 'estimatedMinutes', 'keyTakeaway', 'actionPrompt'],
              },
            },
            remedialDrillPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['flashcards', 'studyGuides', 'remedialDrillPlan'],
        },
      },
    });

    const recommendations = JSON.parse(response.text || '{}');
    res.json({ success: true, recommendations });
  } catch (error: any) {
    console.error('Error generating recommendations with Gemini, using curated fallback:', error);
    const fallbackRecs = getFallbackRecommendations(subject, targets);
    res.json({ success: true, recommendations: fallbackRecs });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Intelligent Tutor server running on http://localhost:${PORT}`);
  });
}

startServer();
