import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export const VALID_AGENTS = [
	"Planner",
	"Implementor",
	"Reviewer",
	"Finalizer",
];
export const MAX_STOP_BLOCKS = 3;

export const PHASE_ALLOWED_AGENTS = {
	init: ["Planner"],
	planning: [],
	plan_complete: ["Implementor"],
	implementing: ["Implementor", "Reviewer"],
	reviewing: [],
	review_complete: ["Implementor"],
	revising: ["Implementor", "Finalizer"],
	finalizing: [],
	done: [],
};

export const PHASE_GUIDANCE = {
	init: "You MUST spawn the Planner agent FIRST. No other action is allowed.",
	planning:
		"The Planner agent is running. WAIT for it to complete before doing anything else.",
	plan_complete:
		"The plan is ready. You MUST now spawn one or more Implementor agents to execute the plan. Each implementor MUST receive a MANIFEST block in its prompt (see Planner output) and a unique TASK_ID.",
	implementing:
		"Implementor(s) are working. When ALL first-pass manifests are verified, spawn the Reviewer. If any manifest FAILED verification, you MUST re-spawn an Implementor for that task BEFORE spawning the Reviewer.",
	reviewing:
		"The Reviewer agent is running. WAIT for it to complete before doing anything else.",
	review_complete:
		"Review feedback is ready. You MUST now spawn one or more Implementor agents to address the feedback. Each revision Implementor MUST receive a MANIFEST block and a unique TASK_ID.",
	revising:
		"Revision Implementor(s) are working. When ALL revision manifests are verified, you MUST spawn the Finalizer to run lint/build/tests and resolve any regressions. If any manifest FAILED verification, re-spawn an Implementor for that task FIRST.",
	finalizing:
		"The Finalizer is running lint/build/tests and handling cleanup. WAIT for it to complete. After it completes, the workflow is DONE.",
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
		finalizerCompleted: false,
		hasFailedManifests: false,
		lastFailureSummary: "",
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
		"Step 1: Spawn Planner → creates plan + per-task MANIFESTS",
		"Step 2: Spawn Implementor(s) → each executes ONE manifest",
		"        (hook verifies every manifest against filesystem)",
		"Step 3: Spawn Reviewer → senior dev reviews all changes",
		"Step 4: Spawn Implementor(s) → addresses review feedback",
		"        (hook verifies revision manifests against filesystem)",
		"Step 5: Spawn Finalizer → runs lint/build/tests, fixes regressions",
		"Step 6: Stop → workflow complete",
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

/* ========================================================================
 * Manifest verification
 *
 * A manifest is a JSON file the Implementor writes after completing its
 * task. It declares the file operations that SHOULD have happened. The hook
 * then checks the actual filesystem to confirm.
 *
 * Manifest dir: $TMPDIR/copilot-workflow-state/<sessionId>-manifests/
 * Filename:     task-<taskId>.json
 *
 * Schema:
 * {
 *   "taskId": "short-slug",
 *   "taskDescription": "human summary",
 *   "phase": "first_pass" | "revision",
 *   "operations": [
 *     { "action": "create"|"modify"|"delete", "path": "relative/path" },
 *     { "action": "rename", "from": "old/path", "to": "new/path" }
 *   ],
 *   "status": "pending" | "verified" | "failed",
 *   "writtenAt": ISO8601,
 *   "verifiedAt": ISO8601 | null,
 *   "failures": [ { "op": {...}, "reason": "..." } ]
 * }
 * ======================================================================== */

export function manifestsDir(sessionId) {
	const safeId = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
	const dir = join(stateDir(), `${safeId}-manifests`);
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	return dir;
}

export function listManifests(sessionId) {
	const dir = manifestsDir(sessionId);
	if (!existsSync(dir)) return [];
	const out = [];
	for (const f of readdirSync(dir)) {
		if (!f.endsWith(".json")) continue;
		const filePath = join(dir, f);
		try {
			const data = JSON.parse(readFileSync(filePath, "utf8"));
			out.push({ filePath, data });
		} catch {
			// ignore malformed manifest files
		}
	}
	return out;
}

function resolveOpPath(cwd, p) {
	if (!p) return null;
	return resolve(cwd, p);
}

export function verifyManifestData(manifestData, cwd) {
	const failures = [];
	const ops = Array.isArray(manifestData.operations)
		? manifestData.operations
		: [];

	for (const op of ops) {
		const action = op.action;
		if (action === "create" || action === "modify") {
			const target = resolveOpPath(cwd, op.path);
			if (!target) {
				failures.push({ op, reason: `missing 'path' for action '${action}'` });
				continue;
			}
			if (!existsSync(target)) {
				failures.push({
					op,
					reason: `expected '${action}' at ${op.path} — file does not exist on disk`,
				});
			}
		} else if (action === "delete") {
			const target = resolveOpPath(cwd, op.path);
			if (!target) {
				failures.push({ op, reason: "missing 'path' for action 'delete'" });
				continue;
			}
			if (existsSync(target)) {
				failures.push({
					op,
					reason: `expected 'delete' of ${op.path} — file still exists on disk`,
				});
			}
		} else if (action === "rename") {
			const from = resolveOpPath(cwd, op.from);
			const to = resolveOpPath(cwd, op.to);
			if (!from || !to) {
				failures.push({
					op,
					reason: "rename requires both 'from' and 'to' paths",
				});
				continue;
			}
			if (existsSync(from)) {
				failures.push({
					op,
					reason: `rename source ${op.from} still exists after rename`,
				});
			}
			if (!existsSync(to)) {
				failures.push({
					op,
					reason: `rename target ${op.to} does not exist`,
				});
			}
		} else {
			failures.push({
				op,
				reason: `unknown action '${action}' — valid: create|modify|delete|rename`,
			});
		}
	}
	return failures;
}

export function verifyPendingManifests(sessionId, cwd) {
	const manifests = listManifests(sessionId);
	const results = { verified: [], failed: [], alreadyDone: [] };

	for (const entry of manifests) {
		const m = entry.data;
		if (m.status === "verified") {
			results.alreadyDone.push(m);
			continue;
		}

		const failures = verifyManifestData(m, cwd);
		if (failures.length === 0) {
			m.status = "verified";
			m.failures = [];
			m.verifiedAt = new Date().toISOString();
			results.verified.push(m);
		} else {
			m.status = "failed";
			m.failures = failures;
			m.verifiedAt = new Date().toISOString();
			results.failed.push(m);
		}

		writeFileSync(entry.filePath, JSON.stringify(m, null, 2));
	}

	return results;
}

export function summarizeManifestFailures(failed) {
	if (!failed.length) return "";
	const lines = [];
	for (const m of failed) {
		lines.push(`  • Task "${m.taskId}" — ${m.failures.length} failure(s):`);
		for (const f of m.failures) {
			lines.push(`      - ${f.reason}`);
		}
	}
	return lines.join("\n");
}

export function countManifestsByPhase(sessionId, phase) {
	const manifests = listManifests(sessionId);
	let verified = 0;
	let failed = 0;
	let pending = 0;
	for (const { data } of manifests) {
		if (phase && data.phase !== phase) continue;
		if (data.status === "verified") verified++;
		else if (data.status === "failed") failed++;
		else pending++;
	}
	return { verified, failed, pending, total: verified + failed + pending };
}
