import type { IWorld } from '@cucumber/cucumber';
import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';

import type { ShareThriftWorld } from './world.js';

// Track printed headers per test configuration
let lastTestConfig: string | undefined;

setDefaultTimeout(30_000);

Before(async function (this: IWorld) {
	const world = this as unknown as ShareThriftWorld;

	const sessionType = (world.parameters as unknown as Record<string, unknown>)['session'] || 'domain';
	const testConfig = `${world.level}:${sessionType}`;

	if (lastTestConfig !== testConfig) {
		lastTestConfig = testConfig;

		const levelIcon = world.level === 'dom' ? '🎨' : '⚡';
		const testLevelStr = world.level.toUpperCase();
		const backendStr = String(sessionType).toUpperCase();

		console.log(`\n${levelIcon} ${testLevelStr} tests with ${backendStr} backend`);
		console.log('  • Listing Context');
		console.log('  • Reservation Request Context\n');
	}

	await world.init();
});

After(async function (this: IWorld) {
	const world = this as unknown as ShareThriftWorld;
	await world.cleanup();
});
