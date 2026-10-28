#!/usr/bin/env bash
# Creates a compressed pg_dump backup of schema 'app' outside the Git repository (S1-T12 / TC-33).
set -euo pipefail

CONNECTION_STRING="${1:-${SUPABASE_DB_URL:-}}"
OUTPUT_DIR="${2:-${HOME}/.learning-platform-backups}"
RETAIN_COUNT="${RETAIN_COUNT:-12}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

mkdir -p "${OUTPUT_DIR}"
RESOLVED_OUT="$(cd "${OUTPUT_DIR}" && pwd)"

case "${RESOLVED_OUT}/" in
  "${REPO_ROOT}/"*)
    echo "SECURITY VIOLATION: Backup output directory '${RESOLVED_OUT}' must be OUTSIDE the Git repository '${REPO_ROOT}'." >&2
    exit 1
    ;;
esac

if [[ -z "${CONNECTION_STRING}" ]]; then
  echo "Error: Connection string required via first argument or SUPABASE_DB_URL env var." >&2
  exit 1
fi

TIMESTAMP="$(date -u +"%Y%m%d-%H%M%S")"
BACKUP_FILE="${RESOLVED_OUT}/learning-platform-app-${TIMESTAMP}.dump"

if [[ "${DRY_RUN:-0}" == "1" ]]; then
  echo "DRY_RUN: pg_dump --schema=app --format=custom --compress=9 --no-owner --no-privileges --file=${BACKUP_FILE}"
  exit 0
fi

if command -v pg_dump >/dev/null 2>&1; then
  pg_dump \
    --dbname="${CONNECTION_STRING}" \
    --schema=app \
    --format=custom \
    --compress=9 \
    --no-owner \
    --no-privileges \
    --file="${BACKUP_FILE}"
elif command -v docker >/dev/null 2>&1; then
  docker run --rm -v "${RESOLVED_OUT}:/backups" postgres:17-alpine pg_dump \
    --dbname="${CONNECTION_STRING}" \
    --schema=app \
    --format=custom \
    --compress=9 \
    --no-owner \
    --no-privileges \
    --file="/backups/learning-platform-app-${TIMESTAMP}.dump"
else
  echo "Error: Neither pg_dump nor docker is installed." >&2
  exit 1
fi

# Prune older backups beyond RETAIN_COUNT
if [[ "${RETAIN_COUNT}" -gt 0 ]]; then
  ls -1t "${RESOLVED_OUT}"/learning-platform-app-*.dump 2>/dev/null | tail -n +"$((RETAIN_COUNT + 1))" | xargs -r rm -f
fi

echo "Backup completed: ${BACKUP_FILE}"
