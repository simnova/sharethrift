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

if [[ "$TOOL_NAME" != "agent" && "$TOOL_NAME" != "custom-agent" ]]; then
  exit 0
fi

mkdir -p "$WORK_DIR"

case "$AGENT_NAME" in
  planner)
    rm -f \
      "$WORK_DIR/plan.md" \
      "$WORK_DIR/plan.approved" \
      "$WORK_DIR/review.ok" \
      "$WORK_DIR/review.blocked" \
      "$WORK_DIR/security.ok" \
      "$WORK_DIR/security.blocked" \
      "$WORK_DIR/validation.ok" \
      "$WORK_DIR/notes.md"
    printf 'full\n' > "$WORK_DIR/workflow.mode"
    ;;
  implementer)
    MODE=""
    if [[ -f "$WORK_DIR/workflow.mode" ]]; then
      MODE="$(tr -d '[:space:]' < "$WORK_DIR/workflow.mode")"
    fi

    if [[ "$MODE" == "lean" ]]; then
      if ! OUTPUT="$(bash "$GATE_SCRIPT" pre-implement --lean 2>&1)"; then
        deny "Workflow gate blocked implementer delegation: ${OUTPUT}"
      fi
    else
      if ! OUTPUT="$(bash "$GATE_SCRIPT" pre-implement 2>&1)"; then
        deny "Workflow gate blocked implementer delegation: ${OUTPUT}"
      fi
    fi

    rm -f \
      "$WORK_DIR/review.ok" \
      "$WORK_DIR/review.blocked" \
      "$WORK_DIR/security.ok" \
      "$WORK_DIR/security.blocked" \
      "$WORK_DIR/validation.ok"
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
esac
