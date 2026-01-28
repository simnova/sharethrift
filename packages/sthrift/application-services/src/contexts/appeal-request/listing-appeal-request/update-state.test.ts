import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type UpdateListingAppealRequestStateCommand,
	updateState,
} from './update-state.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/update-state.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let command: UpdateListingAppealRequestStateCommand;
	let result:
		| Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference
		| undefined;
	let error: Error | undefined;

	BeforeEachScenario(() => {
		mockRepo = {
			getById: vi.fn(),
			save: vi.fn(),
		};

		mockUnitOfWork = {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			withScopedTransaction: vi.fn(async (callback: any) => {
				return await callback(mockRepo);
			}),
		};

		mockDataSources = {
			domainDataSource: {
				AppealRequest: {
					ListingAppealRequest: {
						ListingAppealRequestUnitOfWork: mockUnitOfWork,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully updating appeal request state to accepted',
		({ Given, When, Then, And }) => {
			Given('a valid appeal request ID "appeal-123"', () => {
				command = { id: 'appeal-123', state: 'accepted' };
			});

			And('the new state is "accepted"', () => {
				const mockAppealRequest = {
					id: 'appeal-123',
					state: 'requested',
				};
				mockRepo.getById.mockResolvedValue(mockAppealRequest);
				mockRepo.save.mockResolvedValue({
					...mockAppealRequest,
					state: 'accepted',
				});
			});

			When('the updateState command is executed', async () => {
				try {
					const updateStateFn = updateState(mockDataSources);
					result = await updateStateFn(command);
				} catch (_err) {
					error = _err as Error;
				}
			});

			Then('the appeal request state should be updated', () => {
				expect(mockRepo.getById).toHaveBeenCalledWith('appeal-123');
			});

			And('the updated appeal request should be saved', () => {
				expect(mockRepo.save).toHaveBeenCalled();
			});

			And('the updated entity reference should be returned', () => {
				expect(result).toBeDefined();
				expect(result?.state).toBe('accepted');
			});
		},
	);

	Scenario(
		'Successfully updating appeal request state to denied',
		({ Given, When, Then, And }) => {
			Given('a valid appeal request ID "appeal-123"', () => {
				command = { id: 'appeal-123', state: 'denied' };
			});

			And('the new state is "denied"', () => {
				const mockAppealRequest = {
					id: 'appeal-123',
					state: 'requested',
				};
				mockRepo.getById.mockResolvedValue(mockAppealRequest);
				mockRepo.save.mockResolvedValue({
					...mockAppealRequest,
					state: 'denied',
				});
			});

			When('the updateState command is executed', async () => {
				const updateStateFn = updateState(mockDataSources);
				result = await updateStateFn(command);
			});

			Then('the appeal request state should be updated to "denied"', () => {
				expect(result?.state).toBe('denied');
			});
		},
	);

	Scenario('Handling missing appeal request ID', ({ Given, When, Then }) => {
		Given('an empty appeal request ID', () => {
			command = { id: '', state: 'accepted' };
		});

		When('the updateState command is executed', async () => {
			try {
				const updateStateFn = updateState(mockDataSources);
				result = await updateStateFn(command);
			} catch (_err) {
				error = _err as Error;
			}
		});

		Then(
			'an error should be thrown indicating appeal request id is required',
			() => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('appeal request id is required');
			},
		);
	});

	Scenario('Handling non-existent appeal request', ({ Given, When, Then }) => {
		Given('a non-existent appeal request ID "invalid-id"', () => {
			command = { id: 'invalid-id', state: 'accepted' };
			mockRepo.getById.mockResolvedValue(null);
		});

		When('the updateState command is executed', async () => {
			try {
				const updateStateFn = updateState(mockDataSources);
				result = await updateStateFn(command);
			} catch (_err) {
				error = _err as Error;
			}
		});

		Then(
			'an error should be thrown indicating appeal request not found',
			() => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('appeal request not found');
			},
		);
	});

	Scenario('Handling save failure', ({ Given, When, Then }) => {
		Given('a valid appeal request ID "appeal-123"', () => {
			command = { id: 'appeal-123', state: 'accepted' };
			const mockAppealRequest = {
				id: 'appeal-123',
				state: 'requested',
			};
			mockRepo.getById.mockResolvedValue(mockAppealRequest);
			mockRepo.save.mockResolvedValue(undefined);
		});

		When('the updateState command is executed and save fails', async () => {
			try {
				const updateStateFn = updateState(mockDataSources);
				result = await updateStateFn(command);
			} catch (_err) {
				error = _err as Error;
			}
		});

		Then(
			'an error should be thrown indicating appeal request state update failed',
			() => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('appeal request state update failed');
			},
		);
	});
});
