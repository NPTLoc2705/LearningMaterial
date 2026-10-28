import type {
  LoginResponseDto,
  ProblemDetailsDto,
  UserProfileDto,
  ValidationDiagnosticDto,
} from '../types/api';

const SESSION_STORAGE_KEY = 'learning_platform_auth_v1';

export interface AuthSessionSnapshot {
  accessToken: string | null;
  expiresAt: string | null;
  user: UserProfileDto | null;
}

const EMPTY_SNAPSHOT: AuthSessionSnapshot = {
  accessToken: null,
  expiresAt: null,
  user: null,
};

let memorySession: AuthSessionSnapshot = loadGuardedSessionStorage();
const listeners = new Set<() => void>();

function isValidUserProfile(value: unknown): value is UserProfileDto {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.username === 'string' &&
    typeof candidate.displayName === 'string' &&
    (candidate.role === 'Admin' ||
      candidate.role === 'Teacher' ||
      candidate.role === 'Student') &&
    (candidate.loginMode === 'Password' || candidate.loginMode === 'ClassLink') &&
    typeof candidate.mustChangePassword === 'boolean'
  );
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  const parsed = Date.parse(expiresAt);
  if (Number.isNaN(parsed)) return true;
  return parsed <= Date.now();
}

function loadGuardedSessionStorage(): AuthSessionSnapshot {
  if (typeof window === 'undefined') return EMPTY_SNAPSHOT;
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return EMPTY_SNAPSHOT;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_SNAPSHOT;
    const record = parsed as Record<string, unknown>;
    const accessToken =
      typeof record.accessToken === 'string' && record.accessToken.length > 0
        ? record.accessToken
        : null;
    const expiresAt =
      typeof record.expiresAt === 'string' ? record.expiresAt : null;
    const user = isValidUserProfile(record.user) ? record.user : null;

    if (!accessToken || !user || isExpired(expiresAt)) {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return EMPTY_SNAPSHOT;
    }

    return { accessToken, expiresAt, user };
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function saveGuardedSessionStorage(snapshot: AuthSessionSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    if (!snapshot.accessToken || !snapshot.user) {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(snapshot)
    );
  } catch {
    // Ignore storage quota or private mode restrictions; in-memory state remains active
  }
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

export function getAuthSnapshot(): AuthSessionSnapshot {
  if (memorySession.accessToken && isExpired(memorySession.expiresAt)) {
    clearAuthSession();
  }
  return memorySession;
}

export function subscribeAuthState(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setAuthSession(response: LoginResponseDto): void {
  memorySession = {
    accessToken: response.accessToken,
    expiresAt: response.expiresAt,
    user: response.user,
  };
  saveGuardedSessionStorage(memorySession);
  notifyListeners();
}

export function updateAuthUser(user: UserProfileDto): void {
  if (!memorySession.accessToken) return;
  memorySession = {
    ...memorySession,
    user,
  };
  saveGuardedSessionStorage(memorySession);
  notifyListeners();
}

export function clearAuthSession(): void {
  if (
    memorySession.accessToken === null &&
    memorySession.user === null &&
    memorySession.expiresAt === null
  ) {
    return;
  }
  memorySession = EMPTY_SNAPSHOT;
  saveGuardedSessionStorage(EMPTY_SNAPSHOT);
  notifyListeners();
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly title: string;
  public readonly detail: string;
  public readonly errors?:
    | Record<string, string[]>
    | string[]
    | ValidationDiagnosticDto[];

  constructor(
    status: number,
    title: string,
    detail: string,
    errors?:
      | Record<string, string[]>
      | string[]
      | ValidationDiagnosticDto[]
  ) {
    super(detail || title || `HTTP Error ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.errors = errors;
  }
}

export function getApiBaseUrl(): string {
  const rawBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!rawBase) return '';
  return rawBase.replace(/\/+$/, '');
}

function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const apiPath =
    normalizedPath.startsWith('/api/') || normalizedPath === '/health'
      ? normalizedPath
      : `/api${normalizedPath}`;
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${apiPath}` : apiPath;
}

export interface AuthFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
}

export async function authFetch<T>(
  path: string,
  options: AuthFetchOptions = {}
): Promise<T> {
  const { body, skipAuth = false, headers: customHeaders, ...rest } = options;
  const headers = new Headers(customHeaders);

  const snapshot = getAuthSnapshot();
  if (!skipAuth && snapshot.accessToken) {
    headers.set('Authorization', `Bearer ${snapshot.accessToken}`);
  }

  let serializedBody: BodyInit | undefined;
  if (body !== undefined && body !== null) {
    if (
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      body instanceof Blob ||
      typeof body === 'string'
    ) {
      serializedBody = body;
    } else {
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      serializedBody = JSON.stringify(body);
    }
  }

  const response = await fetch(resolveApiUrl(path), {
    ...rest,
    headers,
    body: serializedBody,
  });

  if (!response.ok) {
    let problem: ProblemDetailsDto | null = null;
    const contentType = response.headers.get('content-type') ?? '';
    if (
      contentType.includes('application/json') ||
      contentType.includes('application/problem+json')
    ) {
      try {
        problem = (await response.json()) as ProblemDetailsDto;
      } catch {
        problem = null;
      }
    }

    if (response.status === 401 && !skipAuth) {
      clearAuthSession();
    }

    const title = problem?.title ?? (response.statusText || 'Lỗi yêu cầu');
    const detail =
      problem?.detail ??
      (response.status === 401
        ? 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.'
        : response.status === 403
          ? 'Bạn không có quyền truy cập tài nguyên này.'
          : response.status === 429
            ? 'Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.'
            : title);

    throw new ApiError(response.status, title, detail, problem?.errors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

