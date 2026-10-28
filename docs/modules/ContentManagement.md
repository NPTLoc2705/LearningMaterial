## ContentManagement (`LessonService`, `LessonsController`, `Lesson`)

### Purpose
Manages lesson shells (`Lesson`) shared across classrooms of the same `Level` (decision Q-06 / S1-T06). Each lesson represents a unique `(LevelId, UnitNo, LessonNo)` tuple (e.g., `Explore 1 · Unit 3 · Lesson 1 — "People"`), starts in `Draft` status, and supports filtering by `levelId`, `status`, and search query `q` with pagination.

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | `LessonFilterDto` | Optional `LevelId`, `Status` (`Draft`/`Published`/`Archived`), search `Query`, `Page`, `PageSize` |
| `request` | `CreateLessonRequestDto` / `UpdateLessonRequestDto` | `{ LevelId, UnitNo, LessonNo, Title, UnitTitle? }` |
| `lessonId` | `int` | Target lesson identifier |

**Returns:** `LessonDto` / `PagedResultDto<LessonDto>` — DTO projection of the lesson and its associated `Level`.

### Prerequisites / Context
- Database table `app."Lessons"` enforces a unique index on `(LevelId, UnitNo, LessonNo)` ($O(\log N)$ duplicate check, returning `409 Conflict` on collision) and a composite index on `(LevelId, Status)` for filtered listing.
- Lessons are level-shared among `Teacher` and `Admin` roles (`TeacherOrAdmin` policy); students are forbidden from `/api/lessons` and only see assigned `Published` lessons via `/api/me/assignments`.
- Archived lessons (`LessonStatus.Archived`) are read-only and reject updates with `409 Conflict`.
