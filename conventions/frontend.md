# Frontend Conventions (`client/src/`)

> **Scope**: React + TypeScript frontend built with Vite.  
> **Language**: TypeScript (`.tsx`/`.ts`) strictly. Never add `.jsx`/`.js` files to `client/`.

---

## 1. Folder Structure & Responsibilities

| Folder | Responsibility | Naming Convention |
|---|---|---|
| `components/{feature}/` | Presentational, reusable feature UI components. Receives data & callbacks via props. | `PascalCase.tsx` |
| `components/ui/` | Primitive UI elements (shadcn-style buttons, inputs, dialogs). | `PascalCase.tsx` |
| `pages/` | Route-level containers. Owns page-level state, calls hooks and services. | `kebab-case.tsx` or `PascalCase/index.tsx` |
| `Service/` | API HTTP clients (fetch/axios logic only). No React imports, no JSX. | `PascalCase + Service.ts` (e.g. `PaymentService.ts`) |
| `hooks/` | Custom hooks (`useX`) for stateful logic, side effects, and orchestration. | `use-kebab-case.ts` (preferred) |
| `lib/` | App-wide infrastructure (query client, auth fetch wrapper, tracking). | `camelCase.ts` |
| `data/` | Static arrays, lookup tables, and configuration maps. | `kebab-case.ts` |
| `utils/` | Pure utility functions with no React dependency. | `camelCase.ts` |

---

## 2. Where New Files Go — Frontend Cheat Sheet

| What you're adding | Where it goes | Example |
|---|---|---|
| New page (route) | `client/src/pages/{name}.tsx` (simple) or `client/src/pages/{Name}/index.tsx` (complex) | `client/src/pages/listening/index.tsx` |
| New reusable component | `client/src/components/{feature}/{ComponentName}.tsx` | `client/src/components/listening/ListeningAudioBar.tsx` |
| New UI primitive | `client/src/components/ui/{ComponentName}.tsx` | `client/src/components/ui/Button.tsx` |
| New API service | `client/src/Service/{Domain}Service.ts` | `client/src/Service/ListeningService.ts` |
| New custom hook | `client/src/hooks/use-{name}.ts` | `client/src/hooks/use-listening-exam.ts` |
| New static data file | `client/src/data/{name}.ts` | `client/src/data/listening-dummy-data.ts` |
| New lib utility | `client/src/lib/{name}.ts` | `client/src/lib/authFetch.ts` |
| New pure utility | `client/src/utils/{name}.ts` | `client/src/utils/listeningGrading.ts` |

---

## 3. Component Separation & Splitting Triggers

Each folder has a strict responsibility. A file violates the architecture when it does something outside its boundaries.

### Splitting Triggers — Split a file when ANY of these occur:
1. **~150 Lines**: A component exceeds ~150 lines or mixes more than one visual concern.
2. **Direct Fetch**: A component or page contains a direct `fetch` or `axios` call → extract to `Service/`.
3. **Repeated Logic**: Stateful logic (data fetching, form handling, countdown, debounce) appears in 2+ places → extract to a custom hook in `hooks/`.
4. **Reusable Markup**: A page component contains presentational markup that can stand alone → extract to `components/{feature}/`.

### Strict "Do NOT" Rules:
- **Do not** put API calls inside components or pages.
- **Do not** put JSX inside services or custom hooks (hooks return state and callbacks only).
- **Do not** create top-level files directly in `client/src/components/` — group them in a feature sub-folder.
- **Do not** put React components inside `lib/` or `utils/`.
- **Do not** over-abstract components/hooks used only once without complexity justification.

---

## 4. Hybrid Decomposition for Large Route Pages

When a route page in `client/src/pages/` grows large (exceeding ~500 lines) due to complex form state, audio synchronization, or API coordination:

1. **Extract State into Custom Hook**:
   - Move all state variables, `useEffect` blocks, audio synchronizers, and event handlers into `client/src/hooks/use-{page-name}.ts`.
2. **Extract Layout Blocks into Sub-Components**:
   - Move distinct UI blocks into presentational components in `client/src/components/{feature}/` (under 150 lines each).
3. **Keep the Page Declarative (<300 lines)**:
   - The page component should only invoke the hook and pass required state/callbacks as props to the presentational sub-components.
