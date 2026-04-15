#!/usr/bin/env node

import {
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

	if (agentType === "Planner" && state.phase === "init") {
		state.phase = "planning";
	} else if (agentType === "Implementor" && state.phase === "plan_complete") {
		state.phase = "implementing";
	} else if (agentType === "Reviewer" && state.phase === "implementing") {
		state.phase = "reviewing";
	} else if (agentType === "Implementor" && state.phase === "review_complete") {
		state.phase = "revising";
	}

	saveState(input.sessionId, state);

	return {
		hookSpecificOutput: {
			hookEventName: "SubagentStart",
			additionalContext: `[WORKFLOW] ${agentType} agent started. Phase is now: "${state.phase}".`,
		},
	};
}

runHook(handleSubagentStart);
