#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
WORK_DIR="${REPO_ROOT}/.agents-work/current"
GATE_SCRIPT="${SCRIPT_DIR}/check-gate.sh"

INPUT="$(cat)"

PARSED="$(
  printf '%s' "$INPUT" | python3 -c '
import json
import sys

def walk_strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for nested in value.values():
            yield from walk_strings(nested)
    elif isinstance(value, list):
        for nested in value:
            yield from walk_strings(nested)

try:
    payload = json.load(sys.stdin)
except Exception:
    print("")
    print("")
    raise SystemExit(0)

tool_name = str(payload.get("toolName", "")).strip().lower()
tool_args_raw = payload.get("toolArgs", "")

haystacks = []
if isinstance(tool_args_raw, str):
    haystacks.append(tool_args_raw.lower())
    try:
        tool_args = json.loads(tool_args_raw)
    except Exception:
        tool_args = None
else:
    tool_args = tool_args_raw

if tool_args is not None:
    for item in walk_strings(tool_args):
        haystacks.append(item.lower())

search_blob = "\n".join(haystacks)

agent_name = ""
for candidate in (
    "implementer-research",
    "validator",
    "implementer",
    "planner",
    "reviewer",
    "security",
    "orchestrator",
):
    if candidate in search_blob:
        agent_name = candidate
        break

print(tool_name)
print(agent_name)
'
)"

TOOL_NAME="$(printf '%s\n' "$PARSED" | sed -n '1p')"
AGENT_NAME="$(printf '%s\n' "$PARSED" | sed -n '2p')"

deny() {
  local reason="$1"

  python3 -c '
import json
import sys

print(json.dumps({
    "permissionDecision": "deny",
    "permissionDecisionReason": sys.argv[1],
}))
' "$reason"
  exit 0
}

# ── Git commit/push guard ────────────────────────────────────────────────────
# Intercept execute/bash tool calls that contain git commit or git push.
# Deny unless review.ok exists — code must be reviewed before committing.

if [[ "$TOOL_NAME" == "execute" || "$TOOL_NAME" == "bash" || "$TOOL_NAME" == "shell" ]]; then
  SEARCH_BLOB="$(printf '%s\n' "$PARSED" | sed -n '2p')"

  # Re-parse: for execute/bash, the interesting content is in the full args blob
  CMD_BLOB="$(
    printf '%s' "$INPUT" | python3 -c '
import json, sys
try:
    payload = json.load(sys.stdin)
except Exception:
    raise SystemExit(0)
args = payload.get("toolArgs", "")
if isinstance(args, dict):
    blob = " ".join(str(v) for v in args.values())
else:
    blob = str(args)
print(blob.lower())
'
  )"

  mkdir -p "$WORK_DIR"

  if printf '%s' "$CMD_BLOB" | grep -qE 'git\s+(commit|push)'; then
    if [[ ! -f "$WORK_DIR/review.ok" ]]; then
      deny "git commit/push blocked: review.ok must exist before committing or pushing. Run the full workflow: implement → review → security → validate → commit."
    fi
  fi

  # Not a blocked git command — allow
  exit 0
fi

# ── Agent delegation guard ───────────────────────────────────────────────────
# Only intercept agent/custom-agent tool calls from here on.

if [[ "$TOOL_NAME" != "agent" && "$TOOL_NAME" != "custom-agent" ]]; then
  exit 0
fi

mkdir -p "$WORK_DIR"

# ── Workflow sequencing ──────────────────────────────────────────────────────
# After implementation, force the orchestrator through reviewer → security
# in order. Without this, the orchestrator could stop after implementation
# and never spawn review or security agents.
#
# Rules:
#   - If implementer.done exists AND review.ok doesn't → only reviewer
#     (or implementer for fix loops) is allowed
#   - If review.ok exists AND security.ok doesn't → only security
#     (or implementer/reviewer for fix loops) is allowed
#   - Planner is always allowed (resets everything)
#   - Helper agents (implementer-research, validator) are always allowed

