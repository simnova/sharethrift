import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	queryActiveByListingId,
	type ReservationRequestQueryActiveByListingIdCommand,
} from './query-active-by-listing-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-active-by-listing-id.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ReservationRequestQueryActiveByListingIdCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getActiveByListingId: vi.fn(),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { listingId: 'listing-123' };
		result = undefined;
	});

	Scenario(
		'Successfully retrieving active reservation requests for a listing',
		({ Given, And, When, Then }) => {
			Given('a valid listing ID "listing-123"', () => {
				command = { listingId: 'listing-123' };
			});

			And('there are 2 active reservation requests for the listing', () => {
				const mockRequests = [
					{ id: 'req-1', state: 'Requested', listing: { id: 'listing-123' } },
					{ id: 'req-2', state: 'Requested', listing: { id: 'listing-123' } },
				];

				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				(
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getActiveByListingId.mockResolvedValue(
					mockRequests,
				);
			});

			When('the queryActiveByListingId command is executed', async () => {
				const queryFn = queryActiveByListingId(mockDataSources);
				result = await queryFn(command);
			});

			Then('2 reservation requests should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(2);
			});
		},
	);

	Scenario(
		'Retrieving active reservation requests for listing with no requests',
		({ Given, And, When, Then }) => {
			Given('a valid listing ID "listing-456"', () => {
				command = { listingId: 'listing-456' };
			});

			And('there are no active reservation requests for the listing', () => {
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				(
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getActiveByListingId.mockResolvedValue(
					[],
				);
			});

			When('the queryActiveByListingId command is executed', async () => {
				const queryFn = queryActiveByListingId(mockDataSources);
				result = await queryFn(command);
			});

			Then('an empty array should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(0);
			});
		},
	);
});
