# Question Generation Module

## [QuestionGeneration]
### Purpose
Generates interactive vocabulary questions dynamically from published lesson vocabulary items based on activity type and the class level's `LevelSettings`. Uses the Strategy pattern with an `IRandom` abstraction for deterministic shuffling and testing.

### Supported Generators
1. **VocabListenPickPictureGenerator** (`VocabListenPickPicture`):
   - Skill: Listening
   - Payload: `speakText` contains target word; `options` contain 3–4 pictures (keys = item IDs).
2. **VocabPictureWordMatchGenerator** (`VocabPictureWordMatch`):
   - Skill: Meaning
   - Prompt: Image key or Vietnamese meaning prompt; `options` contain 3–4 word strings.
3. **VocabWordScrambleGenerator** (`VocabWordScramble`):
   - Skill: Spelling
   - Gated by `LevelSettings.EnabledActivities` (Explore 3+, Pioneer).
   - Prompt: Vietnamese meaning; `options` contain scrambled letter tiles guaranteed not to match the original word.
4. **VocabLookListenRepeatGenerator** (`VocabLookListenRepeat`):
   - Mode: Learn
   - Yields 0 questions (cards are handled directly by presentation layer, completing via API).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `lesson` | `Lesson` | Published lesson containing `VocabularyItem` collection |
| `settings` | `LevelSettings` | Class level configuration (QuestionCount, OptionCount, EnabledActivities) |

**Returns:** `List<GeneratedQuestion>` — list of questions with server-internal `SnapshotJson` ready for storage in `SessionQuestions`.

### Prerequisites / Context
- Requires at least 3 distinct non-archived vocabulary items in the lesson; otherwise throws `InsufficientVocabularyItemsException`.
- Activity must be listed in `settings.EnabledActivities`; otherwise throws `ActivityNotEnabledException`.
- Options must never contain duplicates.
