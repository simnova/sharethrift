import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import conversationResolvers from './conversation.resolvers.ts';

// Generic GraphQL resolver type for tests
type TestResolver<Args extends object = Record<string, unknown>, Return = unknown> = (
	parent: unknown,
	args: Args,
	context: GraphContext,
	info: unknown,
) => Promise<Return>;

// Shared input type for createConversation
interface ConversationCreateInput {
	sharerId: string;
	reserverId: string;
	listingId: string;
}

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.resolvers.feature'),
);

// Types for test results
type ConversationEntity =
	Domain.Contexts.Conversation.Conversation.ConversationEntityReference;

// Helper function to create mock conversation
function createMockConversation(
	overrides: Partial<ConversationEntity> = {},
): ConversationEntity {
	const baseConversation: ConversationEntity = {
		id: 'conv-1',
		sharer: { id: 'user-1' } as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		loadSharer: async () => ({ id: 'user-1' } as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference),
		reserver: { id: 'user-2' } as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		loadReserver: async () => ({ id: 'user-2' } as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference),
		listing: { id: 'listing-1' } as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
		loadListing: async () => ({ id: 'listing-1' } as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference),
		messagingConversationId: 'messaging-conv-123',
		messages: [],
		loadMessages: async () => [],
		twilioConversationId: 'twilio-123',
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		...overrides,
	};
	return baseConversation;
}

