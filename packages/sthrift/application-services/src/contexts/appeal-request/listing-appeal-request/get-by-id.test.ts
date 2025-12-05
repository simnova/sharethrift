import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type GetListingAppealRequestByIdCommand,
	getById,
} from './get-by-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/get-by-id.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	let command: GetListingAppealRequestByIdCommand;
	let result:
		| Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference
		| null
		| undefined;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getById: vi.fn(),
		};

		mockDataSources = {
			readonlyDataSource: {
				AppealRequest: {
					ListingAppealRequest: {
						ListingAppealRequestReadRepo: mockReadRepo,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;
		result = undefined;
	});

	Scenario(
		'Successfully retrieving a listing appeal request by ID',
		({ Given, When, Then }) => {
			Given('a valid appeal request ID "appeal-123"', () => {
				command = { id: 'appeal-123' };
				const mockAppealRequest = {
					id: 'appeal-123',
					userId: 'user-456',
					listingId: 'listing-789',
					reason: 'Test reason',
					state: 'requested',
				};
				mockReadRepo.getById.mockResolvedValue(mockAppealRequest);
			});

			When('the getById command is executed', async () => {
				try {
					const getByIdFn = getById(mockDataSources);
					result = await getByIdFn(command);
				} catch (_err) {
					// No error expected in this scenario
				}
			});

			Then(
				'it should return the listing appeal request entity reference',
				() => {
					expect(result).toBeDefined();
					expect(result?.id).toBe('appeal-123');
					expect(mockReadRepo.getById).toHaveBeenCalledWith('appeal-123');
				},
			);
		},
	);

	Scenario('Handling non-existent appeal request', ({ Given, When, Then }) => {
		Given('a non-existent appeal request ID "invalid-id"', () => {
			command = { id: 'invalid-id' };
			mockReadRepo.getById.mockResolvedValue(null);
		});

		When('the getById command is executed', async () => {
			try {
				const getByIdFn = getById(mockDataSources);
				result = await getByIdFn(command);
			} catch (_err) {
				// No error expected in this scenario
			}
		});

		Then('it should return null', () => {
			expect(result).toBeNull();
			expect(mockReadRepo.getById).toHaveBeenCalledWith('invalid-id');
		});
	});
});
