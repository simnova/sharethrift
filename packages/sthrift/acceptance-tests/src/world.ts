import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import './shared/support/hooks.ts';
import { ShareThriftCast } from './shared/support/cast.ts';
import { clearMockListings } from './shared/support/test-data/listing.test-data.ts';
import { clearMockReservationRequests } from './shared/support/test-data/reservation-request.test-data.ts';
import * as infra from './shared/support/shared-infrastructure.ts';

export type TaskLevel = 'domain' | 'session' | 'e2e';
export type SessionType = 'graphql' | 'mongodb';

export interface WorldParameters {
	tasks: TaskLevel;
	session?: SessionType;
	apiUrl?: string;
}

export async function stopSharedServers(): Promise<void> {
	await infra.stopAll();
}

export class ShareThriftWorld extends World<WorldParameters> {
	private readonly tasksLevel: TaskLevel;
	private readonly sessionType: SessionType;
	private apiUrl: string;

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);
		this.tasksLevel = options.parameters?.tasks || 'domain';
		this.sessionType = options.parameters?.session || 'graphql';
		this.apiUrl = options.parameters?.apiUrl || '';
	}

	async init(): Promise<void> {
		if (this.tasksLevel === 'session') {
			await infra.ensureSessionServers(this.sessionType);
		}

		if (this.tasksLevel === 'e2e') {
			await infra.ensureE2EServers();
		}

		const { apiUrl, accessToken, browseTheWeb } = infra.getState();

		if (apiUrl) {
			this.apiUrl = apiUrl;
		}

		clearMockReservationRequests();
		clearMockListings();

		engage(new ShareThriftCast(
			this.tasksLevel,
			this.sessionType,
			this.apiUrl,
			browseTheWeb,
			accessToken,
		));
	}

	async cleanup(): Promise<void> {
		// Reuse the same authenticated browser session across scenarios for the same user.
	}

	get level(): TaskLevel {
		return this.tasksLevel;
	}

	get setupLevel(): TaskLevel {
		return this.tasksLevel === 'e2e' ? 'session' : this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
