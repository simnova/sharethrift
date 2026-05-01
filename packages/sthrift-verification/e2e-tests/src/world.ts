import { setWorldConstructor, World } from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import './shared/support/hooks.ts';
import {
	clearMockListings,
	clearMockReservationRequests,
} from '@sthrift-verification/verification-shared/test-data';
import { ShareThriftCast } from './shared/support/cast.ts';
import * as infra from './shared/support/shared-infrastructure.ts';

export async function ensureServers(): Promise<void> {
	await infra.ensureE2EServers();
}

export async function stopSharedServers(): Promise<void> {
	await infra.stopAll();
}

export class ShareThriftWorld extends World {
	async init(): Promise<void> {
		// Servers are already started by BeforeAll; this is a no-op if already up.
		await infra.ensureE2EServers();

		const { browseTheWeb } = infra.getState();

		clearMockReservationRequests();
		clearMockListings();

		engage(new ShareThriftCast(browseTheWeb));
	}

	async cleanup(): Promise<void> {
		// Servers are reused across scenarios for performance.
		// Full teardown happens in AfterAll via stopSharedServers().
	}
}

setWorldConstructor(ShareThriftWorld);
