import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { ModelsContext } from '../../../../models-context.ts';
import type { Domain } from '@sthrift/domain';
import { ConversationReadRepositoryImpl } from './conversation.read-repository.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

// Helper to create a valid 24-character hex string from a simple ID
function createValidObjectId(id: string): string {
	// Convert string to a hex representation and pad to 24 characters
	const hexChars = '0123456789abcdef';
	let hex = '';
	for (let i = 0; i < id.length && hex.length < 24; i++) {
		const charCode = id.charCodeAt(i);
		hex += hexChars[charCode % 16];
	}
	// Pad with zeros if needed
	return hex.padEnd(24, '0').substring(0, 24);
}

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.read-repository.feature'),
);

function makePassport(): Domain.Passport {
	return vi.mocked({
		conversation: {
			forConversation: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

function makeMockUser(id: string): Models.User.PersonalUser {
	return {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(id)),
		id: id,
		userType: 'end-user',
		isBlocked: false,
		hasCompletedOnboarding: false,
		account: {
			accountType: 'standard',
			email: `${id}@example.com`,
			username: id,
			profile: {
				firstName: 'Test',
				lastName: 'User',
				aboutMe: 'Hello',
				location: {
					address1: '123 Main St',
					address2: null,
					city: 'Test City',
					state: 'TS',
					country: 'Testland',
					zipCode: '12345',
				},
				billing: {
					subscriptionId: null,
					cybersourceCustomerId: null,
					paymentState: '',
					lastTransactionId: null,
					lastPaymentAmount: null,
				},
			},
		},
		role: { id: 'role-1' },
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
	} as unknown as Models.User.PersonalUser;
}

function makeMockListing(id: string): Models.Listing.ItemListing {
	return {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(id)),
		id: id,
		title: 'Test Listing',
		description: 'Test Description',
	} as unknown as Models.Listing.ItemListing;
}

function makeMockConversation(
	overrides: Partial<Models.Conversation.Conversation> = {},
): Models.Conversation.Conversation {
	const conversationId = overrides.id || 'conv-1';
	const defaultConv = {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(conversationId as string)),
		id: conversationId,
		sharer: makeMockUser('user-1'),
		reserver: makeMockUser('user-2'),
		listing: makeMockListing('listing-1'),
		messagingConversationId: 'twilio-123',
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
		schemaVersion: '1.0.0',
	};
	return {
		...defaultConv,
		...overrides,
	} as unknown as Models.Conversation.Conversation;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: ConversationReadRepositoryImpl;
	let mockModel: Models.Conversation.ConversationModelType;
	let passport: Domain.Passport;
	let mockConversations: Models.Conversation.Conversation[];
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		mockConversations = [makeMockConversation()];

		// Create mock query that supports chaining and is thenable
		const createMockQuery = (result: unknown) => {
			const mockQuery = {
				lean: vi.fn(),
				populate: vi.fn(),
				exec: vi.fn().mockResolvedValue(result),
				catch: vi.fn((onReject) => Promise.resolve(result).catch(onReject)),
			};
			// Configure methods to return the query object for chaining
			mockQuery.lean.mockReturnValue(mockQuery);
			mockQuery.populate.mockReturnValue(mockQuery);
			
			// Make the query thenable (like Mongoose queries are) by adding then as property
			Object.defineProperty(mockQuery, 'then', {
				value: vi.fn((onResolve) => Promise.resolve(result).then(onResolve)),
				enumerable: false,
			});
			return mockQuery;
		};

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
			mockModel.findById = vi.fn(() => ({
				populate: vi.fn(() => ({
					populate: vi.fn(() => ({
						populate: vi.fn(() => ({
							lean: vi.fn(async () => null),
						})),
					})),
				})),
			})) as unknown as typeof mockModel.findById;

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
				mockModel.find = vi.fn(() => ({
					populate: vi.fn(() => ({
						populate: vi.fn(() => ({
							populate: vi.fn(() => ({
								lean: vi.fn(async () => []),
							})),
						})),
					})),
				})) as unknown as typeof mockModel.find;

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
});
