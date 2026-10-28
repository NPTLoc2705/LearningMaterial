# /db-rollback-platform — Roll Back Last EF Core Migration

Safely removes the last migration from **both** the database and `server/LearningPlatform/DAL`.

## Usage
```
/db-rollback-platform
```

## Step 1 — Revert the database to the previous migration

```bash
cd server/LearningPlatform

dotnet ef migrations list \
  --project DAL \
  --startup-project LearningPlatform.Api \
  --context LearningPlatformDbContext

dotnet ef database update <PreviousMigrationName> \
  --project DAL \
  --startup-project LearningPlatform.Api \
  --context LearningPlatformDbContext
```

## Step 2 — Remove the migration files

```bash
dotnet ef migrations remove \
  --project DAL \
  --startup-project LearningPlatform.Api \
  --context LearningPlatformDbContext
```

## Rules
- ALWAYS run Step 1 before Step 2.
- Never manually delete files in `DAL/Migrations/`.

