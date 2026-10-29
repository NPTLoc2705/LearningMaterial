## Extraction (`ExtractionService`, `ExtractionsController`, `ExtractionJob`, `PdfPigDocumentReader`, `PptxDocumentReader`, `GeminiContentExtractor`, `MockContentExtractor`, `ExtractionWorker`)

### Purpose
Automates extracting curriculum vocabulary, grammar sentence patterns, and compressed embedded images from lesson slide presentations (PDF / PPTX <= 20 MB) using `PdfPig` and `Gemini 2.5 Flash` structured JSON output (`S2-T12`, `S2-T13`). Enforces upload validation on magic bytes (`TC-02`), prompt-injection sanitization (`TC-25`), scramble anagram validation (`TC-27`), schema error handling without corrupting lesson tables (`TC-24`), and temporary slide file lifecycle cleanup (`TC-28`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `lessonId` | `int` | Target lesson ID (`POST /api/lessons/{id}/extractions`) |
| `file` | `IFormFile` | Multipart PDF (`%PDF`) or PPTX (`PK\x03\x04`) slide deck (`<= 20 MB`) |
| `jobId` | `int` | Extraction job identifier |
| `request` | `UpdateExtractionDraftRequestDto` | Updated draft content during teacher review |

**Returns:**
- `CreateExtractionJobResponseDto` (`202 Accepted { jobId, lessonId, status, originalFileName, message }`).
- `ExtractionJobDto` (status, page count, provider, model, `ExtractionDraftDto`, error message).
- `POST /api/extractions/{jobId}/approve`: Idempotently inserts approved vocabulary items into `VocabularyItems`, sets status to `Approved`, and deletes the temporary slide file from disk (`TC-28`).
- `DELETE /api/extractions/{jobId}`: Discards the job and deletes the temporary slide file from disk (`TC-28`).

### Prerequisites / Context
- **Security & Untrusted Input (`AGENTS.md`):** Slides are untrusted inputs. The AI model operates with zero tools and outputs structured JSON only. Under no circumstance are extracted items directly written to lesson tables without explicit teacher approval.
- **Upload Validation (`TC-02`):** Stream checking validates magic bytes (`%PDF` / `PK\x03\x04`) and enforces `<= 20 MB` (`MaxSlideFileSizeBytes = 20,971,520`). Spoofed extensions (e.g. text/html files disguised as `.pdf`) are rejected with `400 Bad Request`.
- **Validation Pipeline:**
  - `DraftSchemaValidator` (`TC-24`): Rejects malformed or incomplete AI responses and transitions the job to `Failed` cleanly.
  - `UntrustedContentSanitizer` (`TC-25`): Strips prompt injection commands and bounds all strings.
  - `ScramblePermutationValidator` (`TC-27`): Compares scrambled puzzle letters with target answers and records diagnostic warnings for non-permutations.
- **Background Sequential Processing:** Jobs are queued via `ExtractionBackgroundQueue` and processed sequentially by `ExtractionWorker`.
- **File Lifecycle & Retention (`TC-28`):** Temporary slide files are stored in `learning-platform-temp-slides` and deleted immediately upon approval or discard, with an hourly timer deleting orphaned files exceeding the 24-hour TTL.
- **Database Table:** `app."ExtractionJobs"` has RLS enabled with no public access; index on `(LessonId, CreatedAt DESC)` ($O(\log N)$) and index on `(Status)`.

