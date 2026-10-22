# Enhanced Grammar & Dynamic Mixed Drills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Grammar study experience with modular rule cards (formulas, examples, explanations, and common pitfall warnings) and a dynamic 6-question mixed drill engine sampling at least 3 distinct question types per session with comprehensive rationale feedback, retry logic, and new randomized generation.

**Architecture:** Client-side React 19 + TypeScript architecture. Extend grammar data models with modular rule cards and diverse drill banks. Create a sampling utility `drillGenerator.ts` to pick 3 distinct question types (6 questions total). Implement `ModularRuleRenderer.tsx` for structured theory and `DynamicDrillEngine.tsx` with inline input, error spotting, sentence rewriting, review explanations, and seed/retry state management.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, Tailwind CSS 3.4, Canvas Confetti, Web Speech API.

## Global Constraints

- Tech Stack: Pure client-side React 19 + TypeScript + Vite. No backend server or external database.
- State Persistence: User grammar completion checkmarks and drill scores sync to `localStorage` via existing `useProgress` hook.
- Strict Zero-XSS: Use `FormattedText.tsx` for markdown bold/italic formatting. Zero `dangerouslySetInnerHTML`.
- Design Aesthetics: Warm monochrome canvas (`#FBFBFA`), charcoal typography (`#141413`), Newsreader serif headings, Geist sans body, Geist Mono formula code blocks, concentric double-bezel cards, spot pastel accents (`#FBF3DB` for pitfall warnings, `#EDF3EC` for success).
- Mobile-First: Touch targets >= 42px with `touch-manipulation`, horizontal scrolling for any wide elements, drawer navigation on mobile.
- Language: 100% Vietnamese UI chrome, instructions, and explanations; English lesson content and sentences verbatim.

---

### Task 1: Extend Grammar TypeScript Interfaces

**Files:**
- Modify: `client/src/types/grammar.ts`

**Interfaces:**
- Produces: `GrammarDrillType`, `ModularRuleCard`, `DynamicDrillQuestion`, `GrammarTopicExtended`.

- [ ] **Step 1: Update `client/src/types/grammar.ts` with extended types**

```typescript
export type GrammarCategory =
  | 'Main grammar'
  | 'Speaking strategy'
  | 'Reading strategy'
  | 'Extra grammar'
  | 'Language notes';

export interface GrammarRuleTable {
  title?: string;
  headers: string[];
  rows: string[][];
}

export type GrammarDrillType =
  | 'reading-cloze'
  | 'error-correction'
  | 'sentence-rewrite'
  | 'multiple-choice'
  | 'word-scramble'
  | 'sentence-combining';

export interface ModularRuleCard {
  id: string;
  title: string;
  formula: string;
  exampleEn: string;
  exampleVi?: string;
  explanation: string;
  commonPitfall: {
    confusedWith: string;
    mistakeExample: string;
    ruleTip: string;
  };
}

export interface DynamicDrillQuestion {
  id: string;
  type: GrammarDrillType;
  typeLabel: string;
  prompt: string;
  passage?: string;
  bracketVerb?: string;
  options?: string[];
  correctAnswer: string;
  errorWord?: string;
  targetKeyword?: string;
  scrambledWords?: string[];
  explanation: {
    ruleReason: string;
    whyWrong?: string;
    grammarTip: string;
  };
  sourceContext?: string;
}

export interface GrammarPracticeItem {
  id: string;
  prompt: string;
  correctAnswer: string;
  options?: string[];
  type: 'multiple-choice' | 'fill-in-the-blank';
  sourceSentence: string;
}

export interface GrammarTopic {
  id: string;
  unit: 7 | 8;
  sectionNumber: number;
  lesson?: string;
  title: string;
  category: GrammarCategory;
  summaryText?: string;
  ruleTables: GrammarRuleTable[];
  patterns?: string[];
  examples: string[];
  notes?: string[];
  practiceExercises: GrammarPracticeItem[];
  modularRules?: ModularRuleCard[];
  drillBank?: DynamicDrillQuestion[];
}
```

- [ ] **Step 2: Verify TypeScript compiler passes**

Run: `npx --prefix client tsc -b`  
Expected: 0 errors

- [ ] **Step 3: Commit interface updates**

```bash
git add client/src/types/grammar.ts
git commit -m "feat(types): Mở rộng interface ModularRuleCard và DynamicDrillQuestion cho ngữ pháp"
```

---

