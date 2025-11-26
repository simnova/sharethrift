import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	queryActiveByReserverId,
	type ReservationRequestQueryActiveByReserverIdCommand,
} from './query-active-by-reserver-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-active-by-reserver-id.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ReservationRequestQueryActiveByReserverIdCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getActiveByReserverIdWithListingWithSharer: vi.fn(),
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
		'Successfully retrieving active reservation requests for a reserver',
		({ Given, And, When, Then }) => {
			Given('a valid reserver ID "user-123"', () => {
				command = { reserverId: 'user-123' };
			});

			And('the reserver has 3 active reservation requests', () => {
				const mockRequests = [
					{
						id: 'req-1',
						state: 'Requested',
						reserver: { id: 'user-123' },
						listing: { id: 'listing-1', sharer: { id: 'sharer-1' } },
					},
					{
						id: 'req-2',
						state: 'Requested',
						reserver: { id: 'user-123' },
						listing: { id: 'listing-2', sharer: { id: 'sharer-1' } },
					},
					{
						id: 'req-3',
						state: 'Requested',
						reserver: { id: 'user-123' },
						listing: { id: 'listing-3', sharer: { id: 'sharer-2' } },
					},
				];
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getActiveByReserverIdWithListingWithSharer.mockResolvedValue(
					mockRequests,
				);
			});

			When('the queryActiveByReserverId command is executed', async () => {
				const queryFn = queryActiveByReserverId(mockDataSources);
				result = await queryFn(command);
			});

			Then('3 reservation requests should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(3);
			});
		},
	);

	Scenario(
		'Retrieving active reservation requests for reserver with no requests',
		({ Given, And, When, Then }) => {
			Given('a valid reserver ID "user-456"', () => {
				command = { reserverId: 'user-456' };
			});

			And('the reserver has no active reservation requests', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getActiveByReserverIdWithListingWithSharer.mockResolvedValue(
					[],
				);
			});

			When('the queryActiveByReserverId command is executed', async () => {
				const queryFn = queryActiveByReserverId(mockDataSources);
				result = await queryFn(command);
			});

			Then('an empty array should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(0);
			});
		},
	);
});
