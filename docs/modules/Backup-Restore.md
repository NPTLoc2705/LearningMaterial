# Backup & Restore (`scripts/backup/`)

## `backup.ps1` / `backup.sh` & `restore.ps1` / `restore.sh`
### Purpose
Provides automated, compressed PostgreSQL backups (`pg_dump --schema=app --format=custom --compress=9`) and point-in-time restoration (`pg_restore --schema=app --clean --if-exists`) for the Supabase `app` schema (`S1-T12`, `TC-33`). Required because the Supabase Free tier does not include automatic database backups (`02-architecture.md` D-16 / Q-12).

### Input / Output
| Parameter | Type | Description |
|-----------|------|-------------|
| `ConnectionString` / `SUPABASE_DB_URL` | `string` | PostgreSQL `libpq` connection URI supplied via environment variable `SUPABASE_DB_URL` |
| `OutputDirectory` | `string` | Destination directory **outside** the Git repository (defaults to `~/.learning-platform-backups`) |
| `RetainCount` | `int` | Number of recent `.dump` archives to retain (default: `12` weekly backups) |
| `BackupFile` (`restore`) | `string` | Path to the `.dump` archive to restore into `TargetConnectionString` (`SUPABASE_RESTORE_DB_URL`) |

**Returns:** Compressed custom-format archive `~/.learning-platform-backups/learning-platform-app-YYYYMMDD-HHMMSS.dump`.

### Prerequisites / Context
- **Public-repo safety guard:** Both `backup.ps1` and `backup.sh` resolve the full output path and immediately abort with `SECURITY VIOLATION` if the output directory is inside the Git repository tree.
- **Tooling fallback:** Uses local `pg_dump` / `pg_restore` when installed, or automatically falls back to `docker run --rm postgres:17-alpine pg_dump/pg_restore` when Docker is available.
- **Weekly Scheduling (Windows Task Scheduler):**
  ```powershell
  $Action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"D:\GitHub\LearningMaterial\scripts\backup\backup.ps1`""
  $Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 2:00AM
  Register-ScheduledTask -TaskName "LearningPlatform-WeeklyBackup" -Action $Action -Trigger $Trigger
  ```
- **Weekly Scheduling (Linux / macOS `cron`):**
  ```cron
  0 2 * * 0 /path/to/LearningMaterial/scripts/backup/backup.sh >> ~/.learning-platform-backups/backup.log 2>&1
  ```
