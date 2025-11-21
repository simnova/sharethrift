import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type ItemListingQueryByIdCommand, queryById } from './query-by-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-id.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	let command: ItemListingQueryByIdCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getById: vi.fn(),
		};

		mockDataSources = {
			readonlyDataSource: {
				Listing: {
					ItemListing: {
						ItemListingReadRepo: mockReadRepo,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { id: 'listing-123' };
		result = undefined;
	});

	Scenario(
		'Successfully retrieving an item listing by ID',
		({ Given, And, When, Then }) => {
			Given('a valid item listing ID "listing-123"', () => {
				command = { id: 'listing-123' };
			});

			And('the item listing exists', () => {
				const mockListing = {
					id: 'listing-123',
					title: 'Test Listing',
					sharer: { id: 'sharer-123' },
				};
				mockReadRepo.getById.mockResolvedValue(mockListing);
			});

			When('the queryById command is executed', async () => {
				const queryFn = queryById(mockDataSources);
				result = await queryFn(command);
			});

			Then('the item listing should be returned', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('listing-123');
			});
		},
	);

	Scenario('Retrieving non-existent item listing', ({ Given, When, Then }) => {
		Given('an item listing ID "listing-999" that does not exist', () => {
			command = { id: 'listing-999' };
		});

		When('the queryById command is executed', async () => {
			mockReadRepo.getById.mockResolvedValue(null);
			const queryFn = queryById(mockDataSources);
			result = await queryFn(command);
		});

		Then('null should be returned', () => {
			expect(result).toBeNull();
		});
	});
});
