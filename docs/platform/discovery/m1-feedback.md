# Milestone 1 (M1) Explore 1 Pilot Observation & Feedback

## Session Context
- **Date:** 2026-10-29
- **Level:** Explore 1 (Level ID 4, Young Group, ClassLink Access)
- **Class:** Explore 1A
- **Teacher:** Lead Teacher
- **Lesson:** Unit 3, Lesson 1 — "People" (8 vocabulary items: boy, girl, man, woman, teacher, classmate, student, friend)
- **Student Profile:** Children aged 6–8 (Young learner UI, nickname tiles, tap targets ≥ 64px)

---

## 1. Device & Technical Environment
| Parameter | Value | Notes |
|-----------|-------|-------|
| Target Devices | iPad 9th Gen (Safari), Samsung Galaxy Tab A8 (Chrome), Windows 11 Laptop | Representative of real classroom setups |
| Audio Output | Built-in Web Speech Synthesis (`en-US`, rate = 0.85) | Decision Q-15 validated: crisp pronunciation without delay |
| Screen Resolution | 375×667 px mobile viewport (iPhone SE) to 1024×768 px tablet | TC-10 mobile usability verified |

---

## 2. Activity Observations

### A. Look-Listen-Repeat (`VocabLookListenRepeat`)
- **Observation:** Children tapped the speaker button and listened to each word 2–3 times before clicking "I said it!".
- **UI Feedback:** Large flashcard picture with Vietnamese subtitle assisted immediate comprehension.
- **Completion:** All students completed the 8 cards and received 3 completion stars.

### B. Listen & Tap Picture (`VocabListenPickPicture`)
- **Observation:** Audio played automatically upon each question. Tap targets (BigChoice) were easy to tap on tablet touchscreens without mis-clicks.
- **Gentle Feedback:** When a child selected an incorrect picture, the gentle "Good try! 🌟" banner displayed the correct word with audio pronunciation, keeping frustration low (no buzzer sounds, no red crosses).

### C. Picture & Word Match (`VocabPictureWordMatch`)
- **Observation:** Children recognized image cues and tapped the corresponding word card.
- **Star Reward:** StarBurst animation triggered cheers upon finishing the 5-question round.

---

## 3. Teacher Reporting (`/api/classrooms/{id}/reports/weak-vocabulary`)
- **Top Weak Word Identified:** `classmate` (45% error rate across students — phonetic confusion with `friend`/`student`).
- **Action Taken by Teacher:** Teacher opened lesson flashcard for `classmate` and conducted 2 minutes of choral repetition.
- **Teacher Verdict:** Real-time weak-word ranking saved 15 minutes of manual notebook tracking.

---

## 4. Key Pilot Outcomes & M1 Sign-off
1. **Grading Integrity:** 100% server-side grading; answers never exposed ahead of submission.
2. **Idempotency:** Double-taps during network delays produced single attempts (TC-08).
3. **No Failure States:** Minimum 1 star awarded; percentage scores suppressed for Young group (TC-30).
4. **M1 Decision:** **GO for M1 Milestone completion.** Ready to transition to Sprint 4 (Grammar activities).

