# Sprint 2 — Content: vocabulary, images, AI extraction + review

**Goal:** the teacher uploads a slide file, reviews an AI draft, approves it, and assigns the lesson. Manual editing comes **first** (it is also the review UI's foundation and the fallback if AI fails).

### S2-T01 — Vocabulary entity  [P0][S]
- Depends on: S1-T06
- Do: `VocabularyItem` (03: image key optional, meaning optional, source page) + migration; unique `(LessonId, lower(Word))` for non-archived.
- [x] Done

### S2-T02 — Image storage (`IFileStorage` + Supabase)  [P0][M]
- Depends on: S1-T01
- Do: `IFileStorage` with `SupabaseFileStorage` (private bucket, server-side credentials only) and `LocalFileStorage` (tests); `IImageProcessor`: decode PNG/JPEG/WebP → resize (max ~800 px) → WebP, SHA-256 de-dup; signed-URL generation (short expiry).
- Acceptance: upload → key stored; signed URL works then expires; 2 MB limit; non-images rejected (magic bytes).
- Docs: `docs/modules/Storage.md`
- [x] Done

### S2-T03 — Vocabulary CRUD API  [P0][M]
- Depends on: S2-T01, S1-T05
- Do: `GET/POST /lessons/{id}/vocabulary`, `PUT/DELETE /vocabulary/{id}`, `POST /vocabulary/{id}/image`. Validation: `Word` required/trimmed; **at least one of image/`MeaningVi`**; `SortOrder`.
- Acceptance: CRUD + auth; duplicate word → 409.
- [x] Done

### S2-T04 — Publish state machine + `ContentValidator`  [P0][M]
- Depends on: S2-T03
- Do: publish/archive/restore; `ContentValidator` returns `{path,message}[]` (D-08 vocabulary part: ≥ 4 items if any MCQ activity is enabled for the level, each item has word + image-or-meaning); `422` on failure.
- Acceptance: TC-04, TC-13.
- [x] Done

### S2-T05 — Assignment API + student lesson list  [P0][M]
- Depends on: S2-T04, S1-T05
- Do: `LessonAssignment` + migration; assign (Published + level match), list; `GET /me/assignments`, `GET /me/lessons/{id}` (hub data, no answers).
- Acceptance: TC-01 part 2, TC-03, TC-19.
- Docs: `docs/modules/Assignments.md`
- [x] Done

### S2-T06 — Teacher UI: vocabulary editor  [P0][L]
- Depends on: S2-T03, S2-T02, S1-T09
- Do: lesson editor: Info · Vocabulary (editable rows with image thumbnail, replace/upload image, reorder, delete, keyboard-friendly) · Draft review (later task). Autosave with visible state.
- Acceptance: enter 8 words with pictures quickly; errors inline.
- [x] Done

### S2-T07 — Media URLs + Teacher UI: publish & assign  [P0][M]
- Depends on: S2-T04, S2-T05, S2-T06
- Do: `GET /media/{imageKey}` (authorized signed URL); publish button showing `422` checklist; assign dialog (same-level classes).
- Acceptance: TC-34.
- [x] Done

### S2-T08 — Student UI: my lessons + lesson hub (Young & Senior)  [P0][M]
- Depends on: S2-T05, S1-T08b
- Do: Young: very large lesson cards with picture + 1–2 words, activity buttons (disabled until S3). Senior: standard list. Mobile-first.
- Acceptance: only assigned+Published lessons; usable at 375 px without reading Vietnamese.
- [x] Done

### S2-T09 — Dev seeder  [P0][S]
- Depends on: S2-T04, S0-T05
- Do: `DevSeeder` (Development + flag only): loads `explore1-u3-l1.json`, creates an Explore 1 class, 3 Young profiles (fake nicknames), 1 teacher (creds from user-secrets).
- Acceptance: idempotent; disabled outside Development; **no real children's data**.
- [x] Done

### S2-T11 — SPIKE: PDF reading + Gemini on the sample (go/no-go)  [P0][L]
- Depends on: S0-T02
- Do: console prototype (not production code) using the sample PDF **kept outside git**: (a) extract text + embedded images per page (PdfPig) and render page images (PDFium wrapper); (b) call Gemini (free key) with page images + text and a JSON schema; (c) measure: words found vs expected 8, ignored slides, image mapping correctness, tokens, rate-limit behaviour, time. Write the result in `docs/platform/discovery/extraction-spike.md` with a **go/no-go** and the chosen libraries/model.
- Acceptance: documented numbers; if < 90% of words/images are correct, decide prompt/pipeline changes or fall back to manual entry for MVP.
- [ ] Done

### S2-T12 — Extraction domain: `IDocumentReader`, `IContentExtractor`, validators  [P0][L]
- Depends on: S2-T11, S2-T02
- Layers: Service (+ Repo/DAL for `ExtractionJob`)
- Do: `ExtractionJob` entity + migration; `IDocumentReader` (PDF; PPTX via same abstraction), `IContentExtractor` + `GeminiContentExtractor` (schema-constrained JSON, no tools, bounded tokens, retry/backoff on 429), draft model, **validators** (schema, trim/dedupe, source page present, scramble-letters-are-permutation, counts/ignored-pages summary), image mapping (largest embedded image on the word's page) + crop/re-encode via `IImageProcessor`.
- Acceptance: TC-24, TC-25, TC-27 with fake extractor + fixtures; real Gemini only via a manual local script.
- Docs: `docs/modules/Extraction.md`
- [ ] Done

### S2-T13 — Extraction API + background worker + temp-file lifecycle  [P0][M]
- Depends on: S2-T12
- Do: endpoints in 04 (`POST /lessons/{id}/extractions` → 202, `GET`, `PUT draft`, `POST approve`, `DELETE`); background worker runs jobs sequentially; upload checks (PDF/PPTX ≤ 20 MB, magic bytes); temp file deleted on approve/discard/TTL (24 h); approve is idempotent and writes vocabulary/grammar in one transaction.
- Acceptance: TC-02 (upload validation), TC-28.
- [ ] Done

### S2-T14 — Teacher UI: upload + draft review  [P0][L]
- Depends on: S2-T13, S2-T06
- Do: upload card with progress/status; **review screen**: list of detected words with cropped picture, editable word, remove/restore, replace picture, add missing word, show ignored pages count and validator warnings, "approve all"; after approve → vocabulary editor.
- Acceptance: TC-26 manually on the real sample (8 words); a teacher can fix one wrong word and approve in < 3 minutes.
- [ ] Done

### S2-T15 — Bulk CSV import & duplicate lesson  [P2][M]
- Do: only if wanted after M1. Not required.
- [ ] Done
