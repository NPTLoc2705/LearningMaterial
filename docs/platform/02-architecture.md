# 02 — Architecture & Key Decisions

## 1. Repository layout (workspace-integrated, separate Backend Git repo)
```
LearningMaterial/                       # Root Git repo (Frontend + Platform Docs)
├── client/                             # EXISTING React app → evolves into the platform frontend
├── server/                             # Ignored by root Git; has its own separate Git repo (server/.git)
│   ├── .gitignore                      # Ignores **/appsettings.json, **/appsettings.*.json, bin/, obj/
│   └── LearningPlatform/               # NEW .NET 9 solution
│       ├── BusinessObject/         # entities, enums, DTOs (pure data)
│       ├── DAL/                    # LearningPlatformDbContext, DAOs, Migrations/
│       ├── Repository/             # I{X}Repository + {X}Repository (call DAOs)
│       ├── Service/                # business logic (I{X}Service + {X}Service)
│       ├── LearningPlatform.Api/   # Controllers, Middleware, Program.cs  (target: .NET 9)
│       └── Tests/
│           ├── Service.Tests/              # unit tests
│           └── Api.IntegrationTests/       # WebApplicationFactory + Testcontainers(PostgreSQL)
├── docs/platform/                  # this planning pack
├── docs/modules/                   # per-module docs (created by tasks)
├── docker-compose.yml              # local PostgreSQL (tests / offline dev)
├── scripts/backup/                 # pg_dump backup + restore scripts
└── AGENTS.md
```
Existing legacy files (`client/src/data/*.json`, `scripts/parse-markdown.mjs`, `/vocabulary`, `/grammar` routes) stay untouched until S5-T08.

## 2. Backend layering (adapted from `conventions/backend.md`)
```
LearningPlatform.Api → Service → Repository → DAL → BusinessObject
```
| Layer | Contains | Must NOT |
|---|---|---|
| BusinessObject | Entities, enums, DTOs (`Dtos/{Feature}/`) | logic, EF queries |
| DAL | `LearningPlatformDbContext`, `{Entity}DAO` with EF queries, migrations | HTTP types, business rules |
| Repository | Interfaces + impls that call DAOs, map results | business rules, direct DbContext |
| Service | All business logic: grading, generation, validation, access checks | `HttpContext`, DAOs, raw SQL |
| Api | Controllers (inject `I{X}Service` only), middleware, DI in `Program.cs` | logic, LINQ, repositories |

Naming: `I{Feature}Repository` (never `Repo`), `{Feature}Service`, `{Feature}Controller`, `{Entity}DAO`. One DbContext. DI: `AddScoped` in `Program.cs`.

> **Flagged trade-off:** DAO + Repository double wrapping is heavy for an MVP; most repositories will be thin pass-throughs. It is kept because it is the established convention across Loc's projects and `layer-guard` enforces it. Revisit only via an explicit decision (Q-03), never silently.

### Feature groups (replaces "modular monolith modules"; same separation, expressed as sub-folders in each layer)
| Group | Responsibility |
|---|---|
| `Identity` | Users, login, JWT, password hashing, role policies |
| `ClassManagement` | Levels, classrooms, enrollment, staff, **`IClassroomAccessService`** |
| `ContentManagement` | Lessons, documents, vocabulary, grammar, questions, publish validation |
| `LearningActivities` | Session creation, question generation, grading, answers, completion |
| `LearningProgress` | Progress aggregates, weak-item queries |
| `Reporting` | Teacher/class/student report queries (read-only) |
| `Storage` | `IFileStorage` abstraction (Supabase Storage for images; local disk for tests) |
| `Extraction` | PDF/PPTX → page images/text → AI draft (`IContentExtractor`), image cropping, validators, draft review/approve |

## 3. Key design decisions (with reasoning)

**D-01 Server-side sessions and grading.**
Client calls `POST /sessions` → server picks/generates questions, shuffles, stores a `SessionQuestion` snapshot, returns questions **without correct answers**. Practice mode: each `POST /answers` returns correctness + explanation. Test mode: answers saved silently; `POST /complete` returns the review.
*Why:* correct answers never reach the browser (cheating, tampering); one grading code path; works for any future client.
*Cost:* one request per answer in practice mode (small payloads; fine at target scale).

**D-02 Snapshot, not versioning.**
`SessionQuestion.SnapshotJson` stores prompt, options (with stable keys), correct key(s), explanation as they were at play time.
*Why:* satisfies "editing content must not change old results" (TC-09) with no copy-on-write versioning machinery. *Cost:* some duplicated text in storage (negligible).

**D-03 Stable answer keys.**
Every option has a stable `OptionKey` (authored: `AnswerOption.Id`; generated vocab: `VocabularyItem.Id`). Grading compares keys, never positions or labels (TC-05).

**D-04 Idempotency by constraint.**
`QuestionAttempt.SessionQuestionId` is **unique**; re-posting the same answer returns the stored result (HTTP 200, same body). `POST /complete` on a completed session returns the same result. A double click or retry can never create duplicate rows (TC-08).

