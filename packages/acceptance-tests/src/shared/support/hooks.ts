import type { IWorld } from '@cucumber/cucumber';
import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';

import { ShareThriftWorld } from './world.js';

// Track printed contexts per test configuration
let printedContexts: Set<string> | undefined;
let lastTestConfig: string | undefined;

interface HookScenario {
	sourceLocation: { uri: string };
}

setDefaultTimeout(30_000);

Before(async function (this: IWorld, scenario: HookScenario) {
	const world = this as unknown as ShareThriftWorld;

	const pickleLike = scenario as Record<string, unknown>;
	const pickle = pickleLike.pickle as Record<string, unknown> | undefined;
	const featurePath = String(pickle?.uri || '');
	let context = 'unknown';
	if (featurePath.includes('/listing/')) {
		context = 'listing';
	} else if (featurePath.includes('/reservation-request/')) {
		context = 'reservation-request';
	}

	const testConfig = `${world.level}:${world.parameters?.session || 'domain'}`;

	if (lastTestConfig !== testConfig) {
		lastTestConfig = testConfig;
		printedContexts = new Set();
	}

	if (!printedContexts.has(context)) {
		printedContexts.add(context);
		const levelIcon = world.level === 'dom' ? '🎨' : '⚡';
		const contextName =
			context === 'listing' ? 'Listing Context' : 'Reservation Request Context';
		const testLevelStr = world.level.toUpperCase();
		const sessionType = world.parameters?.session || 'domain';
		const backendStr = sessionType.toUpperCase();

		console.log(`\n${'─'.repeat(70)}`);
		console.log(`${levelIcon} ${contextName} ${testLevelStr} tests with ${backendStr} backend`);
		console.log(`${'─'.repeat(70)}\n`);
	}

	await world.init();
});

After(async function (this: IWorld) {
	const world = this as unknown as ShareThriftWorld;
	await world.cleanup();
});
