## Assignments (`LessonAssignmentService`, `AssignmentsController`, `LessonAssignment`)

### Purpose
Manages assigning `Published` curriculum lessons to same-level classrooms and serving assigned lessons and lesson hub data to enrolled students (`S2-T05`). Enforces strict level matching (`TC-01 part 2`), classroom ownership (`TC-03`), and publication state (`TC-19`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `classroomId` | `int` | Target classroom ID (`POST/GET /api/classrooms/{id}/assignments`) |
| `request` | `CreateLessonAssignmentRequestDto` | `{ LessonId, DueAt? }` |
| `studentId` | `int` | Authenticated student ID resolved from JWT claims (`GET /api/me/assignments`, `GET /api/me/lessons/{id}`) |
| `lessonId` | `int` | Target lesson ID for student lesson hub (`GET /api/me/lessons/{id}`) |

**Returns:** `LessonAssignmentDto`, `IReadOnlyList<StudentAssignedLessonDto>`, or `StudentLessonHubDto` (lesson metadata, `LevelSettingsDto`, active vocabulary items, and zero test answers).

### Prerequisites / Context
- Database table `app."LessonAssignments"` has RLS enabled and enforces a unique index `IX_LessonAssignments_LessonId_ClassroomId` ($O(\log N)$ duplicate check, returning `409 Conflict` on duplicate assignment) and composite index `IX_LessonAssignments_ClassroomId_AssignedAt` ($O(\log N + K)$ classroom assignment listing).
- Only lessons in `LessonStatus.Published` whose `LevelId == Classroom.LevelId` can be assigned (`409 Conflict` otherwise).
- Student queries (`GetPublishedAssignmentsForStudentAsync` and `IsPublishedLessonAssignedToStudentAsync`) join active `Enrollments` (`EnrollmentStatus.Active`) on non-archived `Classrooms` with `LessonAssignments` and `Published` `Lessons` ($O(\log N + K)$ via indexed foreign keys). If a lesson is later archived or a student is unenrolled, it immediately disappears from `/api/me/assignments` and returns `404 Not Found` on `/api/me/lessons/{id}`.

---

## Student Assigned Lessons & Lesson Hub UI (`client/src/pages/student/index.tsx`, `client/src/pages/student/lesson-hub.tsx`, `client/src/components/kids/KidLessonCard.tsx`, `client/src/components/kids/KidVocabularyCard.tsx`)

### Purpose
Renders the student's assigned `Published` lessons (`/student`) and the interactive lesson hub (`/student/lessons/:id`) driven by `LevelSettings` (`S2-T08`). Young group students (`Kiddie–Explore 4`) receive giant icon-first cards (`KidLessonCard`, `KidVocabularyCard`) with $\ge 64\text{ px}$ tap targets (`KidActionButton`) and short English prompts; Senior group students (`Pioneer`) receive standard Vietnamese UI.

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `lessonId` | `number` | Route `:id` parameter for `/student/lessons/:id` |

**Returns:** `JSX.Element` (`StudentHomePage`, `StudentLessonHubPage`) — Displays assigned published lessons, vocabulary cards with authorized signed images (`SignedMediaImage`), and level-enabled activity buttons (disabled until Sprint 3 practice players).

### Prerequisites / Context
- Mobile-first layout (`375px` viewport support), `motion-reduce:` support on all interactive Young components, and zero branching on level names (uses `levelGroup` and `levelSettings.enabledActivities`).

