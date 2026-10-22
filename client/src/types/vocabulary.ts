export interface VocabularyExample {
  sentenceEn: string;
  sentenceVi: string;
  rawText: string;
}

export interface VocabularyItem {
  id: string;
  unit: 7 | 8;
  word: string;
  partOfSpeech?: string; // Optional due to entries lacking POS in source
  synonym?: string; // Extracted when present (e.g., "search", "Task", "origin")
  meaningVi: string;
  example?: VocabularyExample;
  notes?: string; // Clarification notes (e.g. Border vs Boundary)
}

export type UnitFilter = 'all' | 7 | 8;
export type POSFilter = 'all' | 'N' | 'V' | 'Adj' | 'Other';
export type WordStatusFilter = 'all' | 'new' | 'learning' | 'known' | 'review';