**D-05 Two question sources, one pipeline.**
*Authored* (grammar: `Question`+`AnswerOption` rows) and *Generated* (vocabulary games built from `VocabularyItem` at runtime). Both end up as `SessionQuestion` snapshots, so grading, history and reports are identical. New games = a new generator class registered by `ActivityType` (Strategy pattern); grading/history untouched (regression-safe).

**D-06 Skill-level progress.**
`VocabularyProgress` is keyed by `(Student, VocabularyItem, Skill)` with `Skill ∈ {Meaning, Spelling, Usage, Listening}`. Picture & Word Match → Meaning; Listen & Tap Picture → Listening; Word Scramble → Spelling. A student who knows "gloves" but misspells it is routed back to spelling practice.
Progress is updated **in the same transaction as the attempt** (also counts for abandoned sessions).

**D-07 Levels as data (LevelGroup + LevelSettings).**
`Level` rows are seeded and belong to a `LevelGroup` {Young, Senior}. A `LevelSettings` record per level holds: `AccessMode` {ClassLink, Password}, `ShowPercentScore`, `PassThresholdPercent?`, `GrammarPresentation` {UsageFirst, FullRules}, `EnabledActivities[]`, `QuestionCount`, `OptionCount`, `StarThresholds`. No `if (level == "Explore1")` anywhere. Table in 07.

**D-08 Publish gate.**
`ContentValidator` (Service) blocks `Draft → Published` unless: ≥ 4 vocabulary items when any MCQ game is enabled (need distractors); every item has `Word` and **at least one of picture / `MeaningVi`** (Explore 1 uses pictures only); every MC question has ≥ 2 options and exactly 1 correct; every fill-blank question has ≥ 1 accepted answer; sentence-order tokens have contiguous positions; each grammar topic has ≥ 1 rule and (for Mini Test) ≥ 5 questions. Archived lessons cannot be assigned or started.

**D-09 Central access check.**
All class/student data access goes through `IClassroomAccessService` (Teacher ∈ `ClassroomStaff`; Student ∈ active `Enrollment`; Admin = all). No controller or service re-implements it (TC-03, TC-12).

**D-10 Files and images.**
**Original slide files are not stored.** Upload goes to a temporary location, is processed by the extraction pipeline, and is deleted when the draft is approved/discarded (or after a short TTL, e.g. 24 h). Upload limits: PDF/PPTX only, ≤ 20 MB, extension + content-type + magic-byte check, random temp name.
Images cropped from slides are re-encoded to WebP (max ~800 px, quality ~75), de-duplicated by SHA-256, stored in a **private** Supabase Storage bucket, and returned to clients as **short-lived signed URLs** generated by the API. `IFileStorage` hides Supabase vs. local disk (tests).

**D-11 Auth (two access modes).**
Custom `User` + JWT (role claim, server-side identity always). `User.LoginMode` ∈ {Password, ClassLink}.
- **Senior (Pioneer):** username + password (`PasswordHasher<User>`), created by the teacher, forced change on first login; login rate-limited.
- **Young:** see D-16.
Teachers/Admin always use password. No self-registration. Refresh tokens deferred.

**D-12 Primary keys.**
`int` identity PKs (matches repo convention). Because IDs are guessable, **every** query is ownership-checked (D-09); no exceptions.

**D-13 Errors & API shape.**
RFC 7807 `ProblemDetails` for all errors; DTOs only; list endpoints paginated (`page`, `pageSize ≤ 100`); UTC timestamps (`timestamptz`).

**D-14 No microservices, no CQRS.** Revisit only if measured need appears.

**D-15 AI extraction pipeline (human-in-the-loop).**
`POST /lessons/{id}/extractions` (multipart) creates an `ExtractionJob` (Uploaded → Extracting → Draft → Approved | Discarded | Failed). Steps: (1) read PDF/PPTX: text per page + page images + embedded images (`IDocumentReader`); (2) `IContentExtractor` (default `GeminiContentExtractor`; provider-swappable) receives page images + text and must return **schema-constrained JSON**: for each page a `kind` {vocabulary, sentence-pattern, activity, other} and extracted items; decorative/classroom-management pages are classified `other` and ignored; (3) deterministic code maps each vocabulary item to the **largest embedded image on its page**, crops/re-encodes it; (4) validators run (see below); (5) the draft is stored as `DraftJson` and shown in a review UI; (6) **teacher edits and approves** → items are written to `VocabularyItem`/grammar tables; original file and draft are discarded.
*Validators on AI output:* schema valid; words non-empty/trimmed; duplicates merged; no item without a source page; if a "reorder the letters" activity is detected its letters must be a permutation of the answer (flags slide typos such as a wrong letter); counts shown to the teacher ("8 words found on pages 8–15; 12 pages ignored").
*Untrusted input:* slide text can contain instructions → the model has **no tools**, output is schema-validated, nothing from the draft is executed, and the teacher approves. Activity slides are **not** imported; games are generated from the vocabulary (D-05).
*Rate/cost:* free Gemini tier is rate-limited → job runs in a background worker with retry/backoff; one lesson at a time is fine at this scale.
*Privacy:* free-tier content may be used by Google to improve its products (accepted); key lives only in env/user-secrets.

