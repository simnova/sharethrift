import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import type mongoose from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { expect, vi } from 'vitest';
import { makeNewableMock } from '@cellix/test-utils';
import { ConversationConverter } from './conversation.domain-adapter.ts';
import { ConversationRepository } from './conversation.repository.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.repository.feature'),
);

// Test utilities - consolidated helper functions
function createValidObjectId(id: string): string {
	const hexChars = '0123456789abcdef';
	let hex = '';
	for (let i = 0; i < id.length && hex.length < 24; i++) {
		const codePoint = id.codePointAt(i) ?? 0;
		hex += hexChars[codePoint % 16];
	}
	return hex.padEnd(24, '0').substring(0, 24);
}

function makePassport(): Domain.Passport {
	return vi.mocked({
		conversation: { forConversation: vi.fn(() => ({ determineIf: () => true })) },
		user: { forPersonalUser: vi.fn(() => ({ determineIf: () => true })) },
		listing: { forItemListing: vi.fn(() => ({ determineIf: () => true })) },
	} as unknown as Domain.Passport);
}

function makeEventBus(): DomainSeedwork.EventBus {
	return vi.mocked({ dispatch: vi.fn(), register: vi.fn() } as DomainSeedwork.EventBus);
}

// use shared makeNewableMock from test-utils

function makeUserDoc(id: string): Models.User.PersonalUser {
	const validId = createValidObjectId(id);
	return {
		_id: new MongooseSeedwork.ObjectId(validId),
		id: id,
		userType: 'personal-user',
		isBlocked: false,
		hasCompletedOnboarding: true,
		account: {
			accountType: 'standard',
			email: `${id}@example.com`,
			username: id,
			profile: {
				aboutMe: '',
				firstName: 'Test',
				lastName: 'User',
				location: 'Test Location',
				billing: {
					cybersourceCustomerId: '',
					subscription: null,
					transactions: [],
				},
				media: { items: [] },
				avatar: null,
			},
		},
		set: vi.fn(),
	} as unknown as Models.User.PersonalUser;
}

function makeConversationDoc(id = 'conv-1'): Models.Conversation.Conversation {
	return {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(id)),
		id: id,
		sharer: makeUserDoc('user-1'),
		reserver: makeUserDoc('user-2'),
		listing: { id: 'listing-1' },
		messagingConversationId: 'twilio-123',
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
	} as unknown as Models.Conversation.Conversation;
}

function createChainableQuery<T>(result: T) {
	const query = { populate: vi.fn(), exec: vi.fn().mockResolvedValue(result) };
	query.populate.mockReturnValue(query);
	return query;
}

