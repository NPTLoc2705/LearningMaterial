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
