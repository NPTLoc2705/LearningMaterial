import { useState, useMemo, useDeferredValue } from 'react';
import type { VocabularyItem, UnitFilter, POSFilter, WordStatusFilter } from '../types/vocabulary';
import type { AppProgressState, WordLearningStatus } from '../types/progress';

export function useVocabFilter(items: VocabularyItem[], progress: AppProgressState) {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);
  const [unitFilter, setUnitFilter] = useState<UnitFilter>('all');
  const [posFilter, setPosFilter] = useState<POSFilter>('all');
  const [statusFilter, setStatusFilter] = useState<WordStatusFilter>('all');

  const filteredItems = useMemo(() => {
    const trimmedQuery = deferredQuery.trim().toLowerCase();

    return items.filter((item) => {
      // Unit filter
      if (unitFilter !== 'all' && item.unit !== unitFilter) {
        return false;
      }

      // POS filter
      if (posFilter !== 'all') {
        const itemPos = item.partOfSpeech || '';
        if (posFilter === 'Other') {
          if (itemPos.includes('N') || itemPos.includes('V') || itemPos.toLowerCase().includes('adj')) {
            return false;
          }
        } else if (posFilter === 'Adj') {
          if (!itemPos.toLowerCase().includes('adj')) return false;
        } else {
          if (!itemPos.includes(posFilter)) return false;
        }
      }

      // Status filter
      const wordStatus: WordLearningStatus = progress.words[item.id]?.status || 'new';
      if (statusFilter !== 'all' && wordStatus !== statusFilter) {
        return false;
      }

      // Search query
      if (trimmedQuery) {
        const matchesWord = item.word.toLowerCase().includes(trimmedQuery);
        const matchesMeaning = item.meaningVi.toLowerCase().includes(trimmedQuery);
        const matchesSynonym = item.synonym ? item.synonym.toLowerCase().includes(trimmedQuery) : false;
        const matchesExample = item.example ? item.example.sentenceEn.toLowerCase().includes(trimmedQuery) : false;
        return matchesWord || matchesMeaning || matchesSynonym || matchesExample;
      }

      return true;
    });
  }, [items, unitFilter, posFilter, statusFilter, deferredQuery, progress]);

  return {
    searchQuery,
    setSearchQuery,
    unitFilter,
    setUnitFilter,
    posFilter,
    setPosFilter,
    statusFilter,
    setStatusFilter,
    filteredItems,
    totalCount: items.length,
    filteredCount: filteredItems.length,
  };
}
