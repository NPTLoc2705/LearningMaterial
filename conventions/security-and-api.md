# Backend API & Security Rules — REFERENCE ONLY (`Ielts-System`)

> **NOTE (Reference Only — `Ielts-System`)**: Kept as historical reference. For the Junior English Learning Platform, see [docs/platform/02-architecture.md](../docs/platform/02-architecture.md) and [docs/platform/04-api-contract.md](../docs/platform/04-api-contract.md).

> **Scope**: All API endpoints across `Ielts-System/` and `Tracking-System/`.

---

## 1. Authentication & Authorization

- **Default Secure**: All endpoints must have the `[Authorize]` attribute unless explicitly designed and documented as public (e.g. login, registration, public landing content).
- **Role Enforcement**: If an action is restricted to admins, teachers, or moderators, apply `[Authorize(Roles = "...")]` at the controller or action level.

---

## 2. User Identity Trust Boundary

- **Never Trust Client-Sent User IDs**: NEVER accept `userId` from the frontend in route parameters, query strings, or request bodies for user-specific actions.
- **Extract from Claims**: Always resolve the authenticated user ID securely from the JWT token:
  ```csharp
  var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
  ```
- **Ownership Verification**: Before mutating or returning user-specific resources (submissions, scores, profile), verify that the resolved token identity owns the requested entity.

---

## 3. Data Protection & Payloads

- **Strict DTO Usage**: ALWAYS use dedicated Data Transfer Objects (`*Dto.cs`, `*Request.cs`, `*Response.cs`) for request and response payloads.
- **Zero Entity Leaks**: NEVER expose raw EF database entities directly in API responses. This prevents circular serialization reference bugs, over-posting vulnerabilities, and sensitive data leakage (e.g., password hashes, internal flags).
