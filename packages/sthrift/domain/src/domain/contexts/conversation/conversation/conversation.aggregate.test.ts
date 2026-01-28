import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import { expect, vi } from 'vitest';
import type { ItemListingProps } from '../../listing/item/item-listing.entity.ts';
import { ItemListing } from '../../listing/item/item-listing.aggregate.ts';
import type { Passport } from '../../passport.ts';
import type { PersonalUserProps } from '../../user/personal-user/personal-user.entity.ts';
import { PersonalUser } from '../../user/personal-user/personal-user.aggregate.ts';
import type { UserEntityReference } from '../../user/index.ts';
import type { ConversationProps } from './conversation.entity.ts';
import { Conversation } from './conversation.aggregate.ts';
import type { MessageEntityReference } from './message.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.feature'),
);

function makePassport(canManageConversation = false): Passport {
	return vi.mocked({
		conversation: {
			forConversation: vi.fn(() => ({
				determineIf: (fn: (p: { canManageConversation: boolean }) => boolean) =>
					fn({ canManageConversation }),
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: () => true,
			})),
			forAdminUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Passport);
}

function createMockTransactionItem(id: string) {
	return {
		id,
		transactionId: 'txn_123',
		amount: 1000,
		referenceId: 'ref_123',
		status: 'completed',
		completedAt: new Date('2020-01-01T00:00:00Z'),
		errorMessage: null,
	};
}

function getNewTransactionItem() {
	return createMockTransactionItem('2');
}

function createMockTransactions() {
	return {
		items: [createMockTransactionItem('1')],
		getNewItem: getNewTransactionItem,
		addItem: vi.fn(),
		removeItem: vi.fn(),
		removeAll: vi.fn(),
	};
}

function makeBaseProps(
	overrides: Partial<ConversationProps> = {},
): ConversationProps {
	const user = new PersonalUser<PersonalUserProps>(
		{
			userType: 'personal-user',
			id: 'user-1',
			isBlocked: false,
			schemaVersion: '1.0.0',
			hasCompletedOnboarding: false,
			account: {
				accountType: 'standard',
				email: 'sharer@cellix.com',
				username: 'sharer',
				profile: {
					firstName: 'Sharer',
					lastName: 'Sharer',
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
						cybersourceCustomerId: null,
						subscription: {
							planCode: 'verified-personal',
							status: 'ACTIVE',
							startDate: new Date('2020-01-01T00:00:00Z'),
							subscriptionId: 'sub_123',
						},
						transactions: createMockTransactions(),
					},
				},
			},
			createdAt: new Date('2020-01-01T00:00:00Z'),
			updatedAt: new Date('2020-01-02T00:00:00Z'),
		},
		makePassport(),
	);
	const reserver = new PersonalUser<PersonalUserProps>(
		{
			userType: 'personal-user',
			id: 'user-2',
			isBlocked: false,
			schemaVersion: '1.0.0',
			hasCompletedOnboarding: false,
			account: {
				accountType: 'standard',
				email: 'reserver@cellix.com',
				username: 'reserver',
				profile: {
					firstName: 'Reserver',
					lastName: 'Reserver',
					aboutMe: 'Hello',
					location: {
						address1: '456 Main St',
						address2: null,
						city: 'Test City',
						state: 'TS',
						country: 'Testland',
						zipCode: '12345',
					},
					billing: {
						cybersourceCustomerId: null,
						subscription: {
							planCode: 'basic',
							status: 'ACTIVE',
							startDate: new Date('2020-01-01T00:00:00Z'),
							subscriptionId: 'sub_456',
						},
						transactions: createMockTransactions(),
					},
				},
			},
			createdAt: new Date('2020-01-01T00:00:00Z'),
			updatedAt: new Date('2020-01-02T00:00:00Z'),
		},
		makePassport(),
	);
	const listing = new ItemListing<ItemListingProps>(
		{
			id: 'listing-1',
			title: 'Test Listing',
			description: 'A test listing',
			category: 'test',
			location: 'Test City',
			state: 'Active',
			sharingPeriodStart: new Date('2020-01-01T00:00:00Z'),
			sharingPeriodEnd: new Date('2020-01-10T00:00:00Z'),
			sharer: user,
			sharingHistory: [],
			reports: 0,
			images: [],
			createdAt: new Date('2020-01-01T00:00:00Z'),
			updatedAt: new Date('2020-01-02T00:00:00Z'),
			schemaVersion: '1.0.0',
			listingType: 'item-listing',
			loadSharer: async () => user,
		},
		makePassport(),
	);
	return {
		id: 'conv-1',
		sharer: user,
		loadSharer: async () => user,
		reserver,
		loadReserver: async () => reserver,
		listing,
		loadListing: async () => listing,
		messages: [],
		loadMessages: async () => [],
		messagingConversationId: 'twilio-123',
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		...overrides,
	};
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let passport: Passport;
	let baseProps: ConversationProps;
	let conversation: Conversation<ConversationProps>;
	let newConversation: Conversation<ConversationProps>;

	BeforeEachScenario(() => {
		passport = makePassport(true);
		baseProps = makeBaseProps();
		conversation = new Conversation(baseProps, passport);
		newConversation = undefined as unknown as Conversation<ConversationProps>;
	});

	Background(({ Given, And }) => {
		Given('a valid Passport with conversation permissions', () => {
			passport = makePassport(true);
		});
		And('base conversation properties with valid users and listing', () => {
			baseProps = makeBaseProps();
			conversation = new Conversation(baseProps, passport);
		});
	});

	Scenario('Creating a new conversation instance', ({ When, Then }) => {
		When('I create a new Conversation aggregate using getNewInstance', () => {
			newConversation = Conversation.getNewInstance(
				makeBaseProps(),
				baseProps.sharer,
				baseProps.reserver,
				baseProps.listing,
				[],
				'mock-messaging-conversation-id',
				passport,
			);
		});
		Then(
			'the conversation should have the correct sharer, reserver, and listing',
			() => {
				expect(newConversation.sharer.account.email).toBe('sharer@cellix.com');
				expect(newConversation.reserver.account.email).toBe(
					'reserver@cellix.com',
				);
				expect(newConversation.listing.id).toBe('listing-1');
			},
		);
		Then('the conversation should have a messagingConversationId', () => {
			expect(newConversation.messagingConversationId).toBe(
				'mock-messaging-conversation-id',
			);
		});
	});

	Scenario('Changing the sharer with permission', ({ Given, When, Then }) => {
		let newSharer: PersonalUser<PersonalUserProps>;
		Given(
			'a Conversation aggregate with permission to manage conversation',
			() => {
				passport = makePassport(true);
				conversation = new Conversation(makeBaseProps(), passport);
			},
		);
		When('I set the sharer to a new user', () => {
			const originalSharer =
				conversation.sharer as PersonalUser<PersonalUserProps>;
			newSharer = new PersonalUser(
				{
					userType: 'personal-user',
					id: 'user-3',
					isBlocked: false,
					schemaVersion: '1.0.0',
					hasCompletedOnboarding: false,
					account: {
						accountType: originalSharer.account.accountType,
						email: 'newsharer@cellix.com',
						username: 'newsharer',
						profile: {
							firstName: originalSharer.account.profile.firstName,
							lastName: originalSharer.account.profile.lastName,
							aboutMe: originalSharer.account.profile.aboutMe,
							location: originalSharer.account.profile.location,
							billing: {
								cybersourceCustomerId:
									originalSharer.account.profile.billing.cybersourceCustomerId,
								subscription:
									originalSharer.account.profile.billing.subscription,
								transactions: createMockTransactions(),
							},
						},
					},
					createdAt: originalSharer.createdAt,
					updatedAt: originalSharer.updatedAt,
				},
				passport,
			);
			// @ts-expect-error: testing private setter
			conversation.sharer = newSharer;
		});
		Then("the conversation's sharer should be updated", () => {
			expect(conversation.sharer.account.email).toBe('newsharer@cellix.com');
		});
	});

	Scenario(
		'Changing the sharer without permission',
		({ Given, When, Then }) => {
			let setSharerWithoutPermission: () => void;
			Given(
				'a Conversation aggregate without permission to manage conversation',
				() => {
					passport = makePassport(false);
					conversation = new Conversation(makeBaseProps(), passport);
				},
			);
			When('I try to set the sharer to a new user', () => {
				setSharerWithoutPermission = () => {
					const originalSharer =
						conversation.sharer as PersonalUser<PersonalUserProps>;
					// @ts-expect-error: testing private setter
					conversation.sharer = new PersonalUser(
						{
							userType: 'personal-user',
							id: 'user-3',
							isBlocked: false,
							schemaVersion: '1.0.0',
							hasCompletedOnboarding: false,
							account: {
								accountType: originalSharer.account.accountType,
								email: 'newsharer@cellix.com',
								username: 'newsharer',
								profile: {
									firstName: originalSharer.account.profile.firstName,
									lastName: originalSharer.account.profile.lastName,
									aboutMe: originalSharer.account.profile.aboutMe,
									location: originalSharer.account.profile.location,
									billing: {
										cybersourceCustomerId:
											originalSharer.account.profile.billing
												.cybersourceCustomerId,
										subscription:
											originalSharer.account.profile.billing.subscription,
										transactions: createMockTransactions(),
									},
								},
							},
							createdAt: originalSharer.createdAt,
							updatedAt: originalSharer.updatedAt,
						},
						passport,
					);
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(setSharerWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
				expect(setSharerWithoutPermission).throws(
					'You do not have permission to change the sharer of this conversation',
				);
			});
		},
	);

	Scenario('Changing the reserver with permission', ({ Given, When, Then }) => {
		let newReserver: PersonalUser<PersonalUserProps>;
		Given(
			'a Conversation aggregate with permission to manage conversation',
			() => {
				passport = makePassport(true);
				conversation = new Conversation(makeBaseProps(), passport);
			},
		);
		When('I set the reserver to a new user', () => {
			const originalReserver =
				conversation.reserver as PersonalUser<PersonalUserProps>;
			newReserver = new PersonalUser(
				{
					userType: 'personal-user',
					id: 'user-4',
					isBlocked: false,
					schemaVersion: '1.0.0',
					hasCompletedOnboarding: false,
					account: {
						accountType: originalReserver.account.accountType,
						email: 'newreserver@cellix.com',
						username: 'newreserver',
						profile: {
							firstName: originalReserver.account.profile.firstName,
							lastName: originalReserver.account.profile.lastName,
							aboutMe: originalReserver.account.profile.aboutMe,
							location: originalReserver.account.profile.location,
							billing: {
								cybersourceCustomerId:
									originalReserver.account.profile.billing
										.cybersourceCustomerId,
								subscription:
									originalReserver.account.profile.billing.subscription,
								transactions: createMockTransactions(),
							},
						},
					},
					createdAt: originalReserver.createdAt,
					updatedAt: originalReserver.updatedAt,
				},
				passport,
			);
			// @ts-expect-error: testing private setter
			conversation.reserver = newReserver;
		});
		Then("the conversation's reserver should be updated", () => {
			expect(conversation.reserver.account.email).toBe(
				'newreserver@cellix.com',
			);
		});
	});

	Scenario(
		'Changing the reserver without permission',
		({ Given, When, Then }) => {
			let setReserverWithoutPermission: () => void;
			Given(
				'a Conversation aggregate without permission to manage conversation',
				() => {
					passport = makePassport(false);
					conversation = new Conversation(makeBaseProps(), passport);
				},
			);
			When('I try to set the reserver to a new user', () => {
				setReserverWithoutPermission = () => {
					const originalReserver =
						conversation.reserver as PersonalUser<PersonalUserProps>;
					// @ts-expect-error: testing private setter
					conversation.reserver = new PersonalUser(
						{
							userType: 'personal-user',
							id: 'user-4',
							isBlocked: false,
							schemaVersion: '1.0.0',
							hasCompletedOnboarding: false,
							account: {
								accountType: originalReserver.account.accountType,
								email: 'newreserver@cellix.com',
								username: 'newreserver',
								profile: {
									firstName: originalReserver.account.profile.firstName,
									lastName: originalReserver.account.profile.lastName,
									aboutMe: originalReserver.account.profile.aboutMe,
									location: originalReserver.account.profile.location,
									billing: {
										cybersourceCustomerId:
											originalReserver.account.profile.billing
												.cybersourceCustomerId,
										subscription:
											originalReserver.account.profile.billing.subscription,
										transactions: createMockTransactions(),
									},
								},
							},
							createdAt: originalReserver.createdAt,
							updatedAt: originalReserver.updatedAt,
						},
						passport,
					);
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(setReserverWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
				expect(setReserverWithoutPermission).throws(
					'You do not have permission to change the reserver of this conversation',
				);
			});
		},
	);

	Scenario('Changing the listing with permission', ({ Given, When, Then }) => {
		let newListing: ItemListing<ItemListingProps>;
		Given(
			'a Conversation aggregate with permission to manage conversation',
			() => {
				passport = makePassport(true);
				conversation = new Conversation(makeBaseProps(), passport);
			},
		);
		When('I set the listing to a new item listing', () => {
			newListing = new ItemListing(
				{
					...conversation.listing,
					id: 'listing-2',
					title: 'New Listing',
				},
				passport,
			);
			// @ts-expect-error: testing private setter
			conversation.listing = newListing;
		});
		Then("the conversation's listing should be updated", () => {
			expect(conversation.listing.id).toBe('listing-2');
		});
	});

	Scenario(
		'Changing the listing without permission',
		({ Given, When, Then }) => {
			let setListingWithoutPermission: () => void;
			Given(
				'a Conversation aggregate without permission to manage conversation',
				() => {
					passport = makePassport(false);
					conversation = new Conversation(makeBaseProps(), passport);
				},
			);
			When('I try to set the listing to a new item listing', () => {
				setListingWithoutPermission = () => {
					// @ts-expect-error: testing private setter
					conversation.listing = new ItemListing(
						{
							...conversation.listing,
							id: 'listing-2',
							title: 'New Listing',
						},
						passport,
					);
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(setListingWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
				expect(setListingWithoutPermission).throws(
					'You do not have permission to change the listing of this conversation',
				);
			});
		},
	);

	Scenario('Getting readonly properties', ({ Given, Then, And }) => {
		Given('a Conversation aggregate', () => {
			passport = makePassport(true);
			conversation = new Conversation(makeBaseProps(), passport);
		});
		Then(
			'the messagingConversationId property should return the correct value',
			() => {
				expect(conversation.messagingConversationId).toBe('twilio-123');
			},
		);
		And('the createdAt property should return the correct date', () => {
			expect(conversation.createdAt).toEqual(expect.any(Date));
			expect(conversation.createdAt.toISOString()).toBe(
				'2020-01-01T00:00:00.000Z',
			);
		});
		And('the updatedAt property should return the correct date', () => {
			expect(conversation.updatedAt).toEqual(expect.any(Date));
			expect(conversation.updatedAt.toISOString()).toBe(
				'2020-01-02T00:00:00.000Z',
			);
		});
		And('the schemaVersion property should return the correct value', () => {
			expect(conversation.schemaVersion).toBeDefined();
			expect(typeof conversation.schemaVersion).toBe('string');
		});
	});

	Scenario('Setting listing to null', ({ Given, When, Then }) => {
		let setListingToNull: () => void;
		Given(
			'a Conversation aggregate with permission to manage conversation',
			() => {
				passport = makePassport(true);
				conversation = new Conversation(makeBaseProps(), passport);
			},
		);
		When('I try to set the listing to null', () => {
			setListingToNull = () => {
				// @ts-expect-error: testing private setter
				// biome-ignore lint/suspicious/noExplicitAny: Testing null assignment validation
				conversation.listing = null as any;
			};
		});
		Then(
			'a PermissionError should be thrown with message "listing cannot be null or undefined"',
			() => {
				expect(setListingToNull).toThrow(DomainSeedwork.PermissionError);
				expect(setListingToNull).toThrow('listing cannot be null or undefined');
			},
		);
	});

	Scenario('Setting listing to undefined', ({ Given, When, Then }) => {
		let setListingToUndefined: () => void;
		Given(
			'a Conversation aggregate with permission to manage conversation',
			() => {
				passport = makePassport(true);
				conversation = new Conversation(makeBaseProps(), passport);
			},
		);
		When('I try to set the listing to undefined', () => {
			setListingToUndefined = () => {
				// @ts-expect-error: testing private setter
				// biome-ignore lint/suspicious/noExplicitAny: Testing undefined assignment validation
				conversation.listing = undefined as any;
			};
		});
		Then(
			'a PermissionError should be thrown with message "listing cannot be null or undefined"',
			() => {
				expect(setListingToUndefined).toThrow(DomainSeedwork.PermissionError);
				expect(setListingToUndefined).toThrow(
					'listing cannot be null or undefined',
				);
			},
		);
	});

	Scenario('Getting messages from conversation', ({ Given, When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let messages: readonly any[];
		Given('a Conversation aggregate with messages', () => {
			passport = makePassport(true);
			conversation = new Conversation(makeBaseProps(), passport);
		});
		When('I access the messages property', () => {
			messages = conversation.messages;
		});
		Then('it should return an array of messages', () => {
			expect(Array.isArray(messages)).toBe(true);
		});
	});

	Scenario('Loading listing asynchronously', ({ Given, When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let loadedListing: any;
		Given('a Conversation aggregate', () => {
			passport = makePassport(true);
			conversation = new Conversation(makeBaseProps(), passport);
		});
		When('I call loadListing()', async () => {
			loadedListing = await conversation.loadListing();
		});
		Then('it should return the listing asynchronously', () => {
			expect(loadedListing).toBeDefined();
		});
	});

	Scenario('Setting reserver to null', ({ Given, When, Then }) => {
		let setReserverToNull: () => void;
		Given(
			'a Conversation aggregate with permission to manage conversation',
			() => {
				passport = makePassport(true);
				conversation = new Conversation(makeBaseProps(), passport);
			},
		);
		When('I try to set the reserver to null', () => {
			setReserverToNull = () => {
				// @ts-expect-error: testing private setter
				// biome-ignore lint/suspicious/noExplicitAny: Testing null assignment
				conversation.reserver = null as any;
			};
		});
		Then(
			'a PermissionError should be thrown with message "reserver cannot be null or undefined"',
			() => {
				expect(setReserverToNull).toThrow(DomainSeedwork.PermissionError);
				expect(setReserverToNull).toThrow(
					'reserver cannot be null or undefined',
				);
			},
		);
	});

	Scenario('Setting reserver to undefined', ({ Given, When, Then }) => {
		let setReserverToUndefined: () => void;
		Given(
			'a Conversation aggregate with permission to manage conversation',
			() => {
				passport = makePassport(true);
				conversation = new Conversation(makeBaseProps(), passport);
			},
		);
		When('I try to set the reserver to undefined', () => {
			setReserverToUndefined = () => {
				// @ts-expect-error: testing private setter
				// biome-ignore lint/suspicious/noExplicitAny: Testing undefined assignment
				conversation.reserver = undefined as any;
			};
		});
		Then(
			'a PermissionError should be thrown with message "reserver cannot be null or undefined"',
			() => {
				expect(setReserverToUndefined).toThrow(DomainSeedwork.PermissionError);
				expect(setReserverToUndefined).toThrow(
					'reserver cannot be null or undefined',
				);
			},
		);
	});

	Scenario('Setting sharer to null', ({ Given, When, Then }) => {
		let setSharerToNull: () => void;
		Given(
			'a Conversation aggregate with permission to manage conversation',
			() => {
				passport = makePassport(true);
				conversation = new Conversation(makeBaseProps(), passport);
			},
		);
		When('I try to set the sharer to null', () => {
			setSharerToNull = () => {
				// @ts-expect-error: testing private setter
				// biome-ignore lint/suspicious/noExplicitAny: Testing null assignment
				conversation.sharer = null as any;
			};
		});
		Then(
			'a PermissionError should be thrown with message "sharer cannot be null or undefined"',
			() => {
				expect(setSharerToNull).toThrow(DomainSeedwork.PermissionError);
				expect(setSharerToNull).toThrow('sharer cannot be null or undefined');
			},
		);
	});

	Scenario('Setting sharer to undefined', ({ Given, When, Then }) => {
		let setSharerToUndefined: () => void;
		Given(
			'a Conversation aggregate with permission to manage conversation',
			() => {
				passport = makePassport(true);
				conversation = new Conversation(makeBaseProps(), passport);
			},
		);
		When('I try to set the sharer to undefined', () => {
			setSharerToUndefined = () => {
				// @ts-expect-error: testing private setter
				// biome-ignore lint/suspicious/noExplicitAny: Testing undefined assignment
				conversation.sharer = undefined as any;
			};
		});
		Then(
			'a PermissionError should be thrown with message "sharer cannot be null or undefined"',
			() => {
				expect(setSharerToUndefined).toThrow(DomainSeedwork.PermissionError);
				expect(setSharerToUndefined).toThrow(
					'sharer cannot be null or undefined',
				);
			},
		);
	});

	Scenario('Loading messages asynchronously', ({ Given, When, Then }) => {
		let result: readonly MessageEntityReference[];
		Given('a Conversation aggregate', () => {
			passport = makePassport(true);
			conversation = new Conversation(makeBaseProps(), passport);
		});
		When('I call loadMessages()', async () => {
			result = await conversation.loadMessages();
		});
		Then('it should return the messages asynchronously', () => {
			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});
	});

	Scenario(
		'Getting reserver when userType is admin-user',
		({ Given, When, Then }) => {
			let result: UserEntityReference;
			Given('a Conversation aggregate with an admin-user reserver', () => {
				passport = makePassport(true);
				const props = makeBaseProps();
				// Set reserver to admin-user type
				props.reserver = {
					id: 'admin-123',
					userType: 'admin-user',
				} as unknown as PersonalUserProps;
				conversation = new Conversation(props, passport);
			});
			When('I access the reserver property', () => {
				result = conversation.reserver;
			});
			Then('it should return an AdminUser instance', () => {
				expect(result).toBeDefined();
				expect(result.userType).toBe('admin-user');
			});
		},
	);

	Scenario('Setting reserver without permission', ({ Given, When, Then }) => {
		let setReserverWithoutPermission: () => void;
		Given(
			'a Conversation aggregate without permission to manage conversation',
			() => {
				passport = makePassport(false);
				conversation = new Conversation(makeBaseProps(), passport);
			},
		);
		When('I try to set the reserver', () => {
			setReserverWithoutPermission = () => {
				const newReserver = new PersonalUser(
					{
						id: 'new-reserver-id',
						userType: 'personal-user',
					} as PersonalUserProps,
					passport,
				);
				// @ts-expect-error: testing private setter
				conversation.reserver = newReserver;
			};
		});
		Then(
			'a PermissionError should be thrown about managing conversation',
			() => {
				expect(setReserverWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
				expect(setReserverWithoutPermission).toThrow(
					'You do not have permission to change the reserver of this conversation',
				);
			},
		);
	});

	Scenario(
		'Getting sharer when userType is admin-user',
		({ Given, When, Then }) => {
			let result: UserEntityReference;
			Given('a Conversation aggregate with an admin-user sharer', () => {
				passport = makePassport(true);
				const props = makeBaseProps();
				// Set sharer to admin-user type
				props.sharer = {
					id: 'admin-sharer-123',
					userType: 'admin-user',
				} as unknown as PersonalUserProps;
				conversation = new Conversation(props, passport);
			});
			When('I access the sharer property', () => {
				result = conversation.sharer;
			});
			Then('it should return an AdminUser instance for the sharer', () => {
				expect(result).toBeDefined();
				expect(result.userType).toBe('admin-user');
			});
		},
	);

	Scenario('Loading sharer asynchronously', ({ Given, When, Then }) => {
		let result: UserEntityReference;
		Given('a Conversation aggregate', () => {
			passport = makePassport(true);
			conversation = new Conversation(makeBaseProps(), passport);
		});
		When('I call loadSharer()', async () => {
			result = await conversation.loadSharer();
		});
		Then('it should return the sharer asynchronously', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario('Loading reserver asynchronously', ({ Given, When, Then }) => {
		let result: UserEntityReference;
		Given('a Conversation aggregate', () => {
			passport = makePassport(true);
			conversation = new Conversation(makeBaseProps(), passport);
		});
		When('I call loadReserver()', async () => {
			result = await conversation.loadReserver();
		});
		Then('it should return the reserver asynchronously', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario(
		'Setting the messagingConversationId with permission',
		({ Given, When, Then }) => {
			Given(
				'a Conversation aggregate with permission to manage conversation',
				() => {
					passport = makePassport(true);
					conversation = new Conversation(makeBaseProps(), passport);
				},
			);
			When('I set the messagingConversationId to a new value', () => {
				conversation.messagingConversationId = 'twilio-456';
			});
			Then('the messagingConversationId should be updated', () => {
				expect(conversation.messagingConversationId).toBe('twilio-456');
			});
		},
	);

	Scenario(
		'Setting the messagingConversationId without permission',
		({ Given, When, Then }) => {
			let setTwilioIdWithoutPermission: () => void;
			Given(
				'a Conversation aggregate without permission to manage conversation',
				() => {
					passport = makePassport(false);
					conversation = new Conversation(makeBaseProps(), passport);
				},
			);
			When('I try to set the messagingConversationId to a new value', () => {
				setTwilioIdWithoutPermission = () => {
					conversation.messagingConversationId = 'twilio-789';
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(setTwilioIdWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
				expect(setTwilioIdWithoutPermission).throws(
					'You do not have permission to change the messagingConversationId of this conversation',
				);
			});
		},
	);
});
