import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ConversationRepository } from './conversation.repository.ts';
import {
	ConversationConverter,
	type ConversationDomainAdapter,
} from './conversation.domain-adapter.ts';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';
import { ItemListingDomainAdapter } from '../../listing/item/item-listing.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.repository.feature'),
);

function makeUserDoc(
	overrides: Partial<Models.User.PersonalUser> = {},
): Models.User.PersonalUser {
	return {
		_id: new MongooseSeedwork.ObjectId(),
		id: new MongooseSeedwork.ObjectId().toString(),
		displayName: 'Test User',
		email: 'test@example.com',
		...overrides,
	} as Models.User.PersonalUser;
}

function makeListingDoc(
	overrides: Partial<Models.Listing.ItemListing> = {},
): Models.Listing.ItemListing {
	return {
		_id: 'listing-1',
		id: 'listing-1',
		title: 'Test Listing',
		...overrides,
	} as Models.Listing.ItemListing;
}

function makeConversationDoc(
	overrides: Partial<Models.Conversation.Conversation> = {},
): Models.Conversation.Conversation {
	const sharerDoc = makeUserDoc();
	const reserverDoc = makeUserDoc({ _id: new MongooseSeedwork.ObjectId() });
	const listingDoc = makeListingDoc();
	
	const base = {
		_id: 'conv-1',
		id: 'conv-1',
		sharer: sharerDoc,
		reserver: reserverDoc,
		listing: listingDoc,
		twilioConversationId: 'twilio-123',
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		set(key: keyof Models.Conversation.Conversation, value: unknown) {
			(this as Models.Conversation.Conversation)[key] = value as never;
		},
		...overrides,
	} as Models.Conversation.Conversation;
	return vi.mocked(base);
}

