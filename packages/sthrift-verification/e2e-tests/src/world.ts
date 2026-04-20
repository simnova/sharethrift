import { setWorldConstructor, World } from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import './shared/support/hooks.ts';
import { ShareThriftCast } from './shared/support/cast.ts';
import { clearMockListings, clearMockReservationRequests } from '@sthrift-verification/verification-shared/test-data';
import * as infra from './shared/support/shared-infrastructure.ts';

export async function stopSharedServers(): Promise<void> {
	await infra.stopAll();
}

export class ShareThriftWorld extends World {
	async init(): Promise<void> {
		await infra.ensureE2EServers();

		const { browseTheWeb } = infra.getState();

		clearMockReservationRequests();
		clearMockListings();

		engage(new ShareThriftCast(browseTheWeb));
	}

	async cleanup(): Promise<void> {
		// Reuse the same authenticated browser session across scenarios for the same user.
	}
}

setWorldConstructor(ShareThriftWorld);
