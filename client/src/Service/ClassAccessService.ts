import { authFetch, setAuthSession } from '../lib/authFetch';
import type {
  ClassAccessProfilesResponseDto,
  LoginResponseDto,
} from '../types/api';

export const ClassAccessService = {
  async getClassProfiles(
    token: string
  ): Promise<ClassAccessProfilesResponseDto> {
    const safeToken = encodeURIComponent(token.trim());
    return authFetch<ClassAccessProfilesResponseDto>(
      `/access/class/${safeToken}`,
      {
        method: 'GET',
        skipAuth: true,
      }
    );
  },

  async enterClass(
    token: string,
    studentId: number
  ): Promise<LoginResponseDto> {
    const safeToken = encodeURIComponent(token.trim());
    const response = await authFetch<LoginResponseDto>(
      `/access/class/${safeToken}/enter`,
      {
        method: 'POST',
        body: { studentId },
        skipAuth: true,
      }
    );
    setAuthSession(response);
    return response;
  },
};

