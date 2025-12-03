import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type ReservationRequestQueryByIdCommand,
	queryById,
} from './query-by-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-id.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ReservationRequestQueryByIdCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getById: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { id: 'req-123' };
		result = undefined;
	});

	Scenario(
		'Successfully retrieving a reservation request by ID',
		({ Given, And, When, Then }) => {
			Given('a valid reservation request ID "req-123"', () => {
				command = { id: 'req-123' };
			});

			And('the reservation request exists', () => {
				const mockRequest = {
					id: 'req-123',
					state: 'Requested',
					listing: { id: 'listing-123' },
					reserver: { id: 'user-123' },
				};
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getById.mockResolvedValue(
					mockRequest,
				);
			});

			When('the queryById command is executed', async () => {
				const queryFn = queryById(mockDataSources);
				result = await queryFn(command);
			});

			Then('the reservation request should be returned', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('req-123');
			});
		},
	);

	Scenario(
		'Retrieving non-existent reservation request',
		({ Given, When, Then }) => {
			Given('a reservation request ID "req-999" that does not exist', () => {
				command = { id: 'req-999' };
			});

			When('the queryById command is executed', async () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getById.mockResolvedValue(
					null,
				);
				const queryFn = queryById(mockDataSources);
				result = await queryFn(command);
			});

			Then('null should be returned', () => {
				expect(result).toBeNull();
			});
		},
	);
});
