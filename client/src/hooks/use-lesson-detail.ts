import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../lib/authFetch';
import { ClassroomService } from '../Service/ClassroomService';
import { LessonService } from '../Service/LessonService';
import { VocabularyService } from '../Service/VocabularyService';
import type {
  ClassroomDto,
  CreateVocabularyItemRequestDto,
  LessonDto,
  UpdateLessonRequestDto,
  UpdateVocabularyItemRequestDto,
  ValidationDiagnosticDto,
  VocabularyItemDto,
} from '../types/api';

export type SaveIndicatorState = 'idle' | 'saving' | 'saved' | 'error';

function extractPublishDiagnostics(err: unknown): ValidationDiagnosticDto[] {
  if (!(err instanceof ApiError) || !Array.isArray(err.errors)) {
    return [];
  }

  return err.errors.filter(
    (entry): entry is ValidationDiagnosticDto =>
      typeof entry === 'object' &&
      entry !== null &&
      'path' in entry &&
      'message' in entry &&
      typeof entry.path === 'string' &&
      typeof entry.message === 'string'
  );
}

export function useLessonDetail(lessonId: number) {
  const [lesson, setLesson] = useState<LessonDto | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyItemDto[]>([]);
  const [sameLevelClassrooms, setSameLevelClassrooms] = useState<ClassroomDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveState, setSaveState] = useState<SaveIndicatorState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [publishDiagnostics, setPublishDiagnostics] = useState<
    ValidationDiagnosticDto[]
  >([]);

  const isValidLessonId = Number.isFinite(lessonId) && lessonId > 0;

  useEffect(() => {
    if (!isValidLessonId) return;

    let active = true;
    Promise.all([
      LessonService.getLessonById(lessonId),
      VocabularyService.getLessonVocabulary(lessonId),
      ClassroomService.getClassrooms(1, 100),
    ])
      .then(([lessonData, vocabData, classroomsPaged]) => {
        if (!active) return;
        setLesson(lessonData);
        setVocabulary(vocabData);
        setSameLevelClassrooms(
          classroomsPaged.items.filter(
            (c) => !c.isArchived && c.levelId === lessonData.levelId
          )
        );
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof ApiError
            ? err.detail
            : 'Không thể tải thông tin chi tiết bài giảng.'
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lessonId, isValidLessonId]);

  const updateMetadata = useCallback(
    async (payload: UpdateLessonRequestDto) => {
      if (!lesson) return;
      setSaveState('saving');
      setError(null);
      try {
        const updated = await LessonService.updateLesson(lesson.id, payload);
        setLesson(updated);
        setSaveState('saved');
      } catch (err) {
        setSaveState('error');
        setError(
          err instanceof ApiError
            ? err.detail
            : 'Không thể cập nhật thông tin bài giảng.'
        );
        throw err;
      }
    },
    [lesson]
  );

  const addVocabularyItem = useCallback(
    async (payload: CreateVocabularyItemRequestDto) => {
      if (!lesson) return;
      setSaveState('saving');
      setError(null);
      setPublishDiagnostics([]);
      try {
        const created = await VocabularyService.createVocabularyItem(
          lesson.id,
          payload
        );
        setVocabulary((prev) =>
          [...prev, created].sort(
            (a, b) => a.sortOrder - b.sortOrder || a.id - b.id
          )
        );
        setSaveState('saved');
        return created;
      } catch (err) {
        setSaveState('error');
        setError(
          err instanceof ApiError ? err.detail : 'Không thể thêm từ vựng mới.'
        );
        throw err;
      }
    },
    [lesson]
  );

  const saveVocabularyItem = useCallback(
    async (id: number, payload: UpdateVocabularyItemRequestDto) => {
      setSaveState('saving');
      setError(null);
      try {
        const updated = await VocabularyService.updateVocabularyItem(
          id,
          payload
        );
        setVocabulary((prev) =>
          prev
            .map((item) => (item.id === id ? updated : item))
            .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
        );
        setSaveState('saved');
        return updated;
      } catch (err) {
        setSaveState('error');
        setError(
          err instanceof ApiError ? err.detail : 'Không thể lưu từ vựng.'
        );
        throw err;
      }
    },
    []
  );

  const removeVocabularyItem = useCallback(async (id: number) => {
    setSaveState('saving');
    setError(null);
    try {
      await VocabularyService.deleteVocabularyItem(id);
      setVocabulary((prev) => prev.filter((item) => item.id !== id));
      setSaveState('saved');
    } catch (err) {
      setSaveState('error');
      setError(err instanceof ApiError ? err.detail : 'Không thể xóa từ vựng.');
      throw err;
    }
  }, []);

  const uploadVocabularyImage = useCallback(async (id: number, file: File) => {
    setSaveState('saving');
    setError(null);
    setPublishDiagnostics([]);
    try {
      const updated = await VocabularyService.uploadVocabularyImage(id, file);
      setVocabulary((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      setSaveState('saved');
      return updated;
    } catch (err) {
      setSaveState('error');
      setError(
        err instanceof ApiError ? err.detail : 'Không thể tải ảnh từ vựng lên.'
      );
      throw err;
    }
  }, []);

  const publishLesson = useCallback(async () => {
    if (!lesson) return;
    setError(null);
    setPublishDiagnostics([]);
    try {
      const updated = await LessonService.publishLesson(lesson.id);
      setLesson(updated);
    } catch (err) {
      const diagnostics = extractPublishDiagnostics(err);
      if (diagnostics.length > 0) {
        setPublishDiagnostics(diagnostics);
      } else {
        setError(
          err instanceof ApiError
            ? err.detail
            : 'Không thể xuất bản bài giảng.'
        );
      }
    }
  }, [lesson]);

  const archiveLesson = useCallback(async () => {
    if (!lesson) return;
    setError(null);
    try {
      const updated = await LessonService.archiveLesson(lesson.id);
      setLesson(updated);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.detail : 'Không thể lưu trữ bài giảng.'
      );
    }
  }, [lesson]);

  const restoreLesson = useCallback(async () => {
    if (!lesson) return;
    setError(null);
    try {
      const updated = await LessonService.restoreLesson(lesson.id);
      setLesson(updated);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.detail : 'Không thể khôi phục bài giảng.'
      );
    }
  }, [lesson]);

  const moveVocabularyItem = useCallback(
    async (vocabId: number, direction: 'up' | 'down') => {
      const idx = vocabulary.findIndex((v) => v.id === vocabId);
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (idx < 0 || targetIdx < 0 || targetIdx >= vocabulary.length) return;

      const current = vocabulary[idx];
      const neighbor = vocabulary[targetIdx];
      const nextCurrentOrder = neighbor.sortOrder;
      const nextNeighborOrder =
        current.sortOrder === neighbor.sortOrder
          ? direction === 'up'
            ? current.sortOrder + 1
            : Math.max(1, current.sortOrder - 1)
          : current.sortOrder;

      await Promise.all([
        saveVocabularyItem(current.id, {
          ...current,
          sortOrder: nextCurrentOrder,
        }),
        saveVocabularyItem(neighbor.id, {
          ...neighbor,
          sortOrder: nextNeighborOrder,
        }),
      ]);
    },
    [vocabulary, saveVocabularyItem]
  );

  return {
    lesson,
    vocabulary,
    sameLevelClassrooms,
    isLoading: isValidLessonId && isLoading,
    saveState,
    error: !isValidLessonId ? 'Mã bài giảng không hợp lệ.' : error,
    publishDiagnostics,
    clearError: () => {
      setError(null);
      setPublishDiagnostics([]);
    },
    updateMetadata,
    addVocabularyItem,
    saveVocabularyItem,
    moveVocabularyItem,
    removeVocabularyItem,
    uploadVocabularyImage,
    publishLesson,
    archiveLesson,
    restoreLesson,
  };
}

