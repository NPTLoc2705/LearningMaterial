import { authFetch } from '../lib/authFetch';
import type {
  ClassroomDto,
  ClassroomStudentDto,
  CreateClassroomRequestDto,
  CreateClassroomStudentRequestDto,
  CreatedClassAccessLinkDto,
  CreatedUserResponseDto,
  LevelDto,
  PagedResultDto,
  UpdateClassroomRequestDto,
} from '../types/api';

export const ClassroomService = {
  async getLevels(): Promise<LevelDto[]> {
    return authFetch<LevelDto[]>('/levels', { method: 'GET' });
  },

  async getClassrooms(
    page = 1,
    pageSize = 50
  ): Promise<PagedResultDto<ClassroomDto>> {
    return authFetch<PagedResultDto<ClassroomDto>>(
      `/classrooms?page=${page}&pageSize=${pageSize}`,
      { method: 'GET' }
    );
  },

  async getClassroomById(id: number): Promise<ClassroomDto> {
    return authFetch<ClassroomDto>(`/classrooms/${id}`, { method: 'GET' });
  },

  async createClassroom(
    payload: CreateClassroomRequestDto
  ): Promise<ClassroomDto> {
    return authFetch<ClassroomDto>('/classrooms', {
      method: 'POST',
      body: payload,
    });
  },

  async updateClassroom(
    id: number,
    payload: UpdateClassroomRequestDto
  ): Promise<ClassroomDto> {
    return authFetch<ClassroomDto>(`/classrooms/${id}`, {
      method: 'PUT',
      body: payload,
    });
  },

  async archiveClassroom(id: number): Promise<ClassroomDto> {
    return authFetch<ClassroomDto>(`/classrooms/${id}/archive`, {
      method: 'POST',
    });
  },

  async getClassroomStudents(
    classroomId: number
  ): Promise<ClassroomStudentDto[]> {
    return authFetch<ClassroomStudentDto[]>(
      `/classrooms/${classroomId}/students`,
      { method: 'GET' }
    );
  },

  async createAndEnrollStudent(
    classroomId: number,
    payload: CreateClassroomStudentRequestDto
  ): Promise<CreatedUserResponseDto> {
    return authFetch<CreatedUserResponseDto>(
      `/classrooms/${classroomId}/students`,
      {
        method: 'POST',
        body: payload,
      }
    );
  },

  async unenrollStudent(classroomId: number, studentId: number): Promise<void> {
    await authFetch<void>(
      `/classrooms/${classroomId}/enrollments/${studentId}`,
      { method: 'DELETE' }
    );
  },

  async createOrRotateAccessLink(
    classroomId: number
  ): Promise<CreatedClassAccessLinkDto> {
    return authFetch<CreatedClassAccessLinkDto>(
      `/classrooms/${classroomId}/access-link`,
      { method: 'POST' }
    );
  },

  async revokeAccessLink(classroomId: number): Promise<void> {
    await authFetch<void>(`/classrooms/${classroomId}/access-link`, {
      method: 'DELETE',
    });
  },
};

