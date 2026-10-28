# Changelog — v1 → v2 (2026-10-28)

Cause: owner's answers to the open questions + analysis of the sample slide. Each row = a decision and the docs it changed.

| # | Decision / finding | Docs changed |
|---|---|---|
| 1 | Solo + AI, ~2 h/day, no deadline → tasks ordered not dated; sizes redefined in hours; estimate computed | 05, sprints/_estimate |
| 2 | .NET 9; DAO+Repository kept; monorepo `server/` in a **public** repo → public-repo rules | 02 §5–6, AGENTS.md, S0-T06, S1-T10 |
| 3 | Pilot = Explore 1 · Unit 3 · Lesson 1 (8 words), not Explore 2 / Pioneer 1; Units 7–8 not used | 01, 05, S0-T05 |
| 4 | Lesson = (Level, Unit, LessonNo), one slide file each | 03 (Lesson), 04, 01 |
| 5 | AI extraction (Gemini free key) is the main entry path; mandatory teacher review; originals discarded; images auto-cropped → private Supabase bucket + signed URLs | 02 D-10/D-15, 03 (ExtractionJob), 04, sprint-2 (T11–T14), 06 (TC-24..28, 34) |
| 5b | Free-tier data-use accepted by owner; prompt-injection mitigations added | 02 D-15, 06 |
| 6 | Supabase (free) for DB + storage; schema `app` + RLS; backups from day one; API host decided at deployment | 02 §5, S1-T02, S1-T12, S5-T05/06, 06 (TC-32/33) |
| 7 | Young group (Kiddie–Ex4) vs Senior (Pioneer): class-link tap-profile access vs password; stars vs %; usage-first vs full grammar; per-level activity switches → `LevelSettings` | 02 D-07/D-11/D-16, 03, 04, 07 |
| 8 | Ex1: no Vietnamese meaning; picture is the meaning → publish rule relaxed (image OR meaning) | 02 D-08, 03, S2-T04 |
| 9 | Look-Listen-Repeat (non-graded `Learn` mode), Listen & Tap Picture, browser speech; Word Scramble from Ex3 | 02 D-17/D-18, 03, sprint-3 |
| 10 | Grammar for Young = usage-first sentence patterns; extractor proposes them | sprint-4 (T03, T05, T07, T08) |
| 11 | < 20 students/class → performance sprint reduced | sprint-5 (T03) |
| 12 | v1 `SourceDocument` removed; `Explanation` optional for Young questions; `ScorePercent` always stored but shown per level | 03 |
