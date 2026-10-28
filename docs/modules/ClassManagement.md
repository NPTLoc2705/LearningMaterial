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
