import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const VALID_AGENTS = ["Planner", "Implementor", "Reviewer"];
export const MAX_STOP_BLOCKS = 3;

export const PHASE_ALLOWED_AGENTS = {
	init: ["Planner"],
	planning: [],
	plan_complete: ["Implementor"],
	implementing: ["Implementor", "Reviewer"],
	reviewing: [],
	review_complete: ["Implementor"],
	revising: ["Implementor"],
	done: [],
};

export const PHASE_GUIDANCE = {
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

export function stateDir() {
	const dir = join(tmpdir(), "copilot-workflow-state");
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	return dir;
}

export function stateFilePath(sessionId) {
	const safeId = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
	return join(stateDir(), `${safeId}.json`);
}

export function loadState(sessionId) {
	const filePath = stateFilePath(sessionId);
	if (existsSync(filePath)) {
		return JSON.parse(readFileSync(filePath, "utf8"));
	}
	return null;
}

export function saveState(sessionId, state) {
	writeFileSync(stateFilePath(sessionId), JSON.stringify(state, null, 2));
}

export function createInitialState() {
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

export function eventKey(input) {
	const name = input.hookEventName;
	if (input.tool_use_id) return `${name}:${input.tool_use_id}`;
	if (input.agent_id) return `${name}:${input.agent_id}`;
	return name;
}

export function isDuplicate(state, input) {
	const key = eventKey(input);
	if (
		input.hookEventName === "SessionStart" ||
		input.hookEventName === "Stop"
	) {
		return false;
	}
	if (state.processedEvents.includes(key)) return true;
	state.processedEvents.push(key);
	if (state.processedEvents.length > 100) {
		state.processedEvents = state.processedEvents.slice(-50);
	}
	return false;
}

export function extractAgentName(toolInput) {
	if (!toolInput) return null;
	return (
		toolInput.agentName ||
		toolInput.agent ||
		toolInput.name ||
		toolInput.agent_name ||
		null
	);
}

export function isSubagentTool(toolName) {
	if (!toolName) return false;
	const lower = toolName.toLowerCase();
	return (
		lower.includes("agent") ||
		lower.includes("subagent") ||
		lower === "runsubagent"
	);
}

export function workflowSummary(state) {
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

export function readHookInput() {
	try {
		return JSON.parse(readFileSync("/dev/stdin", "utf8"));
	} catch {
		return null;
	}
}

export function runHook(handler) {
	const input = readHookInput();
	if (!input) {
		process.stdout.write("{}");
		process.exit(0);
	}

	process.stdout.write(JSON.stringify(handler(input) || {}));
	process.exit(0);
}
