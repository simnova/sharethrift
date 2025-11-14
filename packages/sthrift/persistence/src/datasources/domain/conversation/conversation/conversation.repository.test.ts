import { Domain } from '@sthrift/domain';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConversationDomainAdapter } from './conversation.domain-adapter.ts';
import { ConversationRepository } from './conversation.repository.ts';

describe('ConversationRepository', () => {
	let repository: ConversationRepository;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock
	let mockModel: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock
	let mockTypeConverter: any;
	let mockPassport: Domain.Passport;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock
	let mockEventBus: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock
	let mockSession: any;

	beforeEach(() => {
		mockModel = vi.fn(() => ({
			save: vi.fn(),
		}));
		mockModel.findById = vi.fn();
		mockModel.findOne = vi.fn();

		mockTypeConverter = {
			toDomain: vi.fn(),
			toAdapter: vi.fn(),
		};

		mockPassport = {} as Domain.Passport;
		mockEventBus = {
			dispatch: vi.fn(),
			register: vi.fn(),
		};
		mockSession = {};

		repository = new ConversationRepository(
			mockPassport,
			mockModel,
			mockTypeConverter,
			mockEventBus,
			mockSession,
		);
	});

	describe('getByIdWithReferences', () => {
		it('should return conversation with populated references', async () => {
			const mockDoc = {
				_id: '123',
				sharer: {},
				reserver: {},
				listing: {},
			};
			const mockConversation =
				{} as Domain.Contexts.Conversation.Conversation.Conversation<ConversationDomainAdapter>;

			const populateMock = vi.fn().mockReturnThis();
			mockModel.findById.mockReturnValue({
				populate: populateMock,
				exec: vi.fn().mockResolvedValue(mockDoc),
			});
			mockTypeConverter.toDomain.mockReturnValue(mockConversation);

			const result = await repository.getByIdWithReferences('123');

			expect(result).toBe(mockConversation);
			expect(mockModel.findById).toHaveBeenCalledWith('123');
			expect(populateMock).toHaveBeenCalledWith('sharer');
			expect(populateMock).toHaveBeenCalledWith('reserver');
			expect(populateMock).toHaveBeenCalledWith('listing');
		});

		it('should throw error if conversation not found', async () => {
			mockModel.findById.mockReturnValue({
				populate: vi.fn().mockReturnThis(),
				exec: vi.fn().mockResolvedValue(null),
			});

			await expect(
				repository.getByIdWithReferences('nonexistent'),
			).rejects.toThrow('Conversation with id nonexistent not found');
		});
	});

	describe('getByMessagingId', () => {
		it('should return conversation by messaging id', async () => {
			const mockDoc = {
				_id: '123',
				messagingConversationId: 'messaging-123',
				sharer: {},
				reserver: {},
				listing: {},
			};
			const mockConversation =
				{} as Domain.Contexts.Conversation.Conversation.Conversation<ConversationDomainAdapter>;

			const populateMock = vi.fn().mockReturnThis();
			mockModel.findOne.mockReturnValue({
				populate: populateMock,
				exec: vi.fn().mockResolvedValue(mockDoc),
			});
			mockTypeConverter.toDomain.mockReturnValue(mockConversation);

			const result = await repository.getByMessagingId('messaging-123');

			expect(result).toBe(mockConversation);
			expect(mockModel.findOne).toHaveBeenCalledWith({
				messagingConversationId: 'messaging-123',
			});
		});

		it('should return null if conversation not found', async () => {
			mockModel.findOne.mockReturnValue({
				populate: vi.fn().mockReturnThis(),
				exec: vi.fn().mockResolvedValue(null),
			});

			const result = await repository.getByMessagingId('nonexistent');

			expect(result).toBeNull();
		});
	});

	describe('getByIdWithSharerReserver', () => {
		it('should return conversation by sharer and reserver', async () => {
			const mockDoc = {
				_id: '123',
				sharer: 'sharer-id',
				reserver: 'reserver-id',
			};
			const mockConversation =
				{} as Domain.Contexts.Conversation.Conversation.Conversation<ConversationDomainAdapter>;

			const populateMock = vi.fn().mockReturnThis();
			const execMock = vi.fn().mockResolvedValue(mockDoc);
			populateMock.mockReturnValue({ populate: populateMock, exec: execMock });
			
			mockModel.findOne.mockReturnValue({
				populate: populateMock,
				exec: execMock,
			});
			mockTypeConverter.toDomain.mockReturnValue(mockConversation);

			const result = await repository.getByIdWithSharerReserver(
				'507f1f77bcf86cd799439011',
				'507f1f77bcf86cd799439012',
			);

			expect(result).toBe(mockConversation);
			expect(mockModel.findOne).toHaveBeenCalled();
		});

		it('should return null if conversation not found', async () => {
			const populateMock = vi.fn().mockReturnThis();
			const execMock = vi.fn().mockResolvedValue(null);
			populateMock.mockReturnValue({ populate: populateMock, exec: execMock });
			
			mockModel.findOne.mockReturnValue({
				populate: populateMock,
				exec: execMock,
			});

			const result = await repository.getByIdWithSharerReserver(
				'507f1f77bcf86cd799439011',
				'507f1f77bcf86cd799439012',
			);

			expect(result).toBeNull();
		});
	});

	describe('getNewInstance', () => {
		it('should create new conversation without messaging id', async () => {
			const mockSharer = {
				id: 'sharer-123',
			} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
			const mockReserver = {
				id: 'reserver-123',
			} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
			const mockListing = {
				id: 'listing-123',
			} as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
			const mockAdapter = {} as ConversationDomainAdapter;
			const mockConversation =
				{} as Domain.Contexts.Conversation.Conversation.Conversation<ConversationDomainAdapter>;

			mockTypeConverter.toAdapter.mockReturnValue(mockAdapter);
			vi.spyOn(
				Domain.Contexts.Conversation.Conversation.Conversation,
				'getNewInstance',
			).mockReturnValue(mockConversation);

			const result = await repository.getNewInstance(
				mockSharer,
				mockReserver,
				mockListing,
			);

			expect(result).toBe(mockConversation);
			expect(
				Domain.Contexts.Conversation.Conversation.Conversation.getNewInstance,
			).toHaveBeenCalledWith(
				mockAdapter,
				mockSharer,
				mockReserver,
				mockListing,
				[],
				undefined,
				mockPassport,
			);
		});
	});
});
