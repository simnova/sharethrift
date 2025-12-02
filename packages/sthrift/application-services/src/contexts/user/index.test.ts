import { describe, it, expect, beforeEach } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { User } from './index.ts';

describe('User Context Factory', () => {
	// biome-ignore lint/suspicious/noExplicitAny: Test mock type
	let mockDataSources: any;

	beforeEach(() => {
		mockDataSources = {
			domainDataSource: {},
			readonlyDataSource: {},
		} as DataSources;
	});

	it('should create User context with all services', () => {
		const context = User(mockDataSources);

		expect(context).toBeDefined();
		expect(context.PersonalUser).toBeDefined();
		expect(context.AdminUser).toBeDefined();
	});

	it('should have PersonalUser service with all required methods', () => {
		const context = User(mockDataSources);

		expect(context.PersonalUser.createIfNotExists).toBeDefined();
		expect(context.PersonalUser.update).toBeDefined();
		expect(context.PersonalUser.queryById).toBeDefined();
		expect(context.PersonalUser.queryByEmail).toBeDefined();
		expect(context.PersonalUser.getAllUsers).toBeDefined();
	});

	it('should have AdminUser service with all required methods', () => {
		const context = User(mockDataSources);

		expect(context.AdminUser.createIfNotExists).toBeDefined();
		expect(context.AdminUser.update).toBeDefined();
		expect(context.AdminUser.queryById).toBeDefined();
		expect(context.AdminUser.queryByEmail).toBeDefined();
		expect(context.AdminUser.queryByUsername).toBeDefined();
		expect(context.AdminUser.blockUser).toBeDefined();
		expect(context.AdminUser.unblockUser).toBeDefined();
		expect(context.AdminUser.getAllUsers).toBeDefined();
	});
});
