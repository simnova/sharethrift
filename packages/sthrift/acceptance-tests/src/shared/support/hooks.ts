import type { IWorld } from '@cucumber/cucumber';
import { After, AfterAll, Before, setDefaultTimeout } from '@cucumber/cucumber';

import { type ShareThriftWorld, stopSharedServers } from '../../world.ts';

// Track printed headers per test configuration
let lastTestConfig: string | undefined;

setDefaultTimeout(30_000);

Before(async function (this: IWorld<{ session?: string; tasks?: string }>) {
	const world = this as IWorld<{ session?: string; tasks?: string }> & ShareThriftWorld;

	const sessionType = this.parameters?.session || 'domain';
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

After(async function (this: IWorld<{ session?: string; tasks?: string }>) {
	const world = this as IWorld<{ session?: string; tasks?: string }> & ShareThriftWorld;
	await world.cleanup();
});

AfterAll(async function () {
	await stopSharedServers();
});
