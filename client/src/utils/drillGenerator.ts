import type { DynamicDrillQuestion, GrammarDrillType } from '../types/grammar';

/**
 * Shuffles an array in place (Fisher-Yates) and returns a shallow copy.
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Samples a dynamic mixed drill:
 * - Guarantees exactly `targetCount` questions (default: 6)
 * - Guarantees at least `targetTypeCount` distinct question types (default: 3)
 */
export function generateMixedDrill(
  bank: DynamicDrillQuestion[],
  targetCount: number = 6,
  targetTypeCount: number = 3
): DynamicDrillQuestion[] {
  if (!bank || bank.length === 0) return [];
  if (bank.length <= targetCount) return shuffle(bank);

  // Group available questions by their drill type
  const typeMap = new Map<GrammarDrillType, DynamicDrillQuestion[]>();
  for (const q of bank) {
    if (!typeMap.has(q.type)) {
      typeMap.set(q.type, []);
    }
    typeMap.get(q.type)!.push(q);
  }

  const availableTypes = Array.from(typeMap.keys());
  const shuffledTypes = shuffle(availableTypes);

  // Pick up to targetTypeCount distinct types
  const chosenTypes = shuffledTypes.slice(0, Math.min(targetTypeCount, availableTypes.length));

  const selectedQuestions: DynamicDrillQuestion[] = [];
  const questionsPerType = Math.max(1, Math.floor(targetCount / chosenTypes.length));

  // Pick questionsPerType from each chosen type
  for (const t of chosenTypes) {
    const questionsOfThisType = shuffle(typeMap.get(t) || []);
    const picked = questionsOfThisType.slice(0, questionsPerType);
    selectedQuestions.push(...picked);
  }

  // If we haven't reached targetCount, fill in from remaining questions in the bank
  if (selectedQuestions.length < targetCount) {
    const selectedIds = new Set(selectedQuestions.map((q) => q.id));
    const remainingQuestions = shuffle(bank.filter((q) => !selectedIds.has(q.id)));
    const needed = targetCount - selectedQuestions.length;
    selectedQuestions.push(...remainingQuestions.slice(0, needed));
  }

  // Final trim to targetCount and shuffle order
  return shuffle(selectedQuestions.slice(0, targetCount));
}
