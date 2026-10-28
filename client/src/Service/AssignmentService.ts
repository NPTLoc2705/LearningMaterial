import { authFetch } from '../lib/authFetch';
import type {
  CreateLessonAssignmentRequestDto,
  LessonAssignmentDto,
  StudentAssignedLessonDto,
  StudentLessonHubDto,
} from '../types/api';

export const AssignmentService = {
  async getClassroomAssignments(
    classroomId: number
  ): Promise<LessonAssignmentDto[]> {
    return authFetch<LessonAssignmentDto[]>(
      `/classrooms/${classroomId}/assignments`,
      { method: 'GET' }
    );
  },

  async assignLessonToClassroom(
    classroomId: number,
    payload: CreateLessonAssignmentRequestDto
  ): Promise<LessonAssignmentDto> {
    return authFetch<LessonAssignmentDto>(
      `/classrooms/${classroomId}/assignments`,
      {
        method: 'POST',
        body: payload,
      }
    );
  },

  async getMyAssignments(): Promise<StudentAssignedLessonDto[]> {
    return authFetch<StudentAssignedLessonDto[]>('/me/assignments', {
      method: 'GET',
    });
  },

  async getMyLessonHub(lessonId: number): Promise<StudentLessonHubDto> {
    return authFetch<StudentLessonHubDto>(`/me/lessons/${lessonId}`, {
      method: 'GET',
    });
  },
};

