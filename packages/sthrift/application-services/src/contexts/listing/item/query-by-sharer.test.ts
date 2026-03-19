import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type ItemListingQueryBySharerCommand,
	queryBySharer,
} from './query-by-sharer.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-sharer.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ItemListingQueryBySharerCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				Listing: {
					ItemListing: {
						ItemListingReadRepo: {
							getBySharer: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { personalUser: 'user-123' };
		result = undefined;
	});

	Scenario(
		'Successfully retrieving listings for a sharer',
		({ Given, And, When, Then }) => {
			Given('a valid sharer ID "user-123"', () => {
				command.personalUser = 'user-123';
			});

			And('the sharer has 2 listings', () => {
				const mockListings = [
					{ id: 'listing-1', title: 'Lawnmower', sharer: { id: 'user-123' } },
					{ id: 'listing-2', title: 'Drill', sharer: { id: 'user-123' } },
				];
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).Listing.ItemListing.ItemListingReadRepo.getBySharer.mockResolvedValue(
					mockListings,
				);
			});

			When('the queryBySharer command is executed', async () => {
				const queryBySharerFn = queryBySharer(mockDataSources);
				result = await queryBySharerFn(command);
			});

			Then('2 listings should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(2);
			});
		},
	);

	Scenario(
		'Retrieving listings for sharer with no listings',
		({ Given, And, When, Then }) => {
			Given('a valid sharer ID "user-456"', () => {
				command.personalUser = 'user-456';
			});

			And('the sharer has no listings', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).Listing.ItemListing.ItemListingReadRepo.getBySharer.mockResolvedValue(
					[],
				);
			});

			When('the queryBySharer command is executed', async () => {
				const queryBySharerFn = queryBySharer(mockDataSources);
				result = await queryBySharerFn(command);
			});

			Then('an empty array should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(0);
			});
		},
	);
});
