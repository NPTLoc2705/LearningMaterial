export type WordLearningStatus = 'new' | 'learning' | 'known' | 'review';

export interface WordProgress {
  status: WordLearningStatus;
  lastStudied?: string; // ISO date string
  quizAttempts: number;
  quizCorrect: number;
}

export interface GrammarProgress {
  completed: boolean;
  practiceScore?: {
    correct: number;
    total: number;
  };
  lastAccessed?: string;
}

export interface AppProgressState {
  words: Record<string, WordProgress>;
  grammar: Record<string, GrammarProgress>;
}
