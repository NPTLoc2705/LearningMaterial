<#
.SYNOPSIS
    Restores a compressed pg_dump backup of schema 'app' into a target PostgreSQL database (S1-T12 / TC-33).
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$BackupFile,

    [Parameter(Mandatory = $false)]
    [string]$TargetConnectionString = $env:SUPABASE_RESTORE_DB_URL,

    [Parameter(Mandatory = $false)]
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $BackupFile)) {
    throw "Backup file '$BackupFile' does not exist."
}

$ResolvedBackup = (Resolve-Path -LiteralPath $BackupFile).Path

if ([string]::IsNullOrWhiteSpace($TargetConnectionString)) {
    throw "TargetConnectionString is required. Pass -TargetConnectionString or set `$env:SUPABASE_RESTORE_DB_URL."
}

if ($DryRun) {
    Write-Output "DRY_RUN: pg_restore --clean --if-exists --no-owner --no-privileges --schema=app --dbname=<redacted> $ResolvedBackup"
    exit 0
}

$PgRestoreCmd = Get-Command "pg_restore" -ErrorAction SilentlyContinue
$PsqlCmd = Get-Command "psql" -ErrorAction SilentlyContinue

if ($null -ne $PgRestoreCmd -and $null -ne $PsqlCmd) {
    & $PsqlCmd.Source "--dbname=$TargetConnectionString" -v ON_ERROR_STOP=1 -c "CREATE SCHEMA IF NOT EXISTS app;" | Out-Null
    & $PgRestoreCmd.Source `
        "--dbname=$TargetConnectionString" `
        "--schema=app" `
        "--clean" `
        "--if-exists" `
        "--no-owner" `
        "--no-privileges" `
        $ResolvedBackup
    if ($LASTEXITCODE -ne 0) {
        throw "pg_restore failed with exit code $LASTEXITCODE."
    }
} else {
    $DockerCmd = Get-Command "docker" -ErrorAction SilentlyContinue
    if ($null -eq $DockerCmd) {
        throw "Neither 'pg_restore' nor 'docker' was found on PATH."
    }
    $BackupDir = [System.IO.Path]::GetDirectoryName($ResolvedBackup)
    $BackupName = [System.IO.Path]::GetFileName($ResolvedBackup)

    & docker run --rm postgres:17-alpine psql "--dbname=$TargetConnectionString" -v ON_ERROR_STOP=1 -c "CREATE SCHEMA IF NOT EXISTS app;" | Out-Null
    & docker run --rm -v "${BackupDir}:/backups:ro" postgres:17-alpine pg_restore `
        "--dbname=$TargetConnectionString" `
        "--schema=app" `
        "--clean" `
        "--if-exists" `
        "--no-owner" `
        "--no-privileges" `
        "/backups/$BackupName"
    if ($LASTEXITCODE -ne 0) {
        throw "Docker pg_restore failed with exit code $LASTEXITCODE."
    }
}

Write-Output "Restore completed from: $ResolvedBackup"
