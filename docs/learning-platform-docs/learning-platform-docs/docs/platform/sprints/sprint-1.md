# Sprint 1 — Foundation  (→ M0.5)

**Goal:** teacher logs in, creates a class + roster, shares the class link; Supabase is secure; backups exist.
Backend rule: BO → DAL → Repository → Service → Api; DI in `Program.cs`; controllers inject services only. Target **.NET 9**.

### S1-T01 — Scaffold solution  [P0][M]
- Depends on: S0-T06
- Do: `server/LearningPlatform/` with `BusinessObject, DAL, Repository, Service, LearningPlatform.Api, Tests/Service.Tests, Tests/Api.IntegrationTests` and correct references; EF Core + Npgsql; config via user-secrets/env (Supabase connection string via **session pooler + SSL**, JWT key, Gemini key); `docker-compose.yml` (local Postgres for tests); `/health` (DB check); global `ProblemDetails`; CORS for the Vite dev origin; Swagger in Development only. Architecture test (assembly references).
- Acceptance: `dotnet build` ok; `/health` = 200 against Supabase and against local Postgres; layer-violation test fails if Service references DAL.
- Docs: `docs/modules/Solution-Structure.md`
- [ ] Done

### S1-T02 — DbContext, base entities, secure Supabase schema  [P0][L]
- Depends on: S1-T01
- Do: entities `User, Level, LevelSettings, Classroom, Enrollment, ClassroomStaff` (03) in schema **`app`**; migration; seed 9 levels + `LevelSettings` per 07; migration SQL enables **RLS on every table** (no policies) and revokes `anon`/`authenticated` privileges on schema `app`. Admin/teacher bootstrap via env vars (no hard-coded password).
- Acceptance: TC-32 — with the project's public `anon` key, REST requests to any `app` table return nothing/denied; unique constraints tested.
- Tests: integration (constraints), security test (anon key).
- Docs: `docs/modules/DataAccess-Foundation.md`
- [ ] Done

### S1-T03 — Authentication (password users)  [P0][M]
- Depends on: S1-T02
- Do: `POST /auth/login`, `GET /auth/me`, `POST /auth/change-password`; `PasswordHasher<User>`; JWT (8 h; claims NameIdentifier, Role, LoginMode); `IsActive` check; identical error for unknown user vs wrong password; login rate-limit; role policies.
- Acceptance: TC-21; only the documented public endpoints are anonymous.
- Docs: `docs/modules/Identity.md`
- [ ] Done

### S1-T04 — User & roster management  [P0][M]
- Depends on: S1-T03
- Do: Admin/Teacher create Teachers (Admin only), **Senior students** (username + temp password, forced change), **Young profiles** (nickname + avatarKey, `LoginMode=ClassLink`, no password, generated internal username). Deactivate/reset.
- Acceptance: Young profile cannot log in via `/auth/login`; deactivated user's token stops working.
- [ ] Done

### S1-T05 — Levels, classrooms, enrollment, staff + `IClassroomAccessService`  [P0][L]
- Depends on: S1-T04
- Do: endpoints per 04; `IClassroomAccessService` (`EnsureCanManageClassroom`, `EnsureCanViewStudent`, `EnsureEnrolled`); prefer 404 over 403 to avoid leaking existence; creator becomes Lead.
- Acceptance: TC-03/TC-12 foundations; archived classroom read-only; duplicate enrollment → 409.
- Docs: `docs/modules/ClassManagement.md`
- [ ] Done

### S1-T05b — Class access link (Young)  [P0][M]
- Depends on: S1-T05
- Do: `ClassAccessLink` entity/migration; create/rotate/revoke endpoints; public `GET /access/class/{token}` and `POST /access/class/{token}/enter` (D-16): token ≥ 32 random bytes, stored hashed, constant-time compare, per-IP and per-token rate limit, only for levels with `AccessMode=ClassLink`; returns only nickname/avatar.
- Acceptance: TC-29.
- Docs: `docs/modules/ClassAccess.md`
- [ ] Done

### S1-T06 — Lesson shell  [P0][M]
- Depends on: S1-T05
- Do: `Lesson` (Level, UnitNo, LessonNo, Title) + migration (unique per level/unit/lesson); CRUD, filters, pagination; starts Draft.
- Acceptance: TC-01 part 1; duplicate (level, unit, lesson) → 409.
- Docs: `docs/modules/ContentManagement.md`
- [ ] Done

### S1-T07 — Frontend foundation  [P0][M]
- Depends on: S1-T03
- Do: `lib/authFetch.ts`, `Service/AuthService.ts`, `hooks/use-auth.ts`, `RoleRoute`, `/login` page, `StudentLayout`/`TeacherLayout`, `VITE_API_BASE_URL`; token in memory + guarded `sessionStorage`. Legacy routes untouched.
- Acceptance: login by role; forbidden URLs redirect; build + lint pass.
- [ ] Done

### S1-T08 — Teacher UI: classes, roster, class link  [P0][L]
- Depends on: S1-T05b, S1-T07
- Do: `pages/teacher/classes`, `class-detail`: roster with avatar picker, add Young profile / Senior student, show temp password once, create/rotate class link with copy button + QR (client-side generated), warning that the link is shown once.
- Acceptance: create class at Explore 1, add 3 profiles, copy link.
- [ ] Done

### S1-T08b — Young UI: class link → profile picker  [P0][M]
- Depends on: S1-T05b, S1-T07
- Do: route `/c/:token`; big avatar tiles with nickname; remembers last profile on the device with "Not me?"; no text input; friendly error for bad/revoked links; Young UI kit foundations (`components/kids/`, ≥ 64 px targets).
- Acceptance: works on 375 px phone and iPad; no typing needed.
- [ ] Done

### S1-T09 — Teacher UI: lesson list + metadata  [P0][S]
- Depends on: S1-T06, S1-T07
- Do: lessons list filtered by level/status; create form (Level, Unit, Lesson no., Title).
- [ ] Done

### S1-T10 — CI  [P1][S]
- Depends on: S1-T01
- Do: GitHub Actions: backend build+test (Testcontainers), frontend lint+build, **secret scan + forbidden files** (S0-T06 script). No secrets in workflow.
- [ ] Done

### S1-T11 — Integration harness + authorization matrix  [P0][M]
- Depends on: S1-T05
- Do: `WebApplicationFactory` + Testcontainers; helpers to create users/tokens/classes; matrix tests from 04.
- Acceptance: TC-03, TC-12 foundations green in CI.
- [ ] Done

### S1-T12 — Backup & restore scripts  [P0][S]
- Depends on: S1-T02
- Do: `scripts/backup/backup.ps1|sh` (pg_dump of schema `app`, compressed, dated, stored outside git) and `restore` script; document how to run weekly (Task Scheduler/cron) — **needed because the free plan has no automatic backups**.
- Acceptance: TC-33.
- [ ] Done
