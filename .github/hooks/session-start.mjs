#!/usr/bin/env node

import {
	createInitialState,
	runHook,
	saveState,
	workflowSummary,
} from "./shared.mjs";

function handleSessionStart(input) {
	const state = createInitialState();
	saveState(input.sessionId, state);

	return {
		hookSpecificOutput: {
			hookEventName: "SessionStart",
			additionalContext: [
				"[WORKFLOW ENFORCEMENT ACTIVE]",
				"This session uses a STRICTLY ENFORCED workflow. Hooks will BLOCK any deviation.",
				"",
				workflowSummary(state),
				"CRITICAL RULES:",
				"1. You can ONLY use the runSubagent/agent tool. You have NO other tools.",
				"2. You MUST spawn agents in the EXACT order above.",
				"3. You CANNOT skip steps or reorder them.",
				"4. You CANNOT stop until ALL steps are complete.",
				"5. Pass relevant context from previous agents to the next agent via the prompt.",
				"6. For implementors, try to split work across MULTIPLE parallel implementors when possible.",
				"",
				"BEGIN: Spawn the Planner agent NOW with the user's task description.",
			].join("\n"),
		},
	};
}

runHook(handleSessionStart);