**D-16 Young-group access (class link + tap profile).**
`ClassAccessLink` (ClassroomId, `TokenHash`, CreatedAt, RevokedAt?) — the token is long random, shown once, stored hashed, rotatable. Public endpoints: `GET /access/class/{token}` → list of profiles `{ studentId, nickname, avatarKey }`; `POST /access/class/{token}/enter { studentId }` → short-lived JWT (Role Student, `LoginMode=ClassLink`). The roster is created by the teacher, so a returning child taps an **existing** profile (no duplicates). Device remembers the last profile (with "Not me?"). Both endpoints are rate-limited and never leak anything beyond nickname/avatar. Everything after entry is identical to Senior (server-side sessions and grading). Trade-off A5 in 07.

**D-17 Not-graded learning mode.** `LearningSession.Mode ∈ {Learn, Practice, Test}`. *Look-Listen-Repeat* is a `Learn` session: no questions/grading, it records completion (and optionally which cards were viewed) so assignment completion can be reported.

**D-18 Speech.** Pronunciation uses the browser's Web Speech synthesis (`speechSynthesis`) via a `use-speech` hook: tap-triggered (required on iOS), picks an English voice, falls back to a visible "no voice available" state. For *Listen & Tap Picture* the spoken word is part of the question payload (`speakText`); it does not reveal which option key is correct.

## 4. Frontend architecture
Keep React 19 + TS + Vite + Tailwind. Follow `conventions/frontend.md`. Extensions for this project:
```
client/src/
├── Service/            # AuthService.ts, ClassroomService.ts, LessonService.ts, SessionService.ts, ReportService.ts …
├── lib/authFetch.ts    # token injection, ProblemDetails → typed error, 401 handling
├── hooks/              # use-auth.ts, use-game-session.ts, use-classrooms.ts …
├── pages/student/      # extension: role folders (my-lessons, lesson-hub, game, result)
├── pages/teacher/      # classes, lesson-editor, assignments, reports
├── components/student/ components/teacher/ components/game/ components/ui/
└── types/api/          # DTO types mirroring 04-api-contract.md
```
- New routes: `/login` (Senior + teacher), `/c/:token` (Young class link → profile picker), `/student/*`, `/teacher/*` behind a `RoleRoute` guard. **Legacy routes unchanged.**
- **Young UI kit** (`components/kids/`): big tap targets (≥ 64 px), icon-first, ≤ 3 words of text, sound/star feedback, no timers, no failure states, `prefers-reduced-motion` respected. **Senior UI** uses the standard components.
- Games are presentational components fed by `use-game-session`; they never grade.
- Reuse existing UI primitives (`components/ui/*`) and design tokens. Existing client-side `drillGenerator` / `DynamicDrillEngine` are **not** reused for graded flows (they grade in the browser); only presentational pieces (e.g. rule card rendering) may be reused.
- Mobile-first (phones, iPads, shared family computers), touch targets ≥ 44 px (≥ 64 px for Young), WCAG 2.2 AA target.
- UI language: teacher + Senior in Vietnamese; Young UI icons + short English prompts.
- No new libraries without justification. Recommended when first needed: `react-hook-form` + `zod` (teacher forms), Playwright (E2E).

## 5. Tooling defaults (change via 07 if you disagree)
.NET 9 · EF Core + Npgsql · xUnit + FluentAssertions · Testcontainers (fallback: docker-compose test DB) · Playwright · GitHub Actions · PdfPig (text/embedded images) + a PDFium wrapper (page rendering) for extraction — confirm in S2-T11 · Gemini API via REST (multimodal, JSON schema output).

### Hosting & data (decision Q-12)
- **Database + files:** Supabase **free** plan, region Singapore. Connect EF Core/Npgsql through the **session pooler** (IPv4-friendly) with SSL; use a dedicated schema `app` (not exposed through Supabase's auto-generated API) **and** enable RLS on all tables so the public `anon` key can never read student data (tested in S1-T02). The API uses the service/db credentials only server-side.
- **Free-plan limits to respect:** 500 MB DB, 1 GB files, project **pauses after 7 days idle**, **no automatic backups** → `scripts/backup` (pg_dump) runs before real students use the system (S1-T12). Restore is tested.
- **API host:** decided at S5-T06 (Cloud Run scale-to-zero vs. ~US$5 VPS/Railway). API ships as a Docker image to stay portable. React app: free static hosting.

## 6. Public-repository rules (mandatory)
Never commit: secrets/keys (Gemini, Supabase, JWT), `appsettings.*.local.json`, student names or any real roster/export, class-link tokens, slide PDFs/PPTX, extracted images, DB dumps, sample lesson files. Samples live outside git (e.g. `D:\samples`). `.gitignore` covers `uploads/`, `samples/`, `*.dump`, `*.bak`. CI fails if a secret scanner or a forbidden file pattern (`*.pdf`, `*.pptx` outside `docs/`) is added (S1-T10).
