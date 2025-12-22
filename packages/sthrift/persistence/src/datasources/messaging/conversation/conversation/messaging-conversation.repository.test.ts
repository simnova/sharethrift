import type { MessagingService } from '@cellix/messaging-service';
import type { Domain } from '@sthrift/domain';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MessagingConversationRepositoryImpl } from './messaging-conversation.repository.ts';

describe('MessagingConversationRepository', () => {
	let repository: MessagingConversationRepositoryImpl;
	let mockMessagingService: MessagingService;

	beforeEach(() => {
		mockMessagingService = {
			getMessages: vi.fn(),
			sendMessage: vi.fn(),
			deleteConversation: vi.fn(),
			createConversation: vi.fn(),
		} as unknown as MessagingService;

		repository = new MessagingConversationRepositoryImpl(mockMessagingService);
	});

	describe('getMessages', () => {
		it('should return messages for a conversation', async () => {
			const mockMessages = [
				{
					id: 'msg-1',
					body: 'Hello',
					author: '507f1f77bcf86cd799439011',
					createdAt: new Date(),
				},
				{
					id: 'msg-2',
					body: 'Hi there',
					author: '507f1f77bcf86cd799439012',
					createdAt: new Date(),
				},
			];
			vi.mocked(mockMessagingService.getMessages).mockResolvedValue(
				mockMessages,
			);

			const result = await repository.getMessages('conversation-123');

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(2);
			expect(mockMessagingService.getMessages).toHaveBeenCalledWith(
				'conversation-123',
			);
		});

		it('should return empty array when message has no author (author required)', async () => {
			const mockMessages = [
				{
					id: 'msg-1',
					body: 'Hello',
					author: null as unknown as string,
					createdAt: new Date(),
				},
			];
			vi.mocked(mockMessagingService.getMessages).mockResolvedValue(
				mockMessages,
			);

			const result = await repository.getMessages('conversation-123');

			// Messages without authors are not valid - error is caught and empty array returned
			expect(result).toEqual([]);
		});

		it('should return empty array on error', async () => {
			vi.mocked(mockMessagingService.getMessages).mockRejectedValue(
				new Error('Service unavailable'),
			);

			const result = await repository.getMessages('conversation-123');

			expect(result).toEqual([]);
		});
	});

	describe('sendMessage', () => {
		it('should send a message successfully', async () => {
			const validAuthorId = '507f1f77bcf86cd799439011';
			const mockMessage = {
				id: 'msg-123',
				body: 'Test message',
				author: validAuthorId,
				createdAt: new Date(),
			};
			const mockConversation = {
				id: 'conv-123',
				messagingConversationId: 'messaging-conv-123',
			} as Domain.Contexts.Conversation.Conversation.ConversationEntityReference;

			vi.mocked(mockMessagingService.sendMessage).mockResolvedValue(
				mockMessage,
			);

			const result = await repository.sendMessage(
				mockConversation,
				['Test message'],
				validAuthorId,
			);

			expect(result).toBeDefined();
			expect(mockMessagingService.sendMessage).toHaveBeenCalledWith(
				'messaging-conv-123',
				'Test message',
				validAuthorId,
			);
		});

		it('should join multiple content items with double newlines', async () => {
			const validAuthorId = '507f1f77bcf86cd799439011';
			const mockMessage = {
				id: 'msg-123',
				body: 'First part\n\nSecond part',
				author: validAuthorId,
				createdAt: new Date(),
			};
			const mockConversation = {
				id: 'conv-123',
				messagingConversationId: 'messaging-conv-123',
			} as Domain.Contexts.Conversation.Conversation.ConversationEntityReference;

			vi.mocked(mockMessagingService.sendMessage).mockResolvedValue(
				mockMessage,
			);

			const result = await repository.sendMessage(
				mockConversation,
				['First part', 'Second part'],
				validAuthorId,
			);

			expect(result).toBeDefined();
			expect(mockMessagingService.sendMessage).toHaveBeenCalledWith(
				'messaging-conv-123',
				'First part\n\nSecond part',
				validAuthorId,
			);
		});

		it('should throw error on send failure', async () => {
			const validAuthorId = '507f1f77bcf86cd799439011';
			const mockConversation = {
				id: 'conv-123',
				messagingConversationId: 'messaging-conv-123',
			} as Domain.Contexts.Conversation.Conversation.ConversationEntityReference;

			vi.mocked(mockMessagingService.sendMessage).mockRejectedValue(
				new Error('Failed to send'),
			);

			await expect(
				repository.sendMessage(mockConversation, ['Test'], validAuthorId),
			).rejects.toThrow('Failed to send');
		});
	});

	describe('deleteConversation', () => {
		it('should delete conversation successfully', async () => {
			vi.mocked(mockMessagingService.deleteConversation).mockResolvedValue(
				undefined,
			);

			await repository.deleteConversation('conversation-123');

			expect(mockMessagingService.deleteConversation).toHaveBeenCalledWith(
				'conversation-123',
			);
		});

		it('should throw error on delete failure', async () => {
			vi.mocked(mockMessagingService.deleteConversation).mockRejectedValue(
				new Error('Failed to delete'),
			);

			await expect(
				repository.deleteConversation('conversation-123'),
			).rejects.toThrow('Failed to delete');
		});
	});

	describe('createConversation', () => {
		it('should create conversation successfully', async () => {
			const mockConversation = {
				id: 'conversation-123',
				displayName: 'Test Conversation',
			};
			vi.mocked(mockMessagingService.createConversation).mockResolvedValue(
				mockConversation,
			);

			const result = await repository.createConversation(
				'Test Conversation',
				'unique-id',
			);

			expect(result).toEqual({
				id: 'conversation-123',
				displayName: 'Test Conversation',
			});
			expect(mockMessagingService.createConversation).toHaveBeenCalledWith(
				'Test Conversation',
				'unique-id',
			);
		});

		it('should create conversation without display name', async () => {
			const mockConversation = {
				id: 'conversation-123',
			};
			vi.mocked(mockMessagingService.createConversation).mockResolvedValue(
				mockConversation,
			);

			const result = await repository.createConversation(
				'Test Conversation',
				'unique-id',
			);

			expect(result).toEqual({
				id: 'conversation-123',
			});
		});

		it('should throw error on create failure', async () => {
			vi.mocked(mockMessagingService.createConversation).mockRejectedValue(
				new Error('Failed to create'),
			);

			await expect(
				repository.createConversation('Test', 'unique-id'),
			).rejects.toThrow('Failed to create');
		});
	});
});
