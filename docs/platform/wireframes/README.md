# Platform Wireframes (S0-T04)

This folder documents the UI flows and low-fi/interactive wireframes for all 3 user groups before Sprint 1 implementation.

## 1. Young Learner Flow (`Kiddie` – `Explore 4`, Mobile-First 375px, ≥ 64px Touch Targets)
```
[Class Link /c/:token]
   │  (Tap giant Avatar tile — e.g. "🦁 Leo", "🐰 Mia", "🐼 Bin")
   │  (Remembers profile on device + subtle "Not me?" button)
   ▼
[My Lessons Hub]
   │  (Large visual card: "Unit 3 · Lesson 1: People" + 3 big icon buttons)
   ├──► 1. Look · Listen · Repeat (Learn Mode)
   │       Large illustration + Word ("teacher") + Giant Speaker Button 🔊
   │       Tap "I said it! 👍" → Next card → Complete
   ├──► 2. Listen & Tap Picture (Practice Mode)
   │       Auto-plays audio ("friend") + 4 large picture tiles (2×2 grid)
   │       Wrong tap → Gentle "Good try! 🌱" + highlights & speaks right answer
   └──► 3. Picture & Word Match (Practice Mode)
           Large picture prompt + 4 large word pills
           │
           ▼
   [Stars Result Screen]
      ⭐ ⭐ ⭐ (1 to 3 stars, never 0, never shows %) + "Play Again! 🔄"
```

## 2. Teacher Studio Flow (`/teacher/*`, Desktop & Tablet Productivity)
```
[Classrooms List /teacher/classes]
   │
   ├──► [Class Detail & Roster]
   │       - Roster table: Nickname + Avatar (Young) or Username + Temp Password (Senior)
   │       - Class Access Link card: Generate / Rotate token (shown once + QR code)
   │       - Tab "Từ cần ôn" (Weak-Word Report): ranked by error rate (Word, Thumb, Error %, Attempts, Skill)
   │
   └──► [Lessons & AI Draft Review /teacher/lessons/:id]
           1. Create Lesson (Level: Explore 1, Unit: 3, Lesson: 1, Title: "People")
           2. Upload PDF/PPTX (≤ 20 MB) → Background Gemini Extraction
           3. AI Draft Review Screen:
              - Banner: "8 words extracted from pages 8–15 · 12 decorative slides ignored · 1 scramble warning"
              - Grid/List of 8 detected words with auto-cropped WebP preview, inline edit, Keep/Remove toggle, Replace image
              - "Approve All (8)" → Writes to Vocabulary & deletes original PDF
           4. Publish & Assign to Classroom
```

## 3. Senior Learner Flow (`Pioneer 1–2`, Warm Editorial Study Workspace)
```
[Login /login] (Username + Password)
   │
   ▼
[Student Dashboard & Lesson Hub /student/lessons/:id]
   ├──► Vocabulary Practice (Listen & Pick, Word Match, Word Scramble tile builder)
   ├──► Grammar 4-Step Flow (Learn Rules/Formulas → Guided Practice → Mini Test → Review)
   └──► Result & Review Screen (Score %, 70% Pass badge, detailed Vietnamese explanations)
```

