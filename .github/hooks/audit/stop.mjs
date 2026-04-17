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

	if (state.phase === "done") return {};

	state.stopBlockCount++;

	if (input.stop_hook_active && state.stopBlockCount >= MAX_STOP_BLOCKS) {
		state.phase = "done";
		saveState(input.sessionId, state);
		return {};
	}

	saveState(input.sessionId, state);

	const progress = [
		`Scoper: ${state.scoperCompleted ? "✓" : "✗"}`,
		`Analyzers completed: ${state.analyzersCompleted.length}`,
		`Synthesizer: ${state.synthesizerCompleted ? "✓" : "✗"}`,
		`Publisher: ${state.publisherCompleted ? "✓" : "✗"}`,
	].join(" | ");

	return {
		hookSpecificOutput: {
			hookEventName: "Stop",
			decision: "block",
			reason: [
				`[AUDIT INCOMPLETE] Cannot stop. Phase: "${state.phase}".`,
				`Progress: ${progress}`,
				`Required action: ${PHASE_GUIDANCE[state.phase]}`,
				"The audit is not complete until the Publisher finishes.",
			].join("\n"),
		},
	};
}

runHook(handleStop);
