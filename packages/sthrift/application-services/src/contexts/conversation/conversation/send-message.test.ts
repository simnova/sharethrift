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

// ============================================================================
// Test Context Builder - Single source for test setup
// ============================================================================

/** Build test context with default happy path and allow per-scenario overrides */
function makeTestContext(overrides?: {
	conversation?: Partial<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>;
	command?: Partial<ConversationSendMessageCommand>;
}) {
	const mockReadRepo = { getById: vi.fn() };
	const mockMessagingRepo = { sendMessage: vi.fn() };

	const conversation = {
		id: 'conv-123',
		messagingConversationId: 'messaging-conv-123',
		sharer: { id: 'author-123' },
		reserver: { id: 'reserver-456' },
		...overrides?.conversation,
	};

	const command: ConversationSendMessageCommand = {
		conversationId: conversation.id,
		content: 'Hello, I would like to reserve this item.',
		authorId: 'author-123',
		...overrides?.command,
	};

	const dataSources: DataSources = {
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
	} as unknown as DataSources;

	mockReadRepo.getById.mockResolvedValue(conversation);

	return { dataSources, mockReadRepo, mockMessagingRepo, conversation, command };
}

test.for(feature, ({ Scenario }) => {
	let ctx: ReturnType<typeof makeTestContext>;
	let result:
		| Domain.Contexts.Conversation.Conversation.MessageEntityReference
		| undefined;
	let error: Error | undefined;

	Scenario(
		'Successfully sending a message',
		({ Given, When, Then, And }) => {
			Given('a valid conversation exists with ID "conv-123"', () => {
				ctx = makeTestContext();
			});

			And('I am a participant in the conversation with author ID "author-123"', () => {
				// Default context already has author-123 as participant
			});

			And('the message content is "Hello, I would like to reserve this item."', () => {
				// Default context already has this content
			});

			When('I send the message', async () => {
				ctx.mockMessagingRepo.sendMessage.mockResolvedValue({
					id: 'msg-123',
					messagingMessageId: 'messaging-msg-123',
					authorId: { valueOf: () => 'author-123' },
					content: 'Hello, I would like to reserve this item.',
					createdAt: new Date(),
				});
				try {
					result = await sendMessage(ctx.dataSources)(ctx.command);
				} catch (err) {
					error = err as Error;
				}
			});

			Then('the message should be sent successfully', () => {
				expect(error).toBeUndefined();
				expect(ctx.mockMessagingRepo.sendMessage).toHaveBeenCalledWith(
					expect.objectContaining({
						id: 'conv-123',
						messagingConversationId: 'messaging-conv-123',
					}),
					'Hello, I would like to reserve this item.',
					'author-123',
				);
			});

			And('the message should be returned with the content and author ID', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('msg-123');
				expect(result?.content).toBe('Hello, I would like to reserve this item.');
			});
		},
	);

	Scenario('Sending a message with empty content', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			ctx = makeTestContext({ command: { content: '' } });
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			// Default context already has author-123 as participant
		});

		And('the message content is empty', () => {
			// Already set in makeTestContext override
		});

		When('I try to send the message', async () => {
			try {
				result = await sendMessage(ctx.dataSources)(ctx.command);
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
			ctx = makeTestContext({ command: { content: 'a'.repeat(2001) } });
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			// Default context already has author-123 as participant
		});

		And('the message content exceeds 2000 characters', () => {
			// Already set in makeTestContext override
		});

		When('I try to send the message', async () => {
			try {
				result = await sendMessage(ctx.dataSources)(ctx.command);
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
			ctx = makeTestContext({
				command: { conversationId: 'non-existent-conv', content: 'Hello' },
			});
			ctx.mockReadRepo.getById.mockResolvedValue(null);
		});

		When('I try to send a message to that conversation', async () => {
			try {
				result = await sendMessage(ctx.dataSources)(ctx.command);
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
			ctx = makeTestContext({
				command: {
					authorId: 'unauthorized-user-999',
					content: 'Hello',
				},
			});
			// Override conversation to have different sharer/reserver that don't match authorId
			(ctx.conversation.sharer as { id: string }).id = 'sharer-789';
			(ctx.conversation.reserver as { id: string }).id = 'reserver-456';
		});

		And('I am not a participant in the conversation', () => {
			// Author is not the sharer or reserver (set above)
		});

		When('I try to send a message', async () => {
			// Mock repository to throw permission error (authorization happens in domain layer via visa)
			ctx.mockMessagingRepo.sendMessage.mockRejectedValue(
				new Error('Not authorized to send message in this conversation'),
			);
			try {
				result = await sendMessage(ctx.dataSources)(ctx.command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown indicating not authorized', () => {
			expect(error).toBeDefined();
			// Authorization validated in domain layer (repository checks visa)
			expect(error?.message).toContain('Not authorized');
		});
	});

	Scenario('Handling messaging service unavailable', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with ID "conv-123"', () => {
			ctx = makeTestContext({ command: { content: 'Hello' } });
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			// Default context already has author-123 as participant
		});

		And('the messaging data source is unavailable', () => {
			ctx.dataSources.messagingDataSource = undefined;
		});

		When('I try to send a message', async () => {
			try {
				result = await sendMessage(ctx.dataSources)(ctx.command);
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
			ctx = makeTestContext({ command: { content: 'Hello' } });
		});

		And('I am a participant in the conversation with author ID "author-123"', () => {
			// Default context already has author-123 as participant
		});

		And('the messaging service fails to send the message', () => {
			ctx.mockMessagingRepo.sendMessage.mockRejectedValue(
				new Error('Service connection timeout'),
			);
		});

		When('I try to send a message', async () => {
			try {
				result = await sendMessage(ctx.dataSources)(ctx.command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('an error should be thrown with the messaging service error details', () => {
			expect(error).toBeDefined();
			expect(error?.message).toContain('Service connection timeout');
		});
	});

	Scenario('Sharer can send message in conversation', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with sharer ID "sharer-123" and reserver ID "reserver-456"', () => {
			result = undefined;
			error = undefined;
			ctx = makeTestContext({
				conversation: {
					sharer: { id: 'sharer-123' } as unknown as Domain.Contexts.Conversation.Conversation.ConversationEntityReference['sharer'],
					reserver: { id: 'reserver-456' } as unknown as Domain.Contexts.Conversation.Conversation.ConversationEntityReference['reserver'],
				},
				command: {
					authorId: 'sharer-123',
					content: 'Hello from the sharer!',
				},
			});
		});

		And('the current user is the sharer with ID "sharer-123"', () => {
			// authorId is already set to sharer-123 in the command
		});

		When('I send a message as the sharer', async () => {
			ctx.mockMessagingRepo.sendMessage.mockResolvedValue({
				id: 'msg-sharer-123',
				messagingMessageId: 'messaging-msg-sharer-123',
				authorId: { valueOf: () => 'sharer-123' },
				content: 'Hello from the sharer!',
				createdAt: new Date(),
			});
			try {
				result = await sendMessage(ctx.dataSources)(ctx.command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('the message should be sent successfully with author ID "sharer-123"', () => {
			expect(error).toBeUndefined();
			expect(ctx.mockMessagingRepo.sendMessage).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'conv-123',
					messagingConversationId: 'messaging-conv-123',
				}),
				'Hello from the sharer!',
				'sharer-123',
			);
		});

		And('the message should be persisted to the messaging repository', () => {
			expect(result).toBeDefined();
			expect(result?.id).toBe('msg-sharer-123');
			expect(result?.authorId?.valueOf()).toBe('sharer-123');
			expect(ctx.mockMessagingRepo.sendMessage).toHaveBeenCalledTimes(1);
		});
	});

	Scenario('Reserver can send message in conversation', ({ Given, When, Then, And }) => {
		Given('a valid conversation exists with sharer ID "sharer-123" and reserver ID "reserver-456"', () => {
			result = undefined;
			error = undefined;
			ctx = makeTestContext({
				conversation: {
					sharer: { id: 'sharer-123' } as unknown as Domain.Contexts.Conversation.Conversation.ConversationEntityReference['sharer'],
					reserver: { id: 'reserver-456' } as unknown as Domain.Contexts.Conversation.Conversation.ConversationEntityReference['reserver'],
				},
				command: {
					authorId: 'reserver-456',
					content: 'Hello from the reserver!',
				},
			});
		});

		And('the current user is the reserver with ID "reserver-456"', () => {
			// authorId is already set to reserver-456 in the command
		});

		When('I send a message as the reserver', async () => {
			ctx.mockMessagingRepo.sendMessage.mockResolvedValue({
				id: 'msg-reserver-456',
				messagingMessageId: 'messaging-msg-reserver-456',
				authorId: { valueOf: () => 'reserver-456' },
				content: 'Hello from the reserver!',
				createdAt: new Date(),
			});
			try {
				result = await sendMessage(ctx.dataSources)(ctx.command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then('the message should be sent successfully with author ID "reserver-456"', () => {
			expect(error).toBeUndefined();
			expect(ctx.mockMessagingRepo.sendMessage).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'conv-123',
					messagingConversationId: 'messaging-conv-123',
				}),
				'Hello from the reserver!',
				'reserver-456',
			);
		});

		And('the message should be persisted to the messaging repository', () => {
			expect(result).toBeDefined();
			expect(result?.id).toBe('msg-reserver-456');
			expect(result?.authorId?.valueOf()).toBe('reserver-456');
			expect(ctx.mockMessagingRepo.sendMessage).toHaveBeenCalledTimes(1);
		});
	});
});
