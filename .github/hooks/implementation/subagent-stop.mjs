#!/usr/bin/env node

import {
	countManifestsByPhase,
	isDuplicate,
	loadState,
	runHook,
	saveState,
	summarizeManifestFailures,
	verifyPendingManifests,
} from "./shared.mjs";

function handlePlannerStop(state) {
	state.plannerCompleted = true;
	state.phase = "plan_complete";
	return [
		"The Planner has completed the implementation plan.",
		"You MUST now spawn one or more Implementor agents.",
		"The plan contains per-task MANIFEST blocks. Copy each MANIFEST into the prompt of its assigned Implementor, along with a unique TASK_ID.",
		"Every Implementor MUST write its manifest to the manifest dir — the hook will verify it against the filesystem before the workflow can advance.",
	].join(" ");
}

function handleReviewerStop(state) {
	state.reviewerCompleted = true;
	state.phase = "review_complete";
	return [
		"The Reviewer has completed the code review.",
		"You MUST now spawn one or more Implementor agents to address the review feedback.",
		"Each revision Implementor MUST receive a unique TASK_ID and a MANIFEST block. The hook will verify the manifest against the filesystem.",
	].join(" ");
}

function handleFinalizerStop(state) {
	state.finalizerCompleted = true;
	state.phase = "done";
	return "The Finalizer has completed. The workflow is DONE. Stop now.";
}

function handleFirstPassImplementorStop(state, results, counts, failureSummary) {
	state.firstPassImplementorsCompleted++;
	if (state.phase === "plan_complete") state.phase = "implementing";

	if (results.failed.length > 0) {
		return [
			`[VERIFICATION FAILED] ${results.failed.length} manifest(s) did NOT match the filesystem.`,
			`Failures:\n${failureSummary}`,
			"You MUST spawn Implementor agent(s) to re-do the failed task(s). Pass the SAME TASK_ID and MANIFEST so the manifest file is overwritten on success.",
			"You are BLOCKED from spawning the Reviewer until every manifest has status='verified'.",
		].join("\n");
	}

	if (results.verified.length > 0) {
		return [
			`Implementor completed and manifest verified (first-pass verified: ${counts.verified}, pending: ${counts.pending}, failed: ${counts.failed}).`,
			"You may spawn MORE Implementor agents for remaining tasks, OR if ALL first-pass tasks are done and verified, spawn the Reviewer.",
		].join(" ");
	}

	state.hasFailedManifests = true;
	state.lastFailureSummary = "Implementor stopped without writing a manifest.";
	return [
		"[VERIFICATION WARNING] The Implementor stopped WITHOUT writing a manifest file.",
		"Every Implementor is REQUIRED to write a manifest. Re-spawn this Implementor with clearer instructions to write the manifest as its final step.",
		"You are BLOCKED from spawning the Reviewer until at least one verified manifest exists for this pass.",
	].join(" ");
}

function handleRevisionImplementorStop(state, results, counts, failureSummary) {
	state.revisionImplementorsCompleted++;
	if (state.phase === "review_complete") state.phase = "revising";

	if (results.failed.length > 0) {
		return [
			`[VERIFICATION FAILED] ${results.failed.length} revision manifest(s) did NOT match the filesystem.`,
			`Failures:\n${failureSummary}`,
			"You MUST spawn Implementor agent(s) to re-do the failed task(s). Pass the SAME TASK_ID and MANIFEST.",
			"You are BLOCKED from spawning the Finalizer until every revision manifest has status='verified'.",
		].join("\n");
	}

	return [
		`Revision Implementor completed and manifest verified (revision verified: ${counts.verified}, pending: ${counts.pending}, failed: ${counts.failed}).`,
		"You may spawn MORE Implementor agents for remaining feedback items, OR once ALL revision manifests are verified, spawn the Finalizer to run lint/build/tests.",
	].join(" ");
}

function handleImplementorStop(state, sessionId, cwd) {
	const results = verifyPendingManifests(sessionId, cwd);
	const failureSummary = summarizeManifestFailures(results.failed);
	state.hasFailedManifests = results.failed.length > 0;
	state.lastFailureSummary = failureSummary;

	const phaseKey =
		state.phase === "implementing" || state.phase === "plan_complete"
			? "first_pass"
			: "revision";
	const counts = countManifestsByPhase(sessionId, phaseKey);

	if (state.phase === "implementing" || state.phase === "plan_complete") {
		return handleFirstPassImplementorStop(
			state,
			results,
			counts,
			failureSummary,
		);
	}
	if (state.phase === "revising" || state.phase === "review_complete") {
		return handleRevisionImplementorStop(
			state,
			results,
			counts,
			failureSummary,
		);
	}
	return "";
}

const AGENT_HANDLERS = {
	Planner: (state) => handlePlannerStop(state),
	Reviewer: (state) => handleReviewerStop(state),
	Finalizer: (state) => handleFinalizerStop(state),
	Implementor: (state, input) =>
		handleImplementorStop(state, input.sessionId, input.cwd || process.cwd()),
};

function handleSubagentStop(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	if (isDuplicate(state, input)) {
		saveState(input.sessionId, state);
		return {};
	}

	const agentType = input.agent_type;
	const handler = AGENT_HANDLERS[agentType];
	const nextStepGuidance = handler ? handler(state, input) : "";

	saveState(input.sessionId, state);

	return {
		hookSpecificOutput: {
			hookEventName: "SubagentStop",
			additionalContext: `[WORKFLOW] ${agentType} agent completed. Phase: "${state.phase}". ${nextStepGuidance}`,
		},
	};
}

runHook(handleSubagentStop);