### Task 2: Create Grammar Extended Dataset

**Files:**
- Create: `client/src/data/grammar-extended.ts`

**Interfaces:**
- Consumes: `ModularRuleCard`, `DynamicDrillQuestion` from `client/src/types/grammar.ts`
- Produces: `GRAMMAR_EXTENDED_DATA: Record<string, { modularRules: ModularRuleCard[]; drillBank: DynamicDrillQuestion[] }>`

- [ ] **Step 1: Write `client/src/data/grammar-extended.ts` with comprehensive modular rules, pitfalls, and question banks for all topics**

The file will define for each topic (e.g. `u7-superlative-adjectives`, `u7-future-will-going-to`, `u7-requests`, `u8-present-perfect`, `u8-for-since`, `u8-cause-and-effect`, `u8-there-to-be`, `u8-wh-questions`, `u8-likes-dislikes`):
1. `modularRules`:
   - Structured formula (e.g. `the + adj + -est`, `the most + adj`, `S + will + V`, `S + be going to + V`, `S + have/has + V3/V-ed`).
   - Direct bilingual example.
   - Clear explanation of usage logic.
   - `commonPitfall`: `confusedWith`, `mistakeExample`, and `ruleTip`.
2. `drillBank`:
   - At least 6-10 questions across multiple types: `reading-cloze`, `error-correction`, `sentence-rewrite`, `multiple-choice`, `word-scramble`.
   - Each question has `explanation.ruleReason`, `explanation.whyWrong`, and `explanation.grammarTip`.

- [ ] **Step 2: Verify compilation**

Run: `npx --prefix client tsc -b`  
Expected: 0 errors

- [ ] **Step 3: Commit extended data**

```bash
git add client/src/data/grammar-extended.ts
git commit -m "feat(data): Xây dựng ngân hàng dữ liệu lý thuyết phân tầng và bài tập KET đa dạng cho ngữ pháp"
```

---

### Task 3: Build 6-Question / 3-Type Dynamic Sampling Utility

**Files:**
- Create: `client/src/utils/drillGenerator.ts`

**Interfaces:**
- Consumes: `DynamicDrillQuestion` from `client/src/types/grammar.ts`
- Produces: `function generateMixedDrill(drillBank: DynamicDrillQuestion[], targetCount?: number, targetTypeCount?: number): DynamicDrillQuestion[]`

- [ ] **Step 1: Implement `client/src/utils/drillGenerator.ts`**

Algorithm specification:
- Group bank items by `type`.
- If fewer than 3 types are available in bank, use all available types.
- Randomly shuffle the types, pick 3 distinct types.
- From each chosen type, pick 2 questions (total 6 questions). If a type has fewer, balance from remaining types to guarantee exactly 6 questions.
- Return the randomized 6-question set.

- [ ] **Step 2: Test utility compilation**

Run: `npx --prefix client tsc -b`  
Expected: 0 errors

- [ ] **Step 3: Commit generator utility**

```bash
git add client/src/utils/drillGenerator.ts
git commit -m "feat(utils): Tạo hàm bốc ngẫu nhiên 3 dạng đề / 6 câu hỏi cho ngữ pháp"
```

---

### Task 4: Build Modular Theory Rules Component

**Files:**
- Create: `client/src/components/grammar/ModularRuleRenderer.tsx`

**Interfaces:**
- Consumes: `ModularRuleCard`, `GrammarTopic` from `client/src/types/grammar.ts`, `FormattedText` from `client/src/components/ui/FormattedText.tsx`
- Produces: `export function ModularRuleRenderer({ topic, modularRules }: ModularRuleRendererProps)`

- [ ] **Step 1: Implement `ModularRuleRenderer.tsx`**

Design specifications:
- Render topic summary box.
- For each rule card:
  - Header with rule title and badge.
  - Formula block: Monospace font, dark charcoal pill with border.
  - Contextual example: Italicized English with Vietnamese translation.
  - "Tại sao lại dùng như vậy?": Clear explanatory paragraph.
  - "Bẫy hay nhầm lẫn nhất": Amber callout card (`bg-[#FBF3DB] border-[#F5E6BF]`) with warning icon, showing `confusedWith`, `mistakeExample` (struck through or marked ❌), and `ruleTip` (marked 👉).

- [ ] **Step 2: Verify compilation**

Run: `npx --prefix client tsc -b`  
Expected: 0 errors

- [ ] **Step 3: Commit modular rule component**

