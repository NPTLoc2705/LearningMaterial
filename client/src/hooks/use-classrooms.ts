import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../lib/authFetch';
import { ClassroomService } from '../Service/ClassroomService';
import type {
  ClassroomDto,
  CreateClassroomRequestDto,
  LevelDto,
} from '../types/api';

export interface UseClassroomsResult {
  levels: LevelDto[];
  classrooms: ClassroomDto[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  clearError: () => void;
  reload: () => Promise<void>;
  createClassroom: (payload: CreateClassroomRequestDto) => Promise<ClassroomDto>;
}

export function useClassrooms(): UseClassroomsResult {
  const [levels, setLevels] = useState<LevelDto[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [levelsData, classroomsPage] = await Promise.all([
        ClassroomService.getLevels(),
        ClassroomService.getClassrooms(1, 100),
      ]);
      setLevels(levelsData);
      setClassrooms(classroomsPage.items);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.detail
          : 'Không thể tải danh sách lớp học. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      ClassroomService.getLevels(),
      ClassroomService.getClassrooms(1, 100),
    ])
      .then(([levelsData, classroomsPage]) => {
        if (!active) return;
        setLevels(levelsData);
        setClassrooms(classroomsPage.items);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg =
          err instanceof ApiError
            ? err.detail
            : 'Không thể tải danh sách lớp học. Vui lòng thử lại.';
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
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createClassroom = useCallback(
    async (payload: CreateClassroomRequestDto): Promise<ClassroomDto> => {
      setIsCreating(true);
      setError(null);
      try {
        const created = await ClassroomService.createClassroom(payload);
        setClassrooms((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.detail
            : 'Không thể tạo lớp học mới. Vui lòng kiểm tra thông tin.';
        setError(msg);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  return {
    levels,
    classrooms,
    isLoading,
    isCreating,
    error,
    clearError,
    reload,
    createClassroom,
  };
}

