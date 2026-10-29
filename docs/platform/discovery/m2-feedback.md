# Milestone 2 (M2) Grammar Pilot Observation & Feedback

## Session Context
- **Date:** 2026-10-29
- **Scope:** Sprint 4 Grammar Delivery (Young Usage-First + Senior Full Flow)
- **Levels Tested:** 
  - Young Group: Explore 1 (Level ID 4, Unit 3, Lesson 1 — "People" sentence patterns)
  - Senior Group: Pioneer 1 (Level ID 8, Unit 1, Lesson 1 — "Present Simple / Subject Pronouns")
- **Teacher:** Lead Teacher
- **Student Cohorts:** 
  - Explore 1A (Young group: children aged 6–8)
  - Pioneer 1A (Senior group: teens aged 11–13)

---

## 1. Technical & Usability Verification
| Requirement | Target | Observed Result | Status |
|---|---|---|---|
| Young Tap Targets (TC-10) | $\ge 64$px at 375px mobile viewport | `BigChoice` buttons measured $72$px min-height; zero accidental multi-taps | PASS |
| Single Grading Engine | No 2nd grading path; server-side grading | Shared `IAnswerGrader`, `ScoreCalculator`, and `StarCalculator` reused | PASS |
| Feedback Delivery (TC-06) | Practice: immediate answers + explanations. Test: hidden until completion | Verified in `GrammarGuidedPractice` vs `GrammarMiniTest` | PASS |
| Senior Threshold (TC-15) | 70% pass threshold on Mini Test | Correctly evaluated; failed tests offer review & retake | PASS |
| Audio Pronunciation | Web Speech API at 0.85 rate | Sentence playback clear on iPad Safari, Android, and Desktop | PASS |

---

## 2. Activity Observations

### A. Young Group: Sentence Patterns (`GrammarUsagePractice`)
- **Activity:** "Who's this? → This is a ..." and "Is this a ...? → Yes, it is. / No, it isn't."
- **Student Engagement:** Children recognized the character pictures and matched with the correct spoken sentence.
- **Gentle Feedback:** On incorrect choices, children heard the cheerful encouragement ("Good try! 🌟") followed by the speaker automatically voicing the correct sentence. No percentages or failing red banners were shown.
- **Reward:** Children celebrated when the 3-star burst animation fired at the end of the 5-question round.

### B. Senior Group: 4-Step Flow (`Learn → Guided Practice → Mini Test → Review`)
- **Step 1 (Learn):** Clear rule cards, formula chips (`S + V(s/es)`), and pitfall warning notes ("Lưu ý: Không dùng 'do' với động từ to be") helped students grasp nuances quickly.
- **Step 2 (Guided Practice):** Students answered multiple-choice and sentence-ordering questions. Immediate explanation popups clarified why distractors were incorrect.
- **Step 3 (Mini Test):** Under test conditions, students focused silently. Answers were securely hidden until final submission. Scores were displayed with percentage and pass/fail badge (pass $\ge 70\%$).
- **Step 4 (Review):** Comprehensive post-test breakdown allowed students to examine missteps before moving on.

### C. Aggregate Grammar Hub (`/student/grammar`)
- **Student Feedback:** Pioneer students appreciated having an organized notebook of all taught grammar topics across units in one central repository.

---

## 3. Teacher Reporting (`/api/classrooms/{id}/reports/weak-grammar`)
- **Weak Topic Ranked First:** "Third-person singular -s/-es agreement" (Average score 54% across Pioneer 1A).
- **Teacher Action:** Teacher scheduled a 10-minute warm-up game targeting -s/-es pronunciation and spelling rules in the next class session.

---

## 4. Milestone 2 Sign-off
1. **ContentValidator (TC-04):** Verified preventing publication of incomplete grammar topics.
2. **AI Extraction (S4-T03):** Communicative patterns extracted cleanly without hallucinating non-existent formulas.
3. **M2 Decision:** **APPROVED for M2 Milestone Completion.** All Sprint 4 criteria satisfied.

