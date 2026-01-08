import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';
import { processExpiredDeletions } from './process-expired-deletions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/process-expired-deletions.feature'),
);

test.for(feature, ({ Background, Scenario }) => {
	let mockDataSources: DataSources;
	let mockBlobStorage: Domain.Services['BlobStorage'] | undefined;
	let mockExpiredListings: Array<{
		id: string;
		images: string[];
	}>;
	let mockConversations: Array<{ id: string }>;
	let mockListingRepo: {
		get: ReturnType<typeof vi.fn>;
		save: ReturnType<typeof vi.fn>;
	};
	let mockConversationRepo: {
		get: ReturnType<typeof vi.fn>;
		save: ReturnType<typeof vi.fn>;
	};
	let mockListingUow: {
		withScopedTransaction: ReturnType<typeof vi.fn>;
	};
	let mockConversationUow: {
		withScopedTransaction: ReturnType<typeof vi.fn>;
	};
	let deleteBlobSpy: ReturnType<typeof vi.fn>;
	let shouldFailListingDeletion: boolean;
	let shouldFailBlobDeletion: boolean;
	let result: {
		deletedCount: number;
		deletedListingIds: string[];
		deletedConversationsCount: number;
		deletedImagesCount: number;
		errors: Array<{ listingId: string; error: string }>;
	};

	Background(({ Given, And }) => {
		Given('the data sources are available', () => {
			shouldFailListingDeletion = false;
			shouldFailBlobDeletion = false;
			mockExpiredListings = [];
			mockConversations = [];

			mockListingRepo = {
				get: vi.fn().mockImplementation(() => ({
					requestDelete: vi.fn(),
				})),
				save: vi.fn().mockResolvedValue(undefined),
			};

			mockConversationRepo = {
				get: vi.fn().mockImplementation(() => ({
					requestDelete: vi.fn(),
				})),
				save: vi.fn().mockResolvedValue(undefined),
			};

			mockListingUow = {
				withScopedTransaction: vi.fn((callback) => {
					if (shouldFailListingDeletion) {
						return Promise.reject(new Error('Failed to delete listing'));
					}
					return Promise.resolve(callback(mockListingRepo));
				}),
			};

			mockConversationUow = {
				withScopedTransaction: vi.fn((callback) =>
					Promise.resolve(callback(mockConversationRepo)),
				),
			};

			mockDataSources = {
				domainDataSource: {
					Listing: {
						ItemListing: {
							ItemListingUnitOfWork: mockListingUow,
						},
					},
					Conversation: {
						Conversation: {
							ConversationUnitOfWork: mockConversationUow,
						},
					},
				},
				readonlyDataSource: {
					Listing: {
						ItemListing: {
							ItemListingReadRepo: {
								getExpiredForDeletion: vi.fn().mockResolvedValue(mockExpiredListings),
							},
						},
					},
					Conversation: {
						Conversation: {
							ConversationReadRepo: {
								getByListingId: vi.fn().mockResolvedValue(mockConversations),
							},
						},
					},
				},
			} as unknown as DataSources;
		});

		And('the blob storage service is available', () => {
			let callCount = 0;
			deleteBlobSpy = vi.fn().mockImplementation(() => {
				callCount++;
				if (shouldFailBlobDeletion && callCount === 1) {
					return Promise.reject(new Error('Blob delete failed'));
				}
				return Promise.resolve();
			});
			mockBlobStorage = {
				deleteBlob: deleteBlobSpy,
			} as unknown as Domain.Services['BlobStorage'];
		});
	});

	Scenario(
		'Successfully processing expired listings with no expired listings found',
		({ Given, When, Then, And }) => {
			Given('there are no expired listings', () => {
				mockExpiredListings = [];
			});

			When('the expired deletion process runs', async () => {
				const processFunction = processExpiredDeletions(
					mockDataSources,
					mockBlobStorage,
				);
				result = await processFunction();
			});

			Then('the result should show 0 deleted listings', () => {
				expect(result.deletedCount).toBe(0);
			});

			And('the result should show 0 deleted conversations', () => {
				expect(result.deletedConversationsCount).toBe(0);
			});

			And('the result should show 0 deleted images', () => {
				expect(result.deletedImagesCount).toBe(0);
			});

			And('the result should have no errors', () => {
				expect(result.errors).toHaveLength(0);
			});
		},
	);

	Scenario(
		'Successfully deleting a single expired listing with images and conversations',
		({ Given, When, Then, And }) => {
			Given(
				'there is 1 expired listing with id {string}',
				(_, listingId: string) => {
					mockExpiredListings = [
						{
							id: listingId,
							images: [],
						},
					];
				},
			);

			And('the listing has 2 images', () => {
				mockExpiredListings[0].images = ['image1.jpg', 'image2.jpg'];
			});

			And('the listing has 3 conversations', () => {
				mockConversations = [
					{ id: 'conv-1' },
					{ id: 'conv-2' },
					{ id: 'conv-3' },
				];
			});

			When('the expired deletion process runs', async () => {
				const processFunction = processExpiredDeletions(
					mockDataSources,
					mockBlobStorage,
				);
				result = await processFunction();
			});

			Then('the result should show 1 deleted listings', () => {
				expect(result.deletedCount).toBe(1);
			});

			And('the result should show 3 deleted conversations', () => {
				expect(result.deletedConversationsCount).toBe(3);
			});

			And('the result should show 2 deleted images', () => {
				expect(result.deletedImagesCount).toBe(2);
			});

			And(
				'the deleted listing ids should include {string}',
				(_, listingId: string) => {
					expect(result.deletedListingIds).toContain(listingId);
				},
			);
		},
	);

	Scenario(
		'Successfully deleting multiple expired listings',
		({ Given, When, Then }) => {
			Given('there are 3 expired listings', () => {
				mockExpiredListings = [
					{ id: 'listing-1', images: [] },
					{ id: 'listing-2', images: [] },
					{ id: 'listing-3', images: [] },
				];
			});

			When('the expired deletion process runs', async () => {
				const processFunction = processExpiredDeletions(
					mockDataSources,
					mockBlobStorage,
				);
				result = await processFunction();
			});

			Then('the result should show 3 deleted listings', () => {
				expect(result.deletedCount).toBe(3);
			});
		},
	);

	Scenario(
		'Handling image deletion failure gracefully',
		({ Given, When, Then, And }) => {
			Given(
				'there is 1 expired listing with id {string}',
				(_, listingId: string) => {
					mockExpiredListings = [
						{
							id: listingId,
							images: [],
						},
					];
				},
			);

			And('the listing has 2 images', () => {
				mockExpiredListings[0].images = ['image1.jpg', 'image2.jpg'];
			});

			And('the blob storage fails to delete the first image', () => {
				shouldFailBlobDeletion = true;
			});

			When('the expired deletion process runs', async () => {
				const processFunction = processExpiredDeletions(
					mockDataSources,
					mockBlobStorage,
				);
				result = await processFunction();
			});

			Then('the result should show 1 deleted listings', () => {
				expect(result.deletedCount).toBe(1);
			});

			And('the result should show 1 deleted images', () => {
				expect(result.deletedImagesCount).toBe(1);
			});
		},
	);

	Scenario('Handling listing deletion failure', ({ Given, When, Then, And }) => {
		Given(
			'there is 1 expired listing with id {string}',
			(_, listingId: string) => {
				mockExpiredListings = [
					{
						id: listingId,
						images: [],
					},
				];
			},
		);

		And('the listing deletion throws an error', () => {
			shouldFailListingDeletion = true;
		});

		When('the expired deletion process runs', async () => {
			const processFunction = processExpiredDeletions(
				mockDataSources,
				mockBlobStorage,
			);
			result = await processFunction();
		});

		Then('the result should show 0 deleted listings', () => {
			expect(result.deletedCount).toBe(0);
		});

		And(
			'the result errors should include listing id {string}',
			(_, listingId: string) => {
				expect(result.errors.some((e) => e.listingId === listingId)).toBe(true);
			},
		);
	});

	Scenario(
		'Processing expired listings without blob storage service',
		({ Given, When, Then, And }) => {
			Given(
				'there is 1 expired listing with id {string}',
				(_, listingId: string) => {
					mockExpiredListings = [
						{
							id: listingId,
							images: [],
						},
					];
				},
			);

			And('the listing has 2 images', () => {
				mockExpiredListings[0].images = ['image1.jpg', 'image2.jpg'];
			});

			And('no blob storage service is provided', () => {
				mockBlobStorage = undefined;
			});

			When('the expired deletion process runs', async () => {
				const processFunction = processExpiredDeletions(
					mockDataSources,
					mockBlobStorage,
				);
				result = await processFunction();
			});

			Then('the result should show 1 deleted listings', () => {
				expect(result.deletedCount).toBe(1);
			});

			And('the result should show 0 deleted images', () => {
				expect(result.deletedImagesCount).toBe(0);
			});
		},
	);
});
