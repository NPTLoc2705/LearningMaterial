## Identity, Authentication & User/Roster Provisioning (`Service.Identity`)

### Purpose
Provides password-based authentication (`POST /api/auth/login`), current-user profile resolution (`GET /api/auth/me`), password updates (`POST /api/auth/change-password`), staff account provisioning/deactivation/password reset (`POST /api/admin/users`, `PATCH /api/admin/users/{id}`), and classroom student creation + enrollment (`POST /api/classrooms/{id}/students`) driven by `LevelSettings.AccessMode`.

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `request` (`LoginAsync`) | `LoginRequestDto` | `{ username, password }` credentials for a `LoginMode.Password` account. |
| `request` (`CreateStaffUserAsync`) | `CreateStaffUserRequestDto` | Admin-only creation of `Teacher` or `Admin` account; returns one-time `TemporaryPassword`. |
| `request` (`UpdateUserAsync`) | `UpdateUserRequestDto` | Toggles `IsActive` and/or resets temporary password (`MustChangePassword = true`). |
| `request` (`CreateClassroomStudentAsync`) | `CreateClassroomStudentRequestDto` | Creates and enrolls either a passwordless `ClassLink` Young profile (nickname + avatar only) or a `Password` Senior student (with one-time `TemporaryPassword`). |

**Returns:** `LoginResponseDto`, `UserProfileDto`, or `CreatedUserResponseDto` — DTOs only, never EF entities.

### Prerequisites / Context
- **Environment assumptions**:
  - `Jwt:SecretKey` ($\ge 32$ bytes), `Jwt:Issuer`, `Jwt:Audience`, and `Jwt:ExpiryHours` (default `8` hours).
  - `JwtBearerEvents.OnTokenValidated` checks `user.IsActive` on every authenticated request so deactivated users' tokens stop working immediately (`S1-T04`).
- **Data constraints or edge cases**:
  - **Anti-enumeration (`TC-21`)**: Unknown usernames, inactive users, `LoginMode.ClassLink` profiles, and wrong passwords all execute a password hash verification (`PasswordHasher<User>`) and return the exact same HTTP `401` message (`"Invalid username or password."`).
  - **Child-data protection**: Young profiles (`AccessMode.ClassLink`) never store an email or password hash and are assigned a generated internal username (`kid_c{classroomId}_{randomHex}`).
  - **Query Complexity**:
    - `GetByUsernameAsync`: $O(\log N)$ via unique case-insensitive index `IX_Users_Username`.
    - `GetByIdAsync` / `UpdateAsync`: $O(\log N)$ via primary key index `PK_Users`.
    - `GetByIdWithSettingsAndStaffAsync`: $O(\log N)$ PK lookup joining `Levels`, `LevelSettings`, and `ClassroomStaffs`.
