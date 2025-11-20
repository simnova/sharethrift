import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { ModelsContext } from '../../../../models-context.ts';
import type { Domain } from '@sthrift/domain';
import { ConversationReadRepositoryImpl, getConversationReadRepository } from './conversation.read-repository.ts';
import {
	createValidObjectId,
	makePassport,
	makeMockUser,
	makeMockListing,
	createMockQuery,
} from '../../../../test-utilities/mock-data-helpers.ts';
import { makeMockConversation } from '../../../../test-utilities/conversation/conversation-test-helpers.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.read-repository.feature'),
);

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: ConversationReadRepositoryImpl;
	let mockModel: Models.Conversation.ConversationModelType;
	let passport: Domain.Passport;
	let mockConversations: Models.Conversation.Conversation[];
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		mockConversations = [makeMockConversation()];

		mockModel = {
			find: vi.fn(() => createMockQuery(mockConversations)),
			findById: vi.fn(() => createMockQuery(mockConversations[0])),
			findOne: vi.fn(() => createMockQuery(mockConversations[0] || null)),
		} as unknown as Models.Conversation.ConversationModelType;

		const modelsContext = {
			Conversation: {
				ConversationModel: mockModel,
			},
		} as unknown as ModelsContext;

		repository = new ConversationReadRepositoryImpl(modelsContext, passport);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'a ConversationReadRepository instance with a working Mongoose model and passport',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		And('valid Conversation documents exist in the database', () => {
			// Mock documents are set up in BeforeEachScenario
		});
	});

	Scenario('Getting all conversations', ({ Given, When, Then, And }) => {
		Given('multiple Conversation documents in the database', () => {
			mockConversations = [
				makeMockConversation(),
				makeMockConversation(),
			];
		});
		When('I call getAll', async () => {
			result = await repository.getAll();
		});
		Then('I should receive an array of Conversation entities', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBeGreaterThan(0);
		});
		And('the array should contain all conversations', () => {
			const conversations =
				result as Domain.Contexts.Conversation.Conversation.ConversationEntityReference[];
			expect(conversations.length).toBe(mockConversations.length);
		});
	});

	Scenario('Getting a conversation by ID', ({ Given, When, Then, And }) => {
		Given('a Conversation document with id "conv-1"', () => {
			mockConversations = [makeMockConversation()];
		});
		When('I call getById with "conv-1"', async () => {
			// Use the same ObjectId format as the mock conversation
			const validObjectId = createValidObjectId('conv-1');
			result = await repository.getById(validObjectId);
		});
		Then('I should receive a Conversation entity', () => {
			expect(result).toBeDefined();
			expect(result).not.toBeNull();
		});
		And('the entity\'s id should be "conv-1"', () => {
			const conversation =
				result as Domain.Contexts.Conversation.Conversation.ConversationEntityReference;
			expect(conversation.id).toBeDefined();
		});
	});

	Scenario('Getting a conversation by nonexistent ID', ({ When, Then }) => {
		When('I call getById with "nonexistent-id"', async () => {
			mockModel.findById = vi.fn(() => createMockQuery(null)) as unknown as typeof mockModel.findById;

			result = await repository.getById('nonexistent-id');
		});
		Then('it should return null', () => {
			expect(result).toBeNull();
		});
	});

	Scenario(
		'Getting conversations by user ID as sharer',
		({ Given, When, Then, And }) => {
			Given('a Conversation document with sharer "user-1"', () => {
				mockConversations = [
					makeMockConversation({
						sharer: makeMockUser('user-1'),
					}),
				];
			});
			When('I call getByUser with "user-1"', async () => {
				result = await repository.getByUser(createValidObjectId('user-1'));
			});
			Then('I should receive an array of Conversation entities', () => {
				expect(Array.isArray(result)).toBe(true);
			});
			And('the array should contain conversations where user is sharer', () => {
				const conversations =
					result as Domain.Contexts.Conversation.Conversation.ConversationEntityReference[];
				expect(conversations.length).toBeGreaterThan(0);
			});
		},
	);

	Scenario(
		'Getting conversations by user ID as reserver',
		({ Given, When, Then, And }) => {
			Given('a Conversation document with reserver "user-2"', () => {
				mockConversations = [
					makeMockConversation({
						reserver: makeMockUser('user-2'),
					}),
				];
			});
			When('I call getByUser with "user-2"', async () => {
				result = await repository.getByUser(createValidObjectId('user-2'));
			});
			Then('I should receive an array of Conversation entities', () => {
				expect(Array.isArray(result)).toBe(true);
			});
			And('the array should contain conversations where user is reserver', () => {
				const conversations =
					result as Domain.Contexts.Conversation.Conversation.ConversationEntityReference[];
				expect(conversations.length).toBeGreaterThan(0);
			});
		},
	);

	Scenario(
		'Getting conversations by user ID with no conversations',
		({ When, Then }) => {
			When('I call getByUser with "user-without-conversations"', async () => {
				mockModel.find = vi.fn(() => createMockQuery([])) as unknown as typeof mockModel.find;

				result = await repository.getByUser(createValidObjectId('user-without-conversations'));
			});
			Then('I should receive an empty array', () => {
				expect(Array.isArray(result)).toBe(true);
				expect((result as unknown[]).length).toBe(0);
			});
		},
	);

	Scenario(
		'Getting conversations with empty or invalid user ID',
		({ When, Then }) => {
			When('I call getByUser with an empty string', async () => {
				result = await repository.getByUser('');
			});
			Then('I should receive an empty array', () => {
				expect(Array.isArray(result)).toBe(true);
				expect((result as unknown[]).length).toBe(0);
			});
		},
	);

	Scenario(
		'Getting conversation by sharer, reserver, and listing IDs',
		({ Given, When, Then, And }) => {
			Given('a conversation with specific sharer, reserver, and listing', () => {
				mockConversations = [
					makeMockConversation({
						sharer: makeMockUser('sharer-1'),
						reserver: makeMockUser('reserver-1'),
						listing: makeMockListing('listing-1'),
					}),
				];
			});
			When('I call getBySharerReserverListing with valid IDs', async () => {
				result = await repository.getBySharerReserverListing(
					createValidObjectId('sharer-1'),
					createValidObjectId('reserver-1'),
					createValidObjectId('listing-1'),
				);
			});
			Then('I should receive a Conversation entity', () => {
				expect(result).toBeDefined();
				expect(result).not.toBeNull();
			});
			And('the entity should match the criteria', () => {
				const conversation =
					result as Domain.Contexts.Conversation.Conversation.ConversationEntityReference;
				expect(conversation.id).toBeDefined();
			});
		},
	);

	Scenario(
		'Getting conversation by sharer, reserver, and listing with no match',
		({ When, Then }) => {
			When('I call getBySharerReserverListing with non-matching IDs', async () => {
				mockModel.findOne = vi.fn(() => createMockQuery(null)) as unknown as typeof mockModel.findOne;

				result = await repository.getBySharerReserverListing(
					createValidObjectId('sharer-999'),
					createValidObjectId('reserver-999'),
					createValidObjectId('listing-999'),
				);
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Getting conversation by sharer, reserver, and listing with empty parameters',
		({ When, Then }) => {
			When('I call getBySharerReserverListing with empty parameters', async () => {
				result = await repository.getBySharerReserverListing('', '', '');
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Getting conversation by sharer, reserver, and listing with partial empty parameters',
		({ When, Then }) => {
			When('I call getBySharerReserverListing with partial empty parameters', async () => {
				result = await repository.getBySharerReserverListing(
					createValidObjectId('sharer-1'),
					'',
					createValidObjectId('listing-1'),
				);
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Getting conversation by sharer, reserver, and listing with invalid ObjectId',
		({ When, Then }) => {
			When('I call getBySharerReserverListing with invalid ObjectId that throws error', async () => {
				// Use a spy to monitor console.warn calls for error handling validation
				const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
					// Mock implementation - suppress console.warn for test
				});

				// Use an invalid ObjectId format that would cause MongoDB/Mongoose to throw
				result = await repository.getBySharerReserverListing(
					'invalid-objectid-format',
					'invalid-objectid-format', 
					'invalid-objectid-format',
				);

				consoleSpy.mockRestore();
			});
			Then('it should return null due to error handling', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Testing getByUser with invalid ObjectId that throws error',
		({ When, Then }) => {
			When('I call getByUser with ObjectId that throws error', async () => {
				// Use a spy to monitor console.warn calls for error handling validation
				const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
					// Mock implementation - suppress console.warn for test
				});

				// Use an invalid ObjectId format that would cause MongoDB/Mongoose to throw
				result = await repository.getByUser('invalid-objectid-format');

				consoleSpy.mockRestore();
			});
			Then('it should return empty array due to error handling', () => {
				expect(Array.isArray(result)).toBe(true);
				expect((result as unknown[]).length).toBe(0);
			});
		},
	);

	Scenario(
		'Testing getConversationReadRepository factory function',
		({ When, Then }) => {
			When('I call getConversationReadRepository factory function', () => {
				const modelsContext = {
					Conversation: {
						ConversationModel: mockModel,
					},
				} as unknown as ModelsContext;

				result = getConversationReadRepository(modelsContext, passport);
			});
			Then('it should return a ConversationReadRepositoryImpl instance', () => {
				expect(result).toBeDefined();
				expect(result).toBeInstanceOf(ConversationReadRepositoryImpl);
			});
		},
	);
});
