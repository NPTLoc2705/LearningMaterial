# Frontend Foundation (`client/src/`)

## `authFetch` & Session Store (`client/src/lib/authFetch.ts`)
### Purpose
Provides a centralized HTTP request wrapper and reactive authentication token store (in-memory primary with guarded `sessionStorage` rehydration) that injects `Authorization: Bearer <token>`, converts RFC 7807 `ProblemDetails` responses into typed `ApiError` instances, and clears session state automatically on `401 Unauthorized`.

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Relative API endpoint (e.g. `/auth/login` or `/api/auth/me`) or absolute URL |
| `options` | `AuthFetchOptions` | Fetch configuration including `body`, `skipAuth`, and headers |

**Returns:** `Promise<T>` — Deserialized JSON response or `undefined` on `204 No Content`.

### Prerequisites / Context
- Reads `VITE_API_BASE_URL` from Vite environment variables (defaults to relative `/api` when unset).
- Validates cached `sessionStorage` payloads against expiration timestamps (`expiresAt`) and expected profile schema before hydrating memory state.

---

## `AuthService` (`client/src/Service/AuthService.ts`)
### Purpose
Encapsulates authentication HTTP endpoints (`/api/auth/login`, `/api/auth/me`, `/api/auth/change-password`) so React components and hooks never invoke `fetch` directly.

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `payload` | `LoginRequestDto \| ChangePasswordRequestDto` | Credentials for login or password update |

**Returns:** `Promise<LoginResponseDto | UserProfileDto | void>` — Synchronizes the active session store upon completion.

### Prerequisites / Context
- Pure TypeScript module with zero React or JSX dependencies.

---

## `useAuth` (`client/src/hooks/use-auth.ts`) & `RoleRoute` (`client/src/components/auth/RoleRoute.tsx`)
### Purpose
Exposes reactive authentication state to components via `useSyncExternalStore` and enforces role-based route protection (`Admin`, `Teacher`, `Student`) as well as mandatory first-login password changes (`mustChangePassword`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `allowedRoles` | `UserRole[]` | List of roles permitted to access the wrapped route tree |
| `children` | `React.ReactNode` | Optional layout or route element to render when authorized |

**Returns:** `JSX.Element` (`RoleRoute`) / `UseAuthResult` (`useAuth`) — Redirects unauthenticated users to `/login` and unauthorized roles to their role home (`/teacher/classes` or `/student`).

### Prerequisites / Context
- Preserves all legacy archive routes (`/`, `/vocabulary/*`, `/grammar/*`) without modification.
- Complexity: $O(1)$ in-memory state reads and role checks per route transition; single `/api/auth/me` verification request on initial page reload when a non-expired session token is present.

