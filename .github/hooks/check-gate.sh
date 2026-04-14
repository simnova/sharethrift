#!/usr/bin/env bash
# check-gate.sh — Hard enforcement for the agent workflow.
#
# Agents MUST call this script via `execute` before progressing to the next
# phase. A non-zero exit code is a hard block — the agent cannot proceed.
#
# Usage:
#   bash .github/hooks/check-gate.sh <gate> [--lean]
#
# Gates:
#   pre-implement   Requires plan.md + plan.approved (skipped with --lean)
#   pre-review      Requires at least one file changed (git diff)
#   pre-security    Requires review.ok, rejects review.blocked
#   pre-validate    Requires security.ok, rejects security.blocked
#   pre-commit      Requires review.ok + security.ok + validation.ok.
#                   Must pass before any git commit or git push.
#   pre-done        Requires ALL: review.ok + security.ok + validation.ok,
#                   rejects any .blocked file. In full mode also requires
#                   plan.md + plan.approved.
#
# Exit codes:
#   0  Gate passed
#   1  Gate failed (missing prerequisite or blocking file exists)
#   2  Usage error

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
WORK_DIR="${REPO_ROOT}/.agents-work/current"
GATE="${1:-}"
LEAN=false

if [[ "${2:-}" == "--lean" ]]; then
  LEAN=true
fi

if [[ -z "$GATE" ]]; then
  echo -e "${RED}ERROR: Usage: bash .github/hooks/check-gate.sh <gate> [--lean]${NC}"
  echo "Gates: pre-implement, pre-review, pre-security, pre-validate, pre-commit, pre-done"
  exit 2
fi

# ── Helpers ──────────────────────────────────────────────────────────────────

fail() {
  echo -e "${RED}GATE FAILED [${GATE}]: $1${NC}"
  exit 1
}

pass() {
  echo -e "${GREEN}GATE PASSED [${GATE}]${NC}"
  exit 0
}

require_file() {
  local file="$1"
  local label="${2:-$file}"
  if [[ ! -f "$file" ]]; then
    fail "Required file missing: ${label} (${file})"
  fi
}

reject_file() {
  local file="$1"
  local label="${2:-$file}"
  if [[ -f "$file" ]]; then
    fail "Blocking file exists: ${label} (${file}) — resolve before proceeding"
  fi
}

ensure_work_dir() {
  if [[ ! -d "$WORK_DIR" ]]; then
    mkdir -p "$WORK_DIR"
    echo -e "${YELLOW}Created ${WORK_DIR}${NC}"
  fi
}

list_reviewable_changes() {
  git -C "$REPO_ROOT" status --short --untracked-files=all -- . ':(exclude).agents-work' 2>/dev/null || true
}

# ── Gates ────────────────────────────────────────────────────────────────────

gate_pre_implement() {
  ensure_work_dir

  if [[ "$LEAN" == true ]]; then
    echo -e "${YELLOW}Lean mode: skipping plan prerequisites${NC}"
    pass
  fi

  require_file "${WORK_DIR}/plan.md" "plan.md"
  require_file "${WORK_DIR}/plan.approved" "plan.approved"
  pass
}

gate_pre_review() {
  ensure_work_dir

  # Verify there are actual code changes to review
  local changed_files
  changed_files="$(list_reviewable_changes)"

  if [[ -z "$changed_files" ]]; then
    fail "No reviewable repository changes detected — nothing to review"
  fi

  pass
}

gate_pre_security() {
  ensure_work_dir
  require_file "${WORK_DIR}/review.ok" "review.ok (review must pass before security)"
  reject_file "${WORK_DIR}/review.blocked" "review.blocked (review has unresolved blockers)"
  pass
}

gate_pre_validate() {
  ensure_work_dir
  require_file "${WORK_DIR}/security.ok" "security.ok (security must pass before validation)"
  reject_file "${WORK_DIR}/security.blocked" "security.blocked (security has unresolved blockers)"
  pass
}

gate_pre_commit() {
  ensure_work_dir
  require_file "${WORK_DIR}/review.ok" "review.ok (review must pass before committing)"
  reject_file "${WORK_DIR}/review.blocked" "review.blocked (review has unresolved blockers)"
  require_file "${WORK_DIR}/security.ok" "security.ok (security must pass before committing)"
  reject_file "${WORK_DIR}/security.blocked" "security.blocked (security has unresolved blockers)"
  require_file "${WORK_DIR}/validation.ok" "validation.ok (validation must pass before committing)"
  pass
}

gate_pre_done() {
  ensure_work_dir

  # Always required
  require_file "${WORK_DIR}/review.ok" "review.ok"
  require_file "${WORK_DIR}/security.ok" "security.ok"
  require_file "${WORK_DIR}/validation.ok" "validation.ok"

  # Reject any blocked files
  reject_file "${WORK_DIR}/review.blocked" "review.blocked"
  reject_file "${WORK_DIR}/security.blocked" "security.blocked"

  # In full mode, also require plan
  if [[ "$LEAN" != true ]]; then
    require_file "${WORK_DIR}/plan.md" "plan.md"
    require_file "${WORK_DIR}/plan.approved" "plan.approved"
  fi

  pass
}

# ── Dispatch ─────────────────────────────────────────────────────────────────

case "$GATE" in
  pre-implement)  gate_pre_implement ;;
  pre-review)     gate_pre_review ;;
  pre-security)   gate_pre_security ;;
  pre-validate)   gate_pre_validate ;;
  pre-commit)     gate_pre_commit ;;
  pre-done)       gate_pre_done ;;
  *)
    echo -e "${RED}ERROR: Unknown gate '${GATE}'${NC}"
    echo "Valid gates: pre-implement, pre-review, pre-security, pre-validate, pre-commit, pre-done"
    exit 2
    ;;
esac
