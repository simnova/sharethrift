#!/usr/bin/env node

import {
	extractAgentName,
	isDuplicate,
	isSubagentTool,
	loadState,
	PHASE_ALLOWED_AGENTS,
	PHASE_GUIDANCE,
	runHook,
	saveState,
	VALID_AGENTS,
} from "./shared.mjs";

function handlePreToolUse(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	const toolName = input.tool_name || "";

	if (!isSubagentTool(toolName)) {
		return {};
	}

	if (isDuplicate(state, input)) {
		saveState(input.sessionId, state);
		return {};
	}

	const agentName = extractAgentName(input.tool_input);
	const allowed = PHASE_ALLOWED_AGENTS[state.phase] || [];

	if (allowed.length === 0) {
		saveState(input.sessionId, state);
		return {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: [
					`[WORKFLOW BLOCKED] Cannot spawn any agent during phase "${state.phase}".`,
					PHASE_GUIDANCE[state.phase],
				].join(" "),
				additionalContext: `Phase: ${state.phase}. ${PHASE_GUIDANCE[state.phase]}`,
			},
		};
	}

	if (agentName && !allowed.includes(agentName)) {
		saveState(input.sessionId, state);
		return {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: [
					`[WORKFLOW BLOCKED] Cannot spawn "${agentName}" during phase "${state.phase}".`,
					`Allowed agents for this phase: [${allowed.join(", ")}].`,
					PHASE_GUIDANCE[state.phase],
				].join(" "),
				additionalContext: `Phase: ${state.phase}. ONLY these agents are allowed: [${allowed.join(", ")}]. ${PHASE_GUIDANCE[state.phase]}`,
			},
		};
	}

	if (agentName && !VALID_AGENTS.includes(agentName)) {
		saveState(input.sessionId, state);
		return {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: `[WORKFLOW BLOCKED] Unknown agent "${agentName}". Only valid agents are: [${VALID_AGENTS.join(", ")}].`,
			},
		};
	}

	saveState(input.sessionId, state);
	return {
		hookSpecificOutput: {
			hookEventName: "PreToolUse",
			permissionDecision: "allow",
			additionalContext: `[WORKFLOW OK] Spawning "${agentName}" is permitted in phase "${state.phase}".`,
		},
	};
}

runHook(handlePreToolUse);
