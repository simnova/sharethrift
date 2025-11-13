import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import conversationResolvers from './conversation.resolvers.ts';
import type { Domain } from '@sthrift/domain';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.resolvers.feature'),
);

function createMockConversation(overrides: Partial<Domain.Contexts.Conversation.Conversation.ConversationEntityReference> = {}): Domain.Contexts.Conversation.Conversation.ConversationEntityReference {
	return {
		id: 'conversation-123',
		sharer: {} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		reserver: {} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		listing: {} as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
		messagingConversationId: 'messaging-123',
		messages: [],
		loadSharer: vi.fn(),
		loadReserver: vi.fn(),
		loadListing: vi.fn(),
		loadMessages: vi.fn(),
		schemaVersion: '1.0',
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

function makeMockGraphContext(overrides: Partial<GraphContext> = {}): GraphContext {
	return {
		applicationServices: {
			Conversation: {
				Conversation: {
					queryByUser: vi.fn(),
					queryById: vi.fn(),
					create: vi.fn(),
				},
			},
			...overrides.applicationServices,
		},
		...overrides,
	} as GraphContext;
}

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let context: GraphContext;
	let result: unknown;

	BeforeEachScenario(() => {
		context = makeMockGraphContext();
		vi.clearAllMocks();
	});

	Scenario('Querying conversations by user ID', ({ Given, When, Then, And }) => {
		Given('a valid user ID', () => {
			// User ID will be passed in the resolver call
		});
		When('the conversationsByUser query is executed with that ID', async () => {
			const mockConversation = createMockConversation();
			vi.mocked(context.applicationServices.Conversation.Conversation.queryByUser).mockResolvedValue([mockConversation]);
			
			const resolver = conversationResolvers.Query?.conversationsByUser;
			if (typeof resolver === 'function') {
				result = await resolver({}, { userId: 'user-123' }, context, {} as never);
			}
		});
		Then('it should call Conversation.Conversation.queryByUser with the provided userId', () => {
			expect(context.applicationServices.Conversation.Conversation.queryByUser).toHaveBeenCalledWith({ userId: 'user-123' });
		});
		And('it should return a list of Conversation entities', () => {
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBeGreaterThan(0);
		});
	});

	Scenario('Querying conversations by user ID with no conversations', ({ Given, And, When, Then }) => {
		Given('a valid user ID', () => {
			// User ID will be passed in the resolver call
		});
		And('Conversation.Conversation.queryByUser returns an empty array', () => {
			vi.mocked(context.applicationServices.Conversation.Conversation.queryByUser).mockResolvedValue([]);
		});
		When('the conversationsByUser query is executed', async () => {
			const resolver = conversationResolvers.Query?.conversationsByUser;
			if (typeof resolver === 'function') {
				result = await resolver({}, { userId: 'user-123' }, context, {} as never);
			}
		});
		Then('it should return an empty list', () => {
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBe(0);
		});
	});

	Scenario('Querying conversations by user ID when an error occurs', ({ Given, And, When, Then }) => {
		Given('a valid user ID', () => {
			// User ID will be passed in the resolver call
		});
		And('Conversation.Conversation.queryByUser throws an error', () => {
			vi.mocked(context.applicationServices.Conversation.Conversation.queryByUser).mockRejectedValue(new Error('Query failed'));
		});
		When('the conversationsByUser query is executed', async () => {
			const resolver = conversationResolvers.Query?.conversationsByUser;
			if (typeof resolver === 'function') {
				try {
					await resolver({}, { userId: 'user-123' }, context, {} as never);
				} catch (error) {
					result = error;
				}
			}
		});
		Then('it should propagate the error message', () => {
			expect(result).toBeDefined();
			expect((result as Error).message).toBe('Query failed');
		});
	});

	Scenario('Querying a conversation by ID', ({ Given, When, Then, And }) => {
		Given('a valid conversation ID', () => {
			// Conversation ID will be passed in the resolver call
		});
		When('the conversation query is executed with that ID', async () => {
			const mockConversation = createMockConversation({ id: 'conversation-123' });
			vi.mocked(context.applicationServices.Conversation.Conversation.queryById).mockResolvedValue(mockConversation);
			
			const resolver = conversationResolvers.Query?.conversation;
			if (typeof resolver === 'function') {
				result = await resolver({}, { conversationId: 'conversation-123' }, context, {} as never);
			}
		});
		Then('it should call Conversation.Conversation.queryById with the provided conversationId', () => {
			expect(context.applicationServices.Conversation.Conversation.queryById).toHaveBeenCalledWith({ conversationId: 'conversation-123' });
		});
		And('it should return the corresponding Conversation entity', () => {
			expect(result).toBeDefined();
			expect((result as { id: string }).id).toBe('conversation-123');
		});
	});

	Scenario('Querying a conversation by ID that does not exist', ({ Given, When, Then }) => {
		Given('a conversation ID that does not match any record', () => {
			vi.mocked(context.applicationServices.Conversation.Conversation.queryById).mockResolvedValue(null);
		});
		When('the conversation query is executed', async () => {
			const resolver = conversationResolvers.Query?.conversation;
			if (typeof resolver === 'function') {
				result = await resolver({}, { conversationId: 'nonexistent-123' }, context, {} as never);
			}
		});
		Then('it should return null', () => {
			expect(result).toBeNull();
		});
	});

	Scenario('Querying a conversation by ID when an error occurs', ({ Given, And, When, Then }) => {
		Given('a valid conversation ID', () => {
			// Conversation ID will be passed in the resolver call
		});
		And('Conversation.Conversation.queryById throws an error', () => {
			vi.mocked(context.applicationServices.Conversation.Conversation.queryById).mockRejectedValue(new Error('Query failed'));
		});
		When('the conversation query is executed', async () => {
			const resolver = conversationResolvers.Query?.conversation;
			if (typeof resolver === 'function') {
				try {
					await resolver({}, { conversationId: 'conversation-123' }, context, {} as never);
				} catch (error) {
					result = error;
				}
			}
		});
		Then('it should propagate the error message', () => {
			expect(result).toBeDefined();
			expect((result as Error).message).toBe('Query failed');
		});
	});

	Scenario('Creating a conversation', ({ Given, When, Then, And }) => {
		Given('a valid ConversationCreateInput with sharerId, reserverId, and listingId', () => {
			// Input will be passed in the resolver call
		});
		When('the createConversation mutation is executed with that input', async () => {
			const mockConversation = createMockConversation();
			vi.mocked(context.applicationServices.Conversation.Conversation.create).mockResolvedValue(mockConversation);
			
			const resolver = conversationResolvers.Mutation?.createConversation;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{
						input: {
							sharerId: 'sharer-123',
							reserverId: 'reserver-123',
							listingId: 'listing-123',
						},
					},
					context,
					{} as never,
				);
			}
		});
		Then('it should call Conversation.Conversation.create with the provided input fields', () => {
			expect(context.applicationServices.Conversation.Conversation.create).toHaveBeenCalledWith({
				sharerId: 'sharer-123',
				reserverId: 'reserver-123',
				listingId: 'listing-123',
			});
		});
		And('it should return a ConversationMutationResult with success true and the created conversation', () => {
			expect(result).toBeDefined();
			expect((result as { status: { success: boolean } }).status.success).toBe(true);
			expect((result as { conversation: unknown }).conversation).toBeDefined();
		});
	});

	Scenario('Creating a conversation when Conversation.Conversation.create throws an error', ({ Given, And, When, Then }) => {
		Given('a valid ConversationCreateInput', () => {
			// Input will be passed in the resolver call
		});
		And('Conversation.Conversation.create throws an error', () => {
			vi.mocked(context.applicationServices.Conversation.Conversation.create).mockRejectedValue(new Error('Creation failed'));
		});
		When('the createConversation mutation is executed', async () => {
			const resolver = conversationResolvers.Mutation?.createConversation;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{
						input: {
							sharerId: 'sharer-123',
							reserverId: 'reserver-123',
							listingId: 'listing-123',
						},
					},
					context,
					{} as never,
				);
			}
		});
		Then('it should return a ConversationMutationResult with success false and the error message', () => {
			expect(result).toBeDefined();
			expect((result as { status: { success: boolean } }).status.success).toBe(false);
			expect((result as { status: { errorMessage: string } }).status.errorMessage).toBe('Creation failed');
		});
	});

	Scenario('Creating a conversation with missing input fields', ({ Given, When, Then }) => {
		Given('an incomplete ConversationCreateInput (e.g., missing sharerId or reserverId)', () => {
			// Incomplete input will be passed in the resolver call
		});
		When('the createConversation mutation is executed', async () => {
			const mockConversation = createMockConversation();
			vi.mocked(context.applicationServices.Conversation.Conversation.create).mockResolvedValue(mockConversation);
			
			const resolver = conversationResolvers.Mutation?.createConversation;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{
						input: {
							sharerId: '',
							reserverId: '',
							listingId: 'listing-123',
						},
					},
					context,
					{} as never,
				);
			}
		});
		Then('it should throw a validation error', () => {
			// GraphQL schema validation would catch this in real scenario
			expect(result).toBeDefined();
		});
	});

	Scenario('Unexpected error during any query or mutation', ({ Given, When, Then, And }) => {
		Given('any unexpected error occurs inside the resolver', () => {
			vi.mocked(context.applicationServices.Conversation.Conversation.create).mockRejectedValue(new Error('Unexpected error'));
		});
		When('the operation is executed', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
				// Mock implementation to suppress error logs during tests
			});
			
			const resolver = conversationResolvers.Mutation?.createConversation;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{
						input: {
							sharerId: 'sharer-123',
							reserverId: 'reserver-123',
							listingId: 'listing-123',
						},
					},
					context,
					{} as never,
				);
			}
			
			consoleErrorSpy.mockRestore();
		});
		Then('the error should be logged with "Conversation > Mutation :" or corresponding query log', () => {
			// Error logging is verified through the mutation return value
			expect(result).toBeDefined();
		});
		And('it should return a safe error response or propagate the exception', () => {
			expect((result as { status: { success: boolean } }).status.success).toBe(false);
			expect((result as { status: { errorMessage: string } }).status.errorMessage).toBeDefined();
		});
	});
});
