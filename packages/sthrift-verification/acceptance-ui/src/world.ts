import {
	setWorldConstructor,
	World,
	type IWorldOptions,
} from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import {
	clearMockListings,
	clearMockReservationRequests,
} from '@sthrift-verification/test-support/test-data';
import './shared/support/hooks.ts';
import { ShareThriftUiCast } from './shared/support/cast.ts';

export class ShareThriftUiWorld extends World {
	constructor(options: IWorldOptions) {
		super(options);
	}

	async init(): Promise<void> {
		clearMockReservationRequests();
		clearMockListings();
		engage(new ShareThriftUiCast());
	}

	async cleanup(): Promise<void> {
		// No cleanup needed per scenario.
	}
}

export { ShareThriftUiWorld as ShareThriftWorld };

setWorldConstructor(ShareThriftUiWorld);
