#!/usr/bin/env node

import {
	PHASE_ALLOWED_AGENTS,
	PHASE_GUIDANCE,
	VALID_AGENTS,
	analyzerReportStatus,
	extractAgentName,
	isDuplicate,
	isSubagentTool,
	loadState,
	runHook,
	saveState,
	summarizeAnalyzerStatus,
} from "./shared.mjs";

function denyOutOfPhase(state, agentName) {
	const allowed = PHASE_ALLOWED_AGENTS[state.phase] || [];
	if (allowed.length === 0) {
		return {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: [
					`[AUDIT BLOCKED] Cannot spawn any agent during phase "${state.phase}".`,
					PHASE_GUIDANCE[state.phase],
				].join(" "),
			},
		};
	}
	if (agentName && !allowed.includes(agentName)) {
		return {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: [
					`[AUDIT BLOCKED] Cannot spawn "${agentName}" during phase "${state.phase}".`,
					`Allowed agents: [${allowed.join(", ")}].`,
					PHASE_GUIDANCE[state.phase],
				].join(" "),
			},
		};
	}
	if (agentName && !VALID_AGENTS.includes(agentName)) {
		return {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: `[AUDIT BLOCKED] Unknown agent "${agentName}". Valid: [${VALID_AGENTS.join(", ")}].`,
			},
		};
	}
	return null;
}

function denyIfReportGate(state, agentName, sessionId) {
	if (agentName !== "Synthesizer") return null;
	if (state.phase !== "analyzing") return null;

	const status = analyzerReportStatus(sessionId);
	if (status.missing.length === 0) return null;

	return {
		hookSpecificOutput: {
			hookEventName: "PreToolUse",
			permissionDecision: "deny",
			permissionDecisionReason: [
				"[AUDIT BLOCKED] Cannot spawn Synthesizer — analyzer reports missing.",
				summarizeAnalyzerStatus(status),
				"You MUST spawn the missing analyzer(s) first.",
			].join("\n"),
		},
	};
}

function handlePreToolUse(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	const toolName = input.tool_name || "";
	if (!isSubagentTool(toolName)) return {};

	if (isDuplicate(state, input)) {
		saveState(input.sessionId, state);
		return {};
	}

	const agentName = extractAgentName(input.tool_input);

	const phaseDeny = denyOutOfPhase(state, agentName);
	if (phaseDeny) {
		saveState(input.sessionId, state);
		return phaseDeny;
	}

	const reportDeny = denyIfReportGate(state, agentName, input.sessionId);
	if (reportDeny) {
		saveState(input.sessionId, state);
		return reportDeny;
	}

	saveState(input.sessionId, state);
	return {
		hookSpecificOutput: {
			hookEventName: "PreToolUse",
			permissionDecision: "allow",
			additionalContext: `[AUDIT OK] Spawning "${agentName}" is permitted in phase "${state.phase}".`,
		},
	};
}

runHook(handlePreToolUse);
