## DataAccess Foundation (`DAL` & Schema `app`)

### Purpose
Defines the core identity and classroom entities (`User`, `Level`, `LevelSettings`, `Classroom`, `Enrollment`, `ClassroomStaff`), seeds the 9 curriculum levels (`kiddie` through `pioneer-2`) with their per-level `LevelSettings`, enforces PostgreSQL Row-Level Security (RLS) and privilege revocation on schema `app` (`TC-32`), and provides environment-driven Admin bootstrap (`IdentityBootstrapService`).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `ModelBuilder` | `ModelBuilder` | Configures table mappings, string enum conversions, case-insensitive ICU collation on `User.Username`, unique indexes, and seed data via `FoundationModelConfiguration.ConfigureFoundation`. |
| `MigrationOperation` | `EnsureSchemaOperation` / `CreateTableOperation` | Processed by `AppSchemaMigrationsSqlGenerator` to emit `REVOKE ALL ON SCHEMA app FROM PUBLIC, anon, authenticated` and `ENABLE/FORCE ROW LEVEL SECURITY` on every table in schema `app`. |

**Returns:** `void` / `MigrationCommandListBuilder` — schema-hardened DDL commands and seeded EF Core model.

### Prerequisites / Context
- **Environment assumptions**:
  - PostgreSQL 15+ (Supabase or local Postgres 16) with ICU collation support (`en-u-ks-level2`).
  - Optional bootstrap credentials (`BootstrapAdmin:Username` / `BOOTSTRAP_ADMIN_USERNAME` and `BootstrapAdmin:Password` / `BOOTSTRAP_ADMIN_PASSWORD`) create the initial Admin user via `PasswordHasher<User>` without any hard-coded password.
- **Data constraints or edge cases**:
  - **Query Complexity**:
    - `User` lookup by `Username`: $O(\log N)$ via unique B-tree index with case-insensitive ICU collation (`case_insensitive_icu`).
    - `Classroom` uniqueness on `(LevelId, Name, TermName)`: $O(\log N)$ with `NULLS NOT DISTINCT` so duplicate classroom names in the same level without a term name are rejected.
    - `Enrollment` lookup by `(ClassroomId, StudentId)` or `(StudentId)`: $O(\log N)$ via composite unique index and secondary `StudentId` index.
    - `ClassroomStaff` lookup by `(ClassroomId, TeacherId)`: $O(\log N)$ via composite unique index.

