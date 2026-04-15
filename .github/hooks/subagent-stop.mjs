#!/usr/bin/env node

import {
	isDuplicate,
	loadState,
	runHook,
	saveState,
} from "./shared.mjs";

function handleSubagentStop(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	if (isDuplicate(state, input)) {
		saveState(input.sessionId, state);
		return {};
	}

	const agentType = input.agent_type;
	let nextStepGuidance = "";

	if (agentType === "Planner") {
		state.plannerCompleted = true;
		state.phase = "plan_complete";
		nextStepGuidance = [
			"The Planner has completed the implementation plan.",
			"You MUST now spawn one or more Implementor agents.",
			"Split the plan into logical subtasks and assign each to a separate Implementor agent for parallel execution.",
			"Pass the relevant portion of the plan to each Implementor in the prompt.",
		].join(" ");
	} else if (agentType === "Reviewer") {
		state.reviewerCompleted = true;
		state.phase = "review_complete";
		nextStepGuidance = [
			"The Reviewer has completed the code review.",
			"You MUST now spawn one or more Implementor agents to address the review feedback.",
			"Pass the specific feedback items to each Implementor in the prompt.",
			"This is the FINAL implementation pass. After these Implementors complete, the workflow is DONE.",
		].join(" ");
	} else if (agentType === "Implementor") {
		if (state.phase === "implementing" || state.phase === "plan_complete") {
			state.firstPassImplementorsCompleted++;
			if (state.phase === "plan_complete") state.phase = "implementing";
			nextStepGuidance = [
				`Implementor completed (first pass, total completed: ${state.firstPassImplementorsCompleted}).`,
				"You may spawn MORE Implementor agents for remaining tasks,",
				"OR if ALL implementation tasks are done, spawn the Reviewer agent to review the changes.",
			].join(" ");
		} else if (
			state.phase === "revising" ||
			state.phase === "review_complete"
		) {
			state.revisionImplementorsCompleted++;
			if (state.phase === "review_complete") state.phase = "revising";
			nextStepGuidance = [
				`Revision Implementor completed (total completed: ${state.revisionImplementorsCompleted}).`,
				"You may spawn MORE Implementor agents for remaining feedback items,",
				"OR if ALL review feedback has been addressed, you may now STOP the session. The workflow will be complete.",
			].join(" ");
		}
	}

	saveState(input.sessionId, state);

	return {
		hookSpecificOutput: {
			hookEventName: "SubagentStop",
			additionalContext: `[WORKFLOW] ${agentType} agent completed. Phase: "${state.phase}". ${nextStepGuidance}`,
		},
	};
}

runHook(handleSubagentStop);
