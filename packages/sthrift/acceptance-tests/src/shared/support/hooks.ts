import type { IWorld } from '@cucumber/cucumber';
import { After, AfterAll, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { isAgent } from 'std-env';

import { type ShareThriftWorld, stopSharedServers } from '../../world.ts';

// Track printed headers per test configuration
let lastTestConfig: string | undefined;

// Suppress noisy React warnings in DOM tests (e.g. controlled input without onChange)
const originalWarn = console.warn;
const originalError = console.error;
const suppressedPatterns = [
	'`value` prop to a form field without an `onChange` handler',
];
console.warn = (...args: unknown[]) => {
	const msg = typeof args[0] === 'string' ? args[0] : '';
	if (suppressedPatterns.some(p => msg.includes(p))) return;
	originalWarn.apply(console, args);
};
console.error = (...args: unknown[]) => {
	const msg = typeof args[0] === 'string' ? args[0] : '';
	if (suppressedPatterns.some(p => msg.includes(p))) return;
	originalError.apply(console, args);
};

setDefaultTimeout(30_000);

Before(async function (this: IWorld<{ session?: string; tasks?: string }>) {
	const world = this as IWorld<{ session?: string; tasks?: string }> & ShareThriftWorld;

	const sessionType = this.parameters?.session || 'domain';
	const testConfig = `${world.level}:${sessionType}`;

	if (lastTestConfig !== testConfig) {
		lastTestConfig = testConfig;

		if (!isAgent) {
			const levelIcon = world.level === 'dom' ? '🎨' : '⚡';
			const testLevelStr = world.level.toUpperCase();
			const backendStr = String(sessionType).toUpperCase();

			console.log(`\n${levelIcon} ${testLevelStr} tests with ${backendStr} backend`);
			console.log('  • Listing Context');
			console.log('  • Reservation Request Context\n');
		}
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
