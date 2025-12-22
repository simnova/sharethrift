import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { cancel, type ReservationRequestCancelCommand } from './cancel.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/cancel.feature'),
);

function buildReservation({
	id,
	state,
	reserverId,
}: {
	id: string;
	state: 'Requested' | 'Rejected' | 'Accepted';
	reserverId: string;
}) {
	let currentState = state;
	return {
		id,
		get state() {
			return currentState;
		},
		set state(value: string) {
			// Simulate domain entity state validation
			if (value === 'Cancelled') {
				if (currentState !== 'Requested' && currentState !== 'Rejected') {
					throw new Error('Cannot cancel reservation in current state');
				}
			}
			currentState = value;
		},
		loadReserver: vi.fn().mockResolvedValue({ id: reserverId }),
	};
}

function mockTransaction({
	dataSources,
	getByIdReturn,
	saveReturn,
}: {
	dataSources: DataSources;
	getByIdReturn?: unknown;
	saveReturn?: unknown;
}) {
	(
        // biome-ignore lint/suspicious/noExplicitAny: Test mock access
		dataSources.domainDataSource as any
	).ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork.withScopedTransaction.mockImplementation(
		// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
		async (callback: any) => {
			const mockRepo = {
				getById: vi.fn().mockResolvedValue(getByIdReturn),
				save: vi.fn().mockResolvedValue(saveReturn),
			};
			await callback(mockRepo);
		},
	);
}

async function runCancel(
	dataSources: DataSources,
	command: ReservationRequestCancelCommand,
) {
	const cancelFn = cancel(dataSources);
	try {
		const result = await cancelFn(command);
		return { result, error: undefined };
	} catch (err) {
		return { result: undefined, error: err };
	}
}

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ReservationRequestCancelCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let error: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			domainDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestUnitOfWork: {
							withScopedTransaction: vi.fn(async (callback) => {
								const mockRepo = {
									getById: vi.fn(),
									save: vi.fn(),
								};
								await callback(mockRepo);
							}),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { id: 'reservation-123', callerId: 'user-123' };
		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully cancelling a requested reservation',
		({ Given, And, When, Then }) => {
			Given('a valid reservation request ID "reservation-123"', () => {
				command = { id: 'reservation-123', callerId: 'user-123' };
			});

			And('the reservation request exists and is in requested state', () => {
				const mockReservationRequest = buildReservation({
					id: command.id,
					state: 'Requested',
					reserverId: command.callerId,
				});

				mockTransaction({
					dataSources: mockDataSources,
					getByIdReturn: mockReservationRequest,
					saveReturn: { ...mockReservationRequest, state: 'Cancelled' },
				});
			});

			When('the cancel command is executed', async () => {
				const outcome = await runCancel(mockDataSources, command);
				result = outcome.result;
				error = outcome.error;
			});

			Then('the reservation request should be cancelled', () => {
				expect(error).toBeUndefined();
				expect(result).toBeDefined();
				expect(result.state).toBe('Cancelled');
			});
		},
	);

	Scenario(
		'Successfully cancelling a rejected reservation',
		({ Given, And, When, Then }) => {
			Given('a reservation request ID "reservation-rejected"', () => {
				command = { id: 'reservation-rejected', callerId: 'user-123' };
			});

			And('the reservation request exists and is in rejected state', () => {
				const mockReservationRequest = buildReservation({
					id: command.id,
					state: 'Rejected',
					reserverId: command.callerId,
				});

				mockTransaction({
					dataSources: mockDataSources,
					getByIdReturn: mockReservationRequest,
					saveReturn: { ...mockReservationRequest, state: 'Cancelled' },
				});
			});

			When('the cancel command is executed', async () => {
				const outcome = await runCancel(mockDataSources, command);
				result = outcome.result;
				error = outcome.error;
			});

			Then('the reservation request should be cancelled', () => {
				expect(error).toBeUndefined();
				expect(result).toBeDefined();
				expect(result.state).toBe('Cancelled');
			});
		},
	);

	Scenario(
		'Attempting to cancel a non-existent reservation request',
		({ Given, And, When, Then }) => {
			Given('a reservation request ID "reservation-999"', () => {
				command = { id: 'reservation-999', callerId: 'user-123' };
			});

			And('the reservation request does not exist', () => {
				mockTransaction({
					dataSources: mockDataSources,
					getByIdReturn: undefined,
					saveReturn: undefined,
				});
			});

			When('the cancel command is executed', async () => {
				const outcome = await runCancel(mockDataSources, command);
				result = outcome.result;
				error = outcome.error;
			});

			Then('an error "Reservation request not found" should be thrown', () => {
				expect(error).toBeDefined();
				expect(error.message).toBe('Reservation request not found');
			});
		},
	);

	Scenario(
		'Cancel fails when save returns undefined',
		({ Given, And, When, Then }) => {
			Given('a valid reservation request ID "reservation-456"', () => {
				command = { id: 'reservation-456', callerId: 'user-123' };
			});

			And('the reservation request exists', () => {
				// Reservation request exists check
			});

			And('save returns undefined', () => {
				const mockReservationRequest = buildReservation({
					id: command.id,
					state: 'Requested',
					reserverId: command.callerId,
				});

				mockTransaction({
					dataSources: mockDataSources,
					getByIdReturn: mockReservationRequest,
					saveReturn: undefined,
				});
			});

			When('the cancel command is executed', async () => {
				const outcome = await runCancel(mockDataSources, command);
				result = outcome.result;
				error = outcome.error;
			});

			Then(
				'an error "Reservation request not cancelled" should be thrown',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe('Reservation request not cancelled');
				},
			);
		},
	);

	Scenario(
		'Cancellation fails when reservation is in Accepted state',
		({ Given, And, When, Then }) => {
			Given('a reservation request ID "reservation-accepted"', () => {
				command = { id: 'reservation-accepted', callerId: 'user-123' };
			});

			And('the reservation request is in Accepted state', () => {
				const mockReservationRequest = buildReservation({
					id: command.id,
					state: 'Accepted',
					reserverId: command.callerId,
				});

				mockTransaction({
					dataSources: mockDataSources,
					getByIdReturn: mockReservationRequest,
					saveReturn: undefined,
				});
			});

			When('the cancel command is executed', async () => {
				const outcome = await runCancel(mockDataSources, command);
				result = outcome.result;
				error = outcome.error;
			});

			Then(
				'an error "Cannot cancel reservation in current state" should be thrown',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe(
						'Cannot cancel reservation in current state',
					);
				},
			);
		},
	);

	Scenario(
		'Authorization failure when caller is not the reserver',
		({ Given, And, When, Then }) => {
			Given('a reservation request ID "reservation-789"', () => {
				command = { id: 'reservation-789', callerId: 'user-999' };
			});

			And('the reservation request belongs to a different user', () => {
				const mockReservationRequest = buildReservation({
					id: command.id,
					state: 'Requested',
					reserverId: 'user-123', // Different from command.callerId
				});

				mockTransaction({
					dataSources: mockDataSources,
					getByIdReturn: mockReservationRequest,
					saveReturn: undefined,
				});
			});

			When('the cancel command is executed', async () => {
				const outcome = await runCancel(mockDataSources, command);
				result = outcome.result;
				error = outcome.error;
			});

			Then(
				'an error "Only the reserver can cancel their reservation request" should be thrown',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe(
						'Only the reserver can cancel their reservation request',
					);
				},
			);
		},
	);
});
