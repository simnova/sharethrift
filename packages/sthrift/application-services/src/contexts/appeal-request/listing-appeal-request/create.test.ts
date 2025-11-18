import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type CreateListingAppealRequestCommand, create } from './create.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/create.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let command: CreateListingAppealRequestCommand;
	let result:
		| Domain.Contexts.AppealRequest.ListingAppealRequest.ListingAppealRequestEntityReference
		| undefined;
	let error: Error | undefined;
	BeforeEachScenario(() => {
		mockRepo = {
			getNewInstance: vi.fn(),
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

		command = {
			userId: 'user-123',
			listingId: 'listing-456',
			reason: 'Inappropriate content',
			blockerId: 'blocker-789',
		};

		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully creating a listing appeal request',
		({ Given, When, Then, And }) => {
			Given(
				'valid appeal request data with userId, listingId, reason, and blockerId',
				() => {
					const mockAppealRequest = {
						id: 'appeal-123',
						...command,
						state: 'requested',
					};
					mockRepo.getNewInstance.mockResolvedValue(mockAppealRequest);
					mockRepo.save.mockResolvedValue(mockAppealRequest);
				},
			);

			When('the create command is executed', async () => {
				try {
					const createFn = create(mockDataSources);
					result = await createFn(command);
				} catch (err) {
					error = err as Error;
				}
			});

			Then('a new listing appeal request should be created', () => {
				expect(mockRepo.getNewInstance).toHaveBeenCalledWith(
					command.userId,
					command.listingId,
					command.reason,
					command.blockerId,
				);
			});

			And('the appeal request should be saved to the repository', () => {
				expect(mockRepo.save).toHaveBeenCalled();
			});

			And('the appeal request entity reference should be returned', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('appeal-123');
			});
		},
	);

	Scenario('Handling repository save failure', ({ Given, When, Then }) => {
		Given('valid appeal request data', () => {
			mockRepo.getNewInstance.mockResolvedValue({ id: 'appeal-123' });
			mockRepo.save.mockResolvedValue(undefined);
		});

		When('the create command is executed and save fails', async () => {
			try {
				const createFn = create(mockDataSources);
				result = await createFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then(
			'an error should be thrown indicating failed to create listing appeal request',
			() => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Failed to create listing appeal request');
			},
		);
	});
});
