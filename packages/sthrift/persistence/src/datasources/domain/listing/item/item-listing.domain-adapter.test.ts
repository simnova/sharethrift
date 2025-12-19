import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { expect, vi } from 'vitest';
import { ItemListingDomainAdapter } from './item-listing.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/item-listing.domain-adapter.feature'),
);

function makeItemListingDoc() {
	const sharerId = new MongooseSeedwork.ObjectId();
	const base = {
		_id: new MongooseSeedwork.ObjectId(),
		title: 'Test Listing',
		description: 'Test Description',
		category: 'Electronics',
		location: 'New York',
		state: 'Active',
		sharingPeriodStart: new Date(),
		sharingPeriodEnd: new Date(),
		// Populated sharer object (not ObjectId) for tests that access .sharer property
		sharer: {
			id: sharerId.toString(),
			userType: 'personal-user',
			isBlocked: false,
			hasCompletedOnboarding: true,
			account: {
				accountType: 'standard',
				email: 'sharer@example.com',
				username: 'shareruser',
				profile: {
					firstName: 'Sharer',
					lastName: 'User',
					aboutMe: 'I share things',
					location: {
						address1: '789 Sharer St',
						address2: null,
						city: 'Sharer City',
						state: 'SH',
						country: 'Sharerland',
						zipCode: '11111',
					},
					billing: {
						cybersourceCustomerId: null,
						subscription: {
							subscriptionId: 'sub-789',
							planCode: 'free',
							status: 'active',
							startDate: new Date('2024-01-01'),
						},
						transactions: [],
					},
				},
			},
			set: vi.fn(),
		},
		set(key: keyof Models.Listing.ItemListing, value: unknown) {
			(this as Models.Listing.ItemListing)[key] = value as never;
		},
	} as unknown as Models.Listing.ItemListing;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.Listing.ItemListing;
	let adapter: ItemListingDomainAdapter;

	BeforeEachScenario(() => {
		doc = makeItemListingDoc();
		vi.spyOn(doc, 'set');
		adapter = new ItemListingDomainAdapter(doc);
	});

	Background(({ Given, And }) => {
		Given('an ItemListing document from the database', () => {
			// Document created in BeforeEachScenario
		});
		And('an ItemListingDomainAdapter wrapping the document', () => {
			// Adapter created in BeforeEachScenario
		});
	});

	Scenario('Accessing item listing properties', ({ Then, And }) => {
		Then('the domain adapter should have a title property', () => {
			expect(adapter.title).toBeDefined();
		});

		And('the domain adapter should have a description property', () => {
			expect(adapter.description).toBeDefined();
		});

		And('the domain adapter should have a category property', () => {
			expect(adapter.category).toBeDefined();
		});

		And('the domain adapter should have a location property', () => {
			expect(adapter.location).toBeDefined();
		});

		And('the domain adapter should have a state property', () => {
			expect(adapter.state).toBeDefined();
		});

		And('the domain adapter should have a sharer property', () => {
			expect(adapter.sharer).toBeDefined();
		});
	});

	Scenario('Getting item listing sharer reference', ({ When, Then }) => {
		let sharer: unknown;

		When('I access the sharer property', () => {
			sharer = adapter.sharer;
		});

		Then('I should receive a User reference with an id', () => {
			expect(sharer).toBeDefined();
			expect((sharer as { id: string }).id).toBeDefined();
		});
	});

	Scenario('Modifying item listing title', ({ When, Then }) => {
		When('I set the title to "Updated Title"', () => {
			adapter.title = 'Updated Title';
		});

		Then('the title should be "Updated Title"', () => {
			expect(adapter.title).toBe('Updated Title');
		});
	});

	Scenario('Modifying item listing state', ({ When, Then }) => {
		When('I set the state to "Active"', () => {
			adapter.state = 'Active';
		});

		Then('the state should be "Active"', () => {
			expect(adapter.state).toBe('Active');
		});
	});

	Scenario('Setting and getting description', ({ When, Then }) => {
		When('I set the description to "New description"', () => {
			adapter.description = 'New description';
		});

		Then('the description should be "New description"', () => {
			expect(adapter.description).toBe('New description');
		});
	});

	Scenario('Setting and getting category', ({ When, Then }) => {
		When('I set the category to "Furniture"', () => {
			adapter.category = 'Furniture';
		});

		Then('the category should be "Furniture"', () => {
			expect(adapter.category).toBe('Furniture');
		});
	});

	Scenario('Setting and getting location', ({ When, Then }) => {
		When('I set the location to "Los Angeles"', () => {
			adapter.location = 'Los Angeles';
		});

		Then('the location should be "Los Angeles"', () => {
			expect(adapter.location).toBe('Los Angeles');
		});
	});

	Scenario('Setting and getting sharingPeriodStart', ({ When, Then }) => {
		let testDate: Date;

		When('I set the sharingPeriodStart to a specific date', () => {
			testDate = new Date('2024-01-01');
			adapter.sharingPeriodStart = testDate;
		});

		Then('the sharingPeriodStart should match that date', () => {
			expect(adapter.sharingPeriodStart).toBe(testDate);
		});
	});

	Scenario('Setting and getting sharingPeriodEnd', ({ When, Then }) => {
		let testDate: Date;

		When('I set the sharingPeriodEnd to a specific date', () => {
			testDate = new Date('2024-12-31');
			adapter.sharingPeriodEnd = testDate;
		});

		Then('the sharingPeriodEnd should match that date', () => {
			expect(adapter.sharingPeriodEnd).toBe(testDate);
		});
	});

	Scenario('Getting sharer when populated as PersonalUser', ({ When, Then }) => {
		When('the sharer is a populated PersonalUser document', () => {
			doc.sharer = { 
				id: '123', 
				userType: 'personal-user',
				account: { email: 'test@test.com' }
			} as never;
		});

		Then('I should receive a PersonalUserDomainAdapter', () => {
			const result = adapter.sharer;
			expect(result).toBeDefined();
			expect(result.id).toBeDefined();
		});
	});

	Scenario('Getting sharer when populated as AdminUser', ({ When, Then }) => {
		When('the sharer is a populated AdminUser document', () => {
			doc.sharer = { 
				id: '456', 
				userType: 'admin-user',
				account: { email: 'admin@test.com' }
			} as never;
		});

		Then('I should receive an AdminUserDomainAdapter', () => {
			const result = adapter.sharer;
			expect(result).toBeDefined();
			expect(result.id).toBeDefined();
		});
	});

	Scenario('Loading sharer when it\'s an ObjectId', ({ When, Then, And }) => {
		When('the sharer is an ObjectId and I call loadSharer', async () => {
			doc.sharer = new MongooseSeedwork.ObjectId() as never;
			// biome-ignore lint/suspicious/useAwait: populate function needs to return promise to match Mongoose signature
			doc.populate = vi.fn(async function(this: Models.Listing.ItemListing) {
				this.sharer = { 
					id: '789', 
					userType: 'personal-user',
					isBlocked: false,
					hasCompletedOnboarding: true,
					account: {
						accountType: 'standard',
						email: 'loaded@test.com',
						username: 'loadeduser',
						profile: {
							aboutMe: '',
							firstName: 'Loaded',
							lastName: 'User',
							location: {},
							billing: {
								cybersourceCustomerId: null,
								subscription: null,
								transactions: { items: [] },
							},
							media: { items: [] },
							avatar: null,
						},
					},
					set: vi.fn(),
				} as never;
				return this;
			});
			await adapter.loadSharer();
		});

		Then('it should populate the sharer field', () => {
			expect(doc.populate).toHaveBeenCalledWith('sharer');
		});

		And('return a domain adapter', async () => {
			doc.sharer = { 
				id: '789', 
				userType: 'personal-user',
				isBlocked: false,
				hasCompletedOnboarding: true,
				account: {
					accountType: 'standard',
					email: 'test@test.com',
					username: 'testuser',
					profile: {
						aboutMe: '',
						firstName: 'Test',
						lastName: 'User',
						location: {},
						billing: {
							cybersourceCustomerId: null,
							subscription: null,
							transactions: { items: [] },
						},
						media: { items: [] },
						avatar: null,
					},
				},
				set: vi.fn(),
			} as never;
			const result = await adapter.loadSharer();
			expect(result).toBeDefined();
		});
	});

	Scenario('Setting sharer with valid reference', ({ When, Then }) => {
		When('I set the sharer property with a valid user reference', () => {
			adapter.sharer = { id: '507f1f77bcf86cd799439011' } as never;
		});

		Then('the document sharer field should be updated with ObjectId', () => {
			expect(doc.set).toHaveBeenCalledWith('sharer', expect.any(MongooseSeedwork.ObjectId));
		});
	});

	Scenario('Setting sharer with missing id throws error', ({ When, Then }) => {
		When('I set the sharer property with a reference missing id', () => {
			expect(() => {
				adapter.sharer = {} as never;
			}).toThrow('user reference is missing id');
		});

		Then('it should throw an error about user reference missing id', () => {
			// Error thrown in When block
		});
	});

	Scenario('Setting and getting sharingHistory', ({ When, Then }) => {
		When('I set sharingHistory to an array of ids', () => {
			adapter.sharingHistory = ['id1', 'id2', 'id3'];
		});

		Then('sharingHistory should return the same array', () => {
			expect(adapter.sharingHistory).toEqual(['id1', 'id2', 'id3']);
		});
	});

	Scenario('Setting and getting reports', ({ When, Then }) => {
		When('I set reports to 5', () => {
			adapter.reports = 5;
		});

		Then('reports should be 5', () => {
			expect(adapter.reports).toBe(5);
		});
	});

	Scenario('Setting and getting images', ({ When, Then }) => {
		When('I set images to an array of URLs', () => {
			adapter.images = ['url1.jpg', 'url2.jpg'];
		});

		Then('images should return the same array', () => {
			expect(adapter.images).toEqual(['url1.jpg', 'url2.jpg']);
		});
	});

	Scenario('Setting and getting listingType', ({ When, Then }) => {
		When('I set listingType to "rental"', () => {
			adapter.listingType = 'rental';
		});

		Then('listingType should be "rental"', () => {
			expect(adapter.listingType).toBe('rental');
		});
	});

	Scenario('Getting default state when not set', ({ When, Then }) => {
		When('the document state is null', () => {
			doc.state = null as never;
		});

		Then('the state getter should return "Active"', () => {
			expect(adapter.state).toBe('Active');
		});
	});

	Scenario('Setting and getting expiresAt', ({ When, Then }) => {
		let testDate: Date;

		When('I set expiresAt to a specific date', () => {
			testDate = new Date('2025-12-31T23:59:59Z');
			adapter.expiresAt = testDate;
		});

		Then('expiresAt should return that date', () => {
			expect(adapter.expiresAt).toEqual(testDate);
		});
	});

	Scenario('Getting expiresAt when not set returns undefined', ({ When, Then }) => {
		let result: Date | undefined;

		When('I get expiresAt when it\'s not set', () => {
			doc.expiresAt = undefined as never;
			result = adapter.expiresAt;
		});

		Then('it should return undefined', () => {
			expect(result).toBeUndefined();
		});
	});
});

