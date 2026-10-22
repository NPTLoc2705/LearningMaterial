import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AppProgressState, WordLearningStatus } from '../types/progress';
import { loadProgress, saveProgress, clearProgress } from '../lib/storage';
import vocabData from '../data/vocabulary.json';
import grammarData from '../data/grammar.json';
import type { VocabularyItem } from '../types/vocabulary';
import type { GrammarTopic } from '../types/grammar';

const vocabList = vocabData as VocabularyItem[];
const grammarList = grammarData as GrammarTopic[];

export function useProgress() {
  const [progress, setProgress] = useState<AppProgressState>(() => loadProgress());

  // Keep state synchronized with localStorage
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const setWordStatus = useCallback((wordId: string, status: WordLearningStatus) => {
    setProgress((prev) => {
      const current = prev.words[wordId] || {
        status: 'new',
        quizAttempts: 0,
        quizCorrect: 0,
      };

      return {
        ...prev,
        words: {
          ...prev.words,
          [wordId]: {
            ...current,
            status,
            lastStudied: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const recordQuizResult = useCallback((wordId: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const current = prev.words[wordId] || {
        status: 'new',
        quizAttempts: 0,
        quizCorrect: 0,
      };

      const newStatus: WordLearningStatus = isCorrect
        ? current.status === 'review'
          ? 'learning'
          : 'known'
        : 'review';

      return {
        ...prev,
        words: {
          ...prev.words,
          [wordId]: {
            status: newStatus,
            quizAttempts: current.quizAttempts + 1,
            quizCorrect: current.quizCorrect + (isCorrect ? 1 : 0),
            lastStudied: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const setGrammarCompleted = useCallback((topicId: string, completed: boolean) => {
    setProgress((prev) => {
      const current = prev.grammar[topicId] || { completed: false };
      return {
        ...prev,
        grammar: {
          ...prev.grammar,
          [topicId]: {
            ...current,
            completed,
            lastAccessed: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const recordGrammarScore = useCallback((topicId: string, correct: number, total: number) => {
    setProgress((prev) => {
      const current = prev.grammar[topicId] || { completed: false };
      return {
        ...prev,
        grammar: {
          ...prev.grammar,
          [topicId]: {
            ...current,
            completed: correct === total ? true : current.completed,
            practiceScore: { correct, total },
            lastAccessed: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    clearProgress();
    setProgress({ words: {}, grammar: {} });
  }, []);

  // Aggregate Statistics
  const stats = useMemo(() => {
    const totalWords = vocabList.length;
    let knownWords = 0;
    let reviewWords = 0;
    let learningWords = 0;

    let u7Known = 0;
    let u8Known = 0;
    const u7Total = vocabList.filter((v) => v.unit === 7).length;
    const u8Total = vocabList.filter((v) => v.unit === 8).length;

    vocabList.forEach((w) => {
      const s = progress.words[w.id]?.status || 'new';
      if (s === 'known') {
        knownWords++;
        if (w.unit === 7) u7Known++;
        if (w.unit === 8) u8Known++;
      } else if (s === 'review') {
        reviewWords++;
      } else if (s === 'learning') {
        learningWords++;
      }
    });

    const newWords = totalWords - (knownWords + reviewWords + learningWords);

    const totalGrammar = grammarList.length;
    const completedGrammar = Object.values(progress.grammar).filter((g) => g.completed).length;

    return {
      totalWords,
      knownWords,
      reviewWords,
      learningWords,
      newWords,
      u7: { total: u7Total, known: u7Known },
      u8: { total: u8Total, known: u8Known },
      totalGrammar,
      completedGrammar,
      overallPercent: Math.round(((knownWords + completedGrammar) / (totalWords + totalGrammar)) * 100),
    };
  }, [progress]);

  return {
    progress,
    stats,
    setWordStatus,
    recordQuizResult,
    setGrammarCompleted,
    recordGrammarScore,
    resetAllProgress,
  };
}
