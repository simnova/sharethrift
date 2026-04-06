import type { IWorld } from '@cucumber/cucumber';
import { After, AfterAll, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { isAgent } from 'std-env';
import { type ShareThriftApiWorld, stopSharedServers } from '../../world.ts';

let printedSuiteHeader = false;

setDefaultTimeout(120_000);

Before(async function (this: IWorld) {
	const world = this as IWorld & ShareThriftApiWorld;

	if (!printedSuiteHeader && !isAgent) {
		printedSuiteHeader = true;
		console.log('\nAPI acceptance tests');
		console.log('  - Listing context');
		console.log('  - Reservation request context\n');
	}

	await world.init();
});

After(async function (this: IWorld) {
	const world = this as IWorld & ShareThriftApiWorld;
	await world.cleanup();
});

AfterAll(async () => {
	await stopSharedServers();
});
