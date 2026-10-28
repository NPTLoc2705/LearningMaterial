## ClassAccess (`ClassAccessService`, `ClassAccessController`, `ClassAccessLink`)

### Purpose
Provides passwordless classroom entry for Young-group classrooms (`AccessMode = ClassLink`, decision D-16 / Q-07). Teachers create, rotate, or revoke a single active class link per classroom whose token is ≥ 32 cryptographically random bytes and stored only as a SHA-256 hex digest. Students open the link, see only nicknames and avatar keys of active students enrolled in that classroom, and tap their profile to receive an 8-hour Student JWT (`LoginMode = ClassLink`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `actorUserId`, `actorRole` | `int`, `UserRole` | Authenticated Teacher/Admin managing the classroom link |
| `classroomId` | `int` | Target classroom ID (must belong to a level with `AccessMode = ClassLink`) |
| `rawToken` | `string` | URL-safe Base64 token (≥ 32 random bytes) from `/c/{token}` |
| `request` | `EnterClassAccessRequestDto` | `{ StudentId }` of the tapped profile in that classroom |

**Returns:**
- `CreatedClassAccessLinkDto` — `{ ClassroomId, Token, RelativePath, CreatedAt }` (raw token returned once on creation/rotation)
- `ClassAccessProfilesResponseDto` — `{ ClassroomId, ClassroomName, LevelCode, LevelDisplayName, Profiles: [{ StudentId, Nickname, AvatarKey }] }`
- `LoginResponseDto` — `{ AccessToken, ExpiresAt, User }` (8-hour Student JWT with `login_mode = ClassLink`)

### Prerequisites / Context
- Database table `app."ClassAccessLinks"` has a unique index on `TokenHash` ($O(\log N)$ lookup) and a partial unique index on `ClassroomId WHERE "RevokedAt" IS NULL` guaranteeing at most one active link per classroom.
- Constant-time comparison (`CryptographicOperations.FixedTimeEquals`) is always executed against either the stored hash bytes or a static 32-byte dummy digest to prevent timing side-channels.
- Public endpoints (`GET /api/access/class/{token}` and `POST /api/access/class/{token}/enter`) are protected by `ClassAccessPolicy`, enforcing fixed-window rate limits per IP and per token (`TC-29`).
- Never logs or persists raw class-link tokens; never exposes internal generated usernames or emails on public endpoints.

---

## Young Profile Picker UI (`client/src/pages/class-access.tsx`, `client/src/components/kids/`)

### Purpose
Renders the passwordless Young-group entry page (`/c/:token`) using the Young UI kit (`KidActionButton`, `KidProfileTile`, `KidRememberedCard`). Children tap their large avatar tile ($\ge 64\text{ px}$ tap targets, icon-first, $\le 3$ English words) to enter the classroom immediately without keyboard input.

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `token` | `string` | Route parameter `:token` from `/c/:token` passed to `useClassAccess(token)` |
| `studentId` | `number` | Selected student profile ID sent to `POST /api/access/class/{token}/enter` |

**Returns:** `JSX.Element` (`ClassAccessPage`) — Authenticates the child into the session store and redirects to `/student`.

### Prerequisites / Context
- Remembers only the numeric `studentId` per `classroomId` in `localStorage` (`learning_platform_kid_profile_c_{classroomId}`) — never stores tokens or child nicknames in `localStorage`.
- Provides a large `"Not me?"` button (`min-h-[64px]`) to switch back to the full class profile grid on shared family/classroom tablets.
- Respects `prefers-reduced-motion` (`motion-reduce:transition-none`) and renders a friendly non-technical prompt (`Ask Your Teacher`) when a link is unknown or revoked.