if [[ "$AGENT_NAME" != "planner" \
   && "$AGENT_NAME" != "implementer-research" \
   && "$AGENT_NAME" != "validator" \
   && "$AGENT_NAME" != "orchestrator" \
   && "$AGENT_NAME" != "" ]]; then

  if [[ -f "$WORK_DIR/implementer.done" && ! -f "$WORK_DIR/review.ok" && ! -f "$WORK_DIR/review.blocked" ]]; then
    # Implementation done, review hasn't run yet
    if [[ "$AGENT_NAME" != "reviewer" && "$AGENT_NAME" != "implementer" ]]; then
      deny "Workflow sequencing: reviewer must run after implementation. Delegate to reviewer next. (implementer.done exists but review.ok does not)"
    fi
  fi

  if [[ -f "$WORK_DIR/review.ok" && ! -f "$WORK_DIR/security.ok" && ! -f "$WORK_DIR/security.blocked" ]]; then
    # Review passed, security hasn't run yet
    if [[ "$AGENT_NAME" != "security" && "$AGENT_NAME" != "implementer" && "$AGENT_NAME" != "reviewer" ]]; then
      deny "Workflow sequencing: security must run after review. Delegate to security next. (review.ok exists but security.ok does not)"
    fi
  fi
fi

# ── Per-agent gate checks ───────────────────────────────────────────────────

case "$AGENT_NAME" in
  planner)
    # Reset all checkpoints — fresh planning cycle
    rm -f \
      "$WORK_DIR/plan.md" \
      "$WORK_DIR/plan.approved" \
      "$WORK_DIR/review.ok" \
      "$WORK_DIR/review.blocked" \
      "$WORK_DIR/security.ok" \
      "$WORK_DIR/security.blocked" \
      "$WORK_DIR/validation.ok" \
      "$WORK_DIR/implementer.done" \
      "$WORK_DIR/notes.md"
    printf 'full\n' > "$WORK_DIR/workflow.mode"
    ;;
  implementer)
    # Require workflow.mode to exist — forces orchestrator to either
    # delegate to planner first (writes "full") or explicitly write "lean"
    if [[ ! -f "$WORK_DIR/workflow.mode" ]]; then
      deny "Implementer blocked: workflow.mode must exist. Delegate to planner first (sets mode=full) or write workflow.mode=lean for trivial changes."
    fi

    MODE="$(tr -d '[:space:]' < "$WORK_DIR/workflow.mode")"

    if [[ "$MODE" == "lean" ]]; then
      if ! OUTPUT="$(bash "$GATE_SCRIPT" pre-implement --lean 2>&1)"; then
        deny "Workflow gate blocked implementer delegation: ${OUTPUT}"
      fi
    else
      if ! OUTPUT="$(bash "$GATE_SCRIPT" pre-implement 2>&1)"; then
        deny "Workflow gate blocked implementer delegation: ${OUTPUT}"
      fi
    fi

    # Clear downstream checkpoints — fresh review/security cycle
    rm -f \
      "$WORK_DIR/review.ok" \
      "$WORK_DIR/review.blocked" \
      "$WORK_DIR/security.ok" \
      "$WORK_DIR/security.blocked" \
      "$WORK_DIR/validation.ok" \
      "$WORK_DIR/implementer.done"

    # Mark that implementer has been dispatched — postToolUse or the
    # implementer itself isn't needed; the fact that we allowed this
    # delegation means implementation is in progress. We write the
    # marker now; if the implementer fails, the orchestrator re-delegates
    # (which clears and re-writes this marker).
    touch "$WORK_DIR/implementer.done"
    ;;
  reviewer)
    if ! OUTPUT="$(bash "$GATE_SCRIPT" pre-review 2>&1)"; then
      deny "Workflow gate blocked reviewer delegation: ${OUTPUT}"
    fi
    ;;
  security)
    if ! OUTPUT="$(bash "$GATE_SCRIPT" pre-security 2>&1)"; then
      deny "Workflow gate blocked security delegation: ${OUTPUT}"
    fi
    ;;
  implementer-research|validator)
    # Helper agents — no gate required, read-only work
    ;;
  orchestrator)
    # Self-delegation — no gate required
    ;;
esac
