#!/usr/bin/env node

import {
	loadState,
	PHASE_GUIDANCE,
	runHook,
} from "./shared.mjs";

function handleUserPromptSubmit(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	return {
		systemMessage: `[Workflow phase: ${state.phase}] ${PHASE_GUIDANCE[state.phase]}`,
	};
}

runHook(handleUserPromptSubmit);
