export type UserRole = 'Admin' | 'Teacher' | 'Student';

export type LoginMode = 'Password' | 'ClassLink';

export type LevelGroup = 'Young' | 'Senior';

export interface UserProfileDto {
  id: number;
  username: string;
  displayName: string;
  email: string | null;
  avatarKey: string | null;
  role: UserRole;
  loginMode: LoginMode;
  mustChangePassword: boolean;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  expiresAt: string;
  user: UserProfileDto;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}

export interface ProblemDetailsDto {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]> | string[];
}

export interface PagedResultDto<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}
