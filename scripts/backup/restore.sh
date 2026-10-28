#!/usr/bin/env bash
# Restores a compressed pg_dump backup of schema 'app' into a target PostgreSQL database (S1-T12 / TC-33).
set -euo pipefail

BACKUP_FILE="${1:-}"
TARGET_CONNECTION_STRING="${2:-${SUPABASE_RESTORE_DB_URL:-}}"

if [[ -z "${BACKUP_FILE}" || ! -f "${BACKUP_FILE}" ]]; then
  echo "Error: Valid backup .dump file path is required as first argument." >&2
  exit 1
fi

if [[ -z "${TARGET_CONNECTION_STRING}" ]]; then
  echo "Error: Target connection string required as second argument or SUPABASE_RESTORE_DB_URL env var." >&2
  exit 1
fi

RESOLVED_BACKUP="$(cd "$(dirname "${BACKUP_FILE}")" && pwd)/$(basename "${BACKUP_FILE}")"

if [[ "${DRY_RUN:-0}" == "1" ]]; then
  echo "DRY_RUN: pg_restore --clean --if-exists --no-owner --no-privileges --schema=app ${RESOLVED_BACKUP}"
  exit 0
fi

if command -v pg_restore >/dev/null 2>&1 && command -v psql >/dev/null 2>&1; then
  psql --dbname="${TARGET_CONNECTION_STRING}" -v ON_ERROR_STOP=1 -c "CREATE SCHEMA IF NOT EXISTS app;" >/dev/null
  pg_restore \
    --dbname="${TARGET_CONNECTION_STRING}" \
    --schema=app \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    "${RESOLVED_BACKUP}"
elif command -v docker >/dev/null 2>&1; then
  BACKUP_DIR="$(dirname "${RESOLVED_BACKUP}")"
  BACKUP_NAME="$(basename "${RESOLVED_BACKUP}")"
  docker run --rm postgres:17-alpine psql --dbname="${TARGET_CONNECTION_STRING}" -v ON_ERROR_STOP=1 -c "CREATE SCHEMA IF NOT EXISTS app;" >/dev/null
  docker run --rm -v "${BACKUP_DIR}:/backups:ro" postgres:17-alpine pg_restore \
    --dbname="${TARGET_CONNECTION_STRING}" \
    --schema=app \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    "/backups/${BACKUP_NAME}"
else
  echo "Error: Neither pg_restore nor docker is installed." >&2
  exit 1
fi

echo "Restore completed from: ${RESOLVED_BACKUP}"
