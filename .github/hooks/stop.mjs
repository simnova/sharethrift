#!/usr/bin/env node

import {
	MAX_STOP_BLOCKS,
	PHASE_GUIDANCE,
	loadState,
	runHook,
	saveState,
} from "./shared.mjs";

function handleStop(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	if (state.phase === "done") {
		return {};
	}

	// Finalizer is the ONLY way to transition to done — do not auto-complete
	// the workflow just because revision implementors ran. The orchestrator
	// must spawn the Finalizer.

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
		`Finalizer: ${state.finalizerCompleted ? "✓" : "✗"}`,
	].join(" | ");

	return {
		hookSpecificOutput: {
			hookEventName: "Stop",
			decision: "block",
			reason: [
				`[WORKFLOW INCOMPLETE] Cannot stop. Phase: "${state.phase}".`,
				`Progress: ${progressReport}`,
				`Required action: ${guidance}`,
				"You MUST complete all workflow steps before stopping — including the Finalizer.",
			].join("\n"),
		},
	};
}

runHook(handleStop);
