import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type CleanupResult,
	processConversationsForArchivedListings,
} from './cleanup-archived-conversations.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/cleanup-archived-conversations.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockListingReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockConversationReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let result: CleanupResult | undefined;
	let thrownError: Error | undefined;

	BeforeEachScenario(() => {
		mockListingReadRepo = {
			getByStates: vi.fn(),
		};

		mockConversationReadRepo = {
			getByListingId: vi.fn(),
		};

		mockUnitOfWork = {
			withScopedTransaction: vi.fn(),
		};

		mockDataSources = {
			readonlyDataSource: {
				Listing: {
					ItemListing: {
						ItemListingReadRepo: mockListingReadRepo,
					},
				},
				Conversation: {
					Conversation: {
						ConversationReadRepo: mockConversationReadRepo,
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
		'Successfully processing conversations for archived listings',
		({ Given, When, Then, And }) => {
			let mockConversations: {
				id: string;
				expiresAt: Date | undefined;
				scheduleForDeletion: ReturnType<typeof vi.fn>;
			}[];

			Given(
				'archived listings exist with states "Expired" and "Cancelled"',
				() => {
					mockListingReadRepo.getByStates.mockResolvedValue([
						{
							id: 'listing-1',
							state: 'Expired',
							updatedAt: new Date('2025-01-01'),
						},
						{
							id: 'listing-2',
							state: 'Cancelled',
							updatedAt: new Date('2025-01-02'),
						},
					]);
				},
			);

			And('each listing has conversations without expiration dates', () => {
				mockConversations = [
					{
						id: 'conv-1',
						expiresAt: undefined,
						scheduleForDeletion: vi.fn(),
					},
					{
						id: 'conv-2',
						expiresAt: undefined,
						scheduleForDeletion: vi.fn(),
					},
				];

				mockConversationReadRepo.getByListingId.mockResolvedValue([
					mockConversations[0],
				]);

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

			When(
				'the processConversationsForArchivedListings command is executed',
				async () => {
					result = await processConversationsForArchivedListings(mockDataSources);
				},
			);

			Then('the result should show the correct processed count', () => {
				expect(result).toBeDefined();
				expect(result?.processedCount).toBeGreaterThan(0);
			});

			And(
				'conversations without expiresAt should be scheduled for deletion',
				() => {
					expect(result?.scheduledCount).toBeGreaterThan(0);
				},
			);

			And('the timestamp should be set', () => {
				expect(result?.timestamp).toBeInstanceOf(Date);
			});
		},
	);

	Scenario(
		'Processing when no archived listings exist',
		({ Given, When, Then, And }) => {
			Given('no archived listings exist', () => {
				mockListingReadRepo.getByStates.mockResolvedValue([]);
			});

			When(
				'the processConversationsForArchivedListings command is executed',
				async () => {
					result = await processConversationsForArchivedListings(mockDataSources);
				},
			);

			Then('the result should show 0 processed', () => {
				expect(result?.processedCount).toBe(0);
			});

			And('the result should show 0 scheduled', () => {
				expect(result?.scheduledCount).toBe(0);
			});
		},
	);

	Scenario(
		'Skipping conversations that already have expiration dates',
		({ Given, When, Then, And }) => {
			Given('archived listings exist with conversations', () => {
				mockListingReadRepo.getByStates.mockResolvedValue([
					{
						id: 'listing-1',
						state: 'Expired',
						updatedAt: new Date('2025-01-01'),
					},
				]);
			});

			And('some conversations already have expiresAt set', () => {
				const conversationsWithExpiry = [
					{
						id: 'conv-already-scheduled',
						expiresAt: new Date('2025-07-01'),
						scheduleForDeletion: vi.fn(),
					},
				];

				mockConversationReadRepo.getByListingId.mockResolvedValue(
					conversationsWithExpiry,
				);

				mockUnitOfWork.withScopedTransaction.mockImplementation(
					async (
						callback: (repo: {
							get: typeof vi.fn;
							save: typeof vi.fn;
						}) => Promise<void>,
					) => {
						const mockRepo = {
							get: vi.fn((id: string) =>
								conversationsWithExpiry.find((c) => c.id === id),
							),
							save: vi.fn(),
						};
						await callback(mockRepo);
					},
				);
			});

			When(
				'the processConversationsForArchivedListings command is executed',
				async () => {
					result = await processConversationsForArchivedListings(mockDataSources);
				},
			);

			Then('only conversations without expiresAt should be scheduled', () => {
				// The one conversation with expiresAt should be processed but not scheduled
				expect(result?.processedCount).toBe(1);
				expect(result?.scheduledCount).toBe(0);
			});
		},
	);

	Scenario(
		'Handling partial failures during cleanup',
		({ Given, When, Then, And }) => {
			Given('archived listings exist', () => {
				mockListingReadRepo.getByStates.mockResolvedValue([
					{
						id: 'listing-good',
						state: 'Expired',
						updatedAt: new Date('2025-01-01'),
					},
					{
						id: 'listing-bad',
						state: 'Cancelled',
						updatedAt: new Date('2025-01-02'),
					},
				]);
			});

			And('an error occurs while processing one listing', () => {
				let callCount = 0;
				mockConversationReadRepo.getByListingId.mockImplementation(() => {
					callCount++;
					if (callCount === 1) {
						return Promise.resolve([
							{
								id: 'conv-1',
								expiresAt: undefined,
								scheduleForDeletion: vi.fn(),
							},
						]);
					}
					return Promise.reject(new Error('Failed to fetch conversations'));
				});

				mockUnitOfWork.withScopedTransaction.mockImplementation(
					async (
						callback: (repo: {
							get: typeof vi.fn;
							save: typeof vi.fn;
						}) => Promise<void>,
					) => {
						const mockRepo = {
							get: vi.fn(() => ({
								id: 'conv-1',
								expiresAt: undefined,
								scheduleForDeletion: vi.fn(),
							})),
							save: vi.fn(),
						};
						await callback(mockRepo);
					},
				);
			});

			When(
				'the processConversationsForArchivedListings command is executed',
				async () => {
					result = await processConversationsForArchivedListings(mockDataSources);
				},
			);

			Then('other listings should still be processed', () => {
				expect(result?.processedCount).toBeGreaterThan(0);
			});

			And('the errors array should contain the failure message', () => {
				expect(result?.errors.length).toBeGreaterThan(0);
				expect(result?.errors[0]).toContain('listing-bad');
			});
		},
	);

	Scenario(
		'Handling complete failure during cleanup',
		({ Given, When, Then }) => {
			Given('the repository throws an error', () => {
				mockListingReadRepo.getByStates.mockRejectedValue(
					new Error('Database connection failed'),
				);
			});

			When(
				'the processConversationsForArchivedListings command is executed',
				async () => {
					try {
						result = await processConversationsForArchivedListings(mockDataSources);
					} catch (error) {
						thrownError = error as Error;
					}
				},
			);

			Then('an error should be thrown', () => {
				expect(thrownError).toBeDefined();
				expect(thrownError?.message).toBe('Database connection failed');
			});
		},
	);
});
