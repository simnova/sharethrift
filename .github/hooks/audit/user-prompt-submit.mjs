#!/usr/bin/env node

import { PHASE_GUIDANCE, loadState, runHook } from "./shared.mjs";

function handleUserPromptSubmit(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	return {
		systemMessage: `[Audit phase: ${state.phase}] ${PHASE_GUIDANCE[state.phase]}`,
	};
}

runHook(handleUserPromptSubmit);
