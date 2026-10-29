# Sprint 4 — Grammar: Young usage-first + Senior full flow  (→ M2)

Two presentation modes driven by `LevelSettings.GrammarPresentation`. Reuse the S3 pipeline; **no second grading path**.

### S4-T01 — Grammar & question entities  [P0][M]
- Depends on: S3-T01
- Do: `GrammarTopic, GrammarRule (Formula optional), GrammarExample (image optional), Question, AnswerOption (text or image), GrammarProgress` + migration.
- [x] Done

### S4-T02 — Grammar content CRUD API  [P0][L]
- Depends on: S4-T01, S1-T05
- Do: topics/rules/examples/questions endpoints (04) with per-type validation; `Explanation` required only for Senior levels.
- Acceptance: invalid MC (0 or 2 correct) rejected; sentence-order positions contiguous.
- Docs: `docs/modules/Grammar.md`
- [x] Done

### S4-T03 — Extraction: sentence patterns → grammar draft  [P0][M]
- Depends on: S2-T12, S4-T02
- Do: extend the extractor schema to return `sentence-pattern` items (e.g. "Who's this?", "Is this a teacher?") with example sentences; map to a `GrammarTopic` + examples (Young: no formula) in the draft; teacher edits in the review UI.
- Acceptance: on the sample PDF the two patterns are proposed; nothing else is invented.
- [ ] Done

### S4-T04 — `ContentValidator` for grammar  [P0][S]
- Depends on: S4-T02, S2-T04
- Do: Young: ≥ 1 example sentence per topic; usage practice question count ≥ 3 if the activity is enabled. Senior: ≥ 1 rule, ≥ 1 guided practice, ≥ 5 mini-test questions.
- Acceptance: TC-04 (grammar side).
- [ ] Done

### S4-T05 — Generators: GrammarUsagePractice (Young), GuidedPractice, MiniTest (Senior)  [P0][M]
- Depends on: S3-T04, S4-T02
- Do: register in the existing registry. *Usage practice:* "choose the right sentence/picture" from authored or teacher-provided examples, 1 attempt per question, gentle feedback, stars. *Guided practice / Mini test:* as in v1 (feedback vs. no feedback until complete).
- Acceptance: TC-06, TC-16, TC-22; Young never shows %.
- [ ] Done

### S4-T06 — Grammar progress + weak topics  [P0][M]
- Depends on: S4-T05
- Do: `GrammarProgress` on complete; `GET /classrooms/{id}/reports/weak-grammar`; extend `/me/review`.
- [ ] Done

### S4-T07 — Teacher UI: grammar editor  [P0][L]
- Depends on: S4-T02, S2-T14
- Do: tab "Ngữ pháp" adapts to level group: Young → example sentences + pictures + simple question builder; Senior → rules, formulas, examples, question forms. Preview as student.
- [ ] Done

### S4-T08 — Young UI: usage practice  [P0][M]
- Depends on: S4-T05, S3-T08
- Do: picture/sentence choice screens; speak sentence button; stars.
- [ ] Done

### S4-T09 — Senior UI: Learn → Practice → Mini Test → Review + Grammar page  [P0][L]
- Depends on: S4-T05, S3-T08
- Do: 4-step flow, aggregate "Ngữ pháp" page listing topics from all published/assigned lessons for the student's level; reuse presentational styling of the legacy rule cards where practical.
- [ ] Done

### S4-T10 — Tests + M2 demo  [P0][M]
- Depends on: S4-T08, S4-T09
- Do: integration TC-04/06/07 on real session flow; E2E for a Young usage topic and a Senior topic; demo to a real class; feedback in `docs/platform/discovery/m2-feedback.md`.
- [ ] Done
