#!/usr/bin/env node

import {
	PHASE_ALLOWED_AGENTS,
	PHASE_GUIDANCE,
	VALID_AGENTS,
	countManifestsByPhase,
	extractAgentName,
	isDuplicate,
	isSubagentTool,
	loadState,
	runHook,
	saveState,
} from "./shared.mjs";

function denyOutOfPhase(state, agentName) {
	const allowed = PHASE_ALLOWED_AGENTS[state.phase] || [];
	if (allowed.length === 0) {
		return {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: [
					`[WORKFLOW BLOCKED] Cannot spawn any agent during phase "${state.phase}".`,
					PHASE_GUIDANCE[state.phase],
				].join(" "),
				additionalContext: `Phase: ${state.phase}. ${PHASE_GUIDANCE[state.phase]}`,
			},
		};
	}
	if (agentName && !allowed.includes(agentName)) {
		return {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: [
					`[WORKFLOW BLOCKED] Cannot spawn "${agentName}" during phase "${state.phase}".`,
					`Allowed agents for this phase: [${allowed.join(", ")}].`,
					PHASE_GUIDANCE[state.phase],
				].join(" "),
				additionalContext: `Phase: ${state.phase}. ONLY these agents are allowed: [${allowed.join(", ")}]. ${PHASE_GUIDANCE[state.phase]}`,
			},
		};
	}
	if (agentName && !VALID_AGENTS.includes(agentName)) {
		return {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: `[WORKFLOW BLOCKED] Unknown agent "${agentName}". Only valid agents are: [${VALID_AGENTS.join(", ")}].`,
			},
		};
	}
	return null;
}

function denyIfManifestGate(state, agentName, sessionId) {
	// Block Reviewer while first-pass manifests have failures or are missing.
	if (state.phase === "implementing" && agentName === "Reviewer") {
		const counts = countManifestsByPhase(sessionId, "first_pass");
		if (counts.failed > 0 || counts.pending > 0 || counts.total === 0) {
			return {
				hookSpecificOutput: {
					hookEventName: "PreToolUse",
					permissionDecision: "deny",
					permissionDecisionReason: [
						`[WORKFLOW BLOCKED] Cannot spawn Reviewer — first-pass manifests not all verified.`,
						`Manifest state: verified=${counts.verified}, pending=${counts.pending}, failed=${counts.failed}, total=${counts.total}.`,
						state.lastFailureSummary
							? `Last failures:\n${state.lastFailureSummary}`
							: "",
						"You MUST spawn Implementor(s) to fix the failed/missing manifests before the Reviewer can run.",
					]
						.filter(Boolean)
						.join("\n"),
				},
			};
		}
	}

	// Block Finalizer while revision manifests have failures or are missing.
	if (state.phase === "revising" && agentName === "Finalizer") {
		const counts = countManifestsByPhase(sessionId, "revision");
		if (counts.failed > 0 || counts.pending > 0 || counts.total === 0) {
			return {
				hookSpecificOutput: {
					hookEventName: "PreToolUse",
					permissionDecision: "deny",
					permissionDecisionReason: [
						`[WORKFLOW BLOCKED] Cannot spawn Finalizer — revision manifests not all verified.`,
						`Manifest state: verified=${counts.verified}, pending=${counts.pending}, failed=${counts.failed}, total=${counts.total}.`,
						state.lastFailureSummary
							? `Last failures:\n${state.lastFailureSummary}`
							: "",
						"You MUST spawn Implementor(s) to fix the failed/missing manifests before the Finalizer can run.",
					]
						.filter(Boolean)
						.join("\n"),
				},
			};
		}
	}

	return null;
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

	const manifestDeny = denyIfManifestGate(state, agentName, input.sessionId);
	if (manifestDeny) {
		saveState(input.sessionId, state);
		return manifestDeny;
	}

	saveState(input.sessionId, state);
	return {
		hookSpecificOutput: {
			hookEventName: "PreToolUse",
			permissionDecision: "allow",
			additionalContext: `[WORKFLOW OK] Spawning "${agentName}" is permitted in phase "${state.phase}".`,
		},
	};
}

runHook(handlePreToolUse);
