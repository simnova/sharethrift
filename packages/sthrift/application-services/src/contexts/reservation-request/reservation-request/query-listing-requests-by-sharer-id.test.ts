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
						createdAt: new Date('2024-01-01'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-05'),
						listing: {
							id: 'listing-1',
							title: 'Test Listing 1',
							images: ['image1.jpg'],
							sharer: { id: 'sharer-123' }
						},
						reserver: {
							id: 'reserver-1',
							account: {
								username: 'johndoe'
							}
						}
					},
					{
						id: 'req-2',
						state: 'Approved',
						createdAt: new Date('2024-01-02'),
						reservationPeriodStart: new Date('2024-02-10'),
						reservationPeriodEnd: new Date('2024-02-15'),
						listing: {
							id: 'listing-1',
							title: 'Test Listing 1',
							images: ['image1.jpg'],
							sharer: { id: 'sharer-123' }
						},
						reserver: {
							id: 'reserver-2',
							account: {
								username: 'janesmith'
							}
						}
					},
					{
						id: 'req-3',
						state: 'Requested',
						createdAt: new Date('2024-01-03'),
						reservationPeriodStart: new Date('2024-03-01'),
						reservationPeriodEnd: new Date('2024-03-03'),
						listing: {
							id: 'listing-2',
							title: 'Test Listing 2',
							images: ['image2.jpg'],
							sharer: { id: 'sharer-123' }
						},
						reserver: {
							id: 'reserver-3',
							account: {
								username: 'bobjohnson'
							}
						}
					},
					{
						id: 'req-4',
						state: 'Rejected',
						createdAt: new Date('2024-01-04'),
						reservationPeriodStart: new Date('2024-03-10'),
						reservationPeriodEnd: new Date('2024-03-12'),
						listing: {
							id: 'listing-2',
							title: 'Test Listing 2',
							images: [],
							sharer: { id: 'sharer-123' }
						},
						reserver: {
							id: 'reserver-4',
							account: {
								username: 'alicebrown'
							}
						}
					},
				];
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getListingRequestsBySharerId.mockResolvedValue(
					{
						items: mockRequests,
						total: 4,
						page: 1,
						pageSize: 10,
					},
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
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
				expect(result).toHaveProperty('page');
				expect(result).toHaveProperty('pageSize');
				expect(Array.isArray(result.items)).toBe(true);
				expect(result.items.length).toBe(4);
				expect(result.total).toBe(4);
				expect(result.page).toBe(1);
				expect(result.pageSize).toBe(10);

				// Check that items are domain entities (not formatted)
				expect(result.items[0]).toEqual({
					id: 'req-1',
					state: 'Requested',
					createdAt: new Date('2024-01-01'),
					reservationPeriodStart: new Date('2024-02-01'),
					reservationPeriodEnd: new Date('2024-02-05'),
					listing: {
						id: 'listing-1',
						title: 'Test Listing 1',
						images: ['image1.jpg'],
						sharer: { id: 'sharer-123' }
					},
					reserver: {
						id: 'reserver-1',
						account: {
							username: 'johndoe'
						}
					}
				});
				expect(result.items[1]).toEqual({
					id: 'req-2',
					state: 'Approved',
					createdAt: new Date('2024-01-02'),
					reservationPeriodStart: new Date('2024-02-10'),
					reservationPeriodEnd: new Date('2024-02-15'),
					listing: {
						id: 'listing-1',
						title: 'Test Listing 1',
						images: ['image1.jpg'],
						sharer: { id: 'sharer-123' }
					},
					reserver: {
						id: 'reserver-2',
						account: {
							username: 'janesmith'
						}
					}
				});
				expect(result.items[2]).toEqual({
					id: 'req-3',
					state: 'Requested',
					createdAt: new Date('2024-01-03'),
					reservationPeriodStart: new Date('2024-03-01'),
					reservationPeriodEnd: new Date('2024-03-03'),
					listing: {
						id: 'listing-2',
						title: 'Test Listing 2',
						images: ['image2.jpg'],
						sharer: { id: 'sharer-123' }
					},
					reserver: {
						id: 'reserver-3',
						account: {
							username: 'bobjohnson'
						}
					}
				});
				expect(result.items[3]).toEqual({
					id: 'req-4',
					state: 'Rejected',
					createdAt: new Date('2024-01-04'),
					reservationPeriodStart: new Date('2024-03-10'),
					reservationPeriodEnd: new Date('2024-03-12'),
					listing: {
						id: 'listing-2',
						title: 'Test Listing 2',
						images: [],
						sharer: { id: 'sharer-123' }
					},
					reserver: {
						id: 'reserver-4',
						account: {
							username: 'alicebrown'
						}
					}
				});
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
					{
						items: [],
						total: 0,
						page: 1,
						pageSize: 10,
					},
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
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
				expect(result).toHaveProperty('page');
				expect(result).toHaveProperty('pageSize');
				expect(Array.isArray(result.items)).toBe(true);
				expect(result.items.length).toBe(0);
				expect(result.total).toBe(0);
				expect(result.page).toBe(1);
				expect(result.pageSize).toBe(10);
			});
		},
	);
});
