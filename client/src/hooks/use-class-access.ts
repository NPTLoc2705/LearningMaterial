import { useCallback, useEffect, useMemo, useState } from 'react';
import { ClassAccessService } from '../Service/ClassAccessService';
import type {
  ClassAccessProfileDto,
  ClassAccessProfilesResponseDto,
  LoginResponseDto,
} from '../types/api';

function getLastProfileStorageKey(classroomId: number): string {
  return `learning_platform_kid_profile_c_${classroomId}`;
}

function readRememberedStudentId(classroomId: number): number | null {
  if (typeof window === 'undefined' || classroomId <= 0) return null;
  try {
    const raw = window.localStorage.getItem(getLastProfileStorageKey(classroomId));
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function saveRememberedStudentId(classroomId: number, studentId: number): void {
  if (typeof window === 'undefined' || classroomId <= 0) return;
  try {
    window.localStorage.setItem(
      getLastProfileStorageKey(classroomId),
      String(studentId)
    );
  } catch {
    // Ignore storage restrictions
  }
}

function removeRememberedStudentId(classroomId: number): void {
  if (typeof window === 'undefined' || classroomId <= 0) return;
  try {
    window.localStorage.removeItem(getLastProfileStorageKey(classroomId));
  } catch {
    // Ignore storage restrictions
  }
}

export interface UseClassAccessResult {
  classInfo: ClassAccessProfilesResponseDto | null;
  rememberedProfile: ClassAccessProfileDto | null;
  isLoading: boolean;
  enteringStudentId: number | null;
  isLinkInvalid: boolean;
  clearRememberedProfile: () => void;
  enterAsStudent: (studentId: number) => Promise<LoginResponseDto>;
}

export function useClassAccess(token: string): UseClassAccessResult {
  const [classInfo, setClassInfo] =
    useState<ClassAccessProfilesResponseDto | null>(null);
  const [rememberedId, setRememberedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [enteringStudentId, setEnteringStudentId] = useState<number | null>(
    null
  );
  const [isLinkInvalid, setIsLinkInvalid] = useState<boolean>(false);

  useEffect(() => {
    const trimmed = token.trim();
    if (!trimmed) {
      return;
    }

    let active = true;
    ClassAccessService.getClassProfiles(trimmed)
      .then((data) => {
        if (!active) return;
        setClassInfo(data);
        setIsLinkInvalid(false);
        const savedId = readRememberedStudentId(data.classroomId);
        if (savedId && data.profiles.some((p) => p.studentId === savedId)) {
          setRememberedId(savedId);
        } else {
          setRememberedId(null);
        }
      })
      .catch(() => {
        if (!active) return;
        setIsLinkInvalid(true);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const rememberedProfile = useMemo(() => {
    if (!classInfo || !rememberedId) return null;
    return (
      classInfo.profiles.find((p) => p.studentId === rememberedId) ?? null
    );
  }, [classInfo, rememberedId]);

  const clearRememberedProfile = useCallback(() => {
    if (classInfo) {
      removeRememberedStudentId(classInfo.classroomId);
    }
    setRememberedId(null);
  }, [classInfo]);

  const enterAsStudent = useCallback(
    async (studentId: number): Promise<LoginResponseDto> => {
      setEnteringStudentId(studentId);
      try {
        const response = await ClassAccessService.enterClass(token, studentId);
        if (classInfo) {
          saveRememberedStudentId(classInfo.classroomId, studentId);
        }
        return response;
      } finally {
        setEnteringStudentId(null);
      }
    },
    [token, classInfo]
  );

  return {
    classInfo,
    rememberedProfile,
    isLoading: Boolean(token.trim()) && isLoading,
    enteringStudentId,
    isLinkInvalid: !token.trim() || isLinkInvalid,
    clearRememberedProfile,
    enterAsStudent,
  };
}

