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
- Database table `app."VocabularyItems"` (`S2-T01`) stores lesson vocabulary (`Word` with `case_insensitive_icu` collation, optional `MeaningVi`, `MeaningEn`, `PartOfSpeech`, `ExampleEn`, `ExampleVi`, `Topic`, `ImageKey`, `ImageSha256`, `SourcePage`, `SortOrder`, `IsArchived`) with a partial unique index `IX_VocabularyItems_LessonId_Word WHERE "IsArchived" = FALSE` ($O(\log N)$ case-insensitive uniqueness check per lesson) and a composite index `IX_VocabularyItems_LessonId_IsArchived_SortOrder` ($O(\log N + K)$ ordered retrieval).

---

## Teacher Lesson List & Metadata UI (`client/src/pages/teacher/lessons/index.tsx`, `client/src/Service/LessonService.ts`)

### Purpose
Provides the teacher lesson library interface (`/teacher/lessons`) with filtering by curriculum `Level`, `LessonStatus` (`Draft`, `Published`, `Archived`), and title search query `q`, plus the `CreateLessonForm` modal/panel for creating new `Draft` lesson shells (`S1-T09`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | `LessonFilterDto` | `{ levelId?, status?, q?, page?, pageSize? }` managed by `useLessons()` |
| `payload` | `CreateLessonRequestDto` | `{ levelId, unitNo, lessonNo, title, unitTitle? }` |

**Returns:** `JSX.Element` (`TeacherLessonsPage`) — Displays filtered lessons and handles `409 Conflict` duplicate `(Level, Unit, Lesson)` errors via `ApiError`.

### Prerequisites / Context
- Accessible to `Teacher` and `Admin` roles inside `TeacherLayout`.


