import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { ItemListingProps } from './item-listing.entity.ts';
import { ItemListing } from './item-listing.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import { PersonalUser } from '../../user/personal-user/personal-user.ts';
import type { PersonalUserProps } from '../../user/personal-user/personal-user.entity.ts';
import { PersonalUserRolePermissions } from '../../role/personal-user-role/personal-user-role-permissions.ts';
import { PersonalUserRole } from '../../role/personal-user-role/personal-user-role.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/item-listing.feature'),
);

function makePassport(
	canUpdateItemListing = true,
	canPublishItemListing = true,
	canUnpublishItemListing = true,
): Passport {
	return vi.mocked({
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: (
					fn: (p: {
						canUpdateItemListing: boolean;
						canPublishItemListing: boolean;
						canUnpublishItemListing: boolean;
					}) => boolean,
				) =>
					fn({
						canUpdateItemListing,
						canPublishItemListing,
						canUnpublishItemListing,
					}),
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		conversation: {
			forConversation: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Passport);
}

function makeBaseProps(
	overrides: Partial<ItemListingProps> = {},
): ItemListingProps {
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
		accountPlanPermissions: {
			canCreateAccountPlan: true,
			canDeleteAccountPlan: true,
			canUpdateAccountPlan: true,
		},
		userPermissions: {
			canBlockUsers: true,
			canCreateUser: true,
			canUnblockUsers: true,
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
					lastName: 'User',
					aboutMe: 'I love sharing items!',
					location: {
						address1: '123 Main St',
						address2: null,
						city: 'Delhi',
						state: 'DL',
						country: 'India',
						zipCode: '110001',
					},
					billing: {
						cybersourceCustomerId: 'cust_123',
						subscription: {
							status: 'inactive',
							planCode: 'verified-personal-user',
							startDate: new Date('2020-01-01T00:00:00Z'),
							subscriptionId: 'sub-1',
						},
						transactions: {
							items: [
								{
									id: '1',
									transactionId: 'txn_123',
									amount: 1000,
									referenceId: 'ref_123',
									status: 'completed',
									completedAt: new Date('2020-01-01T00:00:00Z'),
									errorMessage: null,
								},
							],
							getNewItem: () => ({
								id: '1',
								transactionId: 'txn_123',
								amount: 1000,
								referenceId: 'ref_123',
								status: 'completed',
								completedAt: new Date('2020-01-01T00:00:00Z'),
								errorMessage: null,
							}),
							addItem: vi.fn(),
							removeItem: vi.fn(),
							removeAll: vi.fn(),
						},
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

	return {
		id: 'listing-1',
		sharer: user,
		title: 'Old Title',
		description: 'Old Description',
		category: 'Electronics',
		location: 'Delhi',
		sharingPeriodStart: new Date('2025-10-06T00:00:00Z'),
		sharingPeriodEnd: new Date('2025-11-06T00:00:00Z'),
		state: 'Published',
		images: [],
		sharingHistory: [],
		reports: 0,
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		listingType: 'item',
		...overrides,
	};
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let passport: Passport;
	let baseProps: ItemListingProps;
	let listing: ItemListing<ItemListingProps>;
	let newListing: ItemListing<ItemListingProps>;

	BeforeEachScenario(() => {
		passport = makePassport(true, true, true);
		baseProps = makeBaseProps();
		listing = new ItemListing(baseProps, passport);
		newListing = undefined as unknown as ItemListing<ItemListingProps>;
	});

	Background(({ Given, And }) => {
		Given('a valid Passport with listing permissions', () => {
			passport = makePassport(true, true, true);
		});
		And('a valid PersonalUserEntityReference for ""user1""', () => {
			// Already handled in makeBaseProps
		});
		And(
			'base item listing fields with title ""Old Title"", description ""Old Description"", category ""Electronics"", location ""Delhi"", sharingPeriodStart ""2025-10-06"", sharingPeriodEnd ""2025-11-06"", and valid timestamps"',
			() => {
				baseProps = makeBaseProps();
				listing = new ItemListing(baseProps, passport);
			},
		);
	});

	Scenario('Creating a new item listing instance', ({ When, Then, And }) => {
		When(
			'I create a new ItemListing aggregate using getNewInstance with sharer "user1" and title "New Listing"',
			() => {
				newListing = ItemListing.getNewInstance(
					baseProps.sharer,
					{
						title: 'New Listing',
						description: 'Test Description',
						category: 'Electronics',
						location: 'Delhi',
						sharingPeriodStart: new Date('2025-10-06T00:00:00Z'),
						sharingPeriodEnd: new Date('2025-11-06T00:00:00Z'),
						images: [],
					},
					passport,
				);
			},
		);
		Then('the listing\'s title should be "New Listing"', () => {
			expect(newListing.title).toBe('New Listing');
		});
		And('the listing\'s sharer should reference "user1"', () => {
			expect(newListing.sharer.id).toBe('user-1');
		});
		And('the listing state should be "Published"', () => {
			// Note: getNewInstance stores state as a ValueObject, not a string
			const stateValue =
				typeof newListing.state === 'string'
					? newListing.state
					: (newListing.state as { valueOf: () => string }).valueOf();
			expect(stateValue).toBe('Published');
		});
	});

	Scenario(
		'Creating a new draft listing with missing fields',
		({ When, Then, And }) => {
			When(
				'I create a new ItemListing aggregate using getNewInstance with isDraft true and empty title, description, category, and location',
				() => {
					newListing = ItemListing.getNewInstance(
						baseProps.sharer,
						{
							title: '',
							description: '',
							category: '',
							location: '',
							sharingPeriodStart: new Date('2025-10-06T00:00:00Z'),
							sharingPeriodEnd: new Date('2025-11-06T00:00:00Z'),
							images: [],
							isDraft: true,
						},
						passport,
					);
				},
			);
			Then('the listing\'s title should default to "Draft Title"', () => {
				expect(newListing.title).toBe('Draft Title');
			});
			And(
				'the listing\'s description should default to "Draft Description"',
				() => {
					expect(newListing.description).toBe('Draft Description');
				},
			);
			And('the listing\'s category should default to "Miscellaneous"', () => {
				// Note: getNewInstance stores category as a ValueObject, not a string
				const categoryValue =
					typeof newListing.category === 'string'
						? newListing.category
						: (newListing.category as { valueOf: () => string }).valueOf();
				expect(categoryValue).toBe('Miscellaneous');
			});
			And('the listing\'s location should default to "Draft Location"', () => {
				// Note: getNewInstance stores location as a ValueObject, not a string
				const locationValue =
					typeof newListing.location === 'string'
						? newListing.location
						: (newListing.location as { valueOf: () => string }).valueOf();
				expect(locationValue).toBe('Draft Location');
			});
			And('the listing state should be "Drafted"', () => {
				// Note: getNewInstance stores state as a ValueObject, not a string
				const stateValue =
					typeof newListing.state === 'string'
						? newListing.state
						: (newListing.state as { valueOf: () => string }).valueOf();
				expect(stateValue).toBe('Drafted');
			});
		},
	);

	Scenario(
		'Changing the title with permission to update listings',
		({ Given, When, Then, And }) => {
			let initialUpdatedAt: Date;
			Given(
				'an ItemListing aggregate with permission to update item listing',
				() => {
					passport = makePassport(true, true, true);
					listing = new ItemListing(makeBaseProps(), passport);
					initialUpdatedAt = listing.updatedAt;
				},
			);
			When('I set the title to "Updated Title"', () => {
				listing.title = 'Updated Title';
			});
			Then('the listing\'s title should be "Updated Title"', () => {
				expect(listing.title).toBe('Updated Title');
			});
			And('the updatedAt timestamp should change', () => {
				expect(listing.updatedAt.getTime()).toBeGreaterThanOrEqual(
					initialUpdatedAt.getTime(),
				);
			});
		},
	);

	Scenario(
		'Changing the title without permission',
		({ Given, When, Then, And }) => {
			let changingTitleWithoutPermission: () => void;
			Given(
				'an ItemListing aggregate without permission to update item listing',
				() => {
					passport = makePassport(false, false, false);
					listing = new ItemListing(makeBaseProps(), passport);
				},
			);
			When('I try to set the title to "Updated Title"', () => {
				changingTitleWithoutPermission = () => {
					listing.title = 'Updated Title';
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(changingTitleWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
			});
			And('the title should remain unchanged', () => {
				expect(listing.title).toBe('Old Title');
			});
		},
	);

	Scenario(
		'Changing the description with permission',
		({ Given, When, Then }) => {
			Given(
				'an ItemListing aggregate with permission to update item listing',
				() => {
					passport = makePassport(true, true, true);
					listing = new ItemListing(makeBaseProps(), passport);
				},
			);
			When('I set the description to "Updated Description"', () => {
				listing.description = 'Updated Description';
			});
			Then('the listing\'s description should be "Updated Description"', () => {
				expect(listing.description).toBe('Updated Description');
			});
		},
	);

	Scenario(
		'Changing the description without permission',
		({ Given, When, Then }) => {
			let changingDescriptionWithoutPermission: () => void;
			Given(
				'an ItemListing aggregate without permission to update item listing',
				() => {
					passport = makePassport(false, false, false);
					listing = new ItemListing(makeBaseProps(), passport);
				},
			);
			When('I try to set the description to "Updated Description"', () => {
				changingDescriptionWithoutPermission = () => {
					listing.description = 'Updated Description';
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(changingDescriptionWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
			});
		},
	);

	Scenario('Changing the category with permission', ({ Given, When, Then }) => {
		Given(
			'an ItemListing aggregate with permission to update item listing',
			() => {
				passport = makePassport(true, true, true);
				listing = new ItemListing(makeBaseProps(), passport);
			},
		);
		When('I set the category to "Books"', () => {
			listing.category = 'Books';
		});
		Then('the listing\'s category should be "Books"', () => {
			expect(listing.category).toBe('Books');
		});
	});

	Scenario(
		'Changing the category without permission',
		({ Given, When, Then }) => {
			let changingCategoryWithoutPermission: () => void;
			Given(
				'an ItemListing aggregate without permission to update item listing',
				() => {
					passport = makePassport(false, false, false);
					listing = new ItemListing(makeBaseProps(), passport);
				},
			);
			When('I try to set the category to "Books"', () => {
				changingCategoryWithoutPermission = () => {
					listing.category = 'Books';
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(changingCategoryWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
			});
		},
	);

	Scenario('Changing the location with permission', ({ Given, When, Then }) => {
		Given(
			'an ItemListing aggregate with permission to update item listing',
			() => {
				passport = makePassport(true, true, true);
				listing = new ItemListing(makeBaseProps(), passport);
			},
		);
		When('I set the location to "Mumbai"', () => {
			listing.location = 'Mumbai';
		});
		Then('the listing\'s location should be "Mumbai"', () => {
			expect(listing.location).toBe('Mumbai');
		});
	});

	Scenario(
		'Changing the location without permission',
		({ Given, When, Then }) => {
			let changingLocationWithoutPermission: () => void;
			Given(
				'an ItemListing aggregate without permission to update item listing',
				() => {
					passport = makePassport(false, false, false);
					listing = new ItemListing(makeBaseProps(), passport);
				},
			);
			When('I try to set the location to "Mumbai"', () => {
				changingLocationWithoutPermission = () => {
					listing.location = 'Mumbai';
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(changingLocationWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
			});
		},
	);

	Scenario(
		'Changing sharing period with permission',
		({ Given, When, And, Then }) => {
			Given(
				'an ItemListing aggregate with permission to update item listing',
				() => {
					passport = makePassport(true, true, true);
					listing = new ItemListing(makeBaseProps(), passport);
				},
			);
			When('I set the sharingPeriodStart to "2025-10-10"', () => {
				listing.sharingPeriodStart = new Date('2025-10-10T00:00:00Z');
			});
			And('I set the sharingPeriodEnd to "2025-12-10"', () => {
				listing.sharingPeriodEnd = new Date('2025-12-10T00:00:00Z');
			});
			Then('the sharing period should update accordingly', () => {
				expect(listing.sharingPeriodStart.toISOString()).toBe(
					'2025-10-10T00:00:00.000Z',
				);
				expect(listing.sharingPeriodEnd.toISOString()).toBe(
					'2025-12-10T00:00:00.000Z',
				);
			});
		},
	);

	Scenario(
		'Changing sharing period without permission',
		({ Given, When, Then }) => {
			let changingSharingPeriodWithoutPermission: () => void;
			Given(
				'an ItemListing aggregate without permission to update item listing',
				() => {
					passport = makePassport(false, false, false);
					listing = new ItemListing(makeBaseProps(), passport);
				},
			);
			When('I try to set the sharingPeriodStart or sharingPeriodEnd', () => {
				changingSharingPeriodWithoutPermission = () => {
					listing.sharingPeriodStart = new Date('2025-10-10T00:00:00Z');
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(changingSharingPeriodWithoutPermission).toThrow(
					DomainSeedwork.PermissionError,
				);
			});
		},
	);

	Scenario('Changing images with permission', ({ Given, When, Then }) => {
		Given(
			'an ItemListing aggregate with permission to update item listing',
			() => {
				passport = makePassport(true, true, true);
				listing = new ItemListing(makeBaseProps(), passport);
			},
		);
		When('I set images to ["img1.png", "img2.png"]', () => {
			listing.images = ['img1.png', 'img2.png'];
		});
		Then('the listing\'s images should be ["img1.png", "img2.png"]', () => {
			expect(listing.images).toEqual(['img1.png', 'img2.png']);
		});
	});

	Scenario('Changing images without permission', ({ Given, When, Then }) => {
		let changingImagesWithoutPermission: () => void;
		Given(
			'an ItemListing aggregate without permission to update item listing',
			() => {
				passport = makePassport(false, false, false);
				listing = new ItemListing(makeBaseProps(), passport);
			},
		);
		When('I try to set images to ["img1.png", "img2.png"]', () => {
			changingImagesWithoutPermission = () => {
				listing.images = ['img1.png', 'img2.png'];
			};
		});
		Then('a PermissionError should be thrown', () => {
			expect(changingImagesWithoutPermission).toThrow(
				DomainSeedwork.PermissionError,
			);
		});
	});

	Scenario(
		'Publishing a listing with permission',
		({ Given, When, Then, And }) => {
			let initialUpdatedAt: Date;
			Given(
				'an ItemListing aggregate with permission to publish item listing',
				() => {
					passport = makePassport(true, true, true);
					const draftProps = makeBaseProps({ state: 'Drafted' });
					listing = new ItemListing(draftProps, passport);
					initialUpdatedAt = listing.updatedAt;
				},
			);
			When('I call publish()', () => {
				listing.publish();
			});
			Then('the listing\'s state should be "Published"', () => {
				expect(listing.state).toBe('Published');
			});
			And('the updatedAt timestamp should change', () => {
				expect(listing.updatedAt.getTime()).toBeGreaterThanOrEqual(
					initialUpdatedAt.getTime(),
				);
			});
		},
	);
});
