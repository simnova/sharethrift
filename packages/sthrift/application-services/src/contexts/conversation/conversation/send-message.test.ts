import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type ConversationSendMessageCommand, sendMessage } from './send-message.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/send-message.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockMessagingRepo: any;
	let command: ConversationSendMessageCommand;
	let result:
		| Domain.Contexts.Conversation.Conversation.MessageEntityReference
		| undefined;
	let error: Error | undefined;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getById: vi.fn(),
		};

		mockMessagingRepo = {
			sendMessage: vi.fn(),
		};

		mockDataSources = {
			domainDataSource: {} as DataSources['domainDataSource'],
			readonlyDataSource: {
				Conversation: {
					Conversation: {
						ConversationReadRepo: mockReadRepo,
					},
				},
			},
			messagingDataSource: {
				Conversation: {
					Conversation: {
						MessagingConversationRepo: mockMessagingRepo,
					},
				},
			},
		} as DataSources;

		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully sending a message',
		({ Given, When, Then, And }) => {
			Given('a valid conversation exists with ID "conv-123"', () => {
				const mockConversation = {
					id: 'conv-123',
					messagingConversationId: 'messaging-conv-123',
					sharer: { id: 'author-123' },
					reserver: { id: 'reserver-456' },
				};
				mockReadRepo.getById.mockResolvedValue(mockConversation);
			});

			And('I am a participant in the conversation with author ID "author-123"', () => {
				command = {
					conversationId: 'conv-123',
					content: 'Hello, I would like to reserve this item.',
					authorId: 'author-123',
				};
			});

			And('the message content is "Hello, I would like to reserve this item."', () => {
				// Already set in the previous step
			});

			When('I send the message', async () => {
				const mockMessage = {
					id: 'msg-123',
					messagingMessageId: 'messaging-msg-123',
					authorId: { valueOf: () => 'author-123' },
					content: 'Hello, I would like to reserve this item.',
					createdAt: new Date(),
				};
				mockMessagingRepo.sendMessage.mockResolvedValue(mockMessage);

				try {
					const sendMessageFn = sendMessage(mockDataSources);
					result = await sendMessageFn(command);
				} catch (err) {
					error = err as Error;
				}
			});

		Then('the message should be sent successfully', () => {
			expect(error).toBeUndefined();
			expect(mockMessagingRepo.sendMessage).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'conv-123',
					messagingConversationId: 'messaging-conv-123',
				}),
				'Hello, I would like to reserve this item.',
				'author-123',
			);
		});			And('the message should be returned with the content and author ID', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('msg-123');
				expect(result?.content).toBe('Hello, I would like to reserve this item.');
			});
		},
	);

	Scenario('Sending a message with empty content', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			const mockConversation = {
				id: 'conv-123',
				messagingConversationId: 'messaging-conv-123',
				sharer: { id: 'author-123' },
				reserver: { id: 'reserver-456' },
			};
			mockReadRepo.getById.mockResolvedValue(mockConversation);
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			command = {
				conversationId: 'conv-123',
				content: '',
				authorId: 'author-123',
			};
		});

		And('the message content is empty', () => {
			// Already set in the previous step
		});

		When('I try to send the message', async () => {
			try {
				const sendMessageFn = sendMessage(mockDataSources);
				result = await sendMessageFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown indicating message content cannot be empty', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Too short');
		});
	});

	Scenario('Sending a message that exceeds character limit', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			const mockConversation = {
				id: 'conv-123',
				messagingConversationId: 'messaging-conv-123',
				sharer: { id: 'author-123' },
				reserver: { id: 'reserver-456' },
			};
			mockReadRepo.getById.mockResolvedValue(mockConversation);
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			command = {
				conversationId: 'conv-123',
				content: 'a'.repeat(2001),
				authorId: 'author-123',
			};
		});

		And('the message content exceeds 2000 characters', () => {
			// Already set in the previous step
		});

		When('I try to send the message', async () => {
			try {
				const sendMessageFn = sendMessage(mockDataSources);
				result = await sendMessageFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown indicating message exceeds maximum length', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Too long');
		});
	});

	Scenario('Sending a message to non-existent conversation', ({ Given, When, Then }) => {
		Given('a conversation does not exist with ID "non-existent-conv"', () => {
			mockReadRepo.getById.mockResolvedValue(null);
			command = {
				conversationId: 'non-existent-conv',
				content: 'Hello',
				authorId: 'author-123',
			};
		});

		When('I try to send a message to that conversation', async () => {
			try {
				const sendMessageFn = sendMessage(mockDataSources);
				result = await sendMessageFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown indicating conversation not found', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Conversation not found');
		});
	});

	Scenario('Sending a message when not a participant', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			const mockConversation = {
				id: 'conv-123',
				messagingConversationId: 'messaging-conv-123',
				sharer: { id: 'sharer-789' },
				reserver: { id: 'reserver-456' },
			};
			mockReadRepo.getById.mockResolvedValue(mockConversation);
		});

		And('I am not a participant in the conversation', () => {
			command = {
				conversationId: 'conv-123',
				content: 'Hello',
				authorId: 'unauthorized-user-999',
			};
			mockMessagingRepo.sendMessage.mockRejectedValue(
				new Error('Not authorized to send message in this conversation'),
			);
		});

		When('I try to send a message', async () => {
			try {
				const sendMessageFn = sendMessage(mockDataSources);
				result = await sendMessageFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown indicating not authorized', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Not authorized');
		});
	});	Scenario('Handling messaging service unavailable', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			const mockConversation = {
				id: 'conv-123',
				messagingConversationId: 'messaging-conv-123',
				sharer: { id: 'author-123' },
				reserver: { id: 'reserver-456' },
			};
			mockReadRepo.getById.mockResolvedValue(mockConversation);
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			command = {
				conversationId: 'conv-123',
				content: 'Hello',
				authorId: 'author-123',
			};
		});

		And('the messaging data source is unavailable', () => {
			mockDataSources.messagingDataSource = undefined;
		});

		When('I try to send a message', async () => {
			try {
				const sendMessageFn = sendMessage(mockDataSources);
				result = await sendMessageFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown indicating messaging service unavailable', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Messaging data source is not available');
		});
	});

	Scenario('Handling messaging service send failure', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			const mockConversation = {
				id: 'conv-123',
				messagingConversationId: 'messaging-conv-123',
				sharer: { id: 'author-123' },
				reserver: { id: 'reserver-456' },
			};
			mockReadRepo.getById.mockResolvedValue(mockConversation);
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			command = {
				conversationId: 'conv-123',
				content: 'Hello',
				authorId: 'author-123',
			};
		});

		And('the messaging service fails to send the message', () => {
			mockMessagingRepo.sendMessage.mockRejectedValue(
				new Error('Service connection timeout'),
			);
		});

		When('I try to send a message', async () => {
			try {
				const sendMessageFn = sendMessage(mockDataSources);
				result = await sendMessageFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown with the messaging service error details', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Service connection timeout');
		});
	});
});
