import { useState, useMemo } from 'react';
import type { VocabularyItem, UnitFilter, POSFilter, WordStatusFilter } from '../types/vocabulary';
import type { AppProgressState, WordLearningStatus } from '../types/progress';

export function useVocabFilter(items: VocabularyItem[], progress: AppProgressState) {
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState<UnitFilter>('all');
  const [posFilter, setPosFilter] = useState<POSFilter>('all');
  const [statusFilter, setStatusFilter] = useState<WordStatusFilter>('all');

  const filteredItems = useMemo(() => {
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
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesWord = item.word.toLowerCase().includes(query);
        const matchesMeaning = item.meaningVi.toLowerCase().includes(query);
        const matchesSynonym = item.synonym ? item.synonym.toLowerCase().includes(query) : false;
        const matchesExample = item.example ? item.example.sentenceEn.toLowerCase().includes(query) : false;
        return matchesWord || matchesMeaning || matchesSynonym || matchesExample;
      }

      return true;
    });
  }, [items, unitFilter, posFilter, statusFilter, searchQuery, progress]);

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
