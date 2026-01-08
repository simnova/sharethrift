import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	update,
	type ReservationRequestUpdateCommand,
} from './update.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/update.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ReservationRequestUpdateCommand;
	let result:
		| Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference
		| undefined;
	let error: Error | unknown;
	let mockReservationRequest: Partial<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference>;
	let mockRepo: Pick<
		Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestRepository<Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps>,
		'getById' | 'save'
	>;

	BeforeEachScenario(() => {
		mockReservationRequest = {
			id: 'req-123',
			state: 'Requested',
			closeRequestedBy: null,
			reservationPeriodStart: new Date('2024-01-01'),
			reservationPeriodEnd: new Date('2024-01-07'),
			loadListing: vi.fn().mockResolvedValue({ id: 'listing-456' }),
		};

		mockRepo = {
			getById: vi.fn().mockResolvedValue(mockReservationRequest),
			save: vi.fn().mockImplementation((request) => Promise.resolve(request)),
		};

		mockDataSources = {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							queryOverlapByListingIdAndReservationPeriod: vi.fn(),
						},
					},
				},
			},
			domainDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestUnitOfWork: {
							withScopedTransaction: vi.fn().mockImplementation(
								// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
								async (callback: any) => {
									await callback(mockRepo);
								},
							),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {
			id: 'req-123',
		};

		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully updating a reservation request state to Accepted',
		({ Given, And, When, Then }) => {
			Given('a reservation request ID "req-123"', () => {
				// Already set in command
			});

			And('the reservation request exists with state "Requested"', () => {
				// Already set up in BeforeEachScenario
			});

			When('the update command is executed with state "Accepted"', async () => {
				command.state = 'Accepted';

				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.queryOverlapByListingIdAndReservationPeriod.mockResolvedValue(
					[],
				);

				const updateFn = update(mockDataSources);
				result = await updateFn(command);
			});

			Then(
				'the reservation request state should be updated to "Accepted"',
				() => {
					expect(mockReservationRequest.state).toBe('Accepted');
				},
			);

			And('the update operation should succeed', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('req-123');
			});
		},
	);

	Scenario(
		'Successfully updating closeRequestedBy to SHARER',
		({ Given, And, When, Then }) => {
			Given('a reservation request ID "req-123"', () => {
				// Already set in command
			});

			And('the reservation request exists with state "Accepted"', () => {
				mockReservationRequest.state = 'Accepted';
			});

			When(
				'the update command is executed with closeRequestedBy "SHARER"',
				async () => {
					command.closeRequestedBy = 'SHARER';

					const updateFn = update(mockDataSources);
					result = await updateFn(command);
				},
			);

			Then('closeRequestedBy should be "SHARER"', () => {
				expect(mockReservationRequest.closeRequestedBy).toBe('SHARER');
			});

			And('the update operation should succeed', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('req-123');
			});
		},
	);

	Scenario(
		'Successfully updating closeRequestedBy to RESERVER',
		({ Given, And, When, Then }) => {
			Given('a reservation request ID "req-123"', () => {
				// Already set in command
			});

			And('the reservation request exists with state "Accepted"', () => {
				mockReservationRequest.state = 'Accepted';
			});

			When(
				'the update command is executed with closeRequestedBy "RESERVER"',
				async () => {
					command.closeRequestedBy = 'RESERVER';

					const updateFn = update(mockDataSources);
					result = await updateFn(command);
				},
			);

			Then('closeRequestedBy should be "RESERVER"', () => {
				expect(mockReservationRequest.closeRequestedBy).toBe('RESERVER');
			});

			And('the update operation should succeed', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('req-123');
			});
		},
	);

	Scenario(
		'Auto-rejecting overlapping requests when accepting a request',
		({ Given, And, When, Then }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
			let overlappingRequest1: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
			let overlappingRequest2: any;

			Given('a reservation request ID "req-123"', () => {
				// Already set in command
			});

			And('the reservation request exists with state "Requested"', () => {
				// Already set up in BeforeEachScenario
			});

			And('the reservation request has listing ID "listing-456"', () => {
				// Already mocked in loadListing
			});

			And(
				'there are overlapping pending requests for the same listing',
				() => {
					overlappingRequest1 = {
						id: 'req-456',
						state: 'Requested',
					};
					overlappingRequest2 = {
						id: 'req-789',
						state: 'Requested',
					};

					(
						// biome-ignore lint/suspicious/noExplicitAny: Test mock access
						mockDataSources.readonlyDataSource as any
					).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.queryOverlapByListingIdAndReservationPeriod.mockResolvedValue(
						[
							{ id: 'req-123', state: 'Requested' }, // Self
							overlappingRequest1,
							overlappingRequest2,
						],
					);

					// Mock the repo.getById to return different requests based on ID
					mockRepo.getById.mockImplementation((id: string) => {
						if (id === 'req-123') return Promise.resolve(mockReservationRequest);
						if (id === 'req-456') return Promise.resolve(overlappingRequest1);
						if (id === 'req-789') return Promise.resolve(overlappingRequest2);
						return Promise.resolve(null);
					});
				},
			);

			When('the update command is executed with state "Accepted"', async () => {
				command.state = 'Accepted';

				const updateFn = update(mockDataSources);
				result = await updateFn(command);
			});

			Then(
				'the reservation request state should be updated to "Accepted"',
				() => {
					expect(mockReservationRequest.state).toBe('Accepted');
				},
			);

			And(
				'all overlapping pending requests should be automatically rejected',
				() => {
					expect(overlappingRequest1.state).toBe('Rejected');
					expect(overlappingRequest2.state).toBe('Rejected');
				},
			);
		},
	);

	Scenario(
		'Updating a reservation request that does not exist',
		({ Given, When, Then }) => {
			Given('a reservation request ID "req-999" that does not exist', () => {
				command.id = 'req-999';
				mockRepo.getById.mockResolvedValue(null);
			});

			When('the update command is executed with state "Accepted"', async () => {
				command.state = 'Accepted';

				const updateFn = update(mockDataSources);
				try {
					await updateFn(command);
				} catch (e) {
					error = e;
				}
			});

			Then(
				'an error should be thrown with message "Reservation request not found"',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe('Reservation request not found');
				},
			);
		},
	);

	Scenario(
		'Updating multiple fields at once',
		({ Given, And, When, Then }) => {
			Given('a reservation request ID "req-123"', () => {
				// Already set in command
			});

			And('the reservation request exists with state "Requested"', () => {
				// Already set up in BeforeEachScenario
			});

			When(
				'the update command is executed with state "Accepted" and closeRequestedBy "SHARER"',
				async () => {
					command.state = 'Accepted';
					command.closeRequestedBy = 'SHARER';

					(
						// biome-ignore lint/suspicious/noExplicitAny: Test mock access
						mockDataSources.readonlyDataSource as any
					).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.queryOverlapByListingIdAndReservationPeriod.mockResolvedValue(
						[],
					);

					const updateFn = update(mockDataSources);
					result = await updateFn(command);
				},
			);

			Then(
				'the reservation request state should be updated to "Accepted"',
				() => {
					expect(mockReservationRequest.state).toBe('Accepted');
				},
			);

			And('closeRequestedBy should be "SHARER"', () => {
				expect(mockReservationRequest.closeRequestedBy).toBe('SHARER');
			});

			And('the update operation should succeed', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('req-123');
			});
		},
	);

	Scenario(
		'Auto-reject continues when individual rejection fails',
		({ Given, And, When, Then }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
			let overlappingRequest1: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
			let overlappingRequest2: any;

			Given('a reservation request ID "req-123"', () => {
				// Already set in command
			});

			And('there are multiple overlapping requests', () => {
				overlappingRequest1 = {
					id: 'req-456',
					state: 'Requested',
				};
				overlappingRequest2 = {
					id: 'req-789',
					state: 'Requested',
				};

				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.queryOverlapByListingIdAndReservationPeriod.mockResolvedValue(
					[
						{ id: 'req-123', state: 'Requested' },
						overlappingRequest1,
						overlappingRequest2,
					],
				);
			});

			And('one rejection will fail', () => {
				// First call returns the request, second call throws error, third succeeds
				mockRepo.getById
					.mockResolvedValueOnce(mockReservationRequest) // Main request
					.mockRejectedValueOnce(new Error('Database error')) // First overlap fails
					.mockResolvedValueOnce(overlappingRequest2); // Second overlap succeeds
			});

			When('the update command is executed with state "Accepted"', async () => {
				command.state = 'Accepted';

				const updateFn = update(mockDataSources);
				result = await updateFn(command);
			});

			Then('the main request should still be accepted', () => {
				expect(mockReservationRequest.state).toBe('Accepted');
				expect(result).toBeDefined();
			});

			And('the second overlapping request should be rejected', () => {
				expect(overlappingRequest2.state).toBe('Rejected');
			});
		},
	);

	Scenario(
		'Update succeeds even when auto-reject query fails',
		({ Given, And, When, Then }) => {
			Given('a reservation request ID "req-123"', () => {
				// Already set in command
			});

			And('the overlap query will fail', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.queryOverlapByListingIdAndReservationPeriod.mockRejectedValue(
					new Error('Query failed'),
				);
			});

			When('the update command is executed with state "Accepted"', async () => {
				command.state = 'Accepted';

				const updateFn = update(mockDataSources);
				result = await updateFn(command);
			});

			Then(
				'the main update should still succeed despite auto-reject failure',
				() => {
					expect(mockReservationRequest.state).toBe('Accepted');
					expect(result).toBeDefined();
					expect(result?.id).toBe('req-123');
				},
			);
		},
	);
});
