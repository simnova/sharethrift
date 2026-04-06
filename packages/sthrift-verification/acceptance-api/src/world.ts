import {
	setWorldConstructor,
	World,
} from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import {
	clearMockListings,
	clearMockReservationRequests,
} from '@sthrift-verification/test-support/test-data';
import './shared/support/hooks.ts';
import { ShareThriftApiCast } from './shared/support/cast.ts';
import * as infra from './shared/support/shared-infrastructure.ts';

export async function stopSharedServers(): Promise<void> {
	await infra.stopAll();
}

export class ShareThriftApiWorld extends World {
	private apiUrl = '';

	async init(): Promise<void> {
		await infra.ensureApiServers();

		const { apiUrl } = infra.getState();
		if (apiUrl) {
			this.apiUrl = apiUrl;
		}

		clearMockReservationRequests();
		clearMockListings();

		engage(new ShareThriftApiCast(this.apiUrl));
	}

	async cleanup(): Promise<void> {
		// No cleanup needed per scenario.
	}
}

export { ShareThriftApiWorld as ShareThriftWorld };

setWorldConstructor(ShareThriftApiWorld);
