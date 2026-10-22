# Project Guidelines: LearningMaterial

## Project Overview
Study portal for English Units 7 & 8 (Cool Apps & Into the Past) built with React 19, TypeScript, Vite, Tailwind CSS, and React Router.

## Build & Dev Commands
- Run development server: `npm run dev`
- Build production bundle: `npm run build`
- Parse markdown sources to JSON: `npm run parse`
- Run linting: `npm --prefix client run lint`

## Architecture & Code Rules
- Follow SOLID, DRY, and KISS principles.
- Strict TypeScript: no `any`, keep components typed and under ~150 lines.
- Grounding: Base learning material strictly on `Vocabulary_Units_7_8.md` and `Grammar_Summary_Units_7_8.md`.

## Security Rules
- Adhere strictly to [.claude/rules/secure-coding.md](file:///d:/GitHub/LearningMaterial/.claude/rules/secure-coding.md).
- Zero hardcoded secrets, no unvalidated dynamic execution (`eval()`, shell interpolation), safe storage deserialization, and XSS prevention.
