import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../lib/authFetch';
import { AssignmentService } from '../Service/AssignmentService';
import type { StudentLessonHubDto } from '../types/api';

export function useStudentLessonHub(lessonId: number) {
  const [hub, setHub] = useState<StudentLessonHubDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isValidLessonId = Number.isFinite(lessonId) && lessonId > 0;

  useEffect(() => {
    if (!isValidLessonId) return;

    let active = true;
    AssignmentService.getMyLessonHub(lessonId)
      .then((data) => {
        if (active) setHub(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof ApiError ? err.detail : 'Unable to load lesson hub.'
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lessonId, isValidLessonId]);

  const loadHub = useCallback(async () => {
    if (!isValidLessonId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await AssignmentService.getMyLessonHub(lessonId);
      setHub(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.detail : 'Unable to load lesson hub.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [lessonId, isValidLessonId]);

  return {
    hub,
    isLoading: isValidLessonId && isLoading,
    error: !isValidLessonId ? 'Lesson was not found.' : error,
    reload: loadHub,
  };
}