function setupConversationRepo(
	mockDoc: Models.Conversation.Conversation,
	overrides?: { findById?: () => unknown, findOne?: () => unknown, modelCtor?: Models.Conversation.ConversationModelType }
): ConversationRepository {
	const modelType = overrides?.modelCtor ?? ({
		findById: overrides?.findById ?? (() => createChainableQuery(mockDoc)),
		findOne: overrides?.findOne ?? (() => createChainableQuery(mockDoc))
	} as unknown as Models.Conversation.ConversationModelType);
	
	return new ConversationRepository(
		makePassport(), 
		modelType, 
		new ConversationConverter(), 
		makeEventBus(), 
		vi.mocked({} as mongoose.ClientSession)
	);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: ConversationRepository;
	let mockDoc: Models.Conversation.Conversation;
	let result: unknown;

	BeforeEachScenario(() => {
		mockDoc = makeConversationDoc('conv-1');
		repository = setupConversationRepo(mockDoc);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'a ConversationRepository instance with a working Mongoose model, type converter, and passport',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		And('valid Conversation documents exist in the database', () => {
			// Mock documents are set up in BeforeEachScenario
		});
	});

	Scenario(
		'Getting a conversation by ID with references',
		({ Given, When, Then, And }) => {
			Given(
				'a Conversation document with id "conv-1", sharer "user-1", reserver "user-2", and listing "listing-1"',
				() => {
					// Already set up in BeforeEachScenario
				},
			);
			When('I call getByIdWithReferences with "conv-1"', async () => {
				result = await repository.getByIdWithReferences('conv-1');
			});
			Then('I should receive a Conversation domain object', () => {
				expect(result).toBeInstanceOf(
					Domain.Contexts.Conversation.Conversation.Conversation,
				);
			});
			And("the domain object's sharer should be populated", () => {
				const conversation =
					result as Domain.Contexts.Conversation.Conversation.Conversation<
						Domain.Contexts.Conversation.Conversation.ConversationProps
					>;
				expect(conversation.sharer.id).toBeDefined();
			});
			And("the domain object's reserver should be populated", () => {
				const conversation =
					result as Domain.Contexts.Conversation.Conversation.Conversation<
						Domain.Contexts.Conversation.Conversation.ConversationProps
					>;
				expect(conversation.reserver.id).toBeDefined();
			});
			And("the domain object's listing should be populated", () => {
				const conversation =
					result as Domain.Contexts.Conversation.Conversation.Conversation<
						Domain.Contexts.Conversation.Conversation.ConversationProps
					>;
				expect(conversation.listing.id).toBeDefined();
			});
		},
	);

	Scenario(
		'Getting a conversation by nonexistent ID',
		({ When, Then }) => {
			When('I call getByIdWithReferences with "nonexistent-id"', async () => {
				// Setup repository with null result for this scenario
				repository = setupConversationRepo(mockDoc, {
					findById: () => createChainableQuery(null)
				});

				try {
					result = await repository.getByIdWithReferences('nonexistent-id');
				} catch (error) {
					result = error;
				}
			});
			Then(
				'an error should be thrown indicating "Conversation with id nonexistent-id not found"',
				() => {
					expect(result).toBeInstanceOf(Error);
					expect((result as Error).message).toContain(
						'Conversation with id nonexistent-id not found',
					);
				},
			);
		},
	);

	Scenario(
		'Getting a conversation by messaging ID',
		({ Given, When, Then, And }) => {
			Given(
				'a Conversation document with messagingConversationId "twilio-123"',
				() => {
					// Already set up in BeforeEachScenario
				},
			);
			When('I call getByMessagingId with "twilio-123"', async () => {
				result = await repository.getByMessagingId('twilio-123');
			});
			Then('I should receive a Conversation domain object', () => {
				expect(result).toBeInstanceOf(
					Domain.Contexts.Conversation.Conversation.Conversation,
				);
			});
			And(
				'the domain object\'s messagingConversationId should be "twilio-123"',
				() => {
					const conversation =
						result as Domain.Contexts.Conversation.Conversation.Conversation<
							Domain.Contexts.Conversation.Conversation.ConversationProps
						>;
					expect(conversation.messagingConversationId).toBe('twilio-123');
				},
			);
		},
	);

	Scenario(
		'Getting a conversation by nonexistent messaging ID',
		({ When, Then }) => {
			When('I call getByMessagingId with "nonexistent-twilio-id"', async () => {
				// Setup repository with null result for this scenario
				repository = setupConversationRepo(mockDoc, {
					findOne: () => createChainableQuery(null)
				});

				result = await repository.getByMessagingId('nonexistent-twilio-id');
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Getting a conversation by sharer and reserver IDs',
		({ Given, When, Then, And }) => {
			Given(
				'a Conversation document with sharer "user-1" and reserver "user-2"',
				() => {
					// Already set up in BeforeEachScenario
				},
			);
			When(
				'I call getByIdWithSharerReserver with sharer "user-1" and reserver "user-2"',
				async () => {
					result = await repository.getByIdWithSharerReserver(
						createValidObjectId('user-1'),
						createValidObjectId('user-2'),
					);
				},
			);
			Then('I should receive a Conversation domain object', () => {
				expect(result).toBeInstanceOf(
					Domain.Contexts.Conversation.Conversation.Conversation,
				);
			});
			And('the domain object\'s sharer id should be "user-1"', () => {
				const conversation =
					result as Domain.Contexts.Conversation.Conversation.Conversation<
						Domain.Contexts.Conversation.Conversation.ConversationProps
					>;
				expect(conversation.sharer.id).toBe('user-1');
			});
			And('the domain object\'s reserver id should be "user-2"', () => {
				const conversation =
					result as Domain.Contexts.Conversation.Conversation.Conversation<
						Domain.Contexts.Conversation.Conversation.ConversationProps
					>;
				expect(conversation.reserver.id).toBe('user-2');
			});
		},
	);

	Scenario(
		'Getting a conversation by nonexistent sharer and reserver IDs',
		({ When, Then }) => {
			When(
				'I call getByIdWithSharerReserver with sharer "nonexistent-1" and reserver "nonexistent-2"',
				async () => {
					// Setup repository with null result for this scenario
					repository = setupConversationRepo(mockDoc, {
						findOne: () => createChainableQuery(null)
					});

					result = await repository.getByIdWithSharerReserver(
						createValidObjectId('nonexistent-1'),
						createValidObjectId('nonexistent-2'),
					);
				},
			);
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Creating a new conversation instance',
		({ Given, And, When, Then }) => {
			let sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
			let reserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
			let listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;

			Given('a sharer PersonalUser with id "user-1"', () => {
				sharer = vi.mocked({
					id: createValidObjectId('user-1'),
				} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference);
			});
			And('a reserver PersonalUser with id "user-2"', () => {
				reserver = vi.mocked({
					id: createValidObjectId('user-2'),
				} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference);
			});
			And('a listing ItemListing with id "listing-1"', () => {
				listing = vi.mocked({
					id: createValidObjectId('listing-1'),
				} as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference);
			});
			When(
				'I call getNewInstance with the sharer, reserver, and listing',
				async () => {
					// Mock the model constructor to return a document with required properties
					const mockNewDoc = {
						id: { toString: () => 'new-conversation-id' },
						messagingConversationId: '',
						createdAt: new Date(),
						updatedAt: new Date(),
						schemaVersion: '1.0.0',
						set: vi.fn(),
					};
					
					// Allow dynamic property assignment (like a real Mongoose document)
					Object.defineProperty(mockNewDoc, 'messagingConversationId', {
						writable: true,
						configurable: true,
						enumerable: true,
						value: ''
					});
					
					// Setup repository with constructor mock
					repository = setupConversationRepo(mockDoc, {
						modelCtor: makeNewableMock(() => mockNewDoc) as unknown as Models.Conversation.ConversationModelType,
					});
					
					result = await repository.getNewInstance(sharer, reserver, listing);
				},
			);
			Then('I should receive a new Conversation domain object', () => {
				expect(result).toBeInstanceOf(
					Domain.Contexts.Conversation.Conversation.Conversation,
				);
			});
			And('the domain object should have a messagingConversationId', () => {
				const conversation =
					result as Domain.Contexts.Conversation.Conversation.Conversation<
						Domain.Contexts.Conversation.Conversation.ConversationProps
					>;
				expect(conversation.messagingConversationId).toBeDefined();
			});
			And("the domain object's messages should be empty", () => {
				const conversation =
					result as Domain.Contexts.Conversation.Conversation.Conversation<
						Domain.Contexts.Conversation.Conversation.ConversationProps
					>;
				expect(conversation.messages).toEqual([]);
			});
		},
	);
});
