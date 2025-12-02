import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type ReservationRequestQueryOverlapByListingIdAndReservationPeriodCommand,
	queryOverlapByListingIdAndReservationPeriod,
} from './query-overlap-by-listing-id-and-reservation-period.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-overlap.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ReservationRequestQueryOverlapByListingIdAndReservationPeriodCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getOverlapActiveReservationRequestsForListing: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {
			listingId: 'listing-123',
			reservationPeriodStart: new Date('2024-01-05'),
			reservationPeriodEnd: new Date('2024-01-10'),
		};
		result = undefined;
	});

	Scenario(
		'Finding overlapping active reservation requests',
		({ Given, And, When, Then }) => {
			Given('a valid listing ID "listing-123"', () => {
				command.listingId = 'listing-123';
			});

			And('a reservation period from "2024-01-05" to "2024-01-10"', () => {
				command.reservationPeriodStart = new Date('2024-01-05');
				command.reservationPeriodEnd = new Date('2024-01-10');
			});

			And('there are active requests that overlap this period', () => {
				const overlappingRequests = [
					{
						id: 'req-overlap-1',
						state: 'Requested',
						listing: { id: 'listing-123' },
						reservationPeriodStart: new Date('2024-01-01'),
						reservationPeriodEnd: new Date('2024-01-07'),
					},
					{
						id: 'req-overlap-2',
						state: 'Requested',
						listing: { id: 'listing-123' },
						reservationPeriodStart: new Date('2024-01-08'),
						reservationPeriodEnd: new Date('2024-01-15'),
					},
				];
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getOverlapActiveReservationRequestsForListing.mockResolvedValue(
					overlappingRequests,
				);
			});

			When(
				'the queryOverlapByListingIdAndReservationPeriod command is executed',
				async () => {
					const queryFn =
						queryOverlapByListingIdAndReservationPeriod(mockDataSources);
					result = await queryFn(command);
				},
			);

			Then('the overlapping reservation requests should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(2);
			});
		},
	);

	Scenario(
		'No overlapping active reservation requests found',
		({ Given, And, When, Then }) => {
			Given('a valid listing ID "listing-123"', () => {
				command.listingId = 'listing-123';
			});

			And('a reservation period from "2024-02-01" to "2024-02-07"', () => {
				command.reservationPeriodStart = new Date('2024-02-01');
				command.reservationPeriodEnd = new Date('2024-02-07');
			});

			And('there are no active requests that overlap this period', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getOverlapActiveReservationRequestsForListing.mockResolvedValue(
					[],
				);
			});

			When(
				'the queryOverlapByListingIdAndReservationPeriod command is executed',
				async () => {
					const queryFn =
						queryOverlapByListingIdAndReservationPeriod(mockDataSources);
					result = await queryFn(command);
				},
			);

			Then('an empty array should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(0);
			});
		},
	);
});
