#!/usr/bin/env node

import {
	AUDIT_ANALYZERS,
	analyzerReportStatus,
	isDuplicate,
	loadState,
	runHook,
	saveState,
	summarizeAnalyzerStatus,
} from "./shared.mjs";

function handleScoperStop(state) {
	state.scoperCompleted = true;
	state.phase = "scoping_complete";
	return [
		"The Scoper has completed.",
		`You MUST now spawn ALL analyzer agents in parallel: ${AUDIT_ANALYZERS.join(", ")}.`,
		"Each analyzer MUST write its report to the reports dir.",
		"The hook verifies report files; you are BLOCKED from spawning the Synthesizer until every analyzer has a report on disk.",
	].join(" ");
}

function handleAnalyzerStop(state, agentType, sessionId) {
	if (!state.analyzersCompleted.includes(agentType)) {
		state.analyzersCompleted.push(agentType);
	}
	if (state.phase === "scoping_complete") state.phase = "analyzing";

	const status = analyzerReportStatus(sessionId);
	const summary = summarizeAnalyzerStatus(status);

	if (status.missing.length > 0) {
		return [
			`${agentType} stopped. Report state:\n${summary}`,
			"You MUST spawn the missing analyzer(s) — they did not write a report. You are BLOCKED from spawning the Synthesizer.",
		].join("\n");
	}

	return [
		`${agentType} stopped and all analyzer reports are present.\n${summary}`,
		"You may now spawn the Synthesizer.",
	].join("\n");
}

function handleSynthesizerStop(state) {
	state.synthesizerCompleted = true;
	state.phase = "synthesis_complete";
	return [
		"The Synthesizer has completed and the audit markdown is ready.",
		"You MUST now spawn the Publisher agent.",
		"The Publisher creates the audit branch, commit, push, and pull request.",
	].join(" ");
}

function handlePublisherStop(state) {
	state.publisherCompleted = true;
	state.phase = "done";
	return "The Publisher has completed. The audit workflow is DONE. Stop the session now.";
}

function handleSubagentStop(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	if (isDuplicate(state, input)) {
		saveState(input.sessionId, state);
		return {};
	}

	const agentType = input.agent_type;
	let guidance = "";

	if (agentType === "Scoper") {
		guidance = handleScoperStop(state);
	} else if (AUDIT_ANALYZERS.includes(agentType)) {
		guidance = handleAnalyzerStop(state, agentType, input.sessionId);
	} else if (agentType === "Synthesizer") {
		guidance = handleSynthesizerStop(state);
	} else if (agentType === "Publisher") {
		guidance = handlePublisherStop(state);
	}

	saveState(input.sessionId, state);

	return {
		hookSpecificOutput: {
			hookEventName: "SubagentStop",
			additionalContext: `[AUDIT] ${agentType} agent completed. Phase: "${state.phase}". ${guidance}`,
		},
	};
}

runHook(handleSubagentStop);
