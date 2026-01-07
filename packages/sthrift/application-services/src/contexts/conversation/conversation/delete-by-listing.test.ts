import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { deleteByListing } from './delete-by-listing.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/delete-by-listing.feature'),
);

test.for(feature, ({ Background, Scenario }) => {
	let mockDataSources: DataSources;
	let mockConversations: Array<{ id: string }>;
	let mockConversationRepo: {
		get: ReturnType<typeof vi.fn>;
		save: ReturnType<typeof vi.fn>;
	};
	let mockConversationUow: {
		withScopedTransaction: ReturnType<typeof vi.fn>;
	};
	let shouldFailFirstConversation: boolean;
	let deleteFunction: (listingId: string) => Promise<{
		deletedCount: number;
		deletedConversationIds: string[];
		errors: Array<{ conversationId: string; error: string }>;
	}>;
	let result: {
		deletedCount: number;
		deletedConversationIds: string[];
		errors: Array<{ conversationId: string; error: string }>;
	};

	Background(({ Given, And }) => {
		Given('the data sources are available', () => {
			shouldFailFirstConversation = false;
			mockConversations = [];
		});

		And('the conversation repository is available', () => {
			let callCount = 0;

			mockConversationRepo = {
				get: vi.fn().mockImplementation(() => ({
					requestDelete: vi.fn(),
				})),
				save: vi.fn().mockResolvedValue(undefined),
			};

			mockConversationUow = {
				withScopedTransaction: vi.fn((callback) => {
					callCount++;
					if (shouldFailFirstConversation && callCount === 1) {
						return Promise.reject(new Error('Failed to delete conversation'));
					}
					return callback(mockConversationRepo);
				}),
			};

			mockDataSources = {
				domainDataSource: {
					Conversation: {
						Conversation: {
							ConversationUnitOfWork: mockConversationUow,
						},
					},
				},
				readonlyDataSource: {
					Conversation: {
						Conversation: {
							ConversationReadRepo: {
								getByListingId: vi.fn().mockImplementation(() => {
									return Promise.resolve(mockConversations);
								}),
							},
						},
					},
				},
			} as unknown as DataSources;

			deleteFunction = deleteByListing(mockDataSources);
		});
	});

	Scenario(
		'Successfully deleting conversations when no conversations exist for listing',
		({ Given, When, Then, And }) => {
			Given(
				'the listing with id {string} has no conversations',
				() => {
					mockConversations = [];
				},
			);

			When(
				'conversations are deleted for listing id {string}',
				async () => {
					result = await deleteFunction('listing-no-conversations');
				},
			);

			Then('the result should show 0 deleted conversations', () => {
				expect(result.deletedCount).toBe(0);
			});

			And('the result should have no errors', () => {
				expect(result.errors).toHaveLength(0);
			});
		},
	);

	Scenario(
		'Successfully deleting a single conversation for a listing',
		({ Given, When, Then, And }) => {
			Given(
				'the listing with id {string} has 1 conversation',
				() => {
					mockConversations = [{ id: 'conv-1' }];
				},
			);

			When(
				'conversations are deleted for listing id {string}',
				async () => {
					result = await deleteFunction('listing-single-conv');
				},
			);

			Then('the result should show 1 deleted conversations', () => {
				expect(result.deletedCount).toBe(1);
			});

			And('the deleted conversation ids should be returned', () => {
				expect(result.deletedConversationIds).toContain('conv-1');
			});
		},
	);

	Scenario(
		'Successfully deleting multiple conversations for a listing',
		({ Given, When, Then, And }) => {
			Given(
				'the listing with id {string} has 3 conversations',
				() => {
					mockConversations = [
						{ id: 'conv-1' },
						{ id: 'conv-2' },
						{ id: 'conv-3' },
					];
				},
			);

			When(
				'conversations are deleted for listing id {string}',
				async () => {
					result = await deleteFunction('listing-multi-conv');
				},
			);

			Then('the result should show 3 deleted conversations', () => {
				expect(result.deletedCount).toBe(3);
			});

			And('all 3 conversation ids should be included in the result', () => {
				expect(result.deletedConversationIds).toHaveLength(3);
				expect(result.deletedConversationIds).toContain('conv-1');
				expect(result.deletedConversationIds).toContain('conv-2');
				expect(result.deletedConversationIds).toContain('conv-3');
			});
		},
	);

	Scenario('Handling conversation deletion failure', ({ Given, When, Then, And }) => {
		Given(
			'the listing with id {string} has 2 conversations',
			() => {
				mockConversations = [{ id: 'conv-1' }, { id: 'conv-2' }];
			},
		);

		And('the first conversation deletion throws an error', () => {
			shouldFailFirstConversation = true;
		});

		When(
			'conversations are deleted for listing id {string}',
			async () => {
				result = await deleteFunction('listing-error');
			},
		);

		Then('the result should show 1 deleted conversations', () => {
			expect(result.deletedCount).toBe(1);
		});

		And('the result errors should include 1 error', () => {
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].conversationId).toBe('conv-1');
		});
	});
});
