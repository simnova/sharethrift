import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	queryListingRequestsBySharerId,
	type ReservationRequestQueryListingRequestsBySharerIdCommand,
} from './query-listing-requests-by-sharer-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/query-listing-requests-by-sharer-id.feature',
	),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ReservationRequestQueryListingRequestsBySharerIdCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getListingRequestsBySharerId: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { sharerId: 'user-123' };
		result = undefined;
	});

	Scenario(
		"Successfully retrieving reservation requests for sharer's listings",
		({ Given, And, When, Then }) => {
			Given('a valid sharer ID "user-123"', () => {
				command = { sharerId: 'user-123' };
			});

			And('the sharer has listings with 4 reservation requests', () => {
				const mockRequests = [
					{
						id: 'req-1',
						state: 'Requested',
						listing: { id: 'listing-1', sharer: { id: 'sharer-123' } },
					},
					{
						id: 'req-2',
						state: 'Requested',
						listing: { id: 'listing-1', sharer: { id: 'sharer-123' } },
					},
					{
						id: 'req-3',
						state: 'Requested',
						listing: { id: 'listing-2', sharer: { id: 'sharer-123' } },
					},
					{
						id: 'req-4',
						state: 'Requested',
						listing: { id: 'listing-2', sharer: { id: 'sharer-123' } },
					},
				];
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getListingRequestsBySharerId.mockResolvedValue(
					mockRequests,
				);
			});

			When(
				'the queryListingRequestsBySharerId command is executed',
				async () => {
					const queryFn = queryListingRequestsBySharerId(mockDataSources);
					result = await queryFn(command);
				},
			);

			Then('4 reservation requests should be returned', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(4);
			});
		},
	);

	Scenario(
		'Retrieving requests for sharer with no listings or requests',
		({ Given, And, When, Then }) => {
			Given('a valid sharer ID "user-456"', () => {
				command = { sharerId: 'user-456' };
			});

			And('the sharer has no reservation requests', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getListingRequestsBySharerId.mockResolvedValue(
					[],
				);
			});

			When(
				'the queryListingRequestsBySharerId command is executed',
				async () => {
					const queryFn = queryListingRequestsBySharerId(mockDataSources);
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
