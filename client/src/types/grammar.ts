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

export type GrammarDrillType =
  | 'reading-cloze'
  | 'error-correction'
  | 'sentence-rewrite'
  | 'multiple-choice'
  | 'word-scramble'
  | 'sentence-combining';

export interface ModularRuleCard {
  id: string;
  title: string;
  formula: string;
  exampleEn: string;
  exampleVi?: string;
  explanation: string;
  commonPitfall: {
    confusedWith: string;
    mistakeExample: string;
    ruleTip: string;
  };
}

export interface DynamicDrillQuestion {
  id: string;
  type: GrammarDrillType;
  typeLabel: string;
  prompt: string;
  passage?: string;
  bracketVerb?: string;
  options?: string[];
  correctAnswer: string;
  errorWord?: string;
  targetKeyword?: string;
  scrambledWords?: string[];
  explanation: {
    ruleReason: string;
    whyWrong?: string;
    grammarTip: string;
  };
  sourceContext?: string;
}

export interface GrammarPracticeItem {
  id: string;
  prompt: string;
  correctAnswer: string;
  options?: string[];
  type: 'multiple-choice' | 'fill-in-the-blank';
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
  modularRules?: ModularRuleCard[];
  drillBank?: DynamicDrillQuestion[];
}
