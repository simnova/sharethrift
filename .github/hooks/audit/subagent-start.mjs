#!/usr/bin/env node

import {
	AUDIT_ANALYZERS,
	isDuplicate,
	loadState,
	runHook,
	saveState,
} from "./shared.mjs";

function handleSubagentStart(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	if (isDuplicate(state, input)) {
		saveState(input.sessionId, state);
		return {};
	}

	const agentType = input.agent_type;

	if (agentType === "Scoper" && state.phase === "init") {
		state.phase = "scoping";
	} else if (
		AUDIT_ANALYZERS.includes(agentType) &&
		state.phase === "scoping_complete"
	) {
		state.phase = "analyzing";
	} else if (
		agentType === "Synthesizer" &&
		state.phase === "analyzing"
	) {
		state.phase = "synthesizing";
	}

	saveState(input.sessionId, state);

	return {
		hookSpecificOutput: {
			hookEventName: "SubagentStart",
			additionalContext: `[AUDIT] ${agentType} agent started. Phase is now: "${state.phase}".`,
		},
	};
}

runHook(handleSubagentStart);
