import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import './shared/support/hooks.ts';
import { ShareThriftCast } from './shared/support/cast.ts';
import { clearMockListings, clearMockReservationRequests } from '@sthrift-verification/shared/test-data';
import * as infra from './shared/support/shared-infrastructure.ts';

export async function stopSharedServers(): Promise<void> {
	await infra.stopAll();
}

export class ShareThriftWorld extends World {
	private apiUrl = '';

	async init(): Promise<void> {
		await infra.ensureE2EServers();

		const { apiUrl, accessToken, browseTheWeb } = infra.getState();

		if (apiUrl) {
			this.apiUrl = apiUrl;
		}

		clearMockReservationRequests();
		clearMockListings();

		engage(new ShareThriftCast(
			this.apiUrl,
			browseTheWeb,
			accessToken,
		));
	}

	async cleanup(): Promise<void> {
		// Reuse the same authenticated browser session across scenarios for the same user.
	}
}

setWorldConstructor(ShareThriftWorld);
