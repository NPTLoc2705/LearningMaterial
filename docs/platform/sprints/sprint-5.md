# Sprint 5 — Hardening, deployment, pilot  (→ M3)

### S5-T01 — Teacher dashboard (overview)  [P1][M]
- Depends on: S4-T06
- Do: `GET /classrooms/{id}/reports/overview` (completion, stars/avg score by group, active last 7 days, top weak words/topics) + page.
- [ ] Done

### S5-T02 — Security pass  [P0][M]
- Depends on: S4-T10
- Do: TC-20 reflection test (every action `[Authorize]` except the 4 whitelisted); full authorization matrix for every endpoint; no-entity-leak architecture test; re-run TC-32 (anon key) against the deployed project; class-link/rate-limit review; prompt-injection fixtures (TC-25) re-run; signed-URL expiry; log hygiene (no tokens/names); dependency audit (`dotnet list package --vulnerable`, `npm audit`); secrets only from env; confirm **no student data/slides/images in git history** (`git log -p` scan).
- Acceptance: automated in CI; findings in `docs/platform/security-review.md`.
- [ ] Done

### S5-T03 — Query & performance review  [P1][S]
- Depends on: S4-T06
- Do: seed ~80 students × 50 sessions; `EXPLAIN` weak-word and history queries; add indexes if needed; confirm no N+1.
- Acceptance: TC-23.
- [ ] Done

### S5-T04 — Accessibility, responsive & kids usability  [P0][M]
- Depends on: S4-T09
- Do: WCAG 2.2 AA checklist (contrast, focus, labels, target size, reduced motion); keyboard play-through for Senior; Young UI test with 2–3 real children (observe taps, misses, confusion); fix top issues.
- Acceptance: `docs/platform/a11y-checklist.md` + usability notes.
- [ ] Done

### S5-T05 — Observability  [P0][S]
- Depends on: S1-T01
- Do: structured logs with correlation id; FE error boundary; `/health` with DB check; alert/keep-alive note for Supabase free-plan **auto-pause** (a scheduled ping before school days, or upgrade decision).
- [ ] Done

### S5-T06 — Deployment  [P0][L]
- Depends on: S5-T02
- Do: decide API host (Cloud Run vs ~US$5 VPS/Railway — compare cold start, cost caps, HTTPS) and record in `docs/platform/deployment.md`; Dockerfile for API; env-var config; migrations applied on deploy (never auto-drop); static hosting for the React app; budget alerts; rollback notes; smoke test.
- Acceptance: fresh environment deploys from the doc; class link works from a phone on mobile data.
- [ ] Done

### S5-T07 — Pilot with real classes + metrics  [P0][M]
- Depends on: S5-T06
- Do: Explore 1 (Young) + one Pioneer 2 class for 1–2 weeks; SQL against existing tables: completion rate, sessions/week, return rate, repeated-error words, minutes from upload to published, AI corrections per lesson; short feedback notes from you and (informally) parents.
- Acceptance: `docs/platform/pilot-report.md`.
- [ ] Done

### S5-T08 — Legacy portal decision, retro, backlog  [P0][S]
- Depends on: S5-T07
- Do: decide Q-14; retrospective; order the post-MVP backlog using pilot evidence (audio files? more games? import Units 7–8?).
- [ ] Done
