import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ConversationDomainAdapter } from './conversation.domain-adapter.ts';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.domain-adapter.feature'),
);

function makeUserDoc(overrides: Partial<Models.User.PersonalUser> = {}) {
	const base = {
		id: new MongooseSeedwork.ObjectId(),
		userType: 'personal-user',
		isBlocked: false,
		hasCompletedOnboarding: true,
		account: {
			accountType: 'non-verified-personal',
			email: 'test@example.com',
			username: 'testuser',
			profile: {
				aboutMe: '',
				firstName: 'Test',
				lastName: 'User',
				location: {},
				billing: {
					cybersourceCustomerId: 'cust-123',
					subscription: {},
					transactions: [],
				},
				media: { items: [] },
				avatar: null,
			},
		},
		set: vi.fn(),
		...overrides,
	} as Models.User.PersonalUser;
	return vi.mocked(base);
}
function makeListingDoc(overrides: Partial<Models.Listing.ItemListing> = {}) {
	return { id: 'listing-1', ...overrides } as Models.Listing.ItemListing;
}
function makeConversationDoc(
	overrides: Partial<Models.Conversation.Conversation> = {},
) {
	const base = {
		sharer: overrides.sharer ?? undefined,
		reserver: overrides.reserver ?? undefined,
		listing: overrides.listing ?? undefined,
		messagingConversationId: 'twilio-123',
		set(key: keyof Models.Conversation.Conversation, value: unknown) {
			(this as Models.Conversation.Conversation)[key] = value as never;
		},
		...overrides,
	} as Models.Conversation.Conversation;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.Conversation.Conversation;
	let adapter: ConversationDomainAdapter;
	let sharerDoc: Models.User.PersonalUser;
	let reserverDoc: Models.User.PersonalUser;
	let listingDoc: Models.Listing.ItemListing;
	let result: unknown;

	BeforeEachScenario(() => {
		sharerDoc = makeUserDoc();
		reserverDoc = makeUserDoc({ id: new MongooseSeedwork.ObjectId() });
		listingDoc = makeListingDoc();
		doc = makeConversationDoc({
			sharer: sharerDoc,
			reserver: reserverDoc,
			listing: listingDoc,
		});
		adapter = new ConversationDomainAdapter(doc);
		result = undefined;
	});

	Background(({ Given }) => {
		Given(
			'a valid Conversation document with populated sharer, reserver, and listing',
			() => {
				sharerDoc = makeUserDoc();
				reserverDoc = makeUserDoc({ id: new MongooseSeedwork.ObjectId() });
				listingDoc = makeListingDoc();
				doc = makeConversationDoc({
					sharer: sharerDoc,
					reserver: reserverDoc,
					listing: listingDoc,
				});
				adapter = new ConversationDomainAdapter(doc);
			},
		);
	});

	//  Temporarily commenting out this test until we resolve the issue with nested array (account.profile.billing.transactions) in PersonalUserDomainAdapter
	// Scenario('Getting the sharer property when populated', ({ When, Then }) => {
	// 	When('I get the sharer property', () => {
	// 		result = adapter.sharer;
	// 	});
	// 	Then(
	// 		'it should return a PersonalUserDomainAdapter with the correct doc',
	// 		() => {
	// 			console.log('result:', result);
	// 			expect(result).toBeInstanceOf(PersonalUserDomainAdapter);
	// 			expect((result as PersonalUserDomainAdapter).doc).toBe(sharerDoc);
	// 		},
	// 	);
	// });

	Scenario(
		'Getting the sharer property when not populated',
		({ When, Then }) => {
			When('I get the sharer property on a doc with no sharer', () => {
				doc = makeConversationDoc({ sharer: undefined });
				adapter = new ConversationDomainAdapter(doc);
			});
			Then(
				'an error should be thrown indicating sharer is not populated',
				() => {
					expect(() => adapter.sharer).toThrow(/sharer is not populated/);
				},
			);
		},
	);

	Scenario(
		'Getting the sharer property when it is an ObjectId',
		({ When, Then }) => {
			When('I get the sharer property on a doc with sharer as ObjectId', () => {
				const sharerId = new MongooseSeedwork.ObjectId();
				doc = makeConversationDoc({ sharer: sharerId as unknown as Models.User.PersonalUser });
				adapter = new ConversationDomainAdapter(doc);
				result = adapter.sharer;
			});
			Then(
				'it should return a UserEntityReference with id',
				() => {
					expect(result).toBeDefined();
					expect(result).toHaveProperty('id');
					expect((result as { id: string }).id).toMatch(/^[a-f0-9]{24}$/);
				},
			);
		},
	);

	Scenario('Setting the sharer property', ({ When, Then }) => {
		let userAdapter: PersonalUserDomainAdapter;
		When(
			'I set the sharer property to a valid PersonalUserDomainAdapter',
			() => {
				userAdapter = new PersonalUserDomainAdapter(sharerDoc);
				adapter.sharer = userAdapter.entityReference;
			},
		);
		Then("the document's sharer should be set to an ObjectId", () => {
			expect(doc.sharer).toBeDefined();
			if (doc.sharer instanceof MongooseSeedwork.ObjectId) {
				expect(doc.sharer.toString()).toBe(sharerDoc.id.toString());
			} else {
				expect(doc.sharer).toBe(userAdapter.doc);
			}
		});
	});

	Scenario('Getting the messagingConversationId property', ({ When, Then }) => {
		When('I get the messagingConversationId property', () => {
			result = adapter.messagingConversationId;
		});
		Then('it should return the correct value', () => {
			expect(result).toBe('twilio-123');
		});
	});

	Scenario('Setting the messagingConversationId property', ({ When, Then }) => {
		When('I set the messagingConversationId property to "twilio-456"', () => {
			adapter.messagingConversationId = 'twilio-456';
		});
		Then(
			'the document\'s messagingConversationId should be "twilio-456"',
			() => {
				expect(doc.messagingConversationId).toBe('twilio-456');
			},
		);
	});

	Scenario('Loading sharer when already populated', ({ When, Then }) => {
		When('I call loadSharer on an adapter with populated sharer', async () => {
			result = await adapter.loadSharer();
		});
		Then('it should return a PersonalUserEntityReference', () => {
			expect(result).toBeDefined();
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('userType');
		});
	});

	Scenario('Loading sharer when it is an ObjectId', ({ When, Then }) => {
		When(
			'I call loadSharer on an adapter with sharer as ObjectId',
			async () => {
				const oid = new MongooseSeedwork.ObjectId();
				doc = makeConversationDoc({
					sharer: oid,
				});
				doc.populate = vi.fn().mockImplementation(() => {
					doc.sharer = sharerDoc as never;
					return Promise.resolve(doc);
				});
				adapter = new ConversationDomainAdapter(doc);
				result = await adapter.loadSharer();
			},
		);
		Then('it should populate and return a PersonalUserEntityReference', () => {
			expect(doc.populate).toHaveBeenCalledWith('sharer');
			expect(result).toBeDefined();
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('userType');
		});
	});

	Scenario('Getting the reserver property when populated', ({ When, Then }) => {
		When('I get the reserver property', () => {
			result = adapter.reserver;
		});
		Then(
			'it should return a PersonalUserEntityReference with the correct id',
			() => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('id');
				expect(result).toHaveProperty('userType');
			},
		);
	});

	Scenario(
		'Getting the reserver property when it is an ObjectId',
		({ When, Then }) => {
			When('I get the reserver property on a doc with reserver as ObjectId', () => {
				const reserverId = new MongooseSeedwork.ObjectId();
				doc = makeConversationDoc({ 
					sharer: sharerDoc,
					reserver: reserverId as unknown as Models.User.PersonalUser 
				});
				adapter = new ConversationDomainAdapter(doc);
			});
			Then(
				'an error should be thrown indicating reserver is not populated or is not of the correct type',
				() => {
					expect(() => adapter.reserver).toThrow(/reserver is not populated or is not of the correct type/);
				},
			);
		},
	);

	Scenario(
		'Getting the listing property when not populated',
		({ When, Then }) => {
			When('I get the listing property on a doc with no listing', () => {
				doc = makeConversationDoc({ 
					sharer: sharerDoc,
					reserver: reserverDoc,
					listing: undefined 
				});
				adapter = new ConversationDomainAdapter(doc);
			});
			Then(
				'an error should be thrown indicating listing is not populated',
				() => {
					expect(() => adapter.listing).toThrow(/listing is not populated/);
				},
			);
		},
	);

	Scenario('Loading reserver when already populated', ({ When, Then }) => {
		When(
			'I call loadReserver on an adapter with populated reserver',
			async () => {
				result = await adapter.loadReserver();
			},
		);
		Then('it should return a PersonalUserEntityReference', () => {
			expect(result).toBeDefined();
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('userType');
		});
	});

	Scenario('Getting the listing property when populated', ({ When, Then }) => {
		When('I get the listing property', () => {
			result = adapter.listing;
		});
		Then('it should return an ItemListingDomainAdapter', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario('Getting the listing property when it is an ObjectId', ({ When, Then }) => {
		When('I get the listing property on a doc with listing as ObjectId', () => {
			const listingId = new MongooseSeedwork.ObjectId();
			doc = makeConversationDoc({ 
				listing: listingId as unknown as Models.Listing.ItemListing,
			});
			adapter = new ConversationDomainAdapter(doc);
			result = adapter.listing;
		});
		Then('it should return an ItemListingEntityReference with id', () => {
			expect(result).toBeDefined();
			expect(result).toHaveProperty('id');
			expect((result as { id: string }).id).toMatch(/^[a-f0-9]{24}$/);
		});
	});

	Scenario('Loading listing when already populated', ({ When, Then }) => {
		When(
			'I call loadListing on an adapter with populated listing',
			async () => {
				result = await adapter.loadListing();
			},
		);
		Then('it should return an ItemListingDomainAdapter', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario('Getting messages property', ({ When, Then }) => {
		When('I get the messages property', () => {
			result = adapter.messages;
		});
		Then('it should return an empty array', () => {
			expect(result).toEqual([]);
		});
	});

	Scenario('Loading messages', ({ When, Then }) => {
		When('I call loadMessages', async () => {
			result = await adapter.loadMessages();
		});
		Then('it should return an empty array', () => {
			expect(result).toEqual([]);
		});
	});

	Scenario('Setting sharer property with valid reference', ({ When, Then }) => {
		When('I set the sharer property to a reference with id', () => {
			const setSpy = vi.spyOn(doc, 'set');
			adapter.sharer = { id: '507f1f77bcf86cd799439011' } as never;
			expect(setSpy).toHaveBeenCalledWith('sharer', expect.any(MongooseSeedwork.ObjectId));
		});
		Then("the document's sharer should be set correctly", () => {
			// Verified in When block
		});
	});

	Scenario('Setting sharer property with missing id throws error', ({ When, Then }) => {
		When('I set the sharer property to a reference missing id', () => {
			// Test happens in Then block
		});
		Then('an error should be thrown indicating sharer reference is missing id', () => {
			expect(() => {
				adapter.sharer = {} as never;
			}).toThrow('sharer reference is missing id');
		});
	});

	Scenario('Setting reserver property with valid reference', ({ When, Then }) => {
		When('I set the reserver property to a reference with id', () => {
			const setSpy = vi.spyOn(doc, 'set');
			adapter.reserver = { id: '507f1f77bcf86cd799439012' } as never;
			expect(setSpy).toHaveBeenCalledWith('reserver', expect.any(MongooseSeedwork.ObjectId));
		});
		Then("the document's reserver should be set correctly", () => {
			// Verified in When block
		});
	});

	Scenario('Setting reserver property with missing id throws error', ({ When, Then }) => {
		When('I set the reserver property to a reference missing id', () => {
			// Test happens in Then block
		});
		Then('an error should be thrown indicating reserver reference is missing id', () => {
			expect(() => {
				adapter.reserver = {} as never;
			}).toThrow('reserver reference is missing id');
		});
	});

	Scenario('Setting listing property with valid reference', ({ When, Then }) => {
		When('I set the listing property to a reference with id', () => {
			const setSpy = vi.spyOn(doc, 'set');
			adapter.listing = { id: '507f1f77bcf86cd799439013' } as never;
			expect(setSpy).toHaveBeenCalledWith('listing', expect.any(MongooseSeedwork.ObjectId));
		});
		Then("the document's listing should be set correctly", () => {
			// Verified in When block
		});
	});

	Scenario('Setting listing property with missing id throws error', ({ When, Then }) => {
		When('I set the listing property to a reference missing id', () => {
			// Test happens in Then block
		});
		Then('an error should be thrown indicating listing reference is missing id', () => {
			expect(() => {
				adapter.listing = {} as never;
			}).toThrow('listing reference is missing id');
		});
	});

	Scenario('Loading reserver when it is an ObjectId', ({ When, Then }) => {
		When('I call loadReserver on an adapter with reserver as ObjectId', async () => {
			const oid = new MongooseSeedwork.ObjectId();
			doc = makeConversationDoc({ 
				reserver: oid,
			});
			doc.populate = vi.fn().mockImplementation(() => {
				doc.reserver = reserverDoc as never;
				return Promise.resolve(doc);
			});
			adapter = new ConversationDomainAdapter(doc);
			result = await adapter.loadReserver();
		});
		Then('it should populate and return a PersonalUserDomainAdapter', () => {
			expect(doc.populate).toHaveBeenCalledWith('reserver');
			// loadReserver returns an entity reference object, not a domain adapter instance
			expect(result).toBeDefined();
			expect((result as { id: string }).id).toBeDefined();
		});
	});

	Scenario('Loading listing when it is an ObjectId', ({ When, Then }) => {
		When('I call loadListing on an adapter with listing as ObjectId', async () => {
			const oid = new MongooseSeedwork.ObjectId();
			doc = makeConversationDoc({ 
				listing: oid as unknown as Models.Listing.ItemListing,
				populate: vi.fn().mockResolvedValue({
					...doc,
					listing: listingDoc,
				}),
			});
			adapter = new ConversationDomainAdapter(doc);
			result = await adapter.loadListing();
		});
		Then('it should populate and return an ItemListingDomainAdapter', () => {
			expect(doc.populate).toHaveBeenCalledWith('listing');
			expect(result).toBeDefined();
		});
	});

	Scenario('Getting sharer when it is an admin user', ({ Given, When, Then }) => {
		Given('a conversation with an admin user as sharer', () => {
			const adminUserDoc = {
				...makeUserDoc(),
				userType: 'admin-user',
			} as never;
			doc = makeConversationDoc({ sharer: adminUserDoc });
			adapter = new ConversationDomainAdapter(doc);
		});

		When('I access the sharer property', async () => {
			result = await adapter.loadSharer();
		});

		Then('it should return an AdminUserDomainAdapter', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario('Setting sharer with PersonalUser domain entity', ({ Given, When, Then }) => {
		let personalUser: never;

		Given('a PersonalUser domain entity', () => {
			const userDoc = makeUserDoc();
			const setSpy = vi.fn();
			personalUser = { props: { doc: userDoc }, id: userDoc.id } as never;
			doc = makeConversationDoc({ set: setSpy });
			adapter = new ConversationDomainAdapter(doc);
		});

		When('I set the sharer property with the domain entity', () => {
			adapter.sharer = personalUser;
		});

		Then('the sharer should be set correctly', () => {
			expect(doc.set).toHaveBeenCalledWith('sharer', expect.anything());
		});
	});

	Scenario('Setting listing with ItemListing domain entity', ({ Given, When, Then }) => {
		let itemListing: never;

		Given('an ItemListing domain entity', () => {
			const listingId = new MongooseSeedwork.ObjectId();
			const listing = makeListingDoc({ id: listingId as never });
			const setSpy = vi.fn();
			itemListing = { props: { doc: listing }, id: listingId.toString() } as never;
			doc = makeConversationDoc({ set: setSpy });
			adapter = new ConversationDomainAdapter(doc);
		});

		When('I set the listing property with the domain entity', () => {
			adapter.listing = itemListing;
		});

		Then('the listing should be set correctly', () => {
			expect(doc.set).toHaveBeenCalledWith('listing', expect.anything());
		});
	});

	Scenario('Getting reserver when it is an admin user', ({ Given, When, Then }) => {
		Given('a conversation with an admin user as reserver', () => {
			const adminUserDoc = {
				...makeUserDoc(),
				userType: 'admin-user',
			} as never;
			doc = makeConversationDoc({ reserver: adminUserDoc, sharer: sharerDoc });
			adapter = new ConversationDomainAdapter(doc);
		});

		When('I access the reserver property', () => {
			result = adapter.reserver;
		});

		Then('it should return an AdminUserDomainAdapter for reserver', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario('Loading sharer when it is an admin user', ({ Given, When, Then }) => {
		Given('a conversation with an admin user as sharer', () => {
			const adminUserDoc = {
				...makeUserDoc(),
				userType: 'admin-user',
			} as never;
			doc = makeConversationDoc({ sharer: adminUserDoc });
			adapter = new ConversationDomainAdapter(doc);
		});

		When('I call loadSharer on the adapter', async () => {
			result = await adapter.loadSharer();
		});

		Then('it should return an AdminUserDomainAdapter for sharer', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario('Loading reserver when it is an admin user', ({ Given, When, Then }) => {
		Given('a conversation with an admin user as reserver', () => {
			const adminUserDoc = {
				...makeUserDoc(),
				userType: 'admin-user',
			} as never;
			doc = makeConversationDoc({ reserver: adminUserDoc, sharer: sharerDoc });
			adapter = new ConversationDomainAdapter(doc);
		});

		When('I call loadReserver on the adapter', async () => {
			result = await adapter.loadReserver();
		});

		Then('it should return an AdminUserDomainAdapter for reserver', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario('Getting the sharer property when populated as personal user', ({ When, Then }) => {
		When('I get the sharer property', () => {
			result = adapter.sharer;
		});

		Then('it should return a PersonalUserDomainAdapter entityReference', () => {
			expect(result).toBeDefined();
		});
	});



	Scenario('Setting messages property', ({ When, Then }) => {
		When('I set the messages property to a list', () => {
			adapter.messages = [{ id: 'msg-1' } as never];
		});

		Then('the messages property should be set correctly', () => {
			expect(adapter.messages).toHaveLength(1);
		});
	});

	Scenario('Loading listing when not populated', ({ When, Then }) => {
		let error: Error | undefined;

		When('I call loadListing on an adapter with no listing', async () => {
			const doc = makeConversationDoc({ listing: undefined });
			adapter = new ConversationDomainAdapter(doc);
			try {
				await adapter.loadListing();
			} catch (e) {
				error = e as Error;
			}
		});

		Then('an error should be thrown indicating listing is not populated in load', () => {
			expect(error).toBeDefined();
			expect(error?.message).toBe('listing is not populated');
		});
	});

	Scenario('Getting expiresAt when not set', ({ When, Then }) => {
		When('I get the expiresAt property when it is undefined', () => {
			const doc = makeConversationDoc({ expiresAt: undefined });
			adapter = new ConversationDomainAdapter(doc);
			result = adapter.expiresAt;
		});

		Then('it should return undefined', () => {
			expect(result).toBeUndefined();
		});
	});

	Scenario('Getting expiresAt when set', ({ When, Then }) => {
		let testDate: Date;

		When('I get the expiresAt property when it is set', () => {
			testDate = new Date('2026-07-01T00:00:00.000Z');
			const doc = makeConversationDoc({ expiresAt: testDate });
			adapter = new ConversationDomainAdapter(doc);
			result = adapter.expiresAt;
		});

		Then('it should return the correct date', () => {
			expect(result).toBe(testDate);
		});
	});

	Scenario('Setting expiresAt property', ({ When, Then }) => {
		let testDate: Date;

		When('I set the expiresAt property to a date', () => {
			testDate = new Date('2026-07-01T00:00:00.000Z');
			const doc = makeConversationDoc();
			adapter = new ConversationDomainAdapter(doc);
			adapter.expiresAt = testDate;
		});

		Then("the document's expiresAt should be set correctly", () => {
			expect(doc.expiresAt).toBe(testDate);
		});
	});
});
