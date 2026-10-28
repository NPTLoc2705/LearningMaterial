# /migrate-platform — Run EF Core Migrations

Runs `dotnet ef migrations add` against `server/LearningPlatform/`.

## Usage
```
/migrate-platform <MigrationName>
```

## Add a migration

```bash
cd server/LearningPlatform
dotnet ef migrations add <MigrationName> \
  --project DAL \
  --startup-project LearningPlatform.Api \
  --context LearningPlatformDbContext \
  --output-dir Migrations
```

## Apply to database

```bash
cd server/LearningPlatform
dotnet ef database update \
  --project DAL \
  --startup-project LearningPlatform.Api \
  --context LearningPlatformDbContext
```

