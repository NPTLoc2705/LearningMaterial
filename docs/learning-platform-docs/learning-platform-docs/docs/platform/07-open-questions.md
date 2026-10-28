# 07 — Decisions & Open Questions (owner: Loc)

Status: **all blocking questions closed** (2026-10-28). Items marked 🟡 are non-blocking and have a default.
To change a decision, edit it here **and** update the affected docs listed in the last column.

## Decided
| ID | Topic | Decision | Affects |
|---|---|---|---|
| Q-01 | Context & pace | Loc is project owner and the main teacher; his own students are the users. Franchising/handover is out of scope. **~2 h/day, no hard deadline**: tasks are ordered, not dated. | 05 |
| Q-02 | Who builds | Solo + AI agent (Antigravity). | AGENTS.md |
| Q-03 | Layers | **Keep DAO + Repository** (consistency with Loc's other projects). | 02 |
| Q-04 | Repo & stack | Backend goes in `server/` of the **public** `LearningMaterial` repo (monorepo). **.NET 9**. Public-repo rules are mandatory (see 02 §6). | 02, AGENTS.md |
| Q-05 | Units 7–8 data | They belong to **Pioneer 1** and stay hard-coded in the legacy portal. **Not** used as the pilot. May be imported later through the normal pipeline (optional). | 05 |
| Q-06 | Lesson granularity | **One Lesson = (Level, Unit, LessonNo)**, e.g. "Explore 1 · Unit 3 · Lesson 1". One slide file per Lesson. Lessons are shared per Level and assigned to classrooms. Vocabulary and grammar of a lesson live together in that lesson; grammar is stored **once** (the Pioneer "Grammar" page is only an aggregate view of published lessons). | 01, 03 |
| Q-07 | Student access | **Young group** (Kiddie, Birdie, Newbie, Explore 1–4): open the class link → tap own name/avatar, **no password**. Roster is pre-created by the teacher (no free typing → no duplicates). Nicknames only. **Pioneer 1–2**: username + password created by the teacher. | 02 D-11/D-16, 03, 04 |
| Q-08 | Source files | Slides are PDF/PPTX with a text layer **plus** content inside images → AI must read page images (vision), not only text. **Originals are not stored**: upload → AI draft → teacher review → discard file. Only approved vocabulary/grammar and compressed images are kept. | 02 D-10/D-15, 03 |
| Q-08b | AI provider | **Gemini, free API key** (AI Studio). Loc accepts that free-tier prompts/content may be used by Google to improve its products. Key only in env/user-secrets (public repo!). Teacher approval is always required before Published. | 02 D-15 |
| Q-08c | Images | **Auto-crop images from slides** (third-party stock photos, some with real children — accepted by Loc). Stored compressed (WebP) in a **private** Supabase bucket, served via short-lived signed URLs; never committed to git. | 02 D-10, 03 |
| Q-09 | No-image fallback | Picture-based games fall back to text when a word has no image. | 03 |
| Q-10 | Scoring | **Percentage scores and the 70% pass threshold only for the Senior group (Pioneer)**. Young group: stars + sounds, never a percentage. | 02 D-07 |
| Q-11 | Roles | Teacher and TA are the same role. | 04 |
| Q-12 | Data hosting | **Supabase (free plan) for PostgreSQL and file storage**; region Singapore. Free plan limits to respect: 500 MB DB, 1 GB files, auto-pause after 7 days idle, **no automatic backups** → own backup script early (S1-T12). | 02 §5 |
| Q-12b | API hosting | Azure for Students credit already used. **Decide at deployment (S5-T06)** between Google Cloud Run (scale-to-zero, near-free, cold start), a ~US$5 always-on VPS/Railway; API is shipped as a Docker image so it is portable. React app = free static hosting. Local machine during development. | 02 §5, sprint-5 |
| Q-13 | UI language | Teacher UI and Pioneer UI: **Vietnamese**. Young-group UI: **icons + very short English prompts** ("Listen!", "Tap!"), no Vietnamese meanings (Explore 1). | 02 §4 |
| Q-14 | Legacy portal | 🟡 Decide at the end (S5-T08). Until then untouched. | sprint-5 |

## Level groups (configuration, not code — D-07)
| | **Young group** | **Senior group** |
|---|---|---|
| Levels | Kiddie, Birdie, Newbie, Explore 1, 2, 3, 4 | Pioneer 1, 2 |
| Access | Class link + tap name/avatar | Username + password |
| Feedback | Stars + sound, gentle "try again" tone, never %, wrong answer → correct answer shown and spoken | Score %, pass at 70%, answers + explanations |
| Grammar | **Usage-first**: a few example sentences with pictures + "choose the right sentence"; no formulas; no separate grammar page | Learn → Guided Practice → Mini Test; Grammar aggregate page |
| Meaning field | Picture is the meaning; Vietnamese meaning optional (Ex1: none) | Vietnamese meaning expected |
| Activities | Look-Listen-Repeat (not graded), Listen & Tap Picture, Picture & Word Match | + Word Scramble |
| Word Scramble also enabled for | Explore 3, Explore 4 (per-level switch) | Pioneer 1–2 |

## Assumptions made while closing (tell me if wrong)
- A1. Kiddie/Birdie/Newbie = Young group (Loc confirmed).
- A2. Word Scramble is enabled from Explore 3 upward as agreed in discussion; it is a per-level setting, easy to change.
- A3. Star rule for Young group (adjustable): ≥ 80% correct → 3 stars, ≥ 50% → 2 stars, otherwise 1 star (never zero).
- A4. Young group: **one attempt per question**; a wrong answer shows and speaks the correct one ("Good try!") — no retry loop (keeps grading/history simple).
- A5. Classroom link contains a long random token; anyone holding the link can open any profile of that class (accepted trade-off for low-stakes young learners). The link is **shown once** (only its hash is stored): if you lose it, rotate it — the old link stops working and you share the new one.
- A6. Scale: 4 classes, < 20 students each → no performance engineering beyond sensible indexes.
- A7. Pilot lesson: **Explore 1 · Unit 3 · Lesson 1 ("People")**, 8 words: boy, girl, man, woman, teacher, classmate, student, friend. The sample PDF is kept **outside git** (e.g. `D:\samples`).

## Still open (non-blocking)
| ID | Question | Default |
|---|---|---|
| Q-15 | Do you want audio files later (instead of browser voice) if some devices lack a good English voice? | Decide after the M1 pilot |
| Q-16 | After graduation, who maintains hosting costs/accounts? | Out of scope now |
