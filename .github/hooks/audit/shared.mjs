import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/* ========================================================================
 * Audit Workflow — Shared State & Enforcement
 *
 * Phases:
 *   init → scoping → analyzing → synthesizing → done
 *
 * Analyzer agents (run in parallel during "analyzing"):
 *   - DependencySecurity
 *   - CodeQuality
 *   - Performance
 *
 * Synthesizer (runs during "synthesizing"): reads every analyzer's
 * report file, produces the prioritized audit output, and publishes it
 * by creating a branch, commit, push, and pull request.
 *
 * Enforcement:
 *   - Analyzer phase cannot advance to Synthesizer until EVERY analyzer
 *     has written a report file.
 *   - "error" status is allowed through (Synthesizer decides what to do)
 *     but a MISSING report blocks advancement.
 *   - Session cannot stop until Synthesizer completes.
 * ======================================================================== */

export const AUDIT_ANALYZERS = [
	"DependencySecurity",
	"CodeQuality",
	"Performance",
];

export const VALID_AGENTS = [
	"Scoper",
	...AUDIT_ANALYZERS,
	"Synthesizer",
];

export const MAX_STOP_BLOCKS = 3;

export const PHASE_ALLOWED_AGENTS = {
	init: ["Scoper"],
	scoping: [],
	scoping_complete: AUDIT_ANALYZERS,
	analyzing: AUDIT_ANALYZERS.concat(["Synthesizer"]),
	synthesizing: [],
	synthesis_complete: [],
	publishing: [],
	done: [],
};

export const PHASE_GUIDANCE = {
	init: "You MUST spawn the Scoper agent FIRST. No other action is allowed.",
	scoping:
		"The Scoper agent is running. WAIT for it to complete before doing anything else.",
	scoping_complete:
		"The scope is ready. You MUST now spawn all audit analyzer agents in parallel, in a single response. Each analyzer MUST receive REPORTS_DIR and SCOPE_PATH, and each MUST write its JSON report to the reports dir.",
	analyzing:
		"Analyzers are working. When ALL analyzer reports are present, spawn the Synthesizer. If any analyzer is missing its report, you MUST re-spawn that analyzer BEFORE spawning the Synthesizer.",
	synthesizing:
		"The Synthesizer is running. WAIT for it to write and publish the audit before doing anything else.",
	synthesis_complete:
		"The audit markdown is published. The weekly audit workflow is complete; stop the session.",
	publishing: "Publishing is handled by the Synthesizer in the weekly audit workflow.",
	done: "Workflow is COMPLETE. You should stop now.",
};

export function stateDir() {
	const dir = join(tmpdir(), "copilot-workflow-state");
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	return dir;
}

export function stateFilePath(sessionId) {
	const safeId = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
	return join(stateDir(), `audit-${safeId}.json`);
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
		workflow: "audit",
		phase: "init",
		active: true,
		scoperCompleted: false,
		analyzersCompleted: [],
		synthesizerCompleted: false,
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
		"═══ MANDATORY AUDIT WORKFLOW (enforced by hooks) ═══",
		"Step 1: Spawn Scoper → gathers baseline + trend data",
		"Step 2: Spawn analyzer agents → all in parallel",
		`        (${AUDIT_ANALYZERS.join(", ")})`,
		"        (hook verifies every analyzer report exists)",
		"Step 3: Spawn Synthesizer → reads all reports, produces final output, publishes PR",
		"Step 4: Stop → audit complete",
		"════════════════════════════════════════════════════════",
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
 * Audit reports directory
 *
 * Each analyzer writes to <reportsDir>/<analyzer-id>.json
 * Scoper writes to    <reportsDir>/scope.json
 * Synthesizer reads everything and writes its prioritized output to the
 * repo at documents/audits/YYYY-MM-DD/audit.md (not managed by hooks).
 * ======================================================================== */

export function reportsDir(sessionId) {
	const safeId = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
	const dir = join(stateDir(), `audit-${safeId}-reports`);
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	return dir;
}

export function analyzerReportFilename(analyzerId) {
	return `${analyzerId}.json`;
}

export function listReports(sessionId) {
	const dir = reportsDir(sessionId);
	if (!existsSync(dir)) return [];
	const out = [];
	for (const f of readdirSync(dir)) {
		if (!f.endsWith(".json")) continue;
		const filePath = join(dir, f);
		try {
			const data = JSON.parse(readFileSync(filePath, "utf8"));
			out.push({ filePath, filename: f, data });
		} catch {
			// ignore malformed report
		}
	}
	return out;
}

export function analyzerReportStatus(sessionId) {
	const reports = listReports(sessionId);
	const present = new Set();
	const statusById = {};
	for (const { data, filename } of reports) {
		const id = data.agentId || filename.replace(/\.json$/, "");
		present.add(id);
		statusById[id] = data.status || "unknown";
	}
	const missing = AUDIT_ANALYZERS.filter((a) => !present.has(a));
	const failed = AUDIT_ANALYZERS.filter(
		(a) => statusById[a] === "error",
	);
	return {
		expected: AUDIT_ANALYZERS.length,
		present: AUDIT_ANALYZERS.filter((a) => present.has(a)),
		missing,
		failed,
		statusById,
	};
}

export function summarizeAnalyzerStatus(status) {
	const lines = [];
	lines.push(
		`Expected analyzers: ${status.expected}. Reports present: ${status.present.length}. Missing: ${status.missing.length}. Errored: ${status.failed.length}.`,
	);
	if (status.missing.length > 0) {
		lines.push(`  Missing reports from: ${status.missing.join(", ")}`);
	}
	if (status.failed.length > 0) {
		lines.push(`  Analyzers reporting status='error': ${status.failed.join(", ")}`);
	}
	return lines.join("\n");
}
