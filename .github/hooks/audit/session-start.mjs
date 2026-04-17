#!/usr/bin/env node

import {
	AUDIT_ANALYZERS,
	createInitialState,
	reportsDir,
	runHook,
	saveState,
	workflowSummary,
} from "./shared.mjs";

function handleSessionStart(input) {
	const state = createInitialState();
	saveState(input.sessionId, state);

	const rDir = reportsDir(input.sessionId);

	return {
		hookSpecificOutput: {
			hookEventName: "SessionStart",
			additionalContext: [
				"[AUDIT WORKFLOW ENFORCEMENT ACTIVE]",
				"This session uses a STRICTLY ENFORCED audit workflow. Hooks will BLOCK any deviation.",
				"",
				workflowSummary(state),
				"CRITICAL RULES:",
				"1. You can ONLY use the runSubagent/agent tool. You have NO other tools.",
				"2. You MUST spawn agents in the EXACT order above.",
				"3. You CANNOT skip steps or reorder them.",
				"4. You CANNOT advance to the Synthesizer until every analyzer has written its report.",
				"5. You CANNOT stop until the Publisher completes.",
				"6. Pass relevant context from previous agents to the next agent via the prompt.",
				"7. Spawn ALL analyzers in parallel in a single response.",
				"",
				"REPORT PROTOCOL (enforced by hooks):",
				`- Reports dir for this session: ${rDir}`,
				`- Expected analyzer reports: ${AUDIT_ANALYZERS.map((a) => `${a}.json`).join(", ")}`,
				"- The Scoper MUST write `<reportsDir>/scope.json` as its final action.",
				"- You MUST pass `REPORTS_DIR` and `SCOPE_PATH=<reportsDir>/scope.json` to every analyzer.",
				"- Each analyzer MUST write its report to `<reportsDir>/<AgentName>.json` as its final action.",
				"- `DependencySecurity`, `PracticeCompliance`, and `DocumentationDx` MAY apply safe mechanical fixes, but MUST record every changed path in `appliedFixes` in their report.",
				"- `CodeQuality`, `TestQuality`, and `Performance` are report-only and MUST NOT modify repo files.",
				"- The subagent-stop hook verifies every expected report is present before allowing the Synthesizer to spawn.",
				"- After the Synthesizer writes the audit markdown, the Publisher MUST create a branch, commit, push, and pull request for that audit plus any files listed in analyzer `appliedFixes`.",
				"- If an analyzer skipped/errored but wrote a valid report (status='skipped'|'error'), that's OK — the Synthesizer handles it. A MISSING report file is a BLOCKER.",
				"",
				"BEGIN: Spawn the Scoper agent NOW with the user's audit request.",
			].join("\n"),
		},
	};
}

runHook(handleSessionStart);
