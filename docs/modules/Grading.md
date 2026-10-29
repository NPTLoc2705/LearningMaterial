# Grading & Scoring Module

## [Grading]
### Purpose
Server-side only grading and score calculation engine. Never leaks answers to the client before grading. Normalizes typed answers and computes stars/percentages according to class level rules.

### Components
1. **AnswerGrader** (`IAnswerGrader`):
   - Multiple choice: matches submitted key against `snapshot.CorrectKeys`.
   - Typed: normalizes input (trimming, lowercase, stripping trailing punctuation `. ! ? , ; :`, collapsing multiple internal spaces) and compares to correct keys.
   - Sentence order: matches ordered keys array against sequence.
2. **ScoreCalculator**:
   - Calculates percentage to 2 decimal places: `(correct / total) * 100`.
   - Boundary-safe (0 total questions -> 0.00%, unanswered questions count as wrong on complete).
3. **StarCalculator**:
   - Computes stars (1–3) based on thresholds (`StarThreshold3=80`, `StarThreshold2=50`).
   - Young group safety rule: minimum 1 star, never 0 stars (no failure states for children).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `snapshot` | `QuestionSnapshot` | Server-internal snapshot of question prompt and correct keys |
| `answerPayload` | `string` | Raw JSON or string submitted by the student |

**Returns:** `GradingResult` — `{ IsCorrect, CorrectAnswer, Explanation }`.

### Prerequisites / Context
- Grading must only occur server-side.
- In Test mode, correct answers are hidden until the session is completed.
- In Practice mode, Young students receive `correctAnswer` and `speakText` for gentle feedback.
