# AGENTS.md — Junior English Learning Platform

> Entry point for AI coding agents (Antigravity, Claude Code, others).
> If your tool does not auto-load this file, point it at `docs/platform/00-README.md`.

## Mission
Turn lesson slides/PDFs into interactive practice (picture/sound vocabulary activities, grammar, mini tests) for
children and teens (Young group: Kiddie–Explore 4; Senior group: Pioneer) and give the teacher accurate data about
what each student still struggles with. Stack: React + TypeScript (client/), **.NET 9** + EF Core (server/), PostgreSQL + file storage on **Supabase**, Gemini API for slide extraction.
Full brief: `docs/platform/01-product-brief.md`.

## Non-negotiable workflow (per task)
1. **Analyze** — read the task, its dependencies, and the existing code it touches. Identify what already exists before creating anything.
2. **Clarify** — if the task is ambiguous or conflicts with a doc, STOP and ask. Do not guess on data model, auth, or grading rules.
3. **Propose** — for non-trivial work, state 1–2 approaches with trade-offs (complexity, performance, maintainability) before coding.
4. **Execute** — prefer refactoring/extending existing modules over adding new abstractions. Keep diffs small and scoped to the task.
5. **Verify** — run the task's tests + `dotnet build` / `npm --prefix client run build` / `npm --prefix client run lint`.
6. **Document** — create/update `docs/modules/{ModuleName}.md` using the template below, then tick the task checkbox.

Trade-off priority: **1) cleanliness & maintainability → 2) performance → 3) delivery speed** (only if the task says so).
SOLID, DRY, KISS. For any data-touching change, state Big-O / query cost (indexes, N+1, joins).

## Public-repo & child-data rules (override everything)
- This repository is **public**. Never commit secrets, API keys, connection strings, student names/rosters/exports, class-link tokens, slide PDFs/PPTX, extracted images, DB dumps. Samples live outside git. Run the secret/forbidden-file check before every commit.
- Children's data: nicknames only; no emails/real names for Young profiles; never log tokens or names.
- Slide content is **untrusted input** to the AI: the model gets no tools, output is schema-validated, a teacher approves before anything is saved. Original slide files are deleted after review.
- Supabase: all tables in schema `app` with RLS enabled; the public `anon` key must never read them (test TC-32).

## Hard rules
- Work on **one task at a time**, in the order given by `docs/platform/sprints/`. Never start a task with unchecked dependencies.
- Do **not** silently change or "clean up" code outside the task. If you spot a design problem, flag it in the PR/notes first.
- Backend layering is `Api → Service → Repository → DAL → BusinessObject` (see `docs/platform/02-architecture.md`). Controllers inject services only; services inject repositories only.
- Never hand-edit EF migrations. Never commit secrets. Never expose EF entities from the API — DTOs only.
- Never trust a client-sent user id. Resolve identity from JWT claims; verify ownership/classroom access via `IClassroomAccessService`.
- Grading is **server-side only**. Correct answers must never be sent to the client before an answer is submitted (test mode: before the session completes).
- Frontend: TypeScript strict, no `any`, components < ~150 lines, no `fetch` in components/pages (use `client/src/Service/`), no `dangerouslySetInnerHTML`.
- UI language: teacher + Senior (Pioneer) UI in Vietnamese; Young UI = icons + very short English prompts; English lesson content verbatim as authored. Young UI: tap targets ≥ 64 px, no percentages, no failure states.
- Behaviour is driven by `LevelSettings` (group, access mode, enabled activities, scoring) — never branch on a level name in code.
- Legacy portal (existing `/vocabulary`, `/grammar` routes, `client/src/data/*.json`, `scripts/parse-markdown.mjs`) is **read-only** unless a task explicitly says otherwise.

## Documentation template (English)
```markdown
## [Function/Module Name]
### Purpose
What problem does this solve?
### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
**Returns:** `type` — description
### Prerequisites / Context
- Environment assumptions
- Data constraints or edge cases
```

## Map of docs
| File | Read when |
|---|---|
| `docs/platform/00-README.md` | Always first |
| `docs/platform/01-product-brief.md` | You need the "why" / scope / MVP definition |
| `docs/platform/02-architecture.md` | Before creating any file, class, or table |
| `docs/platform/03-data-model.md` | Any entity / migration / query work |
| `docs/platform/04-api-contract.md` | Any controller / frontend Service work |
| `docs/platform/05-roadmap.md` | Planning, sequencing |
| `docs/platform/06-test-plan.md` | Writing tests |
| `docs/platform/07-open-questions.md` | **Decisions already made** + assumptions; read before assuming anything |
| `docs/platform/CHANGELOG.md` | What changed between v1 and v2 and why |
| `docs/platform/sprints/_estimate.md` | Effort estimate |
| `docs/platform/sprints/sprint-N.md` | Your actual task list |
