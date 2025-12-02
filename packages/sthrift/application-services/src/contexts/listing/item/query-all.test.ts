import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type ItemListingQueryAllCommand, queryAll } from './query-all.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-all.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ItemListingQueryAllCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				Listing: {
					ItemListing: {
						ItemListingReadRepo: {
							getAll: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {};
		result = undefined;
	});

	Scenario('Successfully retrieving all listings', ({ Given, When, Then }) => {
		Given('there are 3 listings in the system', () => {
			const mockListings = [
				{ id: 'listing-1', title: 'Lawnmower' },
				{ id: 'listing-2', title: 'Drill' },
				{ id: 'listing-3', title: 'Ladder' },
			];
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.readonlyDataSource as any
			).Listing.ItemListing.ItemListingReadRepo.getAll.mockResolvedValue(
				mockListings,
			);
		});

		When('the queryAll command is executed', async () => {
			const queryAllFn = queryAll(mockDataSources);
			result = await queryAllFn(command);
		});

		Then('3 listings should be returned', () => {
			expect(result).toBeDefined();
			expect(result.length).toBe(3);
		});
	});

	Scenario(
		'Retrieving all listings when none exist',
		({ Given, When, Then }) => {
			Given('there are no listings in the system', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).Listing.ItemListing.ItemListingReadRepo.getAll.mockResolvedValue([]);
			});

			When('the queryAll command is executed', async () => {
				const queryAllFn = queryAll(mockDataSources);
				result = await queryAllFn(command);
			});

			Then('an empty array should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(0);
			});
		},
	);
});
