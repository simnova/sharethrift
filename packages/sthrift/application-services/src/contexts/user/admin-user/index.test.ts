import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { AdminUser } from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/index.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let service: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				User: {
					AdminUser: {
						AdminUserReadRepo: {
							getById: vi.fn(),
							getByEmail: vi.fn(),
							getByUsername: vi.fn(),
							getAllUsers: vi.fn(),
						},
					},
				},
			},
			domainDataSource: {
				User: {
					AdminUser: {
						AdminUserUnitOfWork: {
							withScopedTransaction: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		service = undefined;
	});

	Scenario(
		'Admin User service provides all required operations',
		({ Given, When, Then, And }) => {
			Given('the Admin User application service is initialized', () => {
				service = AdminUser(mockDataSources);
			});

			When('I check available operations', () => {
				// Operations are checked in the Then steps
			});

			Then('it should provide createIfNotExists operation', () => {
				expect(service.createIfNotExists).toBeDefined();
				expect(typeof service.createIfNotExists).toBe('function');
			});

			And('it should provide queryById operation', () => {
				expect(service.queryById).toBeDefined();
				expect(typeof service.queryById).toBe('function');
			});

			And('it should provide queryByEmail operation', () => {
				expect(service.queryByEmail).toBeDefined();
				expect(typeof service.queryByEmail).toBe('function');
			});

			And('it should provide queryByUsername operation', () => {
				expect(service.queryByUsername).toBeDefined();
				expect(typeof service.queryByUsername).toBe('function');
			});

			And('it should provide update operation', () => {
				expect(service.update).toBeDefined();
				expect(typeof service.update).toBe('function');
			});

			And('it should provide getAllUsers operation', () => {
				expect(service.getAllUsers).toBeDefined();
				expect(typeof service.getAllUsers).toBe('function');
			});

			And('it should provide blockUser operation', () => {
				expect(service.blockUser).toBeDefined();
				expect(typeof service.blockUser).toBe('function');
			});

			And('it should provide unblockUser operation', () => {
				expect(service.unblockUser).toBeDefined();
				expect(typeof service.unblockUser).toBe('function');
			});
		},
	);
});
