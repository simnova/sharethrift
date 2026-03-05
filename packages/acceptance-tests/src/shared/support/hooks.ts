import type { IWorld } from '@cucumber/cucumber';
import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';

import { ShareThriftWorld } from './world.js';

// Track printed contexts per test configuration
let printedContexts: Set<string> | undefined;
let lastTestConfig: string | undefined;

interface HookScenario {
	sourceLocation: { uri: string };
}

/**
 * Serenity/Screenplay pattern hooks.
 *
 * Following Aslak Hellesøy's principles:
 * - Hooks should be minimal and focus on test infrastructure
 * - External dependencies (UI server, backend) should be managed outside tests
 * - Each test level should be independent and fast to set up
 */

// Reasonable timeout for browser interactions
setDefaultTimeout(30_000);

/**
 * Print context banner and initialize world.
 *
 * Prints each context's banner once before its scenarios run,
 * showing which context, test level, and backend are in use.
 */
Before(async function (this: IWorld, scenario: HookScenario) {
	const world = this as unknown as ShareThriftWorld;

	// Determine context from pickle URI
	const pickleLike = scenario as Record<string, unknown>;
	const pickle = pickleLike.pickle as Record<string, unknown> | undefined;
	const featurePath = String(pickle?.uri || '');
	let context = 'unknown';
	if (featurePath.includes('/listing/')) {
		context = 'listing';
	} else if (featurePath.includes('/reservation-request/')) {
		context = 'reservation-request';
	}

	// Create a key for this test configuration (level + backend)
	const testConfig = `${world.level}:${world.parameters?.session || 'domain'}`;

	// Reset tracking set if test configuration changes
	if (lastTestConfig !== testConfig) {
		lastTestConfig = testConfig;
		printedContexts = new Set();
	}

	// Print banner once per context per test run
	if (!printedContexts.has(context)) {
		printedContexts.add(context);
		const levelIcon = world.level === 'dom' ? '🎨' : '⚡';
		const contextName =
			context === 'listing' ? 'Listing Context' : 'Reservation Request Context';
		const testLevelStr = world.level.toUpperCase();
		// Session type from world parameters
		const sessionType = world.parameters?.session || 'domain';
		const backendStr = sessionType.toUpperCase();

		console.log(`\n${'─'.repeat(70)}`);
		console.log(`${levelIcon} ${contextName} ${testLevelStr} tests with ${backendStr} backend`);
		console.log(`${'─'.repeat(70)}\n`);
	}

	await world.init();
});

/**
 * Clean up after each scenario.
 *
 * Closes browser if DOM tests were run.
 */
After(async function (this: IWorld) {
	const world = this as unknown as ShareThriftWorld;
	await world.cleanup();
});
