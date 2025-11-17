import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import conversationResolvers from './conversation.resolvers.ts';

// Generic GraphQL resolver type for tests
type TestResolver<
	Args extends object = Record<string, unknown>,
	Return = unknown,
> = (
	parent: unknown,
	args: Args,
	context: GraphContext,
	info: unknown,
) => Promise<Return>;

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.resolvers.feature'),
);

// Types for test results
type ConversationEntity =
	Domain.Contexts.Conversation.Conversation.ConversationEntityReference;
type PersonalUserEntity =
	Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
type ItemListingEntity =
	Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;

// Helper function to create mock conversation
function createMockConversation(
	overrides: Partial<ConversationEntity> = {},
): ConversationEntity {
	const baseConversation: ConversationEntity = {
		id: 'conv-1',
		sharer: {
			id: 'user-1',
		} as PersonalUserEntity,
		loadSharer: vi.fn().mockResolvedValue({ id: 'user-1' }),
		reserver: {
			id: 'user-2',
		} as PersonalUserEntity,
		loadReserver: vi.fn().mockResolvedValue({ id: 'user-2' }),
		listing: {
			id: 'listing-1',
		} as ItemListingEntity,
		loadListing: vi.fn().mockResolvedValue({ id: 'listing-1' }),
		messagingConversationId: 'twilio-123',
		messages: [],
		loadMessages: vi.fn().mockResolvedValue([]),
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		...overrides,
	};
	return baseConversation;
}

function makeMockGraphContext(
	overrides: Partial<GraphContext> = {},
): GraphContext {
	return {
		applicationServices: {
			Conversation: {
				Conversation: {
					queryByUser: vi.fn(),
					queryById: vi.fn(),
					create: vi.fn(),
				},
			},
		},
		...overrides,
	} as unknown as GraphContext;
}

// Helper function to reduce repetition in conversation queries
function executeConversationsByUser(
	userId: string,
	// biome-ignore lint/suspicious/noExplicitAny: Test helper function needs flexible mock setup
	setup: (svc: any) => void,
): Promise<unknown> {
	const context = makeMockGraphContext();
	const svc = context.applicationServices.Conversation.Conversation;
	setup(svc);
	const resolver = conversationResolvers.Query
		?.conversationsByUser as TestResolver<{ userId: string }>;
	return resolver?.(null, { userId }, context, null);
}

