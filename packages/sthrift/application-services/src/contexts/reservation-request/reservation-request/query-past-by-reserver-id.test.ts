import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	queryPastByReserverId,
	type ReservationRequestQueryPastByReserverIdCommand,
} from './query-past-by-reserver-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-past-by-reserver-id.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ReservationRequestQueryPastByReserverIdCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getPastByReserverIdWithListingWithSharer: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { reserverId: 'user-123' };
		result = undefined;
	});

	Scenario(
		'Successfully retrieving past reservation requests for a reserver',
		({ Given, And, When, Then }) => {
			Given('a valid reserver ID "user-123"', () => {
				command = { reserverId: 'user-123' };
			});

			And('the reserver has 2 past reservation requests', () => {
				const mockRequests = [
					{
						id: 'req-old-1',
						state: 'Completed',
						reserver: { id: 'user-123' },
						listing: { id: 'listing-1' },
					},
					{
						id: 'req-old-2',
						state: 'Completed',
						reserver: { id: 'user-123' },
						listing: { id: 'listing-2' },
					},
				];
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getPastByReserverIdWithListingWithSharer.mockResolvedValue(
					mockRequests,
				);
			});

			When('the queryPastByReserverId command is executed', async () => {
				const queryFn = queryPastByReserverId(mockDataSources);
				result = await queryFn(command);
			});

			Then('2 reservation requests should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(2);
			});
		},
	);

	Scenario(
		'Retrieving past requests for reserver with no past requests',
		({ Given, And, When, Then }) => {
			Given('a valid reserver ID "user-456"', () => {
				command = { reserverId: 'user-456' };
			});

			And('the reserver has no past reservation requests', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getPastByReserverIdWithListingWithSharer.mockResolvedValue(
					[],
				);
			});

			When('the queryPastByReserverId command is executed', async () => {
				const queryFn = queryPastByReserverId(mockDataSources);
				result = await queryFn(command);
			});

			Then('an empty array should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(0);
			});
		},
	);
});