// Helper function to create mock context
function createMockContext(
	queryByUserMock: ReturnType<typeof vi.fn>,
	queryByIdMock: ReturnType<typeof vi.fn>,
	createMock: ReturnType<typeof vi.fn>,
): GraphContext {
	return {
		applicationServices: {
			Conversation: {
				Conversation: {
					queryByUser: queryByUserMock,
					queryById: queryByIdMock,
					create: createMock,
				},
			},
		},
	} as unknown as GraphContext;
}

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let context: GraphContext;
	let queryByUserMock: ReturnType<typeof vi.fn>;
	let queryByIdMock: ReturnType<typeof vi.fn>;
	let createMock: ReturnType<typeof vi.fn>;
	let result: unknown;

	BeforeEachScenario(() => {
		queryByUserMock = vi.fn();
		queryByIdMock = vi.fn();
		createMock = vi.fn();
		context = createMockContext(queryByUserMock, queryByIdMock, createMock);
		result = undefined;
	});

	Scenario('Querying conversations by user ID', ({ Given, And, When, Then }) => {
		let userId: string;
		let conversations: ConversationEntity[];

		Given('a valid user ID', () => {
			userId = 'user-1';
		});
		When('the conversationsByUser query is executed with that ID', async () => {
			conversations = [createMockConversation()];
			queryByUserMock.mockResolvedValue(conversations);
			const resolver = conversationResolvers.Query?.conversationsByUser as TestResolver<{ userId: string }, ConversationEntity[]>;
			result = await resolver({}, { userId }, context, {});
		});
		Then('it should call Conversation.Conversation.queryByUser with the provided userId', () => {
			expect(queryByUserMock).toHaveBeenCalledWith({ userId });
		});
		And('it should return a list of Conversation entities', () => {
			expect(result).toEqual(conversations);
			expect(Array.isArray(result)).toBe(true);
		});
	});

	Scenario(
		'Querying conversations by user ID with no conversations',
		({ Given, And, When, Then }) => {
			let userId: string;

			Given('a valid user ID', () => {
				userId = 'user-no-convs';
			});
			And('Conversation.Conversation.queryByUser returns an empty array', () => {
				queryByUserMock.mockResolvedValue([]);
			});
			When('the conversationsByUser query is executed', async () => {
				const resolver = conversationResolvers.Query?.conversationsByUser as TestResolver<{ userId: string }, ConversationEntity[]>;
				result = await resolver({}, { userId }, context, {});
			});
			Then('it should return an empty list', () => {
				expect(result).toEqual([]);
				expect(Array.isArray(result)).toBe(true);
				expect((result as unknown[]).length).toBe(0);
			});
		},
	);

	Scenario(
		'Querying conversations by user ID when an error occurs',
		({ Given, And, When, Then }) => {
			let userId: string;
			let error: Error;

			Given('a valid user ID', () => {
				userId = 'user-error';
			});
			And('Conversation.Conversation.queryByUser throws an error', () => {
				error = new Error('Database connection failed');
				queryByUserMock.mockRejectedValue(error);
			});
			When('the conversationsByUser query is executed', async () => {
				const resolver = conversationResolvers.Query?.conversationsByUser as TestResolver<{ userId: string }, ConversationEntity[]>;
				try {
					result = await resolver({}, { userId }, context, {});
				} catch (e) {
					result = e;
				}
			});
			Then('it should propagate the error message', () => {
				expect(result).toBe(error);
			});
		},
	);

	Scenario('Querying a conversation by ID', ({ Given, When, Then, And }) => {
		let conversationId: string;
		let conversation: ConversationEntity;

		Given('a valid conversation ID', () => {
			conversationId = 'conv-1';
		});
		When('the conversation query is executed with that ID', async () => {
			conversation = createMockConversation({ id: conversationId });
			queryByIdMock.mockResolvedValue(conversation);
			const resolver = conversationResolvers.Query?.conversation as TestResolver<{ conversationId: string }, ConversationEntity>;
			result = await resolver({}, { conversationId }, context, {});
		});
		Then('it should call Conversation.Conversation.queryById with the provided conversationId', () => {
			expect(queryByIdMock).toHaveBeenCalledWith({ conversationId });
		});
		And('it should return the corresponding Conversation entity', () => {
			expect(result).toEqual(conversation);
		});
	});

	Scenario(
		'Querying a conversation by ID that does not exist',
		({ Given, When, Then }) => {
			let conversationId: string;

			Given('a conversation ID that does not match any record', () => {
				conversationId = 'non-existent-conv';
			});
			When('the conversation query is executed', async () => {
				queryByIdMock.mockResolvedValue(null);
				const resolver = conversationResolvers.Query?.conversation as TestResolver<{ conversationId: string }, ConversationEntity | null>;
				result = await resolver({}, { conversationId }, context, {});
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Querying a conversation by ID when an error occurs',
		({ Given, And, When, Then }) => {
			let conversationId: string;
			let error: Error;

			Given('a valid conversation ID', () => {
				conversationId = 'conv-error';
			});
			And('Conversation.Conversation.queryById throws an error', () => {
				error = new Error('Database query failed');
				queryByIdMock.mockRejectedValue(error);
			});
			When('the conversation query is executed', async () => {
				const resolver = conversationResolvers.Query?.conversation as TestResolver<{ conversationId: string }, ConversationEntity>;
				try {
					result = await resolver({}, { conversationId }, context, {});
				} catch (e) {
					result = e;
				}
			});
			Then('it should propagate the error message', () => {
				expect(result).toBe(error);
			});
		},
	);

	Scenario('Creating a conversation', ({ Given, When, Then, And }) => {
		let input: ConversationCreateInput;
		let conversation: ConversationEntity;

		Given('a valid ConversationCreateInput with sharerId, reserverId, and listingId', () => {
			input = {
				sharerId: 'user-1',
				reserverId: 'user-2',
				listingId: 'listing-1',
			};
		});
		When('the createConversation mutation is executed with that input', async () => {
			conversation = createMockConversation();
			createMock.mockResolvedValue(conversation);
			const resolver = conversationResolvers.Mutation?.createConversation as TestResolver<{ input: ConversationCreateInput }, { status: { success: boolean }; conversation: ConversationEntity }>;
			result = await resolver({}, { input }, context, {});
		});
		Then('it should call Conversation.Conversation.create with the provided input fields', () => {
			expect(createMock).toHaveBeenCalledWith({
				sharerId: input.sharerId,
				reserverId: input.reserverId,
				listingId: input.listingId,
			});
		});
		And('it should return a ConversationMutationResult with success true and the created conversation', () => {
			expect(result).toHaveProperty('status');
			expect((result as { status: { success: boolean } }).status.success).toBe(true);
			expect(result).toHaveProperty('conversation');
			expect((result as { conversation: ConversationEntity }).conversation).toEqual(conversation);
		});
	});

	Scenario(
		'Creating a conversation when Conversation.Conversation.create throws an error',
		({ Given, And, When, Then }) => {
			let input: ConversationCreateInput;
			let error: Error;

			Given('a valid ConversationCreateInput', () => {
				input = {
					sharerId: 'user-1',
					reserverId: 'user-2',
					listingId: 'listing-1',
				};
			});
			And('Conversation.Conversation.create throws an error', () => {
				error = new Error('Failed to create conversation');
				createMock.mockRejectedValue(error);
			});
			When('the createConversation mutation is executed', async () => {
				const resolver = conversationResolvers.Mutation?.createConversation as TestResolver<{ input: ConversationCreateInput }, { status: { success: boolean; errorMessage?: string }; conversation?: ConversationEntity }>;
				result = await resolver({}, { input }, context, {});
			});
			Then('it should return a ConversationMutationResult with success false and the error message', () => {
				expect(result).toHaveProperty('status');
				expect((result as { status: { success: boolean; errorMessage?: string } }).status.success).toBe(false);
				expect((result as { status: { errorMessage?: string } }).status.errorMessage).toBe('Failed to create conversation');
			});
		},
	);

	Scenario(
		'Creating a conversation with missing input fields',
		({ Given, When, Then }) => {
			let input: Partial<ConversationCreateInput>;

			Given('an incomplete ConversationCreateInput (e.g., missing sharerId or reserverId)', () => {
				input = {
					sharerId: 'user-1',
					// Missing reserverId and listingId
				};
			});
			When('the createConversation mutation is executed', async () => {
				// In a real scenario, GraphQL validation would catch this
				// For testing purposes, we'll simulate what would happen
				createMock.mockRejectedValue(new Error('Validation failed: missing required fields'));
				const resolver = conversationResolvers.Mutation?.createConversation as TestResolver<{ input: ConversationCreateInput }, { status: { success: boolean; errorMessage?: string } }>;
				result = await resolver({}, { input: input as ConversationCreateInput }, context, {});
			});
			Then('it should throw a validation error', () => {
				expect(result).toHaveProperty('status');
				expect((result as { status: { success: boolean } }).status.success).toBe(false);
				expect((result as { status: { errorMessage?: string } }).status.errorMessage).toContain('Validation failed');
			});
		},
	);

	Scenario(
		'Unexpected error during any query or mutation',
		({ Given, When, Then, And }) => {
			let error: Error;
			// biome-ignore lint/suspicious/noEmptyBlockStatements: Mock implementation doesn't need to do anything
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			Given('any unexpected error occurs inside the resolver', () => {
				error = new Error('Unexpected error');
				createMock.mockRejectedValue(error);
			});
			When('the operation is executed', async () => {
				const input: ConversationCreateInput = {
					sharerId: 'user-1',
					reserverId: 'user-2',
					listingId: 'listing-1',
				};
				const resolver = conversationResolvers.Mutation?.createConversation as TestResolver<{ input: ConversationCreateInput }, { status: { success: boolean; errorMessage?: string } }>;
				result = await resolver({}, { input }, context, {});
			});
			Then('the error should be logged with "Conversation > Mutation :" or corresponding query log', () => {
				expect(consoleErrorSpy).toHaveBeenCalledWith(
					'Conversation > Mutation  : ',
					error,
				);
			});
			And('it should return a safe error response or propagate the exception', () => {
				expect(result).toHaveProperty('status');
				expect((result as { status: { success: boolean } }).status.success).toBe(false);
			});

			consoleErrorSpy.mockRestore();
		},
	);
});
