import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import { expect, vi } from 'vitest';
import type { ItemListingProps } from '../../listing/item/item-listing.entity.ts';
import { ItemListing } from '../../listing/item/item-listing.ts';
import type { Passport } from '../../passport.ts';
import { PersonalUserRole } from '../../role/personal-user-role/personal-user-role.ts';
import { PersonalUserRolePermissions } from '../../role/personal-user-role/personal-user-role-permissions.ts';
import type { PersonalUserProps } from '../../user/personal-user/personal-user.entity.ts';
import { PersonalUser } from '../../user/personal-user/personal-user.ts';
import type { ConversationProps } from './conversation.entity.ts';
import { Conversation } from './conversation.ts';

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
		},
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Passport);
}

function makeBaseProps(
	overrides: Partial<ConversationProps> = {},
): ConversationProps {
	// Provide a valid PersonalUserPermissions value object for permissions
	const permissions = new PersonalUserRolePermissions({
		listingPermissions: {
			canCreateItemListing: true,
			canUpdateItemListing: true,
			canDeleteItemListing: true,
			canViewItemListing: true,
			canPublishItemListing: true,
			canUnpublishItemListing: true,
		},
		conversationPermissions: {
			canCreateConversation: true,
			canManageConversation: true,
			canViewConversation: true,
		},
		reservationRequestPermissions: {
			canCreateReservationRequest: true,
			canManageReservationRequest: true,
			canViewReservationRequest: true,
		},
	});
	const roleProps = {
		id: 'role-1',
		name: 'default',
		roleName: 'default',
		isDefault: true,
		roleType: 'personal',
		permissions,
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
	};
	const role = new PersonalUserRole(roleProps, makePassport());
	const user = new PersonalUser<PersonalUserProps>(
		{
			userType: 'end-user',
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
						subscriptionId: null,
						cybersourceCustomerId: null,
						paymentState: '',
						lastTransactionId: null,
						lastPaymentAmount: null,
					},
				},
			},
			createdAt: new Date('2020-01-01T00:00:00Z'),
			updatedAt: new Date('2020-01-02T00:00:00Z'),
			role,
			loadRole: async () => role,
		},
		makePassport(),
	);
	const reserver = new PersonalUser<PersonalUserProps>(
		{
			userType: 'end-user',
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
						subscriptionId: null,
						cybersourceCustomerId: null,
						paymentState: '',
						lastTransactionId: null,
						lastPaymentAmount: null,
					},
				},
			},
			createdAt: new Date('2020-01-01T00:00:00Z'),
			updatedAt: new Date('2020-01-02T00:00:00Z'),
			role,
			loadRole: async () => role,
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
			state: 'Published',
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
			expect(newConversation.messagingConversationId).toBe('mock-messaging-conversation-id');
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
			newSharer = new PersonalUser(
				{
					...conversation.sharer,
					id: 'user-3',
					externalId: 'user-external-3',
					account: {
						...conversation.sharer.account,
						email: 'newsharer@cellix.com',
						username: 'newsharer',
					},
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
					// @ts-expect-error: testing private setter
					conversation.sharer = new PersonalUser(
						{
							...conversation.sharer,
							id: 'user-3',
							externalId: 'user-external-3',
							displayName: 'New Sharer',
							email: 'newsharer@cellix.com',
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
			newReserver = new PersonalUser(
				{
					...conversation.reserver,
					id: 'user-4',
					externalId: 'user-external-4',
					account: {
						...conversation.reserver.account,
						email: 'newreserver@cellix.com',
						username: 'newreserver',
					},
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
					// @ts-expect-error: testing private setter
					conversation.reserver = new PersonalUser(
						{
							...conversation.reserver,
							id: 'user-4',
							externalId: 'user-external-4',
							displayName: 'New Reserver',
							email: 'newreserver@cellix.com',
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
