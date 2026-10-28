import {
  authFetch,
  clearAuthSession,
  setAuthSession,
  updateAuthUser,
} from '../lib/authFetch';
import type {
  ChangePasswordRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  UserProfileDto,
} from '../types/api';

export const AuthService = {
  async login(payload: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await authFetch<LoginResponseDto>('/auth/login', {
      method: 'POST',
      body: payload,
      skipAuth: true,
    });
    setAuthSession(response);
    return response;
  },

  async getMe(): Promise<UserProfileDto> {
    const profile = await authFetch<UserProfileDto>('/auth/me', {
      method: 'GET',
    });
    updateAuthUser(profile);
    return profile;
  },

  async changePassword(payload: ChangePasswordRequestDto): Promise<void> {
    await authFetch<void>('/auth/change-password', {
      method: 'POST',
      body: payload,
    });
    await AuthService.getMe();
  },

  logout(): void {
    clearAuthSession();
  },
};
