#!/usr/bin/env node
/**
 * Kills any leftover dev server processes from a previous run before starting fresh.
 * Runs portless proxy stop, then kills known mock-server and func processes by port/name.
 */
import { execSync } from 'node:child_process';

function run(cmd) {
	try {
		execSync(cmd, { stdio: 'ignore' });
	} catch {
		// ignore — process may not exist
	}
}

// Stop portless proxy (clears all route registrations)
run('portless proxy stop');

// Kill any leftover mock server or func processes by matching their command lines
const patterns = [
	'mock-messaging-server.*index.js',
	'mock-payment-server.*index.js',
	'mock-oauth2-server.*index.js',
	'mock-mongodb-memory-server.*index.js',
	'func start --typescript',
	'start-dev.mjs',
];

for (const pattern of patterns) {
	run(`pkill -f '${pattern}'`);
}

// Small pause to let OS reclaim ports before proxy restarts
await new Promise((r) => setTimeout(r, 500));

console.log('dev cleanup done');
