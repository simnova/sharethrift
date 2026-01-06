import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type ScheduleDeletionByListingCommand,
	type ScheduleDeletionResult,
	scheduleDeletionByListing,
} from './schedule-deletion-by-listing.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/schedule-deletion-by-listing.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let command: ScheduleDeletionByListingCommand;
	let result: ScheduleDeletionResult | undefined;
	let thrownError: Error | undefined;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getByListingId: vi.fn(),
		};

		mockUnitOfWork = {
			withScopedTransaction: vi.fn(),
		};

		mockDataSources = {
			readonlyDataSource: {
				Conversation: {
					Conversation: {
						ConversationReadRepo: mockReadRepo,
					},
				},
			},
			domainDataSource: {
				Conversation: {
					Conversation: {
						ConversationUnitOfWork: mockUnitOfWork,
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		result = undefined;
		thrownError = undefined;
	});

	Scenario(
		'Successfully scheduling deletion for conversations',
		({ Given, When, Then, And }) => {
			let mockConversations: {
				id: string;
				scheduleForDeletion: ReturnType<typeof vi.fn>;
			}[];

			Given('a valid listing ID "listing-123"', () => {
				command = {
					listingId: 'listing-123',
					archivalDate: new Date('2025-01-15'),
				};
			});

			And('an archival date of "2025-01-15"', () => {
				// Already set in the command
			});

			And('2 conversations exist for the listing', () => {
				mockConversations = [
					{
						id: 'conv-1',
						scheduleForDeletion: vi.fn(),
					},
					{
						id: 'conv-2',
						scheduleForDeletion: vi.fn(),
					},
				];

				mockReadRepo.getByListingId.mockResolvedValue(mockConversations);

				mockUnitOfWork.withScopedTransaction.mockImplementation(
					async (
						callback: (repo: {
							get: typeof vi.fn;
							save: typeof vi.fn;
						}) => Promise<void>,
					) => {
						const mockRepo = {
							get: vi.fn((id: string) =>
								mockConversations.find((c) => c.id === id),
							),
							save: vi.fn(),
						};
						await callback(mockRepo);
					},
				);
			});

			When('the scheduleDeletionByListing command is executed', async () => {
				const scheduleDeletionFn = scheduleDeletionByListing(mockDataSources);
				result = await scheduleDeletionFn(command);
			});

			Then('the result should show 2 conversations scheduled', () => {
				expect(result).toBeDefined();
				expect(result?.scheduledCount).toBe(2);
			});

			And('all conversation IDs should be returned', () => {
				expect(result?.conversationIds).toEqual(['conv-1', 'conv-2']);
			});

			And(
				'the expiresAt should be set to 6 months after the archival date',
				() => {
					for (const conv of mockConversations) {
						expect(conv.scheduleForDeletion).toHaveBeenCalledWith(
							command.archivalDate,
						);
					}
				},
			);
		},
	);

	Scenario(
		'Scheduling deletion when no conversations exist',
		({ Given, When, Then, And }) => {
			Given('a valid listing ID "listing-no-convos"', () => {
				command = {
					listingId: 'listing-no-convos',
					archivalDate: new Date('2025-01-15'),
				};
			});

			And('an archival date of "2025-01-15"', () => {
				// Already set in the command
			});

			And('no conversations exist for the listing', () => {
				mockReadRepo.getByListingId.mockResolvedValue([]);
			});

			When('the scheduleDeletionByListing command is executed', async () => {
				const scheduleDeletionFn = scheduleDeletionByListing(mockDataSources);
				result = await scheduleDeletionFn(command);
			});

			Then('the result should show 0 conversations scheduled', () => {
				expect(result).toBeDefined();
				expect(result?.scheduledCount).toBe(0);
			});

			And('an empty array of conversation IDs should be returned', () => {
				expect(result?.conversationIds).toEqual([]);
			});
		},
	);

	Scenario(
		'Handling errors during scheduling',
		({ Given, When, Then, And }) => {
			Given('a valid listing ID "listing-error"', () => {
				command = {
					listingId: 'listing-error',
					archivalDate: new Date('2025-01-15'),
				};
			});

			And('an archival date of "2025-01-15"', () => {
				// Already set in the command
			});

			And('the repository throws an error', () => {
				mockReadRepo.getByListingId.mockRejectedValue(
					new Error('Database connection failed'),
				);
			});

			When('the scheduleDeletionByListing command is executed', async () => {
				const scheduleDeletionFn = scheduleDeletionByListing(mockDataSources);
				try {
					result = await scheduleDeletionFn(command);
				} catch (error) {
					thrownError = error as Error;
				}
			});

			Then('an error should be thrown', () => {
				expect(thrownError).toBeDefined();
				expect(thrownError?.message).toBe('Database connection failed');
			});
		},
	);
});
