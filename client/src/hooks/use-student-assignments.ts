import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../lib/authFetch';
import { AssignmentService } from '../Service/AssignmentService';
import type { StudentAssignedLessonDto } from '../types/api';

export function useStudentAssignments() {
  const [assignments, setAssignments] = useState<StudentAssignedLessonDto[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    AssignmentService.getMyAssignments()
      .then((items) => {
        if (active) setAssignments(items);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof ApiError
            ? err.detail
            : 'Unable to load assigned lessons.'
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const loadAssignments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await AssignmentService.getMyAssignments();
      setAssignments(items);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail
          : 'Unable to load assigned lessons.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    assignments,
    isLoading,
    error,
    reload: loadAssignments,
  };
}

