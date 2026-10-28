<#
.SYNOPSIS
    Creates a compressed pg_dump backup of the 'app' schema outside the Git repository (S1-T12 / TC-33).
.DESCRIPTION
    Exports schema 'app' in PostgreSQL custom compressed format (.dump).
    Refuses to write inside the Git repository tree to prevent accidental secret/data commits.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$ConnectionString = $env:SUPABASE_DB_URL,

    [Parameter(Mandatory = $false)]
    [string]$OutputDirectory = (Join-Path $HOME ".learning-platform-backups"),

    [Parameter(Mandatory = $false)]
    [int]$RetainCount = 12,

    [Parameter(Mandatory = $false)]
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$ResolvedOut = [System.IO.Path]::GetFullPath($OutputDirectory)

if ($ResolvedOut.StartsWith($RepoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "SECURITY VIOLATION: Backup output directory '$ResolvedOut' must be OUTSIDE the Git repository '$RepoRoot'."
}

if ([string]::IsNullOrWhiteSpace($ConnectionString)) {
    throw "ConnectionString is required. Pass -ConnectionString or set `$env:SUPABASE_DB_URL (libpq URI postgresql://...)."
}

if (-not (Test-Path -LiteralPath $ResolvedOut)) {
    New-Item -ItemType Directory -Path $ResolvedOut -Force | Out-Null
}

$Timestamp = (Get-Date).ToUniversalTime().ToString("yyyyMMdd-HHmmss")
$BackupFile = Join-Path $ResolvedOut "learning-platform-app-$Timestamp.dump"

$PgDumpArgs = @(
    "--dbname=$ConnectionString",
    "--schema=app",
    "--format=custom",
    "--compress=9",
    "--no-owner",
    "--no-privileges",
    "--file=$BackupFile"
)

if ($DryRun) {
    Write-Output "DRY_RUN: pg_dump --schema=app --format=custom --compress=9 --no-owner --no-privileges --file=$BackupFile"
    exit 0
}

$PgDumpCmd = Get-Command "pg_dump" -ErrorAction SilentlyContinue
if ($null -ne $PgDumpCmd) {
    & $PgDumpCmd.Source @PgDumpArgs
    if ($LASTEXITCODE -ne 0) {
        throw "pg_dump failed with exit code $LASTEXITCODE."
    }
} else {
    $DockerCmd = Get-Command "docker" -ErrorAction SilentlyContinue
    if ($null -eq $DockerCmd) {
        throw "Neither 'pg_dump' nor 'docker' was found on PATH. Install PostgreSQL client tools or Docker."
    }
    $ContainerOutFile = "/backups/learning-platform-app-$Timestamp.dump"
    & docker run --rm -v "${ResolvedOut}:/backups" postgres:17-alpine pg_dump `
        "--dbname=$ConnectionString" `
        "--schema=app" `
        "--format=custom" `
        "--compress=9" `
        "--no-owner" `
        "--no-privileges" `
        "--file=$ContainerOutFile"
    if ($LASTEXITCODE -ne 0) {
        throw "Docker pg_dump failed with exit code $LASTEXITCODE."
    }
}

if (-not (Test-Path -LiteralPath $BackupFile)) {
    throw "Backup file was not created at '$BackupFile'."
}

# Prune older backups beyond RetainCount
if ($RetainCount -gt 0) {
    $ExistingBackups = Get-ChildItem -Path $ResolvedOut -Filter "learning-platform-app-*.dump" |
        Sort-Object LastWriteTimeUtc -Descending
    if ($ExistingBackups.Count -gt $RetainCount) {
        $ExistingBackups | Select-Object -Skip $RetainCount | Remove-Item -Force
    }
}

Write-Output "Backup completed: $BackupFile"
