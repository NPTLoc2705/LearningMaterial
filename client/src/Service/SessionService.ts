import { authFetch } from '../lib/authFetch';
import type {
  CompleteSessionResponseDto,
  PagedResultDto,
  StartSessionRequestDto,
  StartSessionResponseDto,
  StudentSessionSummaryDto,
  SubmitAnswerRequestDto,
  SubmitAnswerResponseDto,
  WeakWordReviewDto,
} from '../types/api';

export const SessionService = {
  async startSession(payload: StartSessionRequestDto): Promise<StartSessionResponseDto> {
    return authFetch<StartSessionResponseDto>('/sessions', {
      method: 'POST',
      body: payload,
    });
  },

  async submitAnswer(
    sessionId: number,
    payload: SubmitAnswerRequestDto
  ): Promise<SubmitAnswerResponseDto> {
    return authFetch<SubmitAnswerResponseDto>(`/sessions/${sessionId}/answers`, {
      method: 'POST',
      body: payload,
    });
  },

  async completeSession(sessionId: number): Promise<CompleteSessionResponseDto> {
    return authFetch<CompleteSessionResponseDto>(`/sessions/${sessionId}/complete`, {
      method: 'POST',
      body: {},
    });
  },

  async getSessionResult(sessionId: number): Promise<CompleteSessionResponseDto> {
    return authFetch<CompleteSessionResponseDto>(`/sessions/${sessionId}/result`, {
      method: 'GET',
    });
  },

  async getMySessions(
    page: number = 1,
    pageSize: number = 10
  ): Promise<PagedResultDto<StudentSessionSummaryDto>> {
    return authFetch<PagedResultDto<StudentSessionSummaryDto>>(
      `/me/sessions?page=${page}&pageSize=${pageSize}`,
      { method: 'GET' }
    );
  },

  async getMyReview(limit: number = 10): Promise<WeakWordReviewDto[]> {
    return authFetch<WeakWordReviewDto[]>(`/me/review?limit=${limit}`, {
      method: 'GET',
    });
  },
};
