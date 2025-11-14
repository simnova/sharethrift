import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import type mongoose from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { expect, vi } from 'vitest';
import { ConversationConverter } from './conversation.domain-adapter.ts';
import { ConversationRepository } from './conversation.repository.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.repository.feature'),
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

function makeEventBus(): DomainSeedwork.EventBus {
	return vi.mocked({
		dispatch: vi.fn(),
		register: vi.fn(),
	} as DomainSeedwork.EventBus);
}

function makeSession(): mongoose.ClientSession {
	return vi.mocked({} as mongoose.ClientSession);
}

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

function makeUserDoc(id: string): Models.User.PersonalUser {
	const validId = createValidObjectId(id);
	return {
		_id: new MongooseSeedwork.ObjectId(validId),
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
	} as unknown as Models.User.PersonalUser;
}

function makeListingDoc(id: string): Models.Listing.ItemListing {
	const validId = createValidObjectId(id);
	return {
		_id: new MongooseSeedwork.ObjectId(validId),
		id: id,
		title: 'Test Listing',
		description: 'Test Description',
		category: 'test',
		location: 'Test City',
		state: 'Published',
		sharingPeriodStart: new Date(),
		sharingPeriodEnd: new Date(),
		sharer: makeUserDoc('user-1'),
	} as unknown as Models.Listing.ItemListing;
}

// Create chainable query mock that supports multiple populate calls
function createChainableQuery(result: unknown) {
	const query = {
		populate: vi.fn(),
		exec: vi.fn().mockResolvedValue(result),
	};
	query.populate.mockReturnValue(query);
	return query;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: ConversationRepository;
	let mockModel: Models.Conversation.ConversationModelType;
	let passport: Domain.Passport;
	let mockDoc: Models.Conversation.Conversation;
	let eventBus: DomainSeedwork.EventBus;
	let session: mongoose.ClientSession;
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		eventBus = makeEventBus();
		session = makeSession();

		const sharerDoc = makeUserDoc('user-1');
		const reserverDoc = makeUserDoc('user-2');
		const listingDoc = makeListingDoc('listing-1');

		mockDoc = {
			_id: new MongooseSeedwork.ObjectId(createValidObjectId('conv-1')),
			id: 'conv-1',
			sharer: sharerDoc,
			reserver: reserverDoc,
			listing: listingDoc,
			messagingConversationId: 'twilio-123',
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1.0.0',
		} as unknown as Models.Conversation.Conversation;

		mockModel = {
			findById: vi.fn(() => createChainableQuery(mockDoc)),
			findOne: vi.fn(() => createChainableQuery(mockDoc)),
		} as unknown as Models.Conversation.ConversationModelType;

		repository = new ConversationRepository(
			passport,
			mockModel,
			new ConversationConverter(),
			eventBus,
			session,
		);
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
				mockModel.findById = vi.fn(() => createChainableQuery(null)) as unknown as typeof mockModel.findById;

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
				mockModel.findOne = vi.fn(() => createChainableQuery(null)) as unknown as typeof mockModel.findOne;

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
					mockModel.findOne = vi.fn(() => createChainableQuery(null)) as unknown as typeof mockModel.findOne;

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
					id: 'user-1',
				} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference);
			});
			And('a reserver PersonalUser with id "user-2"', () => {
				reserver = vi.mocked({
					id: 'user-2',
				} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference);
			});
			And('a listing ItemListing with id "listing-1"', () => {
				listing = vi.mocked({
					id: 'listing-1',
				} as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference);
			});
			When(
				'I call getNewInstance with the sharer, reserver, and listing',
				async () => {
					// Mock the model constructor to return a document with required properties
					// Create a proper mock that allows property assignment
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
					
					mockModel = vi.fn(() => mockNewDoc) as unknown as Models.Conversation.ConversationModelType;
					repository = new ConversationRepository(
						passport,
						mockModel,
						new ConversationConverter(),
						eventBus,
						session,
					);
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