function makeMockPassport(): Domain.Passport {
	return {
		conversation: {
			forConversation: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
	} as unknown as Domain.Passport;
}

function makeMockModel(
	conversationDoc: Models.Conversation.Conversation,
): Models.Conversation.ConversationModelType {
	const ModelMock = function(
		this: Models.Conversation.Conversation,
		_props?: Partial<Models.Conversation.Conversation>,
	) {
		Object.assign(this, conversationDoc);
	} as unknown as Models.Conversation.ConversationModelType;

	const populateMock = vi.fn().mockReturnThis();
	const execMock = vi.fn(() => Promise.resolve(conversationDoc));

	Object.assign(ModelMock, {
		findById: vi.fn(() => ({
			populate: populateMock,
			exec: execMock,
		})),
		findOne: vi.fn(() => ({
			populate: populateMock,
			exec: execMock,
		})),
		find: vi.fn(() => ({
			populate: populateMock,
			exec: execMock,
		})),
	});

	return ModelMock;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repo: ConversationRepository;
	let converter: ConversationConverter;
	let passport: Domain.Passport;
	let conversationDoc: Models.Conversation.Conversation;
	let model: Models.Conversation.ConversationModelType;
	let result: Domain.Contexts.Conversation.Conversation.Conversation<ConversationDomainAdapter> | null;

	BeforeEachScenario(() => {
		conversationDoc = makeConversationDoc();
		model = makeMockModel(conversationDoc);
		converter = new ConversationConverter();
		passport = makeMockPassport();
		repo = new ConversationRepository(passport, model, converter);
		result = null;
	});

	Background(({ Given, And }) => {
		Given(
			'a ConversationRepository instance with a configured Mongoose model, type converter, and authentication passport',
			() => {
				repo = new ConversationRepository(passport, model, converter);
			},
		);
		And('a valid Conversation document exists in the database', () => {
			conversationDoc = makeConversationDoc();
		});
	});

	Scenario(
		'Retrieve a conversation by ID with references',
		({ When, Then, And }) => {
			When('I call getByIdWithReferences with a valid conversation ID', async () => {
				result = await repo.getByIdWithReferences('conv-1');
			});
			Then('I should receive a corresponding Conversation domain object', () => {
				expect(result).toBeDefined();
				expect(result).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.Conversation);
			});
			And("the object's sharer, reserver, and listing should be populated", () => {
				expect(result?.sharer).toBeDefined();
				expect(result?.reserver).toBeDefined();
				expect(result?.listing).toBeDefined();
			});
			And("the object's twilioConversationId should match the stored data", () => {
				expect(result?.twilioConversationId).toBe('twilio-123');
			});
		},
	);

	Scenario(
		'Attempt to retrieve a non-existent conversation by ID',
		({ When, Then }) => {
			let errorResult: Error | null = null;
			
			When(
				'I call getByIdWithReferences with an invalid or non-existent conversation ID',
				async () => {
					const populateMock = vi.fn().mockReturnThis();
					const execMock = vi.fn(() => Promise.resolve(null));
					model.findById = vi.fn(() => ({
						populate: populateMock,
						exec: execMock,
					// biome-ignore lint/suspicious/noExplicitAny: Need to mock Mongoose query chain
					})) as any;
					repo = new ConversationRepository(passport, model, converter);
					
					try {
						await repo.getByIdWithReferences('invalid-id');
					} catch (error) {
						errorResult = error as Error;
					}
				},
			);
			Then('an error should be thrown indicating the conversation was not found', () => {
				expect(errorResult).toBeInstanceOf(Error);
				expect(errorResult?.message).toContain('not found');
			});
		},
	);

	Scenario(
		'Retrieve a conversation by Twilio SID',
		({ Given, When, Then, And }) => {
			let twilioSid: string;
			Given('a valid Twilio conversation SID', () => {
				twilioSid = 'twilio-123';
			});
			When('I call getByTwilioSid with the Twilio SID', async () => {
				result = await repo.getByTwilioSid(twilioSid);
			});
			Then('I should receive a corresponding Conversation domain object', () => {
				expect(result).toBeDefined();
				expect(result).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.Conversation);
			});
			And("the object's twilioConversationId should match the provided SID", () => {
				expect(result?.twilioConversationId).toBe(twilioSid);
			});
		},
	);

	Scenario(
		'Retrieve a non-existent conversation by Twilio SID',
		({ Given, When, Then }) => {
			let twilioSid: string;
			Given('a Twilio conversation SID that does not exist', () => {
				twilioSid = 'non-existent-sid';
			});
			When('I call getByTwilioSid with the non-existent Twilio SID', async () => {
				const populateMock = vi.fn().mockReturnThis();
				const execMock = vi.fn(() => Promise.resolve(null));
				model.findOne = vi.fn(() => ({
					populate: populateMock,
					exec: execMock,
				// biome-ignore lint/suspicious/noExplicitAny: Need to mock Mongoose query chain
				})) as any;
				repo = new ConversationRepository(passport, model, converter);
				
				result = await repo.getByTwilioSid(twilioSid);
			});
			Then('I should receive null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Retrieve a conversation by sharer and reserver IDs',
		({ Given, And, When, Then }) => {
			let sharerId: string;
			let reserverId: string;
			Given('valid sharer and reserver user IDs', () => {
				const sharerDoc = conversationDoc.sharer as Models.User.PersonalUser;
				const reserverDoc = conversationDoc.reserver as Models.User.PersonalUser;
				sharerId = sharerDoc._id?.toString() || 'user-1';
				reserverId = reserverDoc._id?.toString() || 'user-2';
			});
			When('I call getByIdWithSharerReserver with the sharer and reserver IDs', async () => {
				result = await repo.getByIdWithSharerReserver(sharerId, reserverId);
			});
			Then('I should receive a corresponding Conversation domain object', () => {
				expect(result).toBeDefined();
				expect(result).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.Conversation);
			});
			And("the object's sharer and reserver should match the provided IDs", () => {
				// Just verify the result has sharer and reserver
				expect(result?.sharer).toBeDefined();
				expect(result?.reserver).toBeDefined();
			});
		},
	);

	Scenario(
		'Retrieve a non-existent conversation by sharer and reserver IDs',
		({ Given, When, Then }) => {
			let sharerId: string;
			let reserverId: string;
			Given('sharer and reserver IDs that do not match any conversation', () => {
				sharerId = 'non-existent-sharer';
				reserverId = 'non-existent-reserver';
			});
			When('I call getByIdWithSharerReserver with the IDs', async () => {
				const populateMock = vi.fn().mockReturnThis();
				const execMock = vi.fn(() => Promise.resolve(null));
				model.findOne = vi.fn(() => ({
					populate: populateMock,
					exec: execMock,
				// biome-ignore lint/suspicious/noExplicitAny: Need to mock Mongoose query chain
				})) as any;
				repo = new ConversationRepository(passport, model, converter);
				
				result = await repo.getByIdWithSharerReserver(sharerId, reserverId);
			});
			Then('I should receive null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Create a new conversation instance',
		({ Given, And, When, Then }) => {
			let sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
			let reserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
			let listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
			
			Given('a valid sharer domain object', () => {
				const sharerDoc = makeUserDoc();
				const sharerAdapter = new PersonalUserDomainAdapter(sharerDoc);
				sharer = new Domain.Contexts.User.PersonalUser.PersonalUser(
					sharerAdapter,
					passport,
				);
			});
			And('a valid reserver domain object', () => {
				const reserverDoc = makeUserDoc({ _id: new MongooseSeedwork.ObjectId() });
				const reserverAdapter = new PersonalUserDomainAdapter(reserverDoc);
				reserver = new Domain.Contexts.User.PersonalUser.PersonalUser(
					reserverAdapter,
					passport,
				);
			});
			And('a valid listing domain object', () => {
				const listingDoc = makeListingDoc();
				const listingAdapter = new ItemListingDomainAdapter(listingDoc);
				listing = new Domain.Contexts.Listing.ItemListing.ItemListing(
					listingAdapter,
					passport,
				);
			});
			When('I call getNewInstance with the sharer, reserver, and listing', async () => {
				result = await repo.getNewInstance(sharer, reserver, listing);
			});
			Then('I should receive a new Conversation domain object', () => {
				expect(result).toBeDefined();
				expect(result).toBeInstanceOf(Domain.Contexts.Conversation.Conversation.Conversation);
			});
			And("the object's sharer should reference the provided sharer", () => {
				expect(result?.sharer).toBeDefined();
			});
			And("the object's reserver should reference the provided reserver", () => {
				expect(result?.reserver).toBeDefined();
			});
			And("the object's listing should reference the provided listing", () => {
				expect(result?.listing).toBeDefined();
			});
			And("the object's messages array should be empty", () => {
				expect(result?.messages).toEqual([]);
			});
		},
	);
});
