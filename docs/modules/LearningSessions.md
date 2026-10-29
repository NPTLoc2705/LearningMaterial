# Learning Sessions Module

## [LearningSessions]
### Purpose
Manages student game sessions (`Learn`, `Practice`, `Test`), receives and grades answers server-side, idempotently records attempts and updates vocabulary progress in a single transaction, and computes stars/percentages upon completion.

### Endpoints
1. `POST /api/sessions`:
   - Validates student enrollment in classroom, published status of lesson, classroom assignment, and activity enablement in `LevelSettings`.
   - Generates questions via `IQuestionGenerator` registry and snapshots them into `SessionQuestions`.
   - Returns sanitized question payload (masked, without correct answers).
2. `POST /api/sessions/{id}/answers`:
   - Idempotent via unique constraint on `SessionQuestionId`.
   - Grades submitted answer server-side.
   - Transactionally records `QuestionAttempt` and updates `VocabularyProgress`.
   - Practice mode returns correctness + explanation + speakText; Test mode returns `{ saved: true }`.
3. `POST /api/sessions/{id}/complete`:
   - Idempotently marks session as completed and computes score.
   - Young level: returns stars (1–3, min 1); suppresses `scorePercent`.
   - Senior level: returns `scorePercent` and detailed review.
4. `GET /api/sessions/{id}/result`:
   - Owner or assigned classroom teacher can retrieve completed session review.
5. `GET /api/me/sessions`:
   - Paged session history for the current student.
6. `GET /api/me/review`:
   - Returns weak vocabulary items for the student to practice again.

### Input / Output
| Endpoint | Method | Request DTO | Response DTO |
|----------|--------|-------------|--------------|
| `/api/sessions` | POST | `StartSessionRequest` | `StartSessionResponse` |
| `/api/sessions/{id}/answers` | POST | `SubmitAnswerRequest` | `SubmitAnswerResponse` |
| `/api/sessions/{id}/complete` | POST | empty | `CompleteSessionResponse` |
| `/api/sessions/{id}/result` | GET | none | `CompleteSessionResponse` |
| `/api/me/sessions` | GET | `page`, `pageSize` | `PagedResultDto<StudentSessionSummaryDto>` |
| `/api/me/review` | GET | `limit` | `List<WeakWordReviewDto>` |

### Prerequisites / Context
- Identity is resolved exclusively from JWT claims; client-supplied student IDs are never trusted.
- Correct answers are NEVER returned to the client before grading or in Test mode prior to completion.
