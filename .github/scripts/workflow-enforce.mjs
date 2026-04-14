#!/usr/bin/env node

/**
 * Workflow Enforcement Script for Copilot CLI Orchestrator
 *
 * Enforces a strict state machine workflow:
 *   init → planning → plan_complete → implementing → reviewing → review_complete → revising → done
 *
 * Called by agent-scoped hooks on the Orchestrator agent.
 * Reads JSON from stdin, writes JSON to stdout.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ── Constants ───────────────────────────────────────────────────────────────

const VALID_AGENTS = ["Planner", "Implementor", "Reviewer"];
const MAX_STOP_BLOCKS = 3; // Safety valve to prevent infinite loops

/** Which agents are allowed to be spawned in each phase */
const PHASE_ALLOWED_AGENTS = {
	init: ["Planner"],
	planning: [], // Planner is running, nothing else allowed
	plan_complete: ["Implementor"],
	implementing: ["Implementor", "Reviewer"], // More implementors or transition to review
	reviewing: [], // Reviewer is running, nothing else allowed
	review_complete: ["Implementor"],
	revising: ["Implementor"], // More revision implementors allowed
	done: [], // Nothing allowed
};

/** Human-readable guidance for each phase */
const PHASE_GUIDANCE = {
	init: "You MUST spawn the Planner agent FIRST. No other action is allowed.",
	planning:
		"The Planner agent is running. WAIT for it to complete before doing anything else.",
	plan_complete:
		"The plan is ready. You MUST now spawn one or more Implementor agents to execute the plan. Each implementor should receive a specific subset of the plan.",
	implementing:
		"Implementor(s) are working. You may spawn additional Implementor agents for more tasks, OR spawn the Reviewer agent once all implementation is complete.",
	reviewing:
		"The Reviewer agent is running. WAIT for it to complete before doing anything else.",
	review_complete:
		"Review feedback is ready. You MUST now spawn one or more Implementor agents to address the review feedback. Pass the specific feedback items to each implementor.",
	revising:
		"Revision Implementor(s) are working on review feedback. You may spawn additional Implementor agents for more feedback items. Once all revisions are complete, you may stop.",
	done: "Workflow is COMPLETE. You should stop now.",
};

// ── State Management ────────────────────────────────────────────────────────

function stateDir() {
	const dir = join(tmpdir(), "copilot-workflow-state");
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	return dir;
}

function stateFilePath(sessionId) {
	// Sanitize sessionId to prevent path traversal
	const safeId = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
	return join(stateDir(), `${safeId}.json`);
}

function loadState(sessionId) {
	const filePath = stateFilePath(sessionId);
	if (existsSync(filePath)) {
		return JSON.parse(readFileSync(filePath, "utf8"));
	}
	return null;
}

function saveState(sessionId, state) {
	writeFileSync(stateFilePath(sessionId), JSON.stringify(state, null, 2));
}

function createInitialState() {
	return {
		phase: "init",
		active: true,
		plannerCompleted: false,
		firstPassImplementorsCompleted: 0,
		reviewerCompleted: false,
		revisionImplementorsCompleted: 0,
		stopBlockCount: 0,
		processedEvents: [],
	};
}

// ── Deduplication ───────────────────────────────────────────────────────────

function eventKey(input) {
	const name = input.hookEventName;
	if (input.tool_use_id) return `${name}:${input.tool_use_id}`;
	if (input.agent_id) return `${name}:${input.agent_id}`;
	return name;
}

function isDuplicate(state, input) {
	const key = eventKey(input);
	// SessionStart and Stop are singletons - allow re-processing
	if (
		input.hookEventName === "SessionStart" ||
		input.hookEventName === "Stop"
	)
		return false;
	if (state.processedEvents.includes(key)) return true;
	state.processedEvents.push(key);
	// Keep event log bounded
	if (state.processedEvents.length > 100) {
		state.processedEvents = state.processedEvents.slice(-50);
	}
	return false;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractAgentName(toolInput) {
	if (!toolInput) return null;
	// Handle various possible field names from different tool implementations
	return (
		toolInput.agentName ||
		toolInput.agent ||
		toolInput.name ||
		toolInput.agent_name ||
		null
	);
}

function isSubagentTool(toolName) {
	if (!toolName) return false;
	const lower = toolName.toLowerCase();
	return (
		lower.includes("agent") ||
		lower.includes("subagent") ||
		lower === "runsubagent"
	);
}

function workflowSummary(state) {
	return [
		"",
		"═══ MANDATORY WORKFLOW (enforced by hooks) ═══",
		"Step 1: Spawn Planner → creates implementation plan",
		"Step 2: Spawn Implementor(s) → implements the plan",
		"Step 3: Spawn Reviewer → senior dev reviews all changes",
		"Step 4: Spawn Implementor(s) → addresses review feedback",
		"Step 5: Stop → workflow complete",
		"═══════════════════════════════════════════════",
		`Current phase: ${state.phase}`,
		`Next action: ${PHASE_GUIDANCE[state.phase]}`,
		"",
	].join("\n");
}

// ── Hook Handlers ───────────────────────────────────────────────────────────

function handleSessionStart(input) {
	const state = createInitialState();
	saveState(input.sessionId, state);

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
				"4. You CANNOT stop until ALL steps are complete.",
				"5. Pass relevant context from previous agents to the next agent via the prompt.",
				"6. For implementors, try to split work across MULTIPLE parallel implementors when possible.",
				"",
				"BEGIN: Spawn the Planner agent NOW with the user's task description.",
			].join("\n"),
		},
	};
}

