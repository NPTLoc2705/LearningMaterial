## Grammar & Question Management (`GrammarService`, `GrammarTopicsController`, `GrammarRulesController`, `QuestionsController`)

### Purpose
Provides comprehensive CRUD operations and curriculum authoring for grammar topics, rules, example sentences, and practice questions. Supports both Young-group usage-first pattern presentation (Explore 1..4, Kiddie, Birdie, Newbie) and Senior-group full grammar rule flows (Pioneer 1..2), with strict validation on question formatting and explanations (`S4-T01`, `S4-T02`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `lessonId` | `int` | Parent lesson identifier |
| `topicId` / `id` | `int` | Target grammar topic identifier |
| `ruleId` / `id` | `int` | Target grammar rule identifier |
| `exampleId` / `id` | `int` | Target grammar example identifier |
| `questionId` / `id` | `int` | Target question identifier |
| `topicRequest` | `CreateGrammarTopicRequest` / `UpdateGrammarTopicRequest` | `{ Title, Summary?, SortOrder? }` |
| `ruleRequest` | `CreateGrammarRuleRequest` / `UpdateGrammarRuleRequest` | `{ Title, Formula?, Explanation?, PitfallNote?, SortOrder? }` |
| `exampleRequest` | `CreateGrammarExampleRequest` / `UpdateGrammarExampleRequest` | `{ TextEn, TextVi?, ImageKey?, SortOrder? }` |
| `questionRequest` | `CreateQuestionRequest` / `UpdateQuestionRequest` | `{ Type, Purpose, Prompt, PromptImageKey?, Explanation?, SortOrder?, Options: [Text?, ImageKey?, IsCorrect, Position?, SortOrder?] }` |

**Returns:**
- `GrammarTopicDto`: `{ id, lessonId, title, summary, sortOrder, rules: GrammarRuleDto[] }`
- `GrammarRuleDto`: `{ id, grammarTopicId, title, formula, explanation, pitfallNote, sortOrder, examples: GrammarExampleDto[] }`
- `GrammarExampleDto`: `{ id, grammarRuleId, textEn, textVi, imageKey, sortOrder }`
- `QuestionDto`: `{ id, lessonId, grammarTopicId?, type, purpose, prompt, promptImageKey?, explanation?, sortOrder, isArchived, options: AnswerOptionDto[] }`

### Prerequisites / Context
- **Database Tables & RLS (`S4-T01`):**
  - All tables live in schema `app`: `app."GrammarTopics"`, `app."GrammarRules"`, `app."GrammarExamples"`, `app."Questions"`, `app."AnswerOptions"`, and `app."GrammarProgress"`.
  - Row-Level Security (RLS) is enabled and forced on all tables, with privileges revoked from anon and authenticated.
  - Foreign key cascades: Deleting a `GrammarTopic` cascades to its `GrammarRules`, `GrammarExamples`, and associated `Questions`.
  - Deleting a `Question` soft-archives it (`IsArchived = true`) to maintain integrity of past learning sessions.
  - Composite indexes optimize queries: `IX_GrammarTopics_LessonId_SortOrder`, `IX_GrammarRules_GrammarTopicId_SortOrder`, `IX_GrammarExamples_GrammarRuleId_SortOrder`, `IX_Questions_GrammarTopicId_IsArchived_SortOrder`, `IX_Questions_LessonId_IsArchived_SortOrder`.
  - Unique index `IX_GrammarProgress_StudentId_GrammarTopicId` on `app."GrammarProgress"`.

- **Domain Rules & Validation (`S4-T02`):**
  - **Young vs Senior Level Adaptation:**
    - For Young levels (`Level.Group == LevelGroup.Young`), `GrammarRule.Formula` is cleared/null.
    - For Senior levels (`Level.Group == LevelGroup.Senior`), `GrammarRule.Formula` is preserved, and `Question.Explanation` is **mandatory** (rejects empty explanation with `400 Bad Request`). For Young levels, explanation is optional.
  - **Question Type Rules:**
    - `MultipleChoice`: Must have $\ge 2$ options, and **exactly one** option with `IsCorrect == true`. Rejects 0 or $\ge 2$ correct options with `400 Bad Request`.
    - `SentenceOrder`: Must have $\ge 2$ options, all with non-null `Position`. Positions must form a contiguous sequence ($0..N-1$ or $1..N$) without gaps or duplicates.
    - `FillBlank`: Must have $\ge 1$ accepted option with `IsCorrect == true` and non-empty text.
  - **GrammarExample Rule:** `GrammarRuleId` is mandatory (non-nullable foreign key). `TextEn` is required.
  - **Archived Lessons:** Any mutation on topics, rules, examples, or questions under an archived lesson is rejected with `409 Conflict`.

### Publish Validation (`ContentValidator`, `S4-T04`, `TC-04`)
- **Young Group (`Level.Group == LevelGroup.Young`):**
  - When grammar activities (`GrammarUsagePractice`) are enabled on the lesson's level and the lesson has grammar content:
    - Each `GrammarTopic` must have $\ge 1$ example sentence (`GrammarExample`).
    - Total question count + example sentences must be $\ge 3$.
- **Senior Group (`Level.Group == LevelGroup.Senior`):**
  - When the lesson has grammar topics:
    - Each `GrammarTopic` must have $\ge 1$ rule (`GrammarRule`).
    - Must have $\ge 1$ guided practice question (`Purpose == QuestionPurpose.GuidedPractice`).
    - Must have $\ge 5$ mini-test questions (`Purpose == QuestionPurpose.MiniTest`).

### Question Generators (`S4-T05`, TC-06, TC-16, TC-22)
1. **`GrammarUsagePracticeGenerator` (`ActivityType.GrammarUsagePractice`):**
   - For Young group learners.
   - Sourced from authored questions for the topic or dynamically generated "choose the right sentence" multiple-choice questions from `GrammarExample`s in the topic.
   - 1 attempt per question, gentle immediate feedback, star calculation (`StarCalculator`), suppresses percentage score in student DTOs (`ScorePercent = null` when `ShowPercentScore == false`).
2. **`GrammarGuidedPracticeGenerator` (`ActivityType.GrammarGuidedPractice`):**
   - For Senior group practice.
   - Sourced from authored questions (`Purpose == QuestionPurpose.GuidedPractice` or topic questions).
   - Step-by-step immediate feedback: answer returns `{ isCorrect, correctAnswer, explanation }`.
3. **`GrammarMiniTestGenerator` (`ActivityType.GrammarMiniTest`):**
   - For Senior group tests.
   - Always forces `SessionMode.Test`.
   - Sourced from authored questions (`Purpose == QuestionPurpose.MiniTest`).
   - Test mode hides correctness and correct answers until session completion (`answer` returns `{ saved: true }`). Results and score percent are revealed upon session completion.

### Learning Progress & Weak Topics Reporting (`S4-T06`)
- **`GrammarProgress` Upsert:**
  - Upon session completion of any grammar activity with a `GrammarTopicId`, an upsert is executed for `(StudentId, GrammarTopicId)`:
    - `Attempts = Attempts + 1`
    - `LastScore = session.ScorePercent ?? 0`
    - `BestScore = max(BestScore, session.ScorePercent ?? 0)`
    - `LastAttemptAt = session.CompletedAt ?? DateTime.UtcNow`
- **Classroom Weak Grammar Report:**
  - `GET /api/classrooms/{id}/reports/weak-grammar` (Teacher/Admin):
    - Returns active classroom students' grammar topics ranked by average score (lowest score first).
    - DTO: `WeakGrammarTopicReportItem` (`GrammarTopicId`, `Title`, `StudentCount`, `AverageScore`, `Attempts`).
    - Teacher access is strictly validated via `IClassroomAccessService` (returns 404 for non-staff teachers per `TC-12` / `D-09`).
- **Student Review Hub:**
  - `GET /api/me/review` (Student):
    - Returns student's weak grammar topics (`BestScore < 80` or `LastScore < 80`) alongside weak vocabulary items in `WeakWordReviewDto`.

