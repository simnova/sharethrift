import type { IWorld } from '@cucumber/cucumber';
import { After, AfterAll, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { isAgent } from 'std-env';

import { type ShareThriftWorld, stopSharedServers } from '../../world.ts';

let lastTestConfig: string | undefined;

setDefaultTimeout(120_000);

Before(async function (this: IWorld<{ tasks?: string }>) {
	const world = this as IWorld<{ tasks?: string }> & ShareThriftWorld;

	const testConfig = world.level;

	if (lastTestConfig !== testConfig) {
		lastTestConfig = testConfig;

		if (!isAgent) {
			const levelIcon = world.level === 'api' ? '📡' : '🖥️';
			const testLevelStr = world.level.toUpperCase();

			console.log(`\n${levelIcon} ${testLevelStr} tests`);
			console.log('  • Listing Context');
			console.log('  • Reservation Request Context\n');
		}
	}

	await world.init();
});

After(async function (this: IWorld<{ tasks?: string }>) {
	const world = this as IWorld<{ tasks?: string }> & ShareThriftWorld;
	await world.cleanup();
});

AfterAll(async function () {
	await stopSharedServers();
});
