# 01 — Product Brief (v2)

## Goal
Convert each lesson's slide/PDF knowledge into interactive practice so students retain more, and so the teacher can see which words and grammar points each student still struggles with.
**Principle:** not "many games" — every activity serves one learning goal and produces data usable for review.

## Users
| Role | Needs |
|---|---|
| Student — **Young group** (Kiddie…Explore 4, ~6–11 y/o) | Very simple, picture-first, sound-first activities on a phone/iPad/parent's computer; no reading burden, no scores, no password |
| Student — **Senior group** (Pioneer 1–2, own phones) | Vocabulary games, grammar lessons + mini tests, scores and explanations |
| Teacher (= TA) | Create classes/rosters, upload a lesson file, review AI-extracted content, publish, assign, read per-student/per-class results |
| Admin | Same person as the teacher in practice; accounts and levels |

Scale: 4 classes (Explore 1, Explore 3, 2× Pioneer 2), < 20 students each.

## Hierarchy
```
Level (9, seeded; belongs to a LevelGroup: Young | Senior)
 ├─ Lesson = (Level, Unit, LessonNo)   status Draft/Published/Archived
 │    ├─ VocabularyItem[]  (word, picture, audio via browser voice, optional meaning)
 │    └─ GrammarTopic[] → Rule[] → Example[] ; Question[] → AnswerOption[]
 └─ Classroom (a real group) → Roster (students) → LessonAssignment (Lesson → Classroom)
Student activity → LearningSession → SessionQuestion (snapshot) → QuestionAttempt
                 → VocabularyProgress / GrammarProgress (aggregates for reports)
```

## Core flow
1. Teacher creates a Lesson (level + unit + lesson no.) and **uploads the slide file** (PDF/PPTX).
2. The system reads it with AI (Gemini, page images + text) and produces a **draft**: vocabulary (+ cropped pictures) and, where present, sentence patterns/grammar. Decorative/class-management slides are ignored.
3. Teacher **reviews/edits the draft**, approves it → content is saved; the original file is **discarded**. Teacher publishes and assigns the lesson to a class.
4. Students open the class link (Young) or log in (Senior) and practise.
5. The server grades, stores every answer, and updates progress; the teacher reads weak words/topics per student and per class.

## Experience by group (see 07 for the full table)
- **Young:** Look-Listen-Repeat (flashcards with browser voice, not graded) → Listen & Tap Picture → Picture & Word Match (Word Scramble from Explore 3). Stars and sounds instead of scores; grammar is "usage first" — example sentences with pictures and a "choose the right sentence" task, no formulas.
- **Senior:** full vocabulary games, grammar Learn → Guided Practice → Mini Test, percentage scores (pass 70%).

## MVP scope (P0)
**In:** teacher login; levels/classes/rosters; class link + tap-profile access (Young) and password login (Senior); lesson CRUD; **AI-assisted extraction from PDF/PPTX with mandatory teacher review**; manual vocabulary editing; picture storage (Supabase); Look-Listen-Repeat, Listen & Tap Picture, Picture & Word Match, Word Scramble; usage-first grammar (Young) and full grammar flow (Senior); server-side shuffle/grading/explanations; full history; teacher weak-word/weak-topic report; backups.
**Out (post-MVP):** pronunciation scoring, leaderboards/rewards, more games ("Who's missing?", Memory Match, Sorting…), spaced-review scheduler, audio files, microservices, multi-center support.

## Definition of Done (MVP)
The teacher uploads a real lesson file, approves the extracted content, assigns it; children play and finish it on their devices; the system grades correctly and stores results; the teacher sees which words each child and the class get wrong — **demonstrated first with Explore 1 · Unit 3 · Lesson 1 ("People", 8 words)**, then Pioneer content.

## First vertical slice
Explore 1 · Unit 3 · Lesson 1: upload `LESSON_1_-_U3.pdf` → AI draft of 8 words with pictures → teacher approves → assign to the Explore 1 class → children tap their profile → Look-Listen-Repeat + Listen & Tap Picture + Picture & Word Match → results stored per child → teacher sees weak words.
Grammar (usage-first patterns "Who's this?" / "Is this a teacher?") comes right after; the Senior grammar flow is built last.

## Success metrics
| Group | Metrics |
|---|---|
| Learning | % correct (Senior); stars/completion (Young); improvement after a few days; repeated errors |
| Engagement | Session completion; sessions/week; return rate; assigned-lesson completion |
| Teacher efficiency | Minutes from upload to published lesson; number of AI corrections needed per lesson; time to read results |

## Constraints & risks
- **Public repository:** never commit secrets, student data, slide files or extracted images (rules in 02 §6).
- **Children's data:** nicknames only; minimal data; class links are unguessable and rotatable.
- **Third-party content:** slides and photos are not Loc's copyright; originals are discarded, images are stored privately; free Gemini tier may use submitted content to improve Google products (accepted by Loc, revisit if scope grows).
- **AI errors:** extraction can miss/misread content (e.g. a scrambled word in the sample slide has a wrong letter) → teacher approval is mandatory and automated validators run before approval.
- **Browser voice** quality varies by device (iOS needs a tap to start speech) → fallback UI and later option of audio files.
