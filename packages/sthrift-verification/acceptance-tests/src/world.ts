import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { engage } from '@serenity-js/core';
import './shared/support/hooks.ts';
import { ShareThriftCast } from './shared/support/cast.ts';
import { clearMockListings, clearMockReservationRequests } from '@sthrift-verification/test-support/test-data';
import * as infra from './shared/support/shared-infrastructure.ts';

export type TaskLevel = 'api' | 'ui';

export interface WorldParameters {
	tasks: TaskLevel;
}

export async function stopSharedServers(): Promise<void> {
	await infra.stopAll();
}

export class ShareThriftWorld extends World<WorldParameters> {
	private readonly tasksLevel: TaskLevel;
	private apiUrl: string;

	constructor(options: IWorldOptions<WorldParameters>) {
		super(options);
		this.tasksLevel = options.parameters?.tasks || 'api';
		this.apiUrl = '';
	}

	async init(): Promise<void> {
		if (this.tasksLevel === 'api') {
			await infra.ensureApiServers();
		}

		const { apiUrl } = infra.getState();

		if (apiUrl) {
			this.apiUrl = apiUrl;
		}

		clearMockReservationRequests();
		clearMockListings();

		engage(new ShareThriftCast(this.tasksLevel, this.apiUrl));
	}

	async cleanup(): Promise<void> {
		// No cleanup needed
	}

	get level(): TaskLevel {
		return this.tasksLevel;
	}
}

setWorldConstructor(ShareThriftWorld);
