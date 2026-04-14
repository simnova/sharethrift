#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
WORK_DIR="${REPO_ROOT}/.agents-work/current"

INPUT="$(cat)"

SOURCE="$(
  printf '%s' "$INPUT" | python3 -c '
import json
import sys

try:
    payload = json.load(sys.stdin)
except Exception:
    print("")
    raise SystemExit(0)

print(payload.get("source", ""))
'
)"

mkdir -p "$WORK_DIR"

if [[ "$SOURCE" == "new" ]]; then
  rm -f \
    "$WORK_DIR/plan.md" \
    "$WORK_DIR/plan.approved" \
    "$WORK_DIR/review.ok" \
    "$WORK_DIR/review.blocked" \
    "$WORK_DIR/security.ok" \
    "$WORK_DIR/security.blocked" \
    "$WORK_DIR/validation.ok" \
    "$WORK_DIR/implementer.done" \
    "$WORK_DIR/workflow.mode" \
    "$WORK_DIR/notes.md"
fi

date -u +"%Y-%m-%dT%H:%M:%SZ" > "$WORK_DIR/session.started"
