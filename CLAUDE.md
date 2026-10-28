# Project Guidelines: Junior English Learning Platform (`LearningMaterial`)

## Project Overview
Full-stack English learning platform turning lesson slides/PDFs into interactive practice for Young learners (`Kiddie`–`Explore 4`) and Senior learners (`Pioneer 1–2`), with teacher content review and weak-item analytics.
- **Frontend:** `client/` — React 19, TypeScript, Vite, Tailwind CSS, React Router.
- **Backend:** `server/LearningPlatform/` — .NET 9, EF Core, Npgsql (PostgreSQL + Storage on Supabase), Gemini API extraction.
- **Legacy Portal (Read-Only):** Existing Units 7 & 8 routes (`/vocabulary`, `/grammar`), `client/src/data/*.json`, and `scripts/parse-markdown.mjs` are **read-only** unless a sprint task explicitly specifies otherwise.
- **Authoritative Docs:** Start at [AGENTS.md](AGENTS.md) and [docs/platform/00-README.md](docs/platform/00-README.md).

## Build & Dev Commands
- Frontend dev server: `npm run dev`
- Frontend production build: `npm run build`
- Frontend lint: `npm --prefix client run lint`
- Legacy markdown parser: `npm run parse`
- Repo safety & secret check: `node scripts/check-repo-safety.mjs`
- Backend build & test (once scaffolded in S1-T01): `dotnet test server/LearningPlatform/LearningPlatform.sln`

## Architecture & Code Rules
- Follow SOLID, DRY, and KISS principles.
- Backend 5-layer rule ([conventions/learning-platform-backend.md](conventions/learning-platform-backend.md)): `LearningPlatform.Api → Service → Repository → DAL → BusinessObject`. Controllers inject Services only; Services inject Repositories only.
- Strict TypeScript on frontend: no `any`, keep components typed and under ~150 lines, no direct `fetch` in components/pages (use `client/src/Service/`).
- Driven by `LevelSettings` — never branch on level names in code.
- Server-side grading only: never send correct answers to the client before submission.

## Security & Public-Repo Rules
- Adhere strictly to [.claude/rules/secure-coding.md](.claude/rules/secure-coding.md) and [docs/platform/02-architecture.md](docs/platform/02-architecture.md) §6.
- **Public repository:** Never commit secrets, API keys, connection strings, student names/rosters, class-link tokens, slide PDFs/PPTX, extracted images, or DB dumps. Keep real slide samples outside git (e.g. `D:\samples`).
