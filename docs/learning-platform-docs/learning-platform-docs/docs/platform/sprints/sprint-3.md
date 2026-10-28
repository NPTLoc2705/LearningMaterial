# Sprint 3 — Young activities, sessions, grading, weak-word report  (→ M1)

**Goal:** children play three activities on U3-L1; answers are graded server-side and stored; the teacher sees weak words. Build the reusable pipeline (generate → snapshot → grade → progress); grammar will reuse it.

### S3-T01 — Session entities  [P0][M]
- Depends on: S2-T01
- Do: `LearningSession` (Mode Learn/Practice/Test, Stars?), `SessionQuestion`, `QuestionAttempt`, `VocabularyProgress` per 03 + migration.
- Acceptance: unique `QuestionAttempt.SessionQuestionId` and `(StudentId,VocabularyItemId,Skill)` enforced.
- [ ] Done

### S3-T02 — Generators (Strategy, gated by LevelSettings)  [P0][L]
- Depends on: S3-T01, S2-T04
- Do: `IQuestionGenerator` registry by `ActivityType`:
  - `VocabListenPickPicture` — payload `speakText`=word; options = 3–4 **pictures** (keys = item ids); skill Listening.
  - `VocabPictureWordMatch` — prompt picture (or meaning if none) → 3–4 word options; skill Meaning.
  - `VocabWordScramble` — shuffled letters (never equals the word), typed/tapped; skill Spelling. Only if enabled for the level.
  - `VocabLookListenRepeat` — a `Learn` session: ordered cards, no questions.
  Option/question counts from `LevelSettings`; deterministic `IRandom`; items without a picture are excluded from picture-option activities or fall back to text (Q-09).
- Acceptance: TC-13, TC-22, TC-31; no duplicate options; ≥ 3 distinct items required (clear error otherwise).
- Docs: `docs/modules/QuestionGeneration.md`
- [ ] Done

### S3-T03 — Grading + scoring + stars  [P0][M]
- Depends on: S3-T01
- Do: pure `IAnswerGrader` (key compare; typed normalization; sentence order), `ScoreCalculator` (weighted %, unanswered = wrong, 2 dp), `StarCalculator` (thresholds from LevelSettings, min 1 star).
- Acceptance: TC-05, TC-07, TC-14, TC-15, TC-30 (stars).
- Docs: `docs/modules/Grading.md`
- [ ] Done

### S3-T04 — Session API  [P0][L]
- Depends on: S3-T02, S3-T03, S2-T05
- Do: start / answer / complete / result (04). Enforce enrollment/assignment, Published lesson, activity enabled for the level. Answer idempotent via unique constraint; Young practice returns correct answer + `speakText` for gentle feedback; Senior returns explanation; Test hides until complete. `Learn` sessions complete with no questions. `complete` returns `stars` for Young and `scorePercent` only when shown.
- Acceptance: TC-08, TC-09, TC-16, TC-17, TC-18, TC-19, TC-30, TC-31.
- Docs: `docs/modules/LearningSessions.md`
- [ ] Done

### S3-T05 — Progress update + `/me/review`  [P0][M]
- Depends on: S3-T04
- Do: transactional upsert of `VocabularyProgress` with the attempt; `/me/review` returns items to revisit grouped by skill (used for "Practice again" in the UI).
- Acceptance: TC-11.
- [ ] Done

### S3-T06 — Teacher report API  [P0][M]
- Depends on: S3-T05
- Do: `GET /classrooms/{id}/reports/weak-vocabulary`, `GET /classrooms/{id}/students/{id}/progress`; one aggregated query; access via `IClassroomAccessService`; include completion per assignment (who finished the Learn/Practice activities).
- Acceptance: TC-12; ranking by error rate then attempts; `minAttempts`.
- Docs: `docs/modules/Reporting.md`
- [ ] Done

### S3-T07 — Speech hook + device spike  [P0][M]
- Depends on: S1-T08b
- Do: `hooks/use-speech.ts` (Web Speech synthesis, tap-triggered, English voice selection, rate slowed for kids, fallback state); test on **real devices** (iPad/iPhone Safari, Android Chrome, Windows Chrome) and record available voices/quality in `docs/platform/discovery/speech-devices.md`.
- Acceptance: decision recorded: browser voice OK / need audio files (Q-15).
- [ ] Done

### S3-T08 — Frontend game shell + Young UI kit  [P0][L]
- Depends on: S3-T04, S3-T07, S2-T08
- Do: `Service/SessionService.ts`, `hooks/use-game-session.ts` (start → question → answer → feedback → complete; blocks double taps; handles network errors), `components/kids/`: `BigChoice`, `SpeakerButton`, `StarBurst`, `GentleFeedback` (correct = cheer, wrong = "Good try!" + shows and speaks the right answer), progress dots (no numbers). Games never compute correctness.
- Acceptance: a stub activity runs a whole session against the API at 375 px.
- [ ] Done

### S3-T09 — Activity: Look-Listen-Repeat  [P0][M]
- Depends on: S3-T08
- Do: flashcards (picture + word + speaker button auto-playing on tap), next/prev, "I said it!" completion tap; posts a `Learn` session on finish.
- Acceptance: completion appears in the teacher report.
- [ ] Done

### S3-T10 — Activities: Listen & Tap Picture, Picture & Word Match  [P0][L]
- Depends on: S3-T08
- Do: both as presentational games; stars result screen; no percentages for Young.
- Acceptance: TC-10 (375 px), TC-30.
- [ ] Done

### S3-T11 — Activity: Word Scramble (Explore 3+, Pioneer)  [P1][M]
- Depends on: S3-T08
- Do: tap-to-place tiles + undo/reset; shown only when enabled for the level.
- [ ] Done

### S3-T12 — Student results/history + Senior score view  [P0][S]
- Depends on: S3-T08
- Do: Young: stars + "Play again"; Senior: score %, review with explanations, history.
- [ ] Done

### S3-T13 — Teacher UI: weak-word report + completion  [P0][M]
- Depends on: S3-T06, S1-T08
- Do: class tab "Từ cần ôn" (word, picture thumb, error %, attempts, skill) + per-student drill-down + who finished the assignment.
- [ ] Done

### S3-T14 — E2E slice + M1 pilot  [P0][M]
- Depends on: S3-T09, S3-T10, S3-T12, S3-T13, S2-T14
- Do: Playwright (desktop + 375 px): teacher uploads **synthetic** PDF fixture → approves → assigns → child taps profile → plays 3 activities → teacher sees weak words. Then **pilot with the real Explore 1 class using U3-L1** (real sample PDF used manually); collect feedback in `docs/platform/discovery/m1-feedback.md`.
- Acceptance: green in CI; real children's use is observed by the teacher.
- [ ] Done
