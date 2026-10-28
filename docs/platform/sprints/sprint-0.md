# Sprint 0 — Decisions, accounts, guardrails  (→ M0)

👤 = Loc does it · 🤖 = agent does it. Do not start Sprint 1 before S0-T03, S0-T05 and S0-T06 are done.

### S0-T01 — Keep samples outside git 👤  [P0][S]
- Do: put real slide files in `D:\samples\` (not in the repo). Add `samples/`, `uploads/`, `*.pdf`, `*.pptx`, `*.dump` to `.gitignore` (🤖 in S0-T06). First sample: `LESSON_1_-_U3.pdf` (Explore 1 · Unit 3 · Lesson 1). Add 2–3 more from other levels later (one Explore 3, one Pioneer 2) for extraction testing.
- Acceptance: no slide file is tracked by git.
- [x] Done

### S0-T02 — Create accounts and keys 👤  [P0][S]
- Do: (1) Supabase project (free plan, **Singapore**), note DB password; (2) Gemini API key from Google AI Studio; (3) put both in `dotnet user-secrets` / local env — **never in git**.
- Acceptance: you can connect to the Supabase DB from your machine; a test `generateContent` call works.
- [x] Done

### S0-T03 — Review decisions 👤  [P0][S]
- Do: read `07-open-questions.md`; confirm assumptions A1–A7 or edit them.
- Acceptance: file says "all blocking questions closed" and you agree.
- [x] Done

### S0-T04 — Low-fi wireframes 👤  [P0][M]
- Do: sketch into `docs/platform/wireframes/` (photo of paper is fine; no real child photos):
  Young: class link → profile picker → lesson list → Look-Listen-Repeat card → Listen & Tap Picture → result with stars.
  Teacher: class list → roster (+avatar) → create lesson (Level/Unit/Lesson) → upload → **draft review screen** (word + picture + keep/remove) → publish/assign → weak-words report.
  Senior: login → lessons → game → result.
- Acceptance: every screen of the slice exists.
- [x] Done

### S0-T05 — Hand-written demo dataset 🤖/👤  [P0][S]
- Do: `docs/platform/seed/explore1-u3-l1.json`: lesson (Explore 1, Unit 3, Lesson 1, "People") with 8 words (boy, girl, man, woman, teacher, classmate, student, friend), **no images, no copyrighted text**, plus 2 sentence patterns ("Who's this?", "Is this a teacher?"). Used by the dev seeder and E2E.
- Acceptance: JSON matches 03 fields; teacher reviewed.
- [x] Done

### S0-T06 — Repo guardrails 🤖  [P0][M]
- Do:
  1. Update `CLAUDE.md`: project = English learning platform (React + .NET 9 + Supabase); legacy Units 7–8 portal is read-only; fix absolute `d:/GitHub` link.
  2. Add `conventions/learning-platform-backend.md` (layer rules from 02, names `LearningPlatform`, `LearningPlatformDbContext`); mark `backend.md`, `security-and-api.md`, `tracking.md` as "reference only (Ielts-System)" — don't delete.
  3. Copy `AGENTS.md` + `docs/platform/` into the repo root.
  4. Adapt `.claude/commands/*` and `layer-guard.md` paths to `server/LearningPlatform/` (copies suffixed `-platform`).
  5. `.gitignore` additions (see S0-T01) + `server/**/bin|obj`, `appsettings.*.local.json`, `*.bak`.
  6. Add a secret-scan + forbidden-file check script (used by CI in S1-T10).
- Acceptance: no instruction an agent follows for this project mentions `Ielts-System` except "reference only" notes; scan script catches a fake key and a `.pdf` outside `docs/`.
- [x] Done
