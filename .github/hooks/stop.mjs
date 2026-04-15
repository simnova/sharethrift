#!/usr/bin/env node

import {
	loadState,
	MAX_STOP_BLOCKS,
	PHASE_GUIDANCE,
	runHook,
	saveState,
} from "./shared.mjs";

function handleStop(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	if (state.phase === "done") {
		return {};
	}

	if (state.phase === "revising" && state.revisionImplementorsCompleted > 0) {
		state.phase = "done";
		saveState(input.sessionId, state);
		return {};
	}

	state.stopBlockCount++;

	if (input.stop_hook_active) {
		saveState(input.sessionId, state);

		if (state.stopBlockCount >= MAX_STOP_BLOCKS) {
			state.phase = "done";
			saveState(input.sessionId, state);
			return {};
		}
	}

	saveState(input.sessionId, state);

	const guidance = PHASE_GUIDANCE[state.phase];
	const progressReport = [
		`Planner: ${state.plannerCompleted ? "✓" : "✗"}`,
		`Implementors (pass 1): ${state.firstPassImplementorsCompleted} completed`,
		`Reviewer: ${state.reviewerCompleted ? "✓" : "✗"}`,
		`Implementors (revision): ${state.revisionImplementorsCompleted} completed`,
	].join(" | ");

	return {
		hookSpecificOutput: {
			hookEventName: "Stop",
			decision: "block",
			reason: [
				`[WORKFLOW INCOMPLETE] Cannot stop. Phase: "${state.phase}".`,
				`Progress: ${progressReport}`,
				`Required action: ${guidance}`,
				"You MUST complete all workflow steps before stopping.",
			].join("\n"),
		},
	};
}

runHook(handleStop);
