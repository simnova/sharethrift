import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConversationReadRepositoryImpl } from './conversation.read-repository.ts';
import type { ModelsContext } from '../../../../models-context.ts';
import type { Domain } from '@sthrift/domain';

describe('ConversationReadRepository', () => {
	let repository: ConversationReadRepositoryImpl;
	let mockModels: ModelsContext;
	let mockPassport: Domain.Passport;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock
	let mockConversationModel: any;

	beforeEach(() => {
		mockConversationModel = {
			find: vi.fn(),
			findById: vi.fn(),
			findOne: vi.fn(),
		};

		mockModels = {
			Conversation: {
				ConversationModel: mockConversationModel,
			},
		} as unknown as ModelsContext;

		mockPassport = {
			user: {
				forConversation: vi.fn(() => ({
					determineIf: () => true,
				})),
			},
			conversation: {
				forConversation: vi.fn(() => ({
					determineIf: () => true,
				})),
			},
		} as unknown as Domain.Passport;

		repository = new ConversationReadRepositoryImpl(mockModels, mockPassport);
	});

	describe('getAll', () => {
		it('should return all conversations', async () => {
			const mockDocs = [
				{ 
					_id: '1', 
					id: '1', 
					sharer: { _id: '507f1f77bcf86cd799439011', id: '507f1f77bcf86cd799439011' }, 
					reserver: { _id: '507f1f77bcf86cd799439012', id: '507f1f77bcf86cd799439012' }, 
					listing: { _id: '707f1f77bcf86cd799439031', id: '707f1f77bcf86cd799439031' }, 
					messages: [],
					messagingConversationId: 'msg-1'
				},
				{ 
					_id: '2', 
					id: '2', 
					sharer: { _id: '507f1f77bcf86cd799439013', id: '507f1f77bcf86cd799439013' }, 
					reserver: { _id: '507f1f77bcf86cd799439014', id: '507f1f77bcf86cd799439014' }, 
					listing: { _id: '707f1f77bcf86cd799439032', id: '707f1f77bcf86cd799439032' }, 
					messages: [],
					messagingConversationId: 'msg-2'
				},
			];
			mockConversationModel.find.mockReturnValue({
				lean: vi.fn().mockReturnValue(Promise.resolve(mockDocs)),
			});

			const result = await repository.getAll();

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});

		it('should pass options to find query', async () => {
			const mockDocs: never[] = [];
			mockConversationModel.find.mockReturnValue({
				lean: vi.fn().mockReturnValue(Promise.resolve(mockDocs)),
			});

			await repository.getAll({ limit: 10, skip: 0 });

			expect(mockConversationModel.find).toHaveBeenCalled();
		});
	});

	describe('getById', () => {
		it('should return conversation by id', async () => {
			const mockDoc = { _id: '123', sharer: {}, reserver: {}, listing: {} };
			const populateMock = vi.fn().mockReturnThis();
			mockConversationModel.findById.mockReturnValue({
				lean: vi.fn().mockReturnValue({
					populate: populateMock.mockReturnValue(Promise.resolve(mockDoc)),
				}),
			});

			const result = await repository.getById('123');

			expect(result).toBeDefined();
		});

		it('should return null if conversation not found', async () => {
			const populateMock = vi.fn().mockReturnThis();
			mockConversationModel.findById.mockReturnValue({
				lean: vi.fn().mockReturnValue({
					populate: populateMock.mockReturnValue(Promise.resolve(null)),
				}),
			});

			const result = await repository.getById('nonexistent');

			expect(result).toBeNull();
		});

		it('should populate sharer, reserver, and listing fields', async () => {
			const mockDoc = { _id: '123', id: '123', sharer: {}, reserver: {}, listing: {}, messages: [] };
			const populateMock = vi.fn().mockReturnValue(Promise.resolve(mockDoc));
			mockConversationModel.findById.mockReturnValue({
				lean: vi.fn().mockReturnValue({
					populate: populateMock,
				}),
			});

			const result = await repository.getById('123');

			expect(result).toBeDefined();
		});
	});

	describe('getByUser', () => {
		it('should return conversations for a user', async () => {
			const userId = '507f1f77bcf86cd799439011';
			const mockDocs = [
				{ _id: '1', sharer: userId, reserver: {} },
				{ _id: '2', sharer: {}, reserver: userId },
			];
			const populateMock = vi.fn().mockReturnValue(Promise.resolve(mockDocs));
			mockConversationModel.find.mockReturnValue({
				lean: vi.fn().mockReturnValue({
					populate: populateMock,
				}),
			});

			const result = await repository.getByUser(userId);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(mockConversationModel.find).toHaveBeenCalled();
		});

		it('should return empty array for empty userId', async () => {
			const result = await repository.getByUser('');

			expect(result).toEqual([]);
			expect(mockConversationModel.find).not.toHaveBeenCalled();
		});

		it('should return empty array for whitespace userId', async () => {
			const result = await repository.getByUser('   ');

			expect(result).toEqual([]);
			expect(mockConversationModel.find).not.toHaveBeenCalled();
		});

		it('should handle invalid ObjectId gracefully', async () => {
			mockConversationModel.find.mockImplementation(() => {
				throw new Error('Invalid ObjectId');
			});

			const result = await repository.getByUser('invalid-id');

			expect(result).toEqual([]);
		});
	});

	describe('getBySharerReserverListing', () => {
		it('should return conversation by sharer, reserver, and listing', async () => {
			const sharerId = '507f1f77bcf86cd799439011';
			const reserverId = '507f1f77bcf86cd799439012';
			const listingId = '707f1f77bcf86cd799439031';
			const mockDoc = {
				_id: '1',
				sharer: sharerId,
				reserver: reserverId,
				listing: listingId,
			};
			const populateMock = vi.fn().mockReturnValue(Promise.resolve(mockDoc));
			mockConversationModel.findOne.mockReturnValue({
				lean: vi.fn().mockReturnValue({
					populate: populateMock,
				}),
			});

			const result = await repository.getBySharerReserverListing(
				sharerId,
				reserverId,
				listingId,
			);

			expect(result).toBeDefined();
			expect(mockConversationModel.findOne).toHaveBeenCalled();
		});

		it('should return null if conversation not found', async () => {
			const populateMock = vi.fn().mockReturnValue(Promise.resolve(null));
			mockConversationModel.findOne.mockReturnValue({
				lean: vi.fn().mockReturnValue({
					populate: populateMock,
				}),
			});

			const result = await repository.getBySharerReserverListing(
				'507f1f77bcf86cd799439011',
				'507f1f77bcf86cd799439012',
				'707f1f77bcf86cd799439031',
			);

			expect(result).toBeNull();
		});

		it('should return null for empty sharerId', async () => {
			const result = await repository.getBySharerReserverListing(
				'',
				'reserver',
				'listing',
			);

			expect(result).toBeNull();
			expect(mockConversationModel.findOne).not.toHaveBeenCalled();
		});

		it('should return null for empty reserverId', async () => {
			const result = await repository.getBySharerReserverListing(
				'sharer',
				'',
				'listing',
			);

			expect(result).toBeNull();
			expect(mockConversationModel.findOne).not.toHaveBeenCalled();
		});

		it('should return null for empty listingId', async () => {
			const result = await repository.getBySharerReserverListing(
				'sharer',
				'reserver',
				'',
			);

			expect(result).toBeNull();
			expect(mockConversationModel.findOne).not.toHaveBeenCalled();
		});

		it('should handle invalid ObjectId gracefully', async () => {
			mockConversationModel.findOne.mockImplementation(() => {
				throw new Error('Invalid ObjectId');
			});

			const result = await repository.getBySharerReserverListing(
				'invalid',
				'invalid',
				'invalid',
			);

			expect(result).toBeNull();
		});
	});
});
