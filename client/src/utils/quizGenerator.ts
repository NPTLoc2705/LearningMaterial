import type { VocabularyItem } from '../types/vocabulary';

export interface VocabQuizQuestion {
  id: string;
  wordId: string;
  mode: 'multiple-choice' | 'typing';
  prompt: string;
  subPrompt?: string;
  correctAnswer: string;
  options?: string[]; // for multiple choice
  exampleSentence?: string;
  partOfSpeech?: string;
}

/**
 * Shuffle an array immutably using Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build multiple choice options strictly using meanings from other words in the same dataset
 */
export function generateVocabQuestions(
  pool: VocabularyItem[],
  mode: 'multiple-choice' | 'typing',
  count: number = 10
): VocabQuizQuestion[] {
  if (pool.length === 0) return [];

  const shuffledPool = shuffleArray(pool);
  const selectedWords = shuffledPool.slice(0, Math.min(count, pool.length));

  return selectedWords.map((item, index) => {
    const questionId = `vq-${index}-${item.id}`;

    if (mode === 'typing') {
      return {
        id: questionId,
        wordId: item.id,
        mode: 'typing',
        prompt: item.meaningVi,
        subPrompt: item.partOfSpeech ? `(${item.partOfSpeech})` : undefined,
        correctAnswer: item.word,
        exampleSentence: item.example ? item.example.sentenceEn.replace(new RegExp(`\\b${item.word}\\b`, 'gi'), '______') : undefined,
        partOfSpeech: item.partOfSpeech,
      };
    }

    // Multiple Choice
    // Pick 3 distractors from the remaining pool
    const otherMeanings = pool
      .filter((w) => w.id !== item.id)
      .map((w) => w.meaningVi);

    const shuffledDistractors = shuffleArray(otherMeanings).slice(0, 3);
    const options = shuffleArray([item.meaningVi, ...shuffledDistractors]);

    return {
      id: questionId,
      wordId: item.id,
      mode: 'multiple-choice',
      prompt: item.word,
      subPrompt: item.partOfSpeech ? `(${item.partOfSpeech})` : undefined,
      correctAnswer: item.meaningVi,
      options,
      exampleSentence: item.example?.sentenceEn,
      partOfSpeech: item.partOfSpeech,
    };
  });
}
