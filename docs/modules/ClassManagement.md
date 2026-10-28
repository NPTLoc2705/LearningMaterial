## Class Management & Access Control (`Service.ClassManagement`)

### Purpose
Manages curriculum levels (`GET /api/levels`), classrooms (`GET/POST /api/classrooms`, `GET/PUT /api/classrooms/{id}`, `POST /api/classrooms/{id}/archive`), student rosters & enrollments (`GET /api/classrooms/{id}/students`, `POST/DELETE /api/classrooms/{id}/enrollments`), classroom teaching staff (`POST/DELETE /api/classrooms/{id}/staff`), and enforces central ownership/membership checks via `IClassroomAccessService` (`D-09`, `TC-03`, `TC-12`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `classroomId` | `int` | Target classroom identifier verified against `IClassroomAccessService`. |
| `actorUserId`, `actorRole` | `int`, `UserRole` | Authenticated caller identity resolved strictly from JWT claims. |
| `request` (`CreateClassroomAsync`) | `CreateClassroomRequestDto` | `{ name, levelId, termName?, startDate?, endDate? }` — creator is automatically added as `StaffRole.Lead`. |
| `request` (`EnrollStudentAsync`) | `EnrollStudentRequestDto` | `{ studentId }` — enrolls a Student or reactivates a `Left` enrollment; throws `409 Conflict` on duplicate active enrollment. |

**Returns:** `IReadOnlyList<LevelDto>`, `PagedResultDto<ClassroomDto>`, `ClassroomDto`, `IReadOnlyList<ClassroomStudentDto>`, or `ClassroomStaffDto` — DTOs only.

### Prerequisites / Context
- **Environment assumptions**:
  - The 9 curriculum levels (`kiddie` through `pioneer-2`) and their `LevelSettings` are seeded by migration (`S1-T02`).
- **Data constraints or edge cases**:
  - **Existence-leak prevention (`S1-T05`)**: `IClassroomAccessService` throws `KeyNotFoundException` (`404 Not Found`) rather than `403 Forbidden` when a teacher or student attempts to access a classroom they do not belong to (`TC-03`, `TC-12`).
  - **Archived classrooms**: Once `IsArchived = true`, all mutating operations (update, add student, enroll/unenroll, add/remove staff) fail with `409 Conflict` (`InvalidOperationException`).
  - **Query Complexity**:
    - `GetActiveLevelsWithSettingsAsync`: $O(L \log L)$ with $L = 9$ rows.
    - `GetClassroomsForActorAsync`: $O(\log N + K)$ paged query filtered by `ClassroomStaff` (`IX_ClassroomStaffs_ClassroomId_TeacherId`) or `Enrollment` (`IX_Enrollments_StudentId`).
    - `GetByIdWithSettingsAndStaffAsync`: $O(\log N + S + E)$ where $S$ is staff count ($\le 3$) and $E$ is classroom roster size ($< 20$).

---

## Teacher Class Management UI (`client/src/pages/teacher/classes/`, `client/src/Service/ClassroomService.ts`)

### Purpose
Provides the Vietnamese teacher interface for viewing and creating classrooms (`/teacher/classes`), managing student rosters with avatar selection (`/teacher/classes/:id`), displaying one-time temporary passwords for `Password`-mode (Senior) students, and generating/rotating/revoking `ClassLink`-mode access links with client-side SVG QR codes (`generateQrMatrix`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `classroomId` | `number` | Route parameter `:id` used by `useClassroomDetail(classroomId)`. |
| `payload` (`createClassroom`) | `CreateClassroomRequestDto` | `{ name, levelId, termName? }` submitted from `CreateClassroomForm`. |
| `payload` (`addStudent`) | `CreateClassroomStudentRequestDto` | `{ displayName, username?, avatarKey }` submitted from `AddStudentFormCard`. |

**Returns:** `JSX.Element` (`TeacherClassesPage`, `TeacherClassDetailPage`) — Driven strictly by `classroom.accessMode` (`ClassLink` vs `Password`) from `LevelSettings`.

### Prerequisites / Context
- **Child-data & security rules**:
  - For `ClassLink` classrooms, only `displayName` (nickname) and `avatarKey` are collected — never real names or emails.
  - Raw class access links and temporary student passwords are shown **once** in memory immediately after creation/rotation and are never persisted in browser storage.
  - Client-side QR generation (`client/src/utils/qrCode.ts`) implements ISO/IEC 18004 Byte-mode Reed-Solomon ECC Level L in $O(V^2)$ matrix operations ($V \le 45 \times 45$) with zero external dependencies and no `dangerouslySetInnerHTML`.


