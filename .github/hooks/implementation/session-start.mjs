#!/usr/bin/env node

import {
	createInitialState,
	manifestsDir,
	runHook,
	saveState,
	workflowSummary,
} from "./shared.mjs";

function handleSessionStart(input) {
	const state = createInitialState();
	saveState(input.sessionId, state);

	// Pre-create manifest dir so Implementors have a stable path to write to.
	const mDir = manifestsDir(input.sessionId);

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
				"4. You CANNOT stop until ALL steps are complete — INCLUDING the Finalizer.",
				"5. Pass relevant context from previous agents to the next agent via the prompt.",
				"6. For implementors, try to split work across MULTIPLE parallel implementors when possible.",
				"",
				"MANIFEST PROTOCOL (enforced by hooks):",
				`- Manifest dir for this session: ${mDir}`,
				"- The Planner emits one MANIFEST JSON per implementor task, each with a unique taskId.",
				"- You MUST pass the MANIFEST verbatim (and its manifest dir path) to the corresponding Implementor's prompt.",
				"- Each Implementor MUST write its executed manifest to `<manifestDir>/task-<taskId>.json` as its final action.",
				"- The subagent-stop hook verifies every manifest against the filesystem.",
				"- If any manifest fails verification, the workflow is BLOCKED from advancing. You MUST re-spawn an Implementor for the failed taskId to overwrite its manifest.",
				"",
				"BEGIN: Spawn the Planner agent NOW with the user's task description.",
			].join("\n"),
		},
	};
}

runHook(handleSessionStart);
