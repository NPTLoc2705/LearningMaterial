export type GrammarCategory =
  | 'Main grammar'
  | 'Speaking strategy'
  | 'Reading strategy'
  | 'Extra grammar'
  | 'Language notes';

export interface GrammarRuleTable {
  title?: string;
  headers: string[];
  rows: string[][];
}

export type PracticeExerciseType = 'multiple-choice' | 'fill-in-the-blank';

export interface GrammarPracticeItem {
  id: string;
  prompt: string;
  correctAnswer: string;
  options?: string[];
  type: PracticeExerciseType;
  sourceSentence: string;
}

export interface GrammarTopic {
  id: string;
  unit: 7 | 8;
  sectionNumber: number;
  lesson?: string;
  title: string;
  category: GrammarCategory;
  summaryText?: string;
  ruleTables: GrammarRuleTable[];
  patterns?: string[];
  examples: string[];
  notes?: string[];
  practiceExercises: GrammarPracticeItem[];
}
