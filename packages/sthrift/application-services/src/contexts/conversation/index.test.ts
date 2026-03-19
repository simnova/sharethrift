import { describe, it, expect, beforeEach } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { Conversation } from './index.ts';

describe('Conversation Context Factory', () => {
	// biome-ignore lint/suspicious/noExplicitAny: Test mock type
	let mockDataSources: any;

	beforeEach(() => {
		mockDataSources = {
			domainDataSource: {},
			readonlyDataSource: {},
		} as DataSources;
	});

	it('should create Conversation context with all services', () => {
		const context = Conversation(mockDataSources);

		expect(context).toBeDefined();
		expect(context.Conversation).toBeDefined();
	});

	it('should have Conversation service with all required methods', () => {
		const context = Conversation(mockDataSources);

		expect(context.Conversation.create).toBeDefined();
		expect(context.Conversation.queryById).toBeDefined();
		expect(context.Conversation.queryByUser).toBeDefined();
	});
});
