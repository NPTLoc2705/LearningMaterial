import type { AppProgressState, WordLearningStatus } from '../types/progress';

const STORAGE_KEY = 'learning_material_progress_v1';

export const DEFAULT_PROGRESS: AppProgressState = {
  words: {},
  grammar: {},
};

export function loadProgress(): AppProgressState {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      words: parsed.words || {},
      grammar: parsed.grammar || {},
    };
  } catch (err) {
    console.error('Failed to load progress from localStorage:', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(state: AppProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save progress to localStorage:', err);
  }
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset progress in localStorage:', err);
  }
}

export function getWordStatus(
  state: AppProgressState,
  wordId: string
): WordLearningStatus {
  return state.words[wordId]?.status || 'new';
}