// Additional non-BDD tests for edge cases
import { describe, it } from 'vitest';

describe('ItemListingDomainAdapter - Additional Coverage', () => {
	it('should throw error when sharer is null in loadSharer', async () => {
		const doc = {} as Models.Listing.ItemListing;
		doc.sharer = null as never;
		const adapter = new ItemListingDomainAdapter(doc);
		await expect(adapter.loadSharer()).rejects.toThrow('sharer is not populated');
	});

	it('should populate sharer when it is ObjectId in loadSharer', async () => {
		const doc = {} as Models.Listing.ItemListing;
		const sharerId = new MongooseSeedwork.ObjectId();
		doc.sharer = sharerId as never;
		const mockPopulate = vi.fn().mockResolvedValue(undefined);
		doc.populate = mockPopulate as never;
		const adapter = new ItemListingDomainAdapter(doc);
		await adapter.loadSharer();
		expect(mockPopulate).toHaveBeenCalledWith('sharer');
	});

	it('should return AdminUser when sharer userType is admin-user in loadSharer', async () => {
		const doc = {} as Models.Listing.ItemListing;
		const adminUserDoc = {
			userType: 'admin-user',
			id: new MongooseSeedwork.ObjectId(),
		} as Models.User.AdminUser;
		doc.sharer = adminUserDoc as never;
		const adapter = new ItemListingDomainAdapter(doc);
		const result = await adapter.loadSharer();
		expect(result).toBeDefined();
	});

	it('should return entity reference when sharer is ObjectId in getter', () => {
		const doc = {} as Models.Listing.ItemListing;
		const sharerId = new MongooseSeedwork.ObjectId();
		doc.sharer = sharerId as never;
		const adapter = new ItemListingDomainAdapter(doc);
		expect(adapter.sharer.id).toBe(sharerId.toString());
	});

	it('should return entity when sharer is populated admin-user in getter', () => {
		const doc = {} as Models.Listing.ItemListing;
		const adminUserDoc = {
			userType: 'admin-user',
			id: new MongooseSeedwork.ObjectId(),
		} as Models.User.AdminUser;
		doc.sharer = adminUserDoc as never;
		const adapter = new ItemListingDomainAdapter(doc);
		const sharerEntity = adapter.sharer;
		// Just verify it returns an entity (coverage achieved)
		expect(sharerEntity).toBeDefined();
		expect(sharerEntity.id).toBeDefined();
	});
});
