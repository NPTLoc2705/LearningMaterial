import { authFetch } from '../lib/authFetch';
import type {
  CreateLessonRequestDto,
  LessonDto,
  LessonFilterDto,
  PagedResultDto,
  UpdateLessonRequestDto,
} from '../types/api';

export const LessonService = {
  async getLessons(
    filter: LessonFilterDto = {}
  ): Promise<PagedResultDto<LessonDto>> {
    const params = new URLSearchParams();
    if (filter.levelId) params.set('levelId', String(filter.levelId));
    if (filter.status) params.set('status', filter.status);
    if (filter.q && filter.q.trim()) params.set('q', filter.q.trim());
    params.set('page', String(filter.page ?? 1));
    params.set('pageSize', String(filter.pageSize ?? 50));

    return authFetch<PagedResultDto<LessonDto>>(
      `/lessons?${params.toString()}`,
      { method: 'GET' }
    );
  },

  async getLessonById(id: number): Promise<LessonDto> {
    return authFetch<LessonDto>(`/lessons/${id}`, { method: 'GET' });
  },

  async createLesson(payload: CreateLessonRequestDto): Promise<LessonDto> {
    return authFetch<LessonDto>('/lessons', {
      method: 'POST',
      body: payload,
    });
  },

  async updateLesson(
    id: number,
    payload: UpdateLessonRequestDto
  ): Promise<LessonDto> {
    return authFetch<LessonDto>(`/lessons/${id}`, {
      method: 'PUT',
      body: payload,
    });
  },

  async publishLesson(id: number): Promise<LessonDto> {
    return authFetch<LessonDto>(`/lessons/${id}/publish`, {
      method: 'POST',
    });
  },

  async archiveLesson(id: number): Promise<LessonDto> {
    return authFetch<LessonDto>(`/lessons/${id}/archive`, {
      method: 'POST',
    });
  },

  async restoreLesson(id: number): Promise<LessonDto> {
    return authFetch<LessonDto>(`/lessons/${id}/restore`, {
      method: 'POST',
    });
  },
};
