import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { create } from './create.ts';

describe('Conversation Create Service', () => {
	let mockDataSources: DataSources;
	let mockSharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
	let mockReserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
	let mockListing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
	let mockConversation: Domain.Contexts.Conversation.Conversation.ConversationEntityReference;

	beforeEach(() => {
		mockSharer = {
			id: 'sharer-123',
			account: { username: 'sharerUser' },
		} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;

		mockReserver = {
			id: 'reserver-123',
			account: { username: 'reserverUser' },
		} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;

		mockListing = {
			id: 'listing-123',
		} as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;

		mockConversation = {
			id: 'conversation-123',
			sharer: mockSharer,
			reserver: mockReserver,
			listing: mockListing,
			messagingConversationId: 'messaging-123',
		} as Domain.Contexts.Conversation.Conversation.ConversationEntityReference;

		mockDataSources = {
			readonlyDataSource: {
				Conversation: {
					Conversation: {
						ConversationReadRepo: {
							getBySharerReserverListing: vi.fn().mockResolvedValue(null),
						},
					},
				},
				User: {
					PersonalUser: {
						PersonalUserReadRepo: {
							getById: vi.fn((id: string) => {
								if (id === 'sharer-123') return Promise.resolve(mockSharer);
								if (id === 'reserver-123') return Promise.resolve(mockReserver);
								return Promise.resolve(null);
							}),
						},
					},
				},
				Listing: {
					ItemListing: {
						ItemListingReadRepo: {
							getById: vi.fn().mockResolvedValue(mockListing),
						},
					},
				},
			},
			messagingDataSource: {
				Conversation: {
					Conversation: {
						MessagingConversationRepo: {
							createConversation: vi.fn().mockResolvedValue({
								id: 'messaging-123',
								displayName: 'Test Conversation',
							}),
						},
					},
				},
			},
			domainDataSource: {
				Conversation: {
					Conversation: {
						ConversationUnitOfWork: {
							withScopedTransaction: vi.fn(async (callback) => {
								const mockRepo = {
									getNewInstance: vi.fn().mockResolvedValue(mockConversation),
									save: vi.fn().mockResolvedValue(mockConversation),
								};
								await callback(mockRepo);
							}),
						},
					},
				},
			},
		} as unknown as DataSources;
	});

	it('should return existing conversation if one already exists', async () => {
		const existingConversation = { ...mockConversation, id: 'existing-123' };
		vi.mocked(
			mockDataSources.readonlyDataSource.Conversation.Conversation
				.ConversationReadRepo.getBySharerReserverListing,
		).mockResolvedValue(existingConversation as never);

		const createService = create(mockDataSources);
		const result = await createService({
			sharerId: 'sharer-123',
			reserverId: 'reserver-123',
			listingId: 'listing-123',
		});

		expect(result).toEqual(existingConversation);
		expect(
			mockDataSources.messagingDataSource?.Conversation.Conversation
				.MessagingConversationRepo.createConversation,
		).not.toHaveBeenCalled();
	});

	it('should create a new conversation successfully', async () => {
		const createService = create(mockDataSources);
		const result = await createService({
			sharerId: 'sharer-123',
			reserverId: 'reserver-123',
			listingId: 'listing-123',
		});

		expect(result).toEqual(mockConversation);
		expect(
			mockDataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo
				.getById,
		).toHaveBeenCalledWith('sharer-123');
		expect(
			mockDataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo
				.getById,
		).toHaveBeenCalledWith('reserver-123');
		expect(
			mockDataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo
				.getById,
		).toHaveBeenCalledWith('listing-123');
		expect(
			mockDataSources.messagingDataSource?.Conversation.Conversation
				.MessagingConversationRepo.createConversation,
		).toHaveBeenCalledWith(
			'sharerUser & reserverUser',
			'conversation-listing-123-sharer-123-reserver-123',
		);
	});

	it('should throw error if sharer not found', async () => {
		vi.mocked(
			mockDataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo
				.getById,
		).mockImplementation((id: string) => {
			if (id === 'reserver-123') return Promise.resolve(mockReserver);
			return Promise.resolve(null);
		});

		const createService = create(mockDataSources);
		await expect(
			createService({
				sharerId: 'sharer-123',
				reserverId: 'reserver-123',
				listingId: 'listing-123',
			}),
		).rejects.toThrow('Personal user (sharer) not found for id sharer-123');
	});

	it('should throw error if reserver not found', async () => {
		vi.mocked(
			mockDataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo
				.getById,
		).mockImplementation((id: string) => {
			if (id === 'sharer-123') return Promise.resolve(mockSharer);
			return Promise.resolve(null);
		});

		const createService = create(mockDataSources);
		await expect(
			createService({
				sharerId: 'sharer-123',
				reserverId: 'reserver-123',
				listingId: 'listing-123',
			}),
		).rejects.toThrow('Personal user (reserver) not found for id reserver-123');
	});

	it('should throw error if listing not found', async () => {
		vi.mocked(
			mockDataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo
				.getById,
		).mockResolvedValue(null);

		const createService = create(mockDataSources);
		await expect(
			createService({
				sharerId: 'sharer-123',
				reserverId: 'reserver-123',
				listingId: 'listing-123',
			}),
		).rejects.toThrow('Listing not found for id listing-123');
	});

	it('should throw error if messaging data source is not available', async () => {
		// biome-ignore lint/style/noNonNullAssertion: Test requires undefined assignment
		mockDataSources.messagingDataSource = undefined!;

		const createService = create(mockDataSources);
		await expect(
			createService({
				sharerId: 'sharer-123',
				reserverId: 'reserver-123',
				listingId: 'listing-123',
			}),
		).rejects.toThrow('Messaging data source is not available');
	});

	it('should throw error if messaging conversation creation fails', async () => {
		vi.mocked(
			// biome-ignore lint/style/noNonNullAssertion: Test mock requires non-null assertion
			mockDataSources.messagingDataSource!.Conversation.Conversation
				.MessagingConversationRepo.createConversation,
		).mockRejectedValue(new Error('Messaging service unavailable'));

		const createService = create(mockDataSources);
		await expect(
			createService({
				sharerId: 'sharer-123',
				reserverId: 'reserver-123',
				listingId: 'listing-123',
			}),
		).rejects.toThrow(
			'Failed to create messaging conversation: Messaging service unavailable',
		);
	});

	it('should throw error if conversation is not returned after save', async () => {
		vi.mocked(
			mockDataSources.domainDataSource.Conversation.Conversation
				.ConversationUnitOfWork.withScopedTransaction,
		).mockImplementation(async (callback) => {
			const mockRepo = {
				getNewInstance: vi.fn().mockResolvedValue(mockConversation),
				save: vi.fn().mockResolvedValue(undefined),
			};
			await callback(mockRepo as never);
		});

		const createService = create(mockDataSources);
		await expect(
			createService({
				sharerId: 'sharer-123',
				reserverId: 'reserver-123',
				listingId: 'listing-123',
			}),
		).rejects.toThrow('Conversation not found');
	});
});
