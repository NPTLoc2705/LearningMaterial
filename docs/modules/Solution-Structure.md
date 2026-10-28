## Solution Structure (`server/LearningPlatform/`)

### Purpose
Establishes the 5-layer .NET 9 backend architecture (`LearningPlatform.Api → Service → Repository → DAL → BusinessObject`), PostgreSQL database connectivity (`LearningPlatformDbContext` in schema `app`), RFC 7807 `ProblemDetails` error handling, CORS for the React/Vite client, health probe endpoints (`/health` and `/api/health`), and automated assembly-boundary tests.

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `CancellationToken` | `CancellationToken` | Propagates request cancellation to `ISystemHealthService.CheckHealthAsync` and EF Core's `CanConnectAsync`. |

**Returns:** `HealthStatusDto` — JSON payload `{ status, database, timestampUtc }` returned with HTTP `200 OK` when PostgreSQL is reachable or `503 Service Unavailable` when disconnected.

### Prerequisites / Context
- **Environment assumptions**:
  - Target runtime: `.NET 9.0`.
  - Secrets (`ConnectionStrings:DefaultConnection`, `Supabase:*`, `Jwt:SecretKey`, `Gemini:ApiKey`) are loaded from `dotnet user-secrets`, environment variables, or the gitignored `appsettings.Development.local.json` file (template provided in `appsettings.Development.local.json.example`).
  - Local offline development and integration testing use PostgreSQL 16 via `docker-compose.yml` (host port `54329`) or Testcontainers.
- **Data constraints or edge cases**:
  - All EF Core tables and the `__EFMigrationsHistory` table default to the non-exposed PostgreSQL schema `app`.
  - Assembly reference boundaries are enforced by `ArchitectureTests` in `Service.Tests`: `Service` must never reference `DAL` or `LearningPlatform.Api`, and controllers must inject `I{Feature}Service` interfaces only.

