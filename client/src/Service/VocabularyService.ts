import { authFetch, getApiBaseUrl } from '../lib/authFetch';
import type {
  CreateVocabularyItemRequestDto,
  SignedMediaUrlDto,
  UpdateVocabularyItemRequestDto,
  VocabularyItemDto,
} from '../types/api';

const signedUrlCache = new Map<string, { url: string; expiresAtMs: number }>();

export const VocabularyService = {
  async getLessonVocabulary(lessonId: number): Promise<VocabularyItemDto[]> {
    return authFetch<VocabularyItemDto[]>(`/lessons/${lessonId}/vocabulary`, {
      method: 'GET',
    });
  },

  async createVocabularyItem(
    lessonId: number,
    payload: CreateVocabularyItemRequestDto
  ): Promise<VocabularyItemDto> {
    return authFetch<VocabularyItemDto>(`/lessons/${lessonId}/vocabulary`, {
      method: 'POST',
      body: payload,
    });
  },

  async updateVocabularyItem(
    id: number,
    payload: UpdateVocabularyItemRequestDto
  ): Promise<VocabularyItemDto> {
    return authFetch<VocabularyItemDto>(`/vocabulary/${id}`, {
      method: 'PUT',
      body: payload,
    });
  },

  async deleteVocabularyItem(id: number): Promise<void> {
    return authFetch<void>(`/vocabulary/${id}`, {
      method: 'DELETE',
    });
  },

  async uploadVocabularyImage(
    id: number,
    file: File
  ): Promise<VocabularyItemDto> {
    const formData = new FormData();
    formData.append('file', file);
    return authFetch<VocabularyItemDto>(`/vocabulary/${id}/image`, {
      method: 'POST',
      body: formData,
    });
  },

  async getSignedMediaUrl(imageKey: string): Promise<string> {
    const normalized = imageKey.replace(/^\/+/, '');
    const cached = signedUrlCache.get(normalized);
    if (cached && cached.expiresAtMs - Date.now() > 30_000) {
      return cached.url;
    }

    const dto = await authFetch<SignedMediaUrlDto>(`/media/${normalized}`, {
      method: 'GET',
    });

    const baseUrl = getApiBaseUrl();
    const resolvedUrl =
      /^https?:\/\//i.test(dto.url) || !baseUrl
        ? dto.url
        : `${baseUrl}${dto.url.startsWith('/') ? dto.url : `/${dto.url}`}`;

    const expiresAtMs = Date.parse(dto.expiresAt);
    if (!Number.isNaN(expiresAtMs)) {
      signedUrlCache.set(normalized, { url: resolvedUrl, expiresAtMs });
    }

    return resolvedUrl;
  },
};

