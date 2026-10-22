# Known Inconsistencies (Do Not Silently Normalize)

> **Audience**: AI Coding Assistants & Developers.  
> **Rule**: These are legacy patterns or historical quirks present in the repository that deviate from our stated conventions. **Do not silently normalize or "fix" them** during feature work, as this creates huge noisy diffs and risks regressions. Flag them for dedicated cleanup PRs.

---

## 1. Repository Naming (`Repo` vs `Repository` Suffix)
The `Repository/` layer contains mixed suffix usage for interface files:
- Standard / Preferred: `I{Feature}Repository.cs` (e.g., `IUserRepository.cs`, `IOtpVerifyRepository.cs`).
- Inconsistent Legacy: `I{Feature}Repo.cs` (e.g., `IBookRepo.cs`, `ITask1TemplateRepo.cs`, `ITask2Repo.cs`).
- **Rule going forward**: Always use `I{Feature}Repository.cs` for all new interfaces and classes.

---

## 2. Hook Naming (`use-kebab-case` vs `useCamelCase`)
The `client/src/hooks/` directory currently contains both:
- Preferred: `use-kebab-case.ts` (`use-analytics.ts`, `use-timer.ts`, `use-toast.ts`, `use-mobile.tsx`).
- Legacy: `useCamelCase.ts` (`useEvaluationFeedback.ts`, `useExams.ts`, `useTracking.ts`).
- **Rule going forward**: Use `use-kebab-case.ts` for all new hooks.

---

## 3. Stray `Class1.cs` in `Service/`
`Ielts-System/Service/Class1.cs` is an empty Visual Studio scaffold artifact. Do not reference it; leave it for a dedicated cleanup PR.

---

## 4. Top-Level Component Files Outside Feature Folders
Several component files currently reside directly in `client/src/components/` instead of sub-folders:
- `CreateTaskModal.tsx`
- `completion-celebration.tsx`
- `goal-set-modal.tsx`
- `TrackingProvider.tsx`
- `TrackingStatus.tsx`
- **Rule going forward**: Do not add new top-level files to `client/src/components/`. All new components must live inside `components/{feature}/` or `components/ui/`.

---

## 5. Visual Studio & Scaffold Artifacts
- `DAL/Ielts_System/`: Contains only an empty `obj/` folder. Do not add files here.
- `Ielts-System/PRN232/`: Empty legacy project folder. Do not add files here.
- `WeatherForecast.cs`: ASP.NET Core scaffolding files present in both `Ielts_System/` and `Tracking-System/`. Do not add logic here.
- `old_dal.cs`: Orphaned file at repo root. Do not reference or extend it.

---

## 6. Legacy Server & Schema (`server/` and `shared/`)
`server/` (Node/Express) and `shared/schema.ts` (Drizzle ORM) are Replit-era artifacts retained solely for WebSocket support. Do not add REST endpoints or business logic to this layer; all new APIs belong in `Ielts_System/`.

---

## 7. Restricted Directories
Do **not** commit to `scratch/`, `attached_assets/`, or `replit_agent/` as part of regular feature work.
