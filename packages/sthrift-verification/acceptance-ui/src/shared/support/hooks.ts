import type { IWorld } from '@cucumber/cucumber';
import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { isAgent } from 'std-env';
import { type ShareThriftUiWorld } from '../../world.ts';

let printedSuiteHeader = false;

setDefaultTimeout(120_000);

Before(async function (this: IWorld) {
	const world = this as IWorld & ShareThriftUiWorld;

	if (!printedSuiteHeader && !isAgent) {
		printedSuiteHeader = true;
		console.log('\nUI acceptance tests');
		console.log('  - Listing context');
		console.log('  - Reservation request context\n');
	}

	await world.init();
});

After(async function (this: IWorld) {
	const world = this as IWorld & ShareThriftUiWorld;
	await world.cleanup();
});
