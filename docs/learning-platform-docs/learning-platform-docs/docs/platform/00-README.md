# Junior English Learning Platform — Planning Pack

**Status:** v2 · 2026-10-28 · Sources: `Junior_English_Learning_Platform_Brainstorm.docx`, review of repo `NPTLoc2705/LearningMaterial`, the sample slide `LESSON_1_-_U3.pdf`, and the owner's answers (see 07). All blocking questions are closed. What changed since v1: `CHANGELOG.md`.

## Reading order
1. `01-product-brief.md` — scope, personas, MVP definition of done
2. `02-architecture.md` — repo layout, layers, key design decisions
3. `03-data-model.md` — entities, constraints, indexes
4. `04-api-contract.md` — endpoints and role matrix
5. `05-roadmap.md` — sprint order, milestones, dependency graph
6. `06-test-plan.md` — test strategy and traceability (TC-xx ↔ tasks)
7. `07-open-questions.md` — **decisions made by the owner + assumptions** (read before assuming anything)
   `CHANGELOG.md` — v1 → v2 changes · `sprints/_estimate.md` — effort estimate
8. `sprints/sprint-0.md` … `sprint-5.md` — executable task lists

## Task format (used in all sprint files)
```
### S{sprint}-T{nn} — Title   [P0|P1|P2] [S|M|L]
- Depends on: task ids
- Layers: BO | DAL | Repo | Service | Api | FE
- Do: what to build
- Acceptance: observable, testable outcomes
- Tests: which TC-xx / what to assert
- Docs: module doc to create/update
- [ ] Done
```
Size: **S** ≤ half a day · **M** ≈ 1 day · **L** 2+ days (split if you can).
Priority: **P0** MVP-blocking · **P1** after the core flow works · **P2** later.

## Repo findings that shaped this plan (verified, not assumed)
| # | Finding | Consequence |
|---|---|---|
| F1 | `LearningMaterial` is a pure client app (React 19 + Vite + Tailwind) for **Units 7 & 8 only**; progress is in `localStorage`; no backend, no auth. | The platform needs a **new backend** (`server/`). Existing client is evolved, not rewritten. |
| F2 | `CLAUDE.md` says content must be grounded **only** in `Vocabulary_Units_7_8.md` / `Grammar_Summary_Units_7_8.md`. | Incompatible with DB-driven content. Scope line must be updated (task S0-T06). |
| F3 | `conventions/backend.md`, `security-and-api.md`, `.claude/commands/*`, `.claude/agents/layer-guard.md` describe `Ielts-System/` and `WritingAiHubDbContext` — **not present in this repo**. | Agents would generate files in non-existent paths. Adapted in S0-T06; `02-architecture.md` is authoritative for this project. |
| F4 | Frontend conventions (`Service/`, `hooks/use-kebab-case.ts`, ~150-line components) fit this repo and are kept. | Reused as-is, plus role folders (see 02). |
| F5 | Units 7–8 (58 words, 11 grammar topics) belong to **Pioneer 1** and are hard-coded in the legacy portal. | Not used for the pilot; may be imported later through the normal pipeline. |
| F6 | Sample slide (Explore 1 · Unit 3 · Lesson 1): 33 slides, 1.9 MB, only 8 real words; many slides are decorative/classroom management; key content is inside images; no Vietnamese meanings; slide activities mirror our games. | AI must use page images; activities are generated, not imported; meaning is optional; teacher review is mandatory. |
