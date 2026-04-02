import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import './shared/support/hooks.ts';
import { ShareThriftCast } from './shared/support/cast.ts';
import { clearMockListings } from './shared/support/test-data/listing.test-data.ts';
import { clearMockReservationRequests } from './shared/support/test-data/reservation-request.test-data.ts';
import * as infra from './shared/support/shared-infrastructure.ts';

export type TaskLevel = 'domain' | 'session' | 'ui';
export type SessionType = 'graphql' | 'mongodb';

export interface WorldParameters {
	tasks: TaskLevel;
	session?: SessionType;
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
		this.apiUrl = '';
	}

	async init(): Promise<void> {
		if (this.tasksLevel === 'session') {
			await infra.ensureSessionServers(this.sessionType);
		}

		if (this.tasksLevel === 'ui') {
			// jsdom setup is done lazily in UI tasks via dynamic imports
			// No server infrastructure needed for UI tests
		}

		const { apiUrl } = infra.getState();

		if (apiUrl) {
			this.apiUrl = apiUrl;
		}

		clearMockReservationRequests();
		clearMockListings();

		engage(new ShareThriftCast(
			this.tasksLevel,
			this.sessionType,
			this.apiUrl,
		));
	}

	async cleanup(): Promise<void> {
		// No cleanup needed for domain/session tests
	}

	get level(): TaskLevel {
		return this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
