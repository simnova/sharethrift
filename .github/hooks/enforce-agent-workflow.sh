#!/usr/bin/env bash
# enforce-agent-workflow.sh — preToolUse hook for Copilot CLI.
#
# Fires before every tool call (bash, edit, create, view).
# NOTE: Does NOT fire for agent delegation — Copilot does not emit
# preToolUse for subagent spawns. Enforcement must work through the
# tools agents actually use.
#
# Enforcement rules:
#   1. edit/create blocked unless plan.md exists (or workflow.mode=lean)
#   2. git commit/push blocked unless review.ok + security.ok + validation.ok
#   3. All other tool calls pass through

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
WORK_DIR="${REPO_ROOT}/.agents-work/current"

INPUT="$(cat)"

# Parse tool name and args
PARSED="$(
  printf '%s' "$INPUT" | python3 -c '
import json, sys

try:
    payload = json.load(sys.stdin)
except Exception:
    print("")
    print("")
    raise SystemExit(0)

tool_name = str(payload.get("toolName", "")).strip().lower()

tool_args_raw = payload.get("toolArgs", "")
if isinstance(tool_args_raw, dict):
    blob = " ".join(str(v) for v in tool_args_raw.values())
elif isinstance(tool_args_raw, str):
    blob = tool_args_raw
else:
    blob = str(tool_args_raw)

print(tool_name)
print(blob.lower())
'
)"

TOOL_NAME="$(printf '%s\n' "$PARSED" | sed -n '1p')"
ARGS_BLOB="$(printf '%s\n' "$PARSED" | sed -n '2p')"

deny() {
  python3 -c '
import json, sys
print(json.dumps({
    "permissionDecision": "deny",
    "permissionDecisionReason": sys.argv[1],
}))
' "$1"
  exit 0
}

mkdir -p "$WORK_DIR"

# ── Rule 1: edit/create require a plan ───────────────────────────────────────
# Blocks code changes until planning is done. The planner agent only uses
# read/search/web, so it is unaffected. The reviewer and security agents
# only use read/search/execute, so they are also unaffected.
# Only the implementer (which uses edit/create) is gated.

if [[ "$TOOL_NAME" == "edit" || "$TOOL_NAME" == "create" ]]; then
  # Allow writes to .agents-work/ (checkpoint files)
  if printf '%s' "$ARGS_BLOB" | grep -q '\.agents-work'; then
    exit 0
  fi

  # Allow writes to .github/ (workflow config files)
  if printf '%s' "$ARGS_BLOB" | grep -q '\.github/'; then
    exit 0
  fi

  # Check for plan or lean mode
  if [[ -f "$WORK_DIR/workflow.mode" ]]; then
    MODE="$(tr -d '[:space:]' < "$WORK_DIR/workflow.mode")"
    if [[ "$MODE" == "lean" ]]; then
      exit 0
    fi
  fi

  if [[ ! -f "$WORK_DIR/plan.md" ]]; then
    deny "Code changes blocked: no plan exists. The orchestrator must delegate to the planner agent first, which writes .agents-work/current/plan.md. Or write workflow.mode=lean for trivial changes."
  fi

  if [[ ! -f "$WORK_DIR/plan.approved" ]]; then
    deny "Code changes blocked: plan exists but is not approved. The orchestrator must get user approval and write .agents-work/current/plan.approved before implementation begins."
  fi

  exit 0
fi

# ── Rule 2: git commit/push require full review chain ────────────────────────
# Blocks committing until review + security + validation are all done.

if [[ "$TOOL_NAME" == "bash" || "$TOOL_NAME" == "execute" || "$TOOL_NAME" == "shell" ]]; then
  if printf '%s' "$ARGS_BLOB" | grep -qE 'git\s+(commit|push)'; then
    if [[ ! -f "$WORK_DIR/review.ok" ]]; then
      deny "git commit/push blocked: review.ok missing. The reviewer agent must run and pass before committing."
    fi
    if [[ ! -f "$WORK_DIR/security.ok" ]]; then
      deny "git commit/push blocked: security.ok missing. The security agent must run and pass before committing."
    fi
    if [[ ! -f "$WORK_DIR/validation.ok" ]]; then
      deny "git commit/push blocked: validation.ok missing. Run build/test/lint and write validation.ok before committing."
    fi
  fi

  exit 0
fi

# ── Everything else passes through ───────────────────────────────────────────
exit 0
