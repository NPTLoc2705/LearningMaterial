import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../lib/authFetch';
import { ClassroomService } from '../Service/ClassroomService';
import type {
  ClassroomDto,
  ClassroomStudentDto,
  CreateClassroomStudentRequestDto,
  CreatedClassAccessLinkDto,
  CreatedUserResponseDto,
} from '../types/api';

export interface UseClassroomDetailResult {
  classroom: ClassroomDto | null;
  students: ClassroomStudentDto[];
  isLoading: boolean;
  isSubmittingStudent: boolean;
  isMutatingLink: boolean;
  error: string | null;
  latestCreatedStudent: CreatedUserResponseDto | null;
  latestAccessLink: CreatedClassAccessLinkDto | null;
  linkRevokedNotice: boolean;
  clearError: () => void;
  dismissLatestStudentPassword: () => void;
  addStudent: (
    payload: CreateClassroomStudentRequestDto
  ) => Promise<CreatedUserResponseDto>;
  removeStudent: (studentId: number) => Promise<void>;
  createOrRotateLink: () => Promise<CreatedClassAccessLinkDto>;
  revokeLink: () => Promise<void>;
  archiveClassroom: () => Promise<void>;
}

export function useClassroomDetail(classroomId: number): UseClassroomDetailResult {
  const [classroom, setClassroom] = useState<ClassroomDto | null>(null);
  const [students, setStudents] = useState<ClassroomStudentDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmittingStudent, setIsSubmittingStudent] = useState<boolean>(false);
  const [isMutatingLink, setIsMutatingLink] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [latestCreatedStudent, setLatestCreatedStudent] =
    useState<CreatedUserResponseDto | null>(null);
  const [latestAccessLink, setLatestAccessLink] =
    useState<CreatedClassAccessLinkDto | null>(null);
  const [linkRevokedNotice, setLinkRevokedNotice] = useState<boolean>(false);

  useEffect(() => {
    if (!Number.isFinite(classroomId) || classroomId <= 0) {
      return;
    }

    let active = true;
    Promise.all([
      ClassroomService.getClassroomById(classroomId),
      ClassroomService.getClassroomStudents(classroomId),
    ])
      .then(([classroomData, studentsData]) => {
        if (!active) return;
        setClassroom(classroomData);
        setStudents(studentsData);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg =
          err instanceof ApiError
            ? err.detail
            : 'Không thể tải thông tin lớp học.';
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
  }, [classroomId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const dismissLatestStudentPassword = useCallback(() => {
    setLatestCreatedStudent(null);
  }, []);

  const addStudent = useCallback(
    async (
      payload: CreateClassroomStudentRequestDto
    ): Promise<CreatedUserResponseDto> => {
      setIsSubmittingStudent(true);
      setError(null);
      try {
        const created = await ClassroomService.createAndEnrollStudent(
          classroomId,
          payload
        );
        setLatestCreatedStudent(created);
        const refreshed = await ClassroomService.getClassroomStudents(classroomId);
        setStudents(refreshed);
        return created;
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.detail
            : 'Không thể thêm học sinh vào lớp.';
        setError(msg);
        throw err;
      } finally {
        setIsSubmittingStudent(false);
      }
    },
    [classroomId]
  );

  const removeStudent = useCallback(
    async (studentId: number): Promise<void> => {
      setError(null);
      try {
        await ClassroomService.unenrollStudent(classroomId, studentId);
        setStudents((prev) =>
          prev.filter((item) => item.studentId !== studentId)
        );
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.detail
            : 'Không thể xóa học sinh khỏi lớp.';
        setError(msg);
        throw err;
      }
    },
    [classroomId]
  );

  const createOrRotateLink =
    useCallback(async (): Promise<CreatedClassAccessLinkDto> => {
      setIsMutatingLink(true);
      setError(null);
      setLinkRevokedNotice(false);
      try {
        const link = await ClassroomService.createOrRotateAccessLink(classroomId);
        setLatestAccessLink(link);
        return link;
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.detail
            : 'Không thể tạo đường dẫn truy cập lớp học.';
        setError(msg);
        throw err;
      } finally {
        setIsMutatingLink(false);
      }
    }, [classroomId]);

  const revokeLink = useCallback(async (): Promise<void> => {
    setIsMutatingLink(true);
    setError(null);
    try {
      await ClassroomService.revokeAccessLink(classroomId);
      setLatestAccessLink(null);
      setLinkRevokedNotice(true);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.detail
          : 'Không thể thu hồi đường dẫn lớp học.';
      setError(msg);
      throw err;
    } finally {
      setIsMutatingLink(false);
    }
  }, [classroomId]);

  const archiveClassroom = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      const updated = await ClassroomService.archiveClassroom(classroomId);
      setClassroom(updated);
      setLatestAccessLink(null);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.detail : 'Không thể lưu trữ lớp học.';
      setError(msg);
      throw err;
    }
  }, [classroomId]);

  return {
    classroom,
    students,
    isLoading,
    isSubmittingStudent,
    isMutatingLink,
    error,
    latestCreatedStudent,
    latestAccessLink,
    linkRevokedNotice,
    clearError,
    dismissLatestStudentPassword,
    addStudent,
    removeStudent,
    createOrRotateLink,
    revokeLink,
    archiveClassroom,
  };
}
