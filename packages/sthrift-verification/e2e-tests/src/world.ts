import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import './shared/support/hooks.ts';
import { ShareThriftCast } from './shared/support/cast.ts';
import { clearMockListings } from './shared/support/test-data/listing.test-data.ts';
import { clearMockReservationRequests } from './shared/support/test-data/reservation-request.test-data.ts';
import * as infra from './shared/support/shared-infrastructure.ts';

export type TaskLevel = 'e2e' | 'session';
export type SessionType = 'graphql' | 'mongodb';

export interface WorldParameters {
	tasks: 'e2e';
	apiUrl?: string;
}

export async function stopSharedServers(): Promise<void> {
	await infra.stopAll();
}

export class ShareThriftWorld extends World<WorldParameters> {
	private apiUrl: string;

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);
		this.apiUrl = options.parameters?.apiUrl || '';
	}

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

	get level(): TaskLevel {
		return 'e2e';
	}

	get setupLevel(): TaskLevel {
		return 'session';
	}
}

setWorldConstructor(ShareThriftWorld);