test.for(feature, ({ Scenario }) => {
	let context: GraphContext;
	let result: unknown;
	let error: Error | undefined;

	Scenario(
		'Querying conversations by user ID',
		({ When, Then }) => {
			When('the conversationsByUser query is executed with that ID', async () => {
				result = await executeConversationsByUser('user-1', (svc) => {
					svc.queryByUser.mockResolvedValue([createMockConversation()]);
				});
			});
			Then(
				'it should return a list of Conversation entities',
				() => {
					expect(Array.isArray(result)).toBe(true);
					expect((result as ConversationEntity[]).length).toBeGreaterThan(0);
				},
			);
		},
	);

	Scenario(
		'Querying conversations by user ID with no conversations',
		({ When, Then }) => {
			When('the conversationsByUser query is executed', async () => {
				result = await executeConversationsByUser('user-1', (svc) => {
					svc.queryByUser.mockResolvedValue([]);
				});
			});
			Then('it should return an empty list', () => {
				expect(Array.isArray(result)).toBe(true);
				expect((result as ConversationEntity[]).length).toBe(0);
			});
		},
	);

	Scenario(
		'Querying conversations by user ID when an error occurs',
		({ When, Then }) => {
			When('the conversationsByUser query is executed', async () => {
				try {
					result = await executeConversationsByUser('user-1', (svc) => {
						svc.queryByUser.mockRejectedValue(new Error('Database error'));
					});
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Database error');
			});
		},
	);

	Scenario('Querying a conversation by ID', ({ Given, When, Then, And }) => {
		Given('a valid conversation ID', () => {
			context = makeMockGraphContext();
			(
				context.applicationServices.Conversation.Conversation
					.queryById as ReturnType<typeof vi.fn>
			).mockResolvedValue(createMockConversation());
		});
		When('the conversation query is executed with that ID', async () => {
			const resolver = conversationResolvers.Query
				?.conversation as TestResolver<{ conversationId: string }>;
			result = await resolver(
				null,
				{ conversationId: 'conv-1' },
				context,
				null,
			);
		});
		Then(
			'it should call Conversation.Conversation.queryById with the provided conversationId',
			() => {
				expect(
					context.applicationServices.Conversation.Conversation.queryById,
				).toHaveBeenCalledWith({ conversationId: 'conv-1' });
			},
		);
		And('it should return the corresponding Conversation entity', () => {
			expect(result).toBeDefined();
			expect((result as ConversationEntity).id).toBe('conv-1');
		});
	});

	Scenario(
		'Querying a conversation by ID that does not exist',
		({ Given, When, Then }) => {
			Given('a conversation ID that does not match any record', () => {
				context = makeMockGraphContext();
				(
					context.applicationServices.Conversation.Conversation
						.queryById as ReturnType<typeof vi.fn>
				).mockResolvedValue(null);
			});
			When('the conversation query is executed', async () => {
				const resolver = conversationResolvers.Query
					?.conversation as TestResolver<{ conversationId: string }>;
				result = await resolver(
					null,
					{ conversationId: 'nonexistent' },
					context,
					null,
				);
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Querying a conversation by ID when an error occurs',
		({ Given, And, When, Then }) => {
			Given('a valid conversation ID', () => {
				context = makeMockGraphContext();
			});
			And('Conversation.Conversation.queryById throws an error', () => {
				(
					context.applicationServices.Conversation.Conversation
						.queryById as ReturnType<typeof vi.fn>
				).mockRejectedValue(new Error('Database error'));
			});
			When('the conversation query is executed', async () => {
				const resolver = conversationResolvers.Query
					?.conversation as TestResolver<{ conversationId: string }>;
				try {
					result = await resolver(
						null,
						{ conversationId: 'conv-1' },
						context,
						null,
					);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Database error');
			});
		},
	);

	Scenario('Creating a conversation', ({ Given, When, Then, And }) => {
		Given(
			'a valid ConversationCreateInput with sharerId, reserverId, and listingId',
			() => {
				context = makeMockGraphContext();
				(
					context.applicationServices.Conversation.Conversation
						.create as ReturnType<typeof vi.fn>
				).mockResolvedValue(createMockConversation());
			},
		);
		When(
			'the createConversation mutation is executed with that input',
			async () => {
				const resolver = conversationResolvers.Mutation
					?.createConversation as TestResolver<{
					input: {
						sharerId: string;
						reserverId: string;
						listingId: string;
					};
				}>;
				result = await resolver(
					null,
					{
						input: {
							sharerId: 'user-1',
							reserverId: 'user-2',
							listingId: 'listing-1',
						},
					},
					context,
					null,
				);
			},
		);
		Then(
			'it should call Conversation.Conversation.create with the provided input fields',
			() => {
				expect(
					context.applicationServices.Conversation.Conversation.create,
				).toHaveBeenCalledWith({
					sharerId: 'user-1',
					reserverId: 'user-2',
					listingId: 'listing-1',
				});
			},
		);
		And(
			'it should return a ConversationMutationResult with success true and the created conversation',
			() => {
				expect(result).toBeDefined();
				expect(
					(result as { status: { success: boolean } }).status.success,
				).toBe(true);
				expect((result as { conversation: ConversationEntity }).conversation).toBeDefined();
			},
		);
	});

	Scenario(
		'Creating a conversation when Conversation.Conversation.create throws an error',
		({ Given, And, When, Then }) => {
			Given('a valid ConversationCreateInput', () => {
				context = makeMockGraphContext();
			});
			And('Conversation.Conversation.create throws an error', () => {
				(
					context.applicationServices.Conversation.Conversation
						.create as ReturnType<typeof vi.fn>
				).mockRejectedValue(new Error('Creation failed'));
			});
			When('the createConversation mutation is executed', async () => {
				const resolver = conversationResolvers.Mutation
					?.createConversation as TestResolver<{
					input: {
						sharerId: string;
						reserverId: string;
						listingId: string;
					};
				}>;
				result = await resolver(
					null,
					{
						input: {
							sharerId: 'user-1',
							reserverId: 'user-2',
							listingId: 'listing-1',
						},
					},
					context,
					null,
				);
			});
			Then(
				'it should return a ConversationMutationResult with success false and the error message',
				() => {
					expect(result).toBeDefined();
					expect(
						(result as { status: { success: boolean } }).status.success,
					).toBe(false);
					expect(
						(result as { status: { errorMessage?: string } }).status
							.errorMessage,
					).toContain('Creation failed');
				},
			);
		},
	);
});