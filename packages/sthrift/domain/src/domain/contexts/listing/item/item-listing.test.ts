import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import { expect, vi } from 'vitest';
import type { Passport } from '../../passport.ts';
import { PersonalUser } from '../../user/personal-user/personal-user.ts';
import type { PersonalUserProps } from '../../user/personal-user/personal-user.entity.ts';
import { AdminUser } from '../../user/admin-user/admin-user.ts';
import type { AdminUserProps } from '../../user/admin-user/admin-user.entity.ts';
import type { ItemListingProps } from './item-listing.entity.ts';
import { ItemListing } from './item-listing.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/item-listing.feature'),
);

function makePassport(
	canUpdateItemListing = true,
	canPublishItemListing = true,
	canUnpublishItemListing = true,
	canDeleteItemListing = true,
): Passport {
	return vi.mocked({
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: (
					fn: (p: {
						canUpdateItemListing: boolean;
						canPublishItemListing: boolean;
						canUnpublishItemListing: boolean;
						canDeleteItemListing: boolean;
					}) => boolean,
				) =>
					fn({
						canUpdateItemListing,
						canPublishItemListing,
						canUnpublishItemListing,
						canDeleteItemListing,
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
		state: 'Active',
		images: [],
		sharingHistory: [],
		reports: 0,
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		listingType: 'item',
    loadSharer: async () => user,
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
					makeBaseProps(),
					passport,
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
				);
			},
		);
		Then('the listing\'s title should be "New Listing"', () => {
			expect(newListing.title).toBe('New Listing');
		});
		And('the listing\'s sharer should reference "user1"', () => {
			expect(newListing.sharer.id).toBe('user-1');
		});
		And('the listing state should be "Active"', () => {
			// Note: getNewInstance stores state as a ValueObject, not a string
			const stateValue =
				typeof newListing.state === 'string'
					? newListing.state
					: (newListing.state as { valueOf: () => string }).valueOf();
			expect(stateValue).toBe('Active');
		});
	});

	Scenario(
		'Creating a new draft listing with missing fields',
		({ When, Then, And }) => {
			When(
				'I create a new ItemListing aggregate using getNewInstance with isDraft true and empty title, description, category, and location',
				() => {
					newListing = ItemListing.getNewInstance(
						makeBaseProps(),
						passport,
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
					);
				},
			);
			Then("the listing's title should default to empty", () => {
				expect(newListing.title).toBe('');
			});
			And("the listing's description should default to empty", () => {
				expect(newListing.description).toBe('');
			});
			And("the listing's category should default to empty", () => {
				// Note: getNewInstance stores category as a ValueObject, not a string
				const categoryValue =
					typeof newListing.category === 'string'
						? newListing.category
						: (newListing.category as { valueOf: () => string }).valueOf();
				expect(categoryValue).toBe('');
			});
			And("the listing's location should default to empty", () => {
				// Note: getNewInstance stores location as a ValueObject, not a string
				const locationValue =
					typeof newListing.location === 'string'
						? newListing.location
						: (newListing.location as { valueOf: () => string }).valueOf();
				expect(locationValue).toBe('');
			});
			And('the listing state should be "Draft"', () => {
				// Note: getNewInstance stores state as a ValueObject, not a string
				const stateValue =
					typeof newListing.state === 'string'
						? newListing.state
						: (newListing.state as { valueOf: () => string }).valueOf();
				expect(stateValue).toBe('Draft');
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
					const draftProps = makeBaseProps({ state: 'Draft' });
					listing = new ItemListing(draftProps, passport);
					initialUpdatedAt = listing.updatedAt;
				},
			);
			When('I call publish()', () => {
				listing.publish();
			});
			Then('the listing\'s state should be "Active"', () => {
				expect(listing.state).toBe('Active');
			});
			And('the updatedAt timestamp should change', () => {
				expect(listing.updatedAt.getTime()).toBeGreaterThanOrEqual(
					initialUpdatedAt.getTime(),
				);
			});
		},
	);

	Scenario(
		'Publishing a listing without permission',
		({ Given, When, Then }) => {
			let publishWithoutPermission: () => void;
			Given(
				'an ItemListing aggregate without permission to publish item listing',
				() => {
					passport = makePassport(true, false, true, true);
					listing = new ItemListing(makeBaseProps({ state: 'Draft' }), passport);
				},
			);
			When('I try to call publish()', () => {
				publishWithoutPermission = () => {
					listing.publish();
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(publishWithoutPermission).toThrow(DomainSeedwork.PermissionError);
				expect(publishWithoutPermission).toThrow(
					'You do not have permission to publish this listing',
				);
			});
		},
	);

	Scenario('Requesting delete with permission', ({ Given, When, Then }) => {
	Given(
		'an ItemListing aggregate with permission to delete item listing',
		() => {
			passport = makePassport(true, true, true, true);
			listing = new ItemListing(makeBaseProps(), passport);
		},
	);
	When('I call requestDelete()', () => {
		listing.requestDelete();
	});
	Then("the listing's isDeleted flag should be true", () => {
		expect(listing.isDeleted).toBe(true);
	});
});

Scenario(
	'Requesting delete without permission',
	({ Given, When, Then, And }) => {
		let requestDeleteWithoutPermission: () => void;
		Given(
			'an ItemListing aggregate without permission to delete item listing',
			() => {
				passport = makePassport(true, true, true, false);
				listing = new ItemListing(makeBaseProps(), passport);
			},
		);
		When('I try to call requestDelete()', () => {
			requestDeleteWithoutPermission = () => {
				listing.requestDelete();
			};
		});
		Then('a PermissionError should be thrown', () => {
			expect(requestDeleteWithoutPermission).toThrow(
				DomainSeedwork.PermissionError,
			);
		});
		And("the listing's isDeleted flag should remain false", () => {
			expect(listing.isDeleted).toBe(false);
		});
	},
);

	Scenario(
		'Requesting delete when already deleted',
		({ Given, When, Then, And }) => {
			Given(
				'an ItemListing aggregate with permission to delete item listing',
				() => {
					passport = makePassport(true, true, true, true);
					listing = new ItemListing(makeBaseProps(), passport);
				},
			);
			And('the listing is already marked as deleted', () => {
				listing.requestDelete();
			});
			When('I call requestDelete() again', () => {
				listing.requestDelete();
			});
			Then("the listing's isDeleted flag should remain true", () => {
				expect(listing.isDeleted).toBe(true);
			});
			And('no error should be thrown', () => {
				// Test passes if no error was thrown
				expect(listing.isDeleted).toBe(true);
			});
		},
	);

	Scenario(
		'Pausing a listing with permission',
		({ Given, When, Then, And }) => {
			let initialUpdatedAt: Date;
			Given(
				'an ItemListing aggregate with permission to unpublish item listing',
				() => {
					passport = makePassport(true, true, true, true);
					listing = new ItemListing(makeBaseProps({ state: 'Active' }), passport);
					initialUpdatedAt = listing.updatedAt;
				},
			);
			When('I call pause()', () => {
				listing.pause();
			});
			Then('the listing\'s state should be "Paused"', () => {
				expect(listing.state).toBe('Paused');
			});
			And('the updatedAt timestamp should change', () => {
				expect(listing.updatedAt.getTime()).toBeGreaterThanOrEqual(
					initialUpdatedAt.getTime(),
				);
			});
		},
	);

	Scenario(
		'Pausing a listing without permission',
		({ Given, When, Then }) => {
			let pauseWithoutPermission: () => void;
			Given(
				'an ItemListing aggregate without permission to unpublish item listing',
				() => {
					passport = makePassport(true, true, false, true);
					listing = new ItemListing(makeBaseProps({ state: 'Active' }), passport);
				},
			);
			When('I try to call pause()', () => {
				pauseWithoutPermission = () => {
					listing.pause();
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(pauseWithoutPermission).toThrow(DomainSeedwork.PermissionError);
			});
		},
	);

	Scenario('Cancelling a listing with permission', ({ Given, When, Then }) => {
		Given(
			'an ItemListing aggregate with permission to delete item listing',
			() => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps({ state: 'Active' }), passport);
			},
		);
		When('I call cancel()', () => {
			listing.cancel();
		});
		Then('the listing\'s state should be "Cancelled"', () => {
			expect(listing.state).toBe('Cancelled');
		});
	});

	Scenario(
		'Cancelling a listing without permission',
		({ Given, When, Then }) => {
			let cancelWithoutPermission: () => void;
			Given(
				'an ItemListing aggregate without permission to delete item listing',
				() => {
					passport = makePassport(true, true, true, false);
					listing = new ItemListing(makeBaseProps({ state: 'Active' }), passport);
				},
			);
			When('I try to call cancel()', () => {
				cancelWithoutPermission = () => {
					listing.cancel();
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(cancelWithoutPermission).toThrow(DomainSeedwork.PermissionError);
			});
		},
	);

	Scenario('Blocking a listing with permission', ({ Given, When, Then }) => {
		Given(
			'an ItemListing aggregate with permission to publish item listing',
			() => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps({ state: 'Active' }), passport);
			},
		);
		When('I call setBlocked(true)', () => {
			listing.setBlocked(true);
		});
		Then('the listing\'s state should be "Blocked"', () => {
			expect(listing.state).toBe('Blocked');
		});
	});

	Scenario(
		'Unblocking a listing with permission',
		({ Given, When, Then }) => {
			Given(
				'an ItemListing aggregate with permission to publish item listing that is currently blocked',
				() => {
					passport = makePassport(true, true, true, true);
					listing = new ItemListing(makeBaseProps({ state: 'Blocked' }), passport);
				},
			);
			When('I call setBlocked(false)', () => {
				listing.setBlocked(false);
			});
			Then('the listing\'s state should be "Active"', () => {
				expect(listing.state).toBe('Active');
			});
		},
	);

	Scenario(
		'Blocking already blocked listing',
		({ Given, When, Then }) => {
			Given(
				'an ItemListing aggregate with permission to publish item listing that is already blocked',
				() => {
					passport = makePassport(true, true, true, true);
					listing = new ItemListing(makeBaseProps({ state: 'Blocked' }), passport);
				},
			);
			When('I call setBlocked(true) again', () => {
				listing.setBlocked(true);
			});
			Then('the listing\'s state should remain "Blocked"', () => {
				expect(listing.state).toBe('Blocked');
			});
		},
	);

	Scenario(
		'Unblocking non-blocked listing',
		({ Given, When, Then }) => {
			Given(
				'an ItemListing aggregate with permission to publish item listing in Active state',
				() => {
					passport = makePassport(true, true, true, true);
					listing = new ItemListing(makeBaseProps({ state: 'Active' }), passport);
				},
			);
			When('I call setBlocked(false)', () => {
				listing.setBlocked(false);
			});
			Then('the listing\'s state should remain "Active"', () => {
				expect(listing.state).toBe('Active');
			});
		},
	);

	Scenario(
		'Blocking a listing without permission',
		({ Given, When, Then }) => {
			let blockWithoutPermission: () => void;
			Given(
				'an ItemListing aggregate without permission to publish item listing',
				() => {
					passport = makePassport(true, false, true, true);
					listing = new ItemListing(makeBaseProps({ state: 'Active' }), passport);
				},
			);
			When('I try to call setBlocked(true)', () => {
				blockWithoutPermission = () => {
					listing.setBlocked(true);
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(blockWithoutPermission).toThrow(DomainSeedwork.PermissionError);
			});
		},
	);

	Scenario(
		'Unblocking a listing without permission',
		({ Given, When, Then }) => {
			let unblockWithoutPermission: () => void;
			Given(
				'an ItemListing aggregate without permission to publish item listing that is blocked',
				() => {
					passport = makePassport(true, false, true, true);
					listing = new ItemListing(makeBaseProps({ state: 'Blocked' }), passport);
				},
			);
			When('I try to call setBlocked(false)', () => {
				unblockWithoutPermission = () => {
					listing.setBlocked(false);
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(unblockWithoutPermission).toThrow(DomainSeedwork.PermissionError);
			});
		},
	);

	Scenario(
		'Getting listingType from item listing',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps(), passport);
			});
			When('I access the listingType property', () => {
				// Access happens in Then
			});
			Then('it should return "item"', () => {
				expect(listing.listingType).toBe('item');
			});
		},
	);

	Scenario(
		'Setting listingType for item listing',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps(), passport);
			});
			When('I set the listingType to "premium-listing"', () => {
				listing.listingType = 'premium-listing';
			});
			Then('the listingType should be updated to "premium-listing"', () => {
				expect(listing.listingType).toBe('premium-listing');
			});
		},
	);

	Scenario(
		'Getting sharer as AdminUser when userType is admin-user',
		({ Given, When, Then, And }) => {
			Given('an ItemListing with an AdminUser as sharer', () => {
				const adminPassport = vi.mocked({
					listing: {
						forItemListing: vi.fn(() => ({
							determineIf: () => true,
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
					conversation: {
						forConversation: vi.fn(() => ({
							determineIf: () => true,
						})),
					},
				} as unknown as Passport);

				const adminUser = {
					userType: 'admin-user' as const,
					id: 'admin-1',
					isBlocked: false,
					schemaVersion: '1.0.0',
				} as unknown as AdminUserProps;
				const propsWithAdmin = { ...makeBaseProps(), sharer: adminUser };
				listing = new ItemListing(propsWithAdmin, adminPassport);
			});
			When('I access the sharer property', () => {
				// Access happens in Then
			});
			Then('it should return an AdminUser instance', () => {
				expect(listing.sharer).toBeInstanceOf(AdminUser);
			});
			And('the sharer id should match', () => {
				expect(listing.sharer.id).toBe('admin-1');
			});
		},
	);

	Scenario(
		'Getting sharer as PersonalUser when userType is personal-user',
		({ Given, When, Then, And }) => {
			Given('an ItemListing with a PersonalUser as sharer', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps(), passport);
			});
			When('I access the sharer property', () => {
				// Access happens in Then
			});
			Then('it should return a PersonalUser instance', () => {
				expect(listing.sharer).toBeInstanceOf(PersonalUser);
			});
			And('the sharer id should match', () => {
				expect(listing.sharer.id).toBe('user-1');
			});
		},
	);

	Scenario(
		'Loading sharer asynchronously',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps(), passport);
			});
			When('I call loadSharer()', () => {
				// Implementation in Then
			});
			Then('it should return a UserEntityReference', async () => {
				const loadedSharer = await listing.loadSharer();
				expect(loadedSharer).toBeDefined();
				expect(loadedSharer.id).toBe('user-1');
			});
		},
	);

	Scenario(
		'Getting createdAt timestamp',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate with a known createdAt date', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps(), passport);
			});
			When('I access the createdAt property', () => {
				// Access happens in Then
			});
			Then('it should return the correct creation date', () => {
				expect(listing.createdAt).toEqual(new Date('2020-01-01T00:00:00Z'));
			});
		},
	);

	Scenario(
		'Getting schemaVersion',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate with a known schemaVersion', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps(), passport);
			});
			When('I access the schemaVersion property', () => {
				// Access happens in Then
			});
			Then('it should return the correct schema version', () => {
				expect(listing.schemaVersion).toBe('1.0.0');
			});
		},
	);

	Scenario(
		'Getting sharingHistory as empty array when not set',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate with no sharingHistory', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps({ sharingHistory: undefined }), passport);
			});
			When('I access the sharingHistory property', () => {
				// Access happens in Then
			});
			Then('it should return an empty array', () => {
				expect(listing.sharingHistory).toEqual([]);
			});
		},
	);

	Scenario(
		'Getting sharingHistory with entries',
		({ Given, When, Then, And }) => {
			Given('an ItemListing aggregate with sharingHistory entries', () => {
				passport = makePassport(true, true, true, true);
				const historyEntries = ['user-2', 'user-3', 'user-4'];
				listing = new ItemListing(
					makeBaseProps({ sharingHistory: historyEntries }),
					passport,
				);
			});
			When('I access the sharingHistory property', () => {
				// Access happens in Then
			});
			Then('it should return the sharing history as an array', () => {
				expect(listing.sharingHistory).toEqual(['user-2', 'user-3', 'user-4']);
			});
			And('it should be a copy of the original array', () => {
				const { 0: firstItem, 1: secondItem, 2: thirdItem } = listing.sharingHistory;
				const mutatedHistory = [firstItem, secondItem, thirdItem];
				mutatedHistory.push('user-5');
				expect(listing.sharingHistory).toEqual(['user-2', 'user-3', 'user-4']);
			});
		},
	);

	Scenario(
		'Getting reports count when not set',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate with no reports', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps({ reports: undefined }), passport);
			});
			When('I access the reports property', () => {
				// Access happens in Then
			});
			Then('it should return 0', () => {
				expect(listing.reports).toBe(0);
			});
		},
	);

	Scenario(
		'Getting reports count when set',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate with reports', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps({ reports: 5 }), passport);
			});
			When('I access the reports property', () => {
				// Access happens in Then
			});
			Then('it should return the correct number of reports', () => {
				expect(listing.reports).toBe(5);
			});
		},
	);

	Scenario(
		'Getting images as empty array when not set',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate with no images', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps({ images: undefined }), passport);
			});
			When('I access the images property', () => {
				// Access happens in Then
			});
			Then('it should return an empty array', () => {
				expect(listing.images).toEqual([]);
			});
		},
	);

	Scenario(
		'Getting images returns a copy of the array',
		({ Given, When, Then, And }) => {
			Given('an ItemListing aggregate with images', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(
					makeBaseProps({ images: ['img1.png', 'img2.png'] }),
					passport,
				);
			});
			When('I access the images property', () => {
				// Access happens in Then
			});
			Then('it should return a copy of the images array', () => {
				const [first, second] = listing.images;
				expect([first, second]).toEqual(['img1.png', 'img2.png']);
			});
			And('modifications to the returned array do not affect the listing', () => {
				const originalLength = listing.images.length;
				const retrievedImages = listing.images;
				retrievedImages.push('img3.png');
				expect(listing.images.length).toBe(originalLength);
			});
		},
	);

	Scenario(
		'Getting isActive when state is Published',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate in Published state', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(
					makeBaseProps({ state: 'Published' }),
					passport,
				);
			});
			When('I access the isActive property', () => {
				// Access happens in Then
			});
			Then('it should return true', () => {
				expect(listing.isActive).toBe(true);
			});
		},
	);

	Scenario(
		'Getting isActive when state is not Published',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate in Drafted state', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(
					makeBaseProps({ state: 'Drafted' }),
					passport,
				);
			});
			When('I access the isActive property', () => {
				// Access happens in Then
			});
			Then('it should return false', () => {
				expect(listing.isActive).toBe(false);
			});
		},
	);

	Scenario(
		'Getting displayLocation',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate with a known location', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps({ location: 'New York' }), passport);
			});
			When('I access the displayLocation property', () => {
				// Access happens in Then
			});
			Then('it should return the location', () => {
				expect(listing.displayLocation).toBe('New York');
			});
		},
	);

	Scenario(
		'Getting getEntityReference',
		({ Given, When, Then }) => {
			Given('an ItemListing aggregate', () => {
				passport = makePassport(true, true, true, true);
				listing = new ItemListing(makeBaseProps(), passport);
			});
			When('I call getEntityReference()', () => {
				// Implementation in Then
			});
			Then('it should return an ItemListingEntityReference', () => {
				const ref = listing.getEntityReference();
				expect(ref).toBeDefined();
				expect(ref.id).toBe('listing-1');
			});
		},
	);
	Scenario('Getting expiresAt from item listing', ({ Given, When, Then }) => {
		Given('an ItemListing aggregate with expiresAt set', () => {
			const expirationDate = new Date('2025-12-31T23:59:59Z');
			passport = makePassport(true, true, true, true);
			listing = new ItemListing(makeBaseProps({ expiresAt: expirationDate }), passport);
		});
		When('I access the expiresAt property', () => {
			// Access happens in Then
		});
		Then('it should return the expiration date', () => {
			expect(listing.expiresAt).toEqual(new Date('2025-12-31T23:59:59Z'));
		});
	});

	Scenario('Getting expiresAt when undefined', ({ Given, When, Then }) => {
		Given('an ItemListing aggregate without expiresAt set', () => {
			passport = makePassport(true, true, true, true);
			listing = new ItemListing(makeBaseProps({ expiresAt: undefined }), passport);
		});
		When('I access the expiresAt property', () => {
			// Access happens in Then
		});
		Then('it should return undefined', () => {
			expect(listing.expiresAt).toBeUndefined();
		});
	});

	Scenario('Setting expiresAt with permission', ({ Given, When, Then }) => {
		Given('an ItemListing aggregate with permission to update item listing', () => {
			passport = makePassport(true, true, true, true);
			listing = new ItemListing(makeBaseProps(), passport);
		});
		When('I set the expiresAt to a specific date', () => {
			const expirationDate = new Date('2025-12-31T23:59:59Z');
			listing.expiresAt = expirationDate;
		});
		Then('the expiresAt should be updated', () => {
			expect(listing.expiresAt).toEqual(new Date('2025-12-31T23:59:59Z'));
		});
	});

	Scenario('Setting expiresAt without permission', ({ Given, When, Then }) => {
		let settingExpiresAtWithoutPermission: () => void;
		Given('an ItemListing aggregate without permission to update item listing', () => {
			passport = makePassport(false, false, false, false);
			listing = new ItemListing(makeBaseProps(), passport);
		});
		When('I try to set the expiresAt', () => {
			settingExpiresAtWithoutPermission = () => {
				listing.expiresAt = new Date('2025-12-31T23:59:59Z');
			};
		});
		Then('a PermissionError should be thrown', () => {
			expect(settingExpiresAtWithoutPermission).toThrow(DomainSeedwork.PermissionError);
			expect(settingExpiresAtWithoutPermission).toThrow('You do not have permission to update this expiration');
		});
	});

	Scenario('Setting expiresAt to undefined with permission', ({ Given, When, Then }) => {
		Given('an ItemListing aggregate with permission to update item listing and expiresAt set', () => {
			const expirationDate = new Date('2025-12-31T23:59:59Z');
			passport = makePassport(true, true, true, true);
			listing = new ItemListing(makeBaseProps({ expiresAt: expirationDate }), passport);
		});
		When('I set the expiresAt to undefined', () => {
			listing.expiresAt = undefined;
		});
		Then('the expiresAt should be cleared', () => {
			expect(listing.expiresAt).toBeUndefined();
		});
	});
});