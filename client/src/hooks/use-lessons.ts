import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../lib/authFetch';
import { ClassroomService } from '../Service/ClassroomService';
import { LessonService } from '../Service/LessonService';
import type {
  CreateLessonRequestDto,
  LessonDto,
  LessonStatus,
  LevelDto,
} from '../types/api';

export interface UseLessonsResult {
  levels: LevelDto[];
  lessons: LessonDto[];
  selectedLevelId: number | null;
  selectedStatus: LessonStatus | null;
  searchQuery: string;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  setSelectedLevelId: (levelId: number | null) => void;
  setSelectedStatus: (status: LessonStatus | null) => void;
  setSearchQuery: (q: string) => void;
  clearError: () => void;
  createLesson: (payload: CreateLessonRequestDto) => Promise<LessonDto>;
  archiveLesson: (id: number) => Promise<void>;
}

export function useLessons(): UseLessonsResult {
  const [levels, setLevels] = useState<LevelDto[]>([]);
  const [lessons, setLessons] = useState<LessonDto[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<LessonStatus | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    ClassroomService.getLevels()
      .then((data) => {
        if (active) setLevels(data);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    LessonService.getLessons({
      levelId: selectedLevelId,
      status: selectedStatus,
      q: searchQuery,
      page: 1,
      pageSize: 50,
    })
      .then((result) => {
        if (!active) return;
        setLessons(result.items);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg =
          err instanceof ApiError
            ? err.detail
            : 'Không thể tải danh sách bài giảng.';
        setError(msg);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedLevelId, selectedStatus, searchQuery]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createLesson = useCallback(
    async (payload: CreateLessonRequestDto): Promise<LessonDto> => {
      setIsCreating(true);
      setError(null);
      try {
        const created = await LessonService.createLesson(payload);
        setLessons((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.detail
            : 'Không thể tạo bài giảng mới. Kiểm tra trùng lặp Unit/Lesson.';
        setError(msg);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  const archiveLesson = useCallback(async (id: number): Promise<void> => {
    setError(null);
    try {
      const updated = await LessonService.archiveLesson(id);
      setLessons((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.detail
          : 'Không thể lưu trữ bài giảng.';
      setError(msg);
      throw err;
    }
  }, []);

  return {
    levels,
    lessons,
    selectedLevelId,
    selectedStatus,
    searchQuery,
    isLoading,
    isCreating,
    error,
    setSelectedLevelId,
    setSelectedStatus,
    setSearchQuery,
    clearError,
    createLesson,
    archiveLesson,
  };
}

