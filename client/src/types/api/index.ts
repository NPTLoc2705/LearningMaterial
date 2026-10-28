export type UserRole = 'Admin' | 'Teacher' | 'Student';

export type LoginMode = 'Password' | 'ClassLink';

export type AccessMode = 'Password' | 'ClassLink';

export type LevelGroup = 'Young' | 'Senior';

export type GrammarPresentation = 'UsageFirst' | 'FullRules';

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

export interface LevelSettingsDto {
  accessMode: AccessMode;
  showPercentScore: boolean;
  passThresholdPercent: number | null;
  grammarPresentation: GrammarPresentation;
  enabledActivities: string[];
  questionCount: number;
  optionCount: number;
  starThreshold3: number;
  starThreshold2: number;
}

export interface LevelDto {
  id: number;
  code: string;
  displayName: string;
  sortOrder: number;
  group: LevelGroup;
  settings: LevelSettingsDto;
}

export interface ClassroomDto {
  id: number;
  name: string;
  levelId: number;
  levelCode: string;
  levelDisplayName: string;
  levelGroup: LevelGroup;
  accessMode: AccessMode;
  termName: string | null;
  startDate: string | null;
  endDate: string | null;
  isArchived: boolean;
  createdByUserId: number;
  createdAt: string;
}

export interface CreateClassroomRequestDto {
  name: string;
  levelId: number;
  termName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface UpdateClassroomRequestDto {
  name: string;
  termName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ClassroomStudentDto {
  studentId: number;
  username: string;
  displayName: string;
  avatarKey: string | null;
  loginMode: LoginMode;
  enrollmentStatus: 'Active' | 'Left';
  enrolledAt: string;
}

export interface CreateClassroomStudentRequestDto {
  displayName: string;
  username?: string | null;
  avatarKey?: string | null;
}

export interface CreatedUserResponseDto {
  user: UserProfileDto;
  temporaryPassword: string | null;
}

export interface CreatedClassAccessLinkDto {
  classroomId: number;
  token: string;
  relativePath: string;
  createdAt: string;
}

export interface ClassAccessProfileDto {
  studentId: number;
  nickname: string;
  avatarKey: string | null;
}

export interface ClassAccessProfilesResponseDto {
  classroomId: number;
  classroomName: string;
  levelCode: string;
  levelDisplayName: string;
  profiles: ClassAccessProfileDto[];
}

export type LessonStatus = 'Draft' | 'Published' | 'Archived';

export interface LessonDto {
  id: number;
  levelId: number;
  levelCode: string;
  levelDisplayName: string;
  levelGroup: LevelGroup;
  unitNo: number;
  unitTitle: string | null;
  lessonNo: number;
  title: string;
  status: LessonStatus;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface CreateLessonRequestDto {
  levelId: number;
  unitNo: number;
  lessonNo: number;
  title: string;
  unitTitle?: string | null;
}

export interface UpdateLessonRequestDto {
  unitNo: number;
  lessonNo: number;
  title: string;
  unitTitle?: string | null;
}

export interface LessonFilterDto {
  levelId?: number | null;
  status?: LessonStatus | null;
  q?: string | null;
  page?: number;
  pageSize?: number;
}

