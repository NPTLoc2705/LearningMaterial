import { authFetch } from '../lib/authFetch';
import type {
  CreateExtractionJobResponseDto,
  ExtractionJobDto,
  UpdateExtractionDraftRequestDto,
} from '../types/api';

export const ExtractionService = {
  async uploadSlideDeck(
    lessonId: number,
    file: File
  ): Promise<CreateExtractionJobResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    return authFetch<CreateExtractionJobResponseDto>(
      `/lessons/${lessonId}/extractions`,
      {
        method: 'POST',
        body: formData,
      }
    );
  },

  async getExtractionJob(jobId: number): Promise<ExtractionJobDto> {
    return authFetch<ExtractionJobDto>(`/extractions/${jobId}`, {
      method: 'GET',
    });
  },

  async updateDraft(
    jobId: number,
    payload: UpdateExtractionDraftRequestDto
  ): Promise<ExtractionJobDto> {
    return authFetch<ExtractionJobDto>(`/extractions/${jobId}/draft`, {
      method: 'PUT',
      body: payload,
    });
  },

  async approveJob(jobId: number): Promise<ExtractionJobDto> {
    return authFetch<ExtractionJobDto>(`/extractions/${jobId}/approve`, {
      method: 'POST',
    });
  },

  async discardJob(jobId: number): Promise<ExtractionJobDto> {
    return authFetch<ExtractionJobDto>(`/extractions/${jobId}`, {
      method: 'DELETE',
    });
  },
};
