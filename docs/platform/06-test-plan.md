# 06 — Test Plan

## Layers
| Layer | Tooling | Scope |
|---|---|---|
| Unit | xUnit + FluentAssertions | Pure logic in `Service`: graders, generators, `ContentValidator`, score calc, progress math |
| Integration | `WebApplicationFactory` + Testcontainers PostgreSQL | API + EF + real DB + JWT/roles, idempotency, constraints |
| E2E | Playwright (desktop + 375 px viewport) | Student and Teacher critical paths |
| UAT | TA + small class | Real material, usability, content accuracy |

Rule: tests must verify **correct result, correct persisted data, correct access, and unchanged history** — not just "it runs".

## Traceability (brainstorm TC → where it is implemented)
| TC | Scenario | Level | Task |
|---|---|---|---|
| TC-01 | Teacher creates Explore 2 lesson; level saved; assignable to class | Integration | S1-T06, S2-T05 |
| TC-02 | Valid PDF/PPTX accepted as a temporary upload; wrong type/oversize/spoofed magic bytes rejected | Integration | S2-T13 |
| TC-03 | Student outside class cannot open lesson | Integration | S1-T11, S2-T05, S2-T08 |
| TC-04 | Publish blocked for item with neither picture nor meaning / MC question without exactly one correct answer | Unit+Integration | S2-T04, S4-T04 |
| TC-05 | Shuffle ×N: choosing correct `key` always graded correct | Unit (property-style loop) | S3-T03 |
| TC-06 | Wrong grammar answer shows correct answer (+ explanation for Senior) | Integration+E2E | S4-T05, S4-T10 |
| TC-07 | 10 questions, 7 correct, equal weight → 70% | Unit | S3-T03 |
| TC-08 | Double submit (answer and complete) → no duplicate rows | Integration | S3-T04 |
| TC-09 | Edit question after use → old session review unchanged | Integration | S3-T04 |
| TC-10 | 375 px viewport: activities fully usable | E2E | S3-T10, S3-T14, S5-T04 |
| TC-11 | Repeated wrong word → appears in weak list per rule | Integration | S3-T05, S3-T06 |
| TC-12 | Teacher of class A cannot read class B | Integration | S1-T11, S3-T06 |

## Additional cases added by this plan
| ID | Scenario | Task |
|---|---|---|
| TC-13 | Boundary: 0, 1, 3 (<4), 4, many vocabulary items → game start / publish behave per D-08 | S2-T04, S3-T02 |
| TC-14 | Typed grading normalization: case, extra spaces, trailing punctuation; wrong spelling stays wrong | S3-T03 |
| TC-15 | Score exactly at pass threshold; 0 correct; all correct; unanswered questions count as wrong on complete | S3-T03 |
| TC-16 | Test mode never returns correctness before complete; practice mode never leaks other questions' answers | S3-T04 |
| TC-17 | Answer for a `sessionQuestionId` not in that session → 404/403 | S3-T04 |
| TC-18 | Concurrent answers for same question → exactly one row, same response | S3-T04 |
| TC-19 | Archived lesson cannot be assigned or started; unpublished lesson hidden from student | S2-T05, S3-T04 |
| TC-20 | Every controller action has `[Authorize]` (reflection test) except whitelisted public ones | S5-T02 |
| TC-21 | Login throttling after repeated failures; no user-enumeration difference in messages | S1-T03 |
| TC-22 | Adding a new generator/game does not change existing games' outputs (regression snapshot) | S3-T02 |
| TC-23 | Weak-word report returns correct ranking and stays fast with ~80 students × 50 sessions | S5-T03 |
| TC-24 | Extraction: malformed/over-long/non-schema AI output → job `Failed` with a clear message; nothing written to lesson tables | S2-T12 |
| TC-25 | Extraction: slide text containing instructions ("ignore previous…") does not alter schema or create unexpected items (prompt-injection fixtures) | S2-T12 |
| TC-26 | Extraction on the sample PDF yields the 8 expected words, ignores TOC/rules/Thank-you/Homework slides, each word has the right image | S2-T11, S2-T14 |
| TC-27 | Scramble validator flags an activity whose letters aren't a permutation of the answer (sample: "ernfld" vs "friend") | S2-T12 |
| TC-28 | Temp slide file is deleted on approve, discard, and TTL expiry | S2-T13 |
| TC-29 | Class link: unknown/revoked token → 404; `enter` with a student of another class → 403/404; rate limit triggers; rotating invalidates the old link | S1-T05b |
| TC-30 | Young level never returns/shows `scorePercent` in UI payload; stars follow thresholds (80/50 defaults) | S3-T04, S3-T10 |
| TC-31 | `LevelSettings` gate: a disabled activity (e.g. Word Scramble for Explore 1) cannot be started via API | S3-T04 |
| TC-32 | Supabase exposure: using the public `anon` key, every `app` table returns nothing/denied | S1-T02 |
| TC-33 | Backup script produces a dump that restores into an empty DB with identical row counts | S1-T12 |
| TC-34 | Signed image URLs expire; a student not allowed to see a lesson cannot get its image URL | S2-T07 |

## Targets (NFR)
p95 < 2 s for standard endpoints at ~80 students; grading a 20-question test < 1 s; WCAG 2.2 AA on student pages; no EF entity types in any API response (architecture test).

## Test data
Deterministic seeds (`IRandom` injected, fixed seed in tests). Demo dataset (8 words, hand-written, no copyrighted images committed) from S0-T05/S2-T09 reused in E2E; **extraction fixtures** use synthetic PDFs generated in tests, not the copyrighted sample (which stays outside git, used only for manual verification). AI calls are mocked in CI (`IContentExtractor` fake); a manual script runs the real Gemini call locally.