```bash
git add client/src/components/grammar/ModularRuleRenderer.tsx
git commit -m "feat(ui): Thêm component ModularRuleRenderer hiển thị công thức kèm bẫy nhầm lẫn"
```

---

### Task 5: Build Dynamic Mixed Drill Engine with Review Rationale

**Files:**
- Create: `client/src/components/grammar/DynamicDrillEngine.tsx`

**Interfaces:**
- Consumes: `DynamicDrillQuestion` from `client/src/types/grammar.ts`, `generateMixedDrill` from `client/src/utils/drillGenerator.ts`
- Produces: `export function DynamicDrillEngine({ drillBank, onComplete }: DynamicDrillEngineProps)`

- [ ] **Step 1: Implement `DynamicDrillEngine.tsx`**

Features:
- State:
  - `activeQuestions`: Array of 6 sampled questions.
  - `answers`: Record<string, string> (user input per question).
  - `isSubmitted`: boolean.
- Interactions for question types:
  - `reading-cloze`: Shows reading passage with inline blank and bracketed verb `(verb)`.
  - `error-correction`: Sentence with clickable word chips. Touching a word marks it as the error and opens an input to type the correction.
  - `sentence-rewrite`: Shows original sentence, target keyword in badge `[SMALLEST]`, and input for new sentence.
  - `multiple-choice`: 4 options.
  - `word-scramble`: Scrambled word chips that can be tapped to assemble the sentence.
- Submit & Evaluation View:
  - Score summary card: `{score} / 6 câu đúng ({percentage}%)` + Confetti if >= 80%.
  - Detailed review for every question:
    - User answer vs Correct answer.
    - Status badge (`Chính xác` / `Chưa chính xác`).
    - Explanation callout: `explanation.ruleReason`, `explanation.whyWrong`, `explanation.grammarTip`.
- Two action buttons:
  - 🔁 **"Làm lại đề này"**: Keeps `activeQuestions`, resets `answers` to empty, sets `isSubmitted = false`.
  - 🎲 **"Tạo đề luyện mới"**: Calls `generateMixedDrill()` to sample a brand new 6-question set.

- [ ] **Step 2: Verify compilation**

Run: `npx --prefix client tsc -b`  
Expected: 0 errors

- [ ] **Step 3: Commit dynamic drill engine**

```bash
git add client/src/components/grammar/DynamicDrillEngine.tsx
git commit -m "feat(ui): Thêm component DynamicDrillEngine hỗ trợ 3 dạng bài / 6 câu kèm giải thích chi tiết"
```

---

### Task 6: Integrate Components into Grammar Lesson Page

**Files:**
- Modify: `client/src/pages/grammar-lesson.tsx`

- [ ] **Step 1: Update `client/src/pages/grammar-lesson.tsx`**

- Import `GRAMMAR_EXTENDED_DATA` from `../data/grammar-extended`.
- In Tab 1 ("Lý thuyết & Công thức"):
  - Render `ModularRuleRenderer` using extended modular rules if available, falling back gracefully to existing tables.
- In Tab 2 ("Bài tập vận dụng"):
  - Render `DynamicDrillEngine` using extended drill bank if available, falling back gracefully to basic drills.
- Pass score callbacks to sync with `useProgress`.

- [ ] **Step 2: Run full build check**

Run: `npm run build`  
Expected: `tsc -b && vite build` succeeds with 0 errors.

- [ ] **Step 3: Commit integration**

```bash
git add client/src/pages/grammar-lesson.tsx
git commit -m "feat: Tích hợp ModularRuleRenderer và DynamicDrillEngine vào trang bài học ngữ pháp"
```

---

### Task 7: End-to-End Browser Testing & Git Push

**Files:**
- Verification only

- [ ] **Step 1: Test with browser_subagent**
- Navigate to `http://localhost:4173/grammar/u7-superlative-adjectives`.
- Verify Tab 1: Check modular cards with formula, example, explanation, and pitfall box.
- Verify Tab 2: Switch to "Bài tập vận dụng", confirm 6 questions from 3 different types are rendered.
- Submit answers, verify the review screen displays rationale and explanations.
- Test "Làm lại đề này" button (verifies same 6 questions remain).
- Test "Tạo đề luyện mới" button (verifies new 6 questions are sampled).
- Capture screenshots for verification.

- [ ] **Step 2: Push changes to GitHub repository**

```bash
git push origin main
```
