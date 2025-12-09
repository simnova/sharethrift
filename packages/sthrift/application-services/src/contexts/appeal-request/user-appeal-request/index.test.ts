import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';

// Mock the individual service modules
vi.mock('./create.ts', () => ({
	create: vi.fn(),
}));
vi.mock('./get-by-id.ts', () => ({
	getById: vi.fn(),
}));
vi.mock('./get-all.ts', () => ({
	getAll: vi.fn(),
}));
vi.mock('./update-state.ts', () => ({
	updateState: vi.fn(),
}));

import { UserAppealRequest } from './index.ts';
import { create } from './create.ts';
import { getById } from './get-by-id.ts';
import { getAll } from './get-all.ts';
import { updateState } from './update-state.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, './features/index.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let service: ReturnType<typeof UserAppealRequest>;

	BeforeEachScenario(() => {
		// Reset mocks
		vi.clearAllMocks();

		const mockCreateFn = vi.fn().mockResolvedValue({
			id: 'appeal-1',
			userId: 'user-1',
			reason: 'Test reason',
		});
		const mockGetByIdFn = vi.fn().mockResolvedValue({
			id: 'appeal-1',
		});
		const mockGetAllFn = vi.fn().mockResolvedValue({
			items: [],
			total: 0,
			page: 1,
			pageSize: 10,
		});
		const mockUpdateStateFn = vi.fn().mockResolvedValue({
			id: 'appeal-1',
			state: 'accepted',
		});

		vi.mocked(create).mockReturnValue(mockCreateFn);
		vi.mocked(getById).mockReturnValue(mockGetByIdFn);
		vi.mocked(getAll).mockReturnValue(mockGetAllFn);
		vi.mocked(updateState).mockReturnValue(mockUpdateStateFn);

		mockDataSources = {
			domainDataSource: {
				AppealRequest: {
					UserAppealRequest: {
						UserAppealRequestUnitOfWork: {
							withScopedTransaction: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		service = UserAppealRequest(mockDataSources);
	});

	Scenario(
		'Creating a user appeal request through the application service',
		({
			Given,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			let result: Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference;

			Given('a user appeal request application service', () => {
				expect(service).toBeDefined();
			});

			When('I create a user appeal request', async () => {
				result = await service.create({
					userId: 'user-1',
					reason: 'Test reason',
					blockerId: 'blocker-1',
				});
			});

			Then('it should delegate to the create function', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('appeal-1');
			});
		},
	);

	Scenario(
		'Getting a user appeal request by ID through the application service',
		({
			Given,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			let result: Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference | null;

			Given('a user appeal request application service', () => {
				expect(service).toBeDefined();
			});

			When('I get a user appeal request by id "appeal-1"', async () => {
				result = await service.getById({ id: 'appeal-1' });
			});

			Then('it should delegate to the getById function', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('appeal-1');
			});
		},
	);

	Scenario(
		'Getting all user appeal requests through the application service',
		({
			Given,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
			let result: any;

			Given('a user appeal request application service', () => {
				expect(service).toBeDefined();
			});

			When(
				'I get all user appeal requests with page 1 and pageSize 10',
				async () => {
					result = await service.getAll({ page: 1, pageSize: 10 });
				},
			);

			Then('it should delegate to the getAll function', () => {
				expect(result).toBeDefined();
			});
		},
	);

	Scenario(
		'Updating a user appeal request state through the application service',
		({
			Given,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			let result: Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference;

			Given('a user appeal request application service', () => {
				expect(service).toBeDefined();
			});

			When(
				'I update user appeal request "appeal-1" state to "accepted"',
				async () => {
					result = await service.updateState({
						id: 'appeal-1',
						state: 'accepted',
					});
				},
			);

			Then('it should delegate to the updateState function', () => {
				expect(result).toBeDefined();
				expect(result.state).toBe('accepted');
			});
		},
	);
});
