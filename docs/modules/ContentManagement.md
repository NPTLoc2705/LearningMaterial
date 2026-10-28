## ContentManagement (`LessonService`, `VocabularyService`, `ContentValidator`, `LessonsController`, `VocabularyController`)

### Purpose
Manages lesson shells (`Lesson`), vocabulary items (`VocabularyItem`), and publication validation (`ContentValidator`) shared across classrooms of the same `Level` (decision Q-06 / `S1-T06`, `S2-T01`, `S2-T03`, `S2-T04`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | `LessonFilterDto` | Optional `LevelId`, `Status` (`Draft`/`Published`/`Archived`), search `Query`, `Page`, `PageSize` |
| `request` | `CreateLessonRequestDto` / `UpdateLessonRequestDto` | `{ LevelId, UnitNo, LessonNo, Title, UnitTitle? }` |
| `vocabRequest` | `CreateVocabularyItemRequestDto` / `UpdateVocabularyItemRequestDto` | `{ Word, MeaningVi?, MeaningEn?, PartOfSpeech?, ExampleEn?, ExampleVi?, Topic?, ImageKey?, ImageSha256?, SourcePage?, SortOrder? }` |
| `lessonId` / `id` | `int` | Target lesson or vocabulary item identifier |

**Returns:** `LessonDto`, `PagedResultDto<LessonDto>`, `VocabularyItemDto`, or `SignedMediaUrlDto` (`GET /api/media/{*imageKey}`). On publish validation failure (`POST /api/lessons/{id}/publish`), returns `422 Unprocessable Entity` with `errors: ValidationDiagnosticDto[]` (`{ path, message }[]`).

### Prerequisites / Context
- Database table `app."Lessons"` enforces a unique index on `(LevelId, UnitNo, LessonNo)` ($O(\log N)$ duplicate check, returning `409 Conflict` on collision) and a composite index on `(LevelId, Status)` for filtered listing.
- Database table `app."VocabularyItems"` (`S2-T01`) stores lesson vocabulary (`Word` with `case_insensitive_icu` collation, optional `MeaningVi`, `MeaningEn`, `PartOfSpeech`, `ExampleEn`, `ExampleVi`, `Topic`, `ImageKey`, `ImageSha256`, `SourcePage`, `SortOrder`, `IsArchived`) with a partial unique index `IX_VocabularyItems_LessonId_Word WHERE "IsArchived" = FALSE` ($O(\log N)$ case-insensitive uniqueness check per lesson) and a composite index `IX_VocabularyItems_LessonId_IsArchived_SortOrder` ($O(\log N + K)$ ordered retrieval).
- **Vocabulary Validation (`S2-T03`):** Each item requires a non-empty `Word` and at least one of `ImageKey` or `MeaningVi` (`400 Bad Request` otherwise). Duplicate active words in the same lesson return `409 Conflict`. Deleting a vocabulary item soft-archives it (`IsArchived = true`).
- **Publish State Machine & `ContentValidator` (`S2-T04`, `TC-04`, `TC-13`):**
  - `Draft -> Published` (`POST /api/lessons/{id}/publish`): Evaluates `ContentValidator.ValidateForPublish` in $O(V)$ where $V$ is the number of active vocabulary items in the lesson. If the lesson's `LevelSettings.EnabledActivities` includes any picture/word MCQ or matching activity (`VocabListenPickPicture`, `VocabListenChoose`, `VocabPictureWordMatch`, `VocabMatchPictureWord`), at least `4` active vocabulary items are required (`TC-13`); otherwise at least `1` active item is required. Every active item must have a non-empty `Word` and at least one of `ImageKey` or `MeaningVi` (`TC-04`).
  - `Draft/Published -> Archived` (`POST /api/lessons/{id}/archive`): Marks lesson `Archived` (read-only).
  - `Archived -> Draft` (`POST /api/lessons/{id}/restore`): Restores an archived lesson back to `Draft` so it can be edited and re-published.
- **Media Authorization (`GET /api/media/{*imageKey}`, `TC-34`):** Teachers and Admins can request signed read URLs for any stored media key; Students can only obtain a signed URL if the `imageKey` belongs to an active vocabulary item in a `Published` lesson assigned to a non-archived classroom where the student has an `Active` enrollment ($O(\log N)$ indexed check).

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
