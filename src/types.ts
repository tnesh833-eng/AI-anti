export interface WeakArea {
  topic: string;
  subtopic: string;
  errorCount: number;
  lastIdentified: string;
  severity: 'high' | 'medium' | 'low';
  recommendationSnippet: string;
}

export interface QuizRecord {
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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'consistency' | 'accuracy' | 'mastery';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: 'flame' | 'award' | 'target' | 'zap' | 'shield' | 'brain' | 'clock' | 'star';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpBonus: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  gradeLevel: string;
  preferredSubject: string;
  streakDays: number;
  xpPoints: number;
  masteryLevels: Record<string, number>;
  weakAreas: WeakArea[];
  quizHistory: QuizRecord[];
  achievements?: Achievement[];
}

export type TutorMode = 'socratic' | 'deep_dive' | 'eli5' | 'practice' | 'code_debug';

export interface SerpSource {
  title: string;
  link: string;
  snippet: string;
  source?: string;
  date?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: string;
  mode?: TutorMode;
  suggestedFollowUps?: string[];
  sources?: SerpSource[];
  relatedQuestions?: string[];
  isRealTimeSearch?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  subtopic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hint: string;
  explanation: string;
}

export interface QuizSessionData {
  id: string;
  subject: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subtopic: string;
}

export interface StudyGuide {
  title: string;
  estimatedMinutes: number;
  keyTakeaway: string;
  actionPrompt: string;
}

export interface RecommendationsData {
  flashcards: Flashcard[];
  studyGuides: StudyGuide[];
  remedialDrillPlan: string[];
}

export interface CurriculumTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedHours: number;
  keyConcepts: string[];
  sampleQuestions: string[];
}
