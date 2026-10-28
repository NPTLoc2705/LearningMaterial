## Identity & Authentication (`Service.Identity` / `AuthController`)

### Purpose
Provides password-based authentication (`POST /api/auth/login`), current-user profile resolution (`GET /api/auth/me`), and password updates (`POST /api/auth/change-password`) for Teachers, Admins, and Senior (`Pioneer`) students while enforcing anti-enumeration, rate-limiting (`TC-21`), and role-based JWT authorization.

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `request` (`LoginAsync`) | `LoginRequestDto` | `{ username, password }` credentials for a `LoginMode.Password` account. |
| `userId` (`GetCurrentUserAsync`) | `int` | Resolved strictly from the authenticated JWT `ClaimTypes.NameIdentifier` claim. |
| `request` (`ChangePasswordAsync`) | `ChangePasswordRequestDto` | `{ currentPassword, newPassword }` ($\ge 8$ characters). |

**Returns:** `LoginResponseDto` (`{ accessToken, expiresAt, user }`) or `UserProfileDto` — DTOs only, never EF entities.

### Prerequisites / Context
- **Environment assumptions**:
  - `Jwt:SecretKey` ($\ge 32$ bytes), `Jwt:Issuer`, `Jwt:Audience`, and `Jwt:ExpiryHours` (default `8` hours).
  - Rate limiter policy `"LoginPolicy"` permits 5 attempts per minute per IP before returning HTTP `429 Too Many Requests` (`ProblemDetails`).
- **Data constraints or edge cases**:
  - **Anti-enumeration (`TC-21`)**: Unknown usernames, inactive users, `LoginMode.ClassLink` profiles, and wrong passwords all execute a password hash verification (`PasswordHasher<User>`) and return the exact same HTTP `401` message (`"Invalid username or password."`).
  - **Query Complexity**:
    - `GetByUsernameAsync`: $O(\log N)$ via unique case-insensitive index `IX_Users_Username`.
    - `GetByIdAsync` / `UpdateAsync`: $O(\log N)$ via primary key index `PK_Users`.
