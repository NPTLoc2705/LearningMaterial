import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  ApiError,
  getAuthSnapshot,
  subscribeAuthState,
} from '../lib/authFetch';
import { AuthService } from '../Service/AuthService';
import type {
  ChangePasswordRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  UserProfileDto,
  UserRole,
} from '../types/api';

let initialProfileVerificationPromise: Promise<void> | null = null;

export function getHomeRouteForRole(role: UserRole): string {
  switch (role) {
    case 'Admin':
    case 'Teacher':
      return '/teacher/classes';
    case 'Student':
      return '/student';
  }
}

export interface UseAuthResult {
  user: UserProfileDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
  login: (payload: LoginRequestDto) => Promise<LoginResponseDto>;
  changePassword: (payload: ChangePasswordRequestDto) => Promise<void>;
  refreshProfile: () => Promise<UserProfileDto | null>;
  logout: () => void;
}

export function useAuth(): UseAuthResult {
  const snapshot = useSyncExternalStore(
    subscribeAuthState,
    getAuthSnapshot,
    getAuthSnapshot
  );

  const [hasVerifiedSession, setHasVerifiedSession] = useState<boolean>(
    () => !snapshot.accessToken || initialProfileVerificationPromise !== null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!snapshot.accessToken) {
      return;
    }

    if (!initialProfileVerificationPromise) {
      initialProfileVerificationPromise = AuthService.getMe()
        .then(() => undefined)
        .catch(() => undefined);
    }

    let isMounted = true;
    initialProfileVerificationPromise.finally(() => {
      if (isMounted) {
        setHasVerifiedSession(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [snapshot.accessToken]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(
    async (payload: LoginRequestDto): Promise<LoginResponseDto> => {
      setIsSubmitting(true);
      setError(null);
      try {
        return await AuthService.login(payload);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.detail
            : 'Không thể đăng nhập. Vui lòng kiểm tra kết nối mạng.';
        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const changePassword = useCallback(
    async (payload: ChangePasswordRequestDto): Promise<void> => {
      setIsSubmitting(true);
      setError(null);
      try {
        await AuthService.changePassword(payload);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.detail
            : 'Không thể đổi mật khẩu. Vui lòng thử lại.';
        setError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const refreshProfile = useCallback(async (): Promise<UserProfileDto | null> => {
    if (!snapshot.accessToken) return null;
    try {
      return await AuthService.getMe();
    } catch {
      return null;
    }
  }, [snapshot.accessToken]);

  const logout = useCallback(() => {
    initialProfileVerificationPromise = null;
    setError(null);
    AuthService.logout();
  }, []);

  return {
    user: snapshot.user,
    accessToken: snapshot.accessToken,
    isAuthenticated: Boolean(snapshot.accessToken && snapshot.user),
    isInitializing: Boolean(snapshot.accessToken) && !hasVerifiedSession,
    isSubmitting,
    error,
    clearError,
    login,
    changePassword,
    refreshProfile,
    logout,
  };
}