function handleUserPromptSubmit(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	return {
		systemMessage: `[Workflow phase: ${state.phase}] ${PHASE_GUIDANCE[state.phase]}`,
	};
}

function handlePreToolUse(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	const toolName = input.tool_name || "";

	// Only enforce subagent/agent tool calls
	if (!isSubagentTool(toolName)) {
		// The orchestrator should not have non-agent tools, but if something
		// slips through, allow it (structural tool restrictions handle this).
		return {};
	}

	if (isDuplicate(state, input)) {
		saveState(input.sessionId, state);
		return {};
	}

	const agentName = extractAgentName(input.tool_input);
	const allowed = PHASE_ALLOWED_AGENTS[state.phase] || [];

	// Phase allows no agents (a subagent is still running or workflow is done)
	if (allowed.length === 0) {
		saveState(input.sessionId, state);
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

	// Agent name not in allowed list for this phase
	if (agentName && !allowed.includes(agentName)) {
		saveState(input.sessionId, state);
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

	// Validate agent name is one of our known agents
	if (agentName && !VALID_AGENTS.includes(agentName)) {
		saveState(input.sessionId, state);
		return {
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: `[WORKFLOW BLOCKED] Unknown agent "${agentName}". Only valid agents are: [${VALID_AGENTS.join(", ")}].`,
			},
		};
	}

	// Allowed
	saveState(input.sessionId, state);
	return {
		hookSpecificOutput: {
			hookEventName: "PreToolUse",
			permissionDecision: "allow",
			additionalContext: `[WORKFLOW OK] Spawning "${agentName}" is permitted in phase "${state.phase}".`,
		},
	};
}

function handleSubagentStart(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	if (isDuplicate(state, input)) {
		saveState(input.sessionId, state);
		return {};
	}

	const agentType = input.agent_type;

	// Phase transitions on subagent start
	if (agentType === "Planner" && state.phase === "init") {
		state.phase = "planning";
	} else if (agentType === "Implementor" && state.phase === "plan_complete") {
		state.phase = "implementing";
	} else if (agentType === "Reviewer" && state.phase === "implementing") {
		state.phase = "reviewing";
	} else if (agentType === "Implementor" && state.phase === "review_complete") {
		state.phase = "revising";
	}
	// Additional Implementors in implementing/revising phase don't change phase

	saveState(input.sessionId, state);

	return {
		hookSpecificOutput: {
			hookEventName: "SubagentStart",
			additionalContext: `[WORKFLOW] ${agentType} agent started. Phase is now: "${state.phase}".`,
		},
	};
}

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

function handleStop(input) {
	const state = loadState(input.sessionId);
	if (!state?.active) return {};

	// Allow stop if workflow is complete
	if (state.phase === "done") {
		return {};
	}

	// Allow stop if revising and at least one revision implementor completed
	if (state.phase === "revising" && state.revisionImplementorsCompleted > 0) {
		state.phase = "done";
		saveState(input.sessionId, state);
		return {};
	}

	// Safety valve: prevent infinite loops
	if (input.stop_hook_active) {
		state.stopBlockCount++;
		saveState(input.sessionId, state);

		if (state.stopBlockCount >= MAX_STOP_BLOCKS) {
			// Let it through to prevent infinite loop
			state.phase = "done";
			saveState(input.sessionId, state);
			return {};
		}
	}

	// Block stop - workflow not complete
	state.stopBlockCount++;
	saveState(input.sessionId, state);

	const guidance = PHASE_GUIDANCE[state.phase];
	const progressReport = [
		`Planner: ${state.plannerCompleted ? "✓" : "✗"}`,
		`Implementors (pass 1): ${state.firstPassImplementorsCompleted} completed`,
		`Reviewer: ${state.reviewerCompleted ? "✓" : "✗"}`,
		`Implementors (revision): ${state.revisionImplementorsCompleted} completed`,
	].join(" | ");

	return {
		hookSpecificOutput: {
			hookEventName: "Stop",
			decision: "block",
			reason: [
				`[WORKFLOW INCOMPLETE] Cannot stop. Phase: "${state.phase}".`,
				`Progress: ${progressReport}`,
				`Required action: ${guidance}`,
				"You MUST complete all workflow steps before stopping.",
			].join("\n"),
		},
	};
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
	let input;
	try {
		const raw = readFileSync("/dev/stdin", "utf8");
		input = JSON.parse(raw);
	} catch {
		// If stdin is empty or invalid JSON, output nothing (non-blocking)
		process.stdout.write("{}");
		process.exit(0);
	}

	const eventName = input.hookEventName;
	let output = {};

	switch (eventName) {
		case "SessionStart":
			output = handleSessionStart(input);
			break;
		case "UserPromptSubmit":
			output = handleUserPromptSubmit(input);
			break;
		case "PreToolUse":
			output = handlePreToolUse(input);
			break;
		case "SubagentStart":
			output = handleSubagentStart(input);
			break;
		case "SubagentStop":
			output = handleSubagentStop(input);
			break;
		case "Stop":
			output = handleStop(input);
			break;
		default:
			// Unknown event, no action
			break;
	}

	process.stdout.write(JSON.stringify(output));
	process.exit(0);
}

main();
