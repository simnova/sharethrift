import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { describe, expect, it, vi } from 'vitest';
import { ListingAppealRequestDomainAdapter } from './listing-appeal-request.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/listing-appeal-request.domain-adapter.feature'),
);

function makeAppealRequestDoc() {
	const userId = new MongooseSeedwork.ObjectId();
	const listingId = new MongooseSeedwork.ObjectId();
	const blockerId = new MongooseSeedwork.ObjectId();
	const base = {
		id: new MongooseSeedwork.ObjectId(),
		reason: 'Test reason',
		state: 'pending',
		type: 'inappropriate',
		// Populated user object (not ObjectId) for tests that access .user property
		user: {
			id: userId.toString(),
			userType: 'personal-user',
			isBlocked: false,
			hasCompletedOnboarding: true,
			account: {
				accountType: 'standard',
				email: 'test@example.com',
				username: 'testuser',
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
						cybersourceCustomerId: null,
						subscription: {
							subscriptionId: 'sub-123',
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
		// Populated listing object for tests that access .listing property
		listing: {
			id: listingId.toString(),
			title: 'Test Listing',
			description: 'Test Description',
			state: 'active',
			sharer: {
				id: userId.toString(),
				userType: 'personal-user',
			},
		},
		// Populated blocker object for tests that access .blocker property
		blocker: {
			id: blockerId.toString(),
			userType: 'personal-user',
			isBlocked: false,
			hasCompletedOnboarding: true,
			account: {
				accountType: 'admin',
				email: 'admin@example.com',
				username: 'adminuser',
				profile: {
					firstName: 'Admin',
					lastName: 'User',
					aboutMe: 'Admin user',
					location: {
						address1: '456 Admin St',
						address2: null,
						city: 'Admin City',
						state: 'AD',
						country: 'Adminland',
						zipCode: '67890',
					},
					billing: {
						cybersourceCustomerId: null,
						subscription: {
							subscriptionId: 'sub-456',
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
		createdAt: new Date(),
		updatedAt: new Date(),
		set(key: keyof Models.AppealRequest.ListingAppealRequest, value: unknown) {
			(this as Models.AppealRequest.ListingAppealRequest)[key] = value as never;
		},
		populate: vi.fn(function (this: Models.AppealRequest.ListingAppealRequest) {
			return this;
		}),
	} as unknown as Models.AppealRequest.ListingAppealRequest;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.AppealRequest.ListingAppealRequest;
	let adapter: ListingAppealRequestDomainAdapter;

	BeforeEachScenario(() => {
		doc = makeAppealRequestDoc();
		vi.spyOn(doc, 'set');
		adapter = new ListingAppealRequestDomainAdapter(doc);
	});	Background(({ Given }) => {
		Given('a valid ListingAppealRequest document', () => {
			// Setup happens in BeforeEachScenario
		});
	});

	Scenario('Getting the userId property', ({ When, Then }) => {
		When('I get the userId property', () => {
			// Property access is tested in Then
		});

		Then('it should return the correct value', () => {
			expect(adapter.user).toBeDefined();
			expect(adapter.user.id).toBeDefined();
		});
	});

	Scenario('Getting the listingId property', ({ When, Then }) => {
		When('I get the listingId property', () => {
			// Property access is tested in Then
		});

		Then('it should return the correct value', () => {
			expect(adapter.listing).toBeDefined();
			expect(adapter.listing.id).toBeDefined();
		});
	});

	Scenario('Getting the reason property', ({ When, Then }) => {
		When('I get the reason property', () => {
			// Property access is tested in Then
		});

		Then('it should return the correct value', () => {
			expect(adapter.reason).toBe('Test reason');
		});
	});

	Scenario('Getting the blockerId property', ({ When, Then }) => {
		When('I get the blockerId property', () => {
			// Property access is tested in Then
		});

		Then('it should return the correct value', () => {
			expect(adapter.blocker).toBeDefined();
			expect(adapter.blocker.id).toBeDefined();
		});
	});

	Scenario('Setting the user property with valid reference', ({ When, Then }) => {
		When('I set the user property with a valid reference', () => {
			adapter.user = { id: '507f1f77bcf86cd799439011' } as never;
		});

		Then('the document user field should be updated', () => {
			expect(doc.set).toHaveBeenCalledWith('user', expect.any(MongooseSeedwork.ObjectId));
		});
	});

	Scenario('Setting the user property with missing id throws error', ({ When, Then }) => {
		When('I set the user property with a reference missing id', () => {
			expect(() => {
				adapter.user = {} as never;
			}).toThrow('user reference is missing id');
		});

		Then('it should throw an error about missing id', () => {
			// Error thrown in When block
		});
	});

	Scenario('Setting the listing property with valid reference', ({ When, Then }) => {
		When('I set the listing property with a valid reference', () => {
			adapter.listing = { id: '507f1f77bcf86cd799439022' } as never;
		});

		Then('the document listing field should be updated', () => {
			expect(doc.set).toHaveBeenCalledWith('listing', expect.any(MongooseSeedwork.ObjectId));
		});
	});

	Scenario('Setting the listing property with missing id throws error', ({ When, Then }) => {
		When('I set the listing property with a reference missing id', () => {
			expect(() => {
				adapter.listing = {} as never;
			}).toThrow('listing reference is missing id');
		});

		Then('it should throw an error about missing id', () => {
			// Error thrown in When block
		});
	});

	Scenario('Setting the blocker property with valid reference', ({ When, Then }) => {
		When('I set the blocker property with a valid reference', () => {
			adapter.blocker = { id: '507f1f77bcf86cd799439033' } as never;
		});

		Then('the document blocker field should be updated', () => {
			expect(doc.set).toHaveBeenCalledWith('blocker', expect.any(MongooseSeedwork.ObjectId));
		});
	});

	Scenario('Setting the blocker property with missing id throws error', ({ When, Then }) => {
		When('I set the blocker property with a reference missing id', () => {
			expect(() => {
				adapter.blocker = {} as never;
			}).toThrow('blocker reference is missing id');
		});

		Then('it should throw an error about missing id', () => {
			// Error thrown in When block
		});
	});

	Scenario('Loading user when populated as ObjectId', ({ When, Then, And }) => {
		When('the user is an ObjectId and I call loadUser', async () => {
			doc.user = new MongooseSeedwork.ObjectId() as never;
			const populatedUser = {
				id: '123',
				userType: 'personal-user',
				isBlocked: false,
				hasCompletedOnboarding: true,
				account: {
					accountType: 'standard',
					email: 'test@example.com',
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
			};
			doc.populate = vi.fn().mockImplementation(() => {
				doc.user = populatedUser as never;
				return Promise.resolve(doc);
			});
			await adapter.loadUser();
		});

		Then('it should populate the user field', () => {
			expect(doc.populate).toHaveBeenCalledWith('user');
		});

		And('return a PersonalUserDomainAdapter', async () => {
			const result = await adapter.loadUser();
			expect(result).toBeDefined();
		});
	});

	Scenario('Loading listing when populated as ObjectId', ({ When, Then, And }) => {
		When('the listing is an ObjectId and I call loadListing', async () => {
			doc.listing = new MongooseSeedwork.ObjectId() as never;
			await adapter.loadListing();
		});

		Then('it should populate the listing field', () => {
			expect(doc.populate).toHaveBeenCalledWith('listing');
		});

		And('return an ItemListingDomainAdapter', async () => {
			doc.listing = { id: '123', title: 'Test' } as never;
			const result = await adapter.loadListing();
			expect(result).toBeDefined();
		});
	});

	Scenario('Loading blocker when populated as ObjectId', ({ When, Then, And }) => {
		When('the blocker is an ObjectId and I call loadBlocker', async () => {
			doc.blocker = new MongooseSeedwork.ObjectId() as never;
			const populatedBlocker = {
				id: '123',
				userType: 'personal-user',
				isBlocked: false,
				hasCompletedOnboarding: true,
				account: {
					accountType: 'standard',
					email: 'blocker@example.com',
					username: 'blockeruser',
					profile: {
						aboutMe: '',
						firstName: 'Blocker',
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
			};
			doc.populate = vi.fn().mockImplementation(() => {
				doc.blocker = populatedBlocker as never;
				return Promise.resolve(doc);
			});
			await adapter.loadBlocker();
		});

		Then('it should populate the blocker field', () => {
			expect(doc.populate).toHaveBeenCalledWith('blocker');
		});

		And('return a PersonalUserDomainAdapter', async () => {
			const result = await adapter.loadBlocker();
			expect(result).toBeDefined();
		});
	});

	Scenario('Setting and getting reason property', ({ When, Then }) => {
		When('I set the reason to "New reason"', () => {
			adapter.reason = 'New reason';
		});

		Then('the reason should be "New reason"', () => {
			expect(adapter.reason).toBe('New reason');
			expect(doc.reason).toBe('New reason');
		});
	});

	Scenario('Setting and getting state property', ({ When, Then }) => {
		When('I set the state to "accepted"', () => {
			adapter.state = 'accepted';
		});

		Then('the state should be "accepted"', () => {
			expect(adapter.state).toBe('accepted');
			expect(doc.state).toBe('accepted');
		});
	});

	Scenario('Getting type property', ({ When, Then }) => {
		When('I get the type property', () => {
			// Property access tested in Then
		});

		Then('it should return the document type value', () => {
			expect(adapter.type).toBe('inappropriate');
		});
	});
});

// Additional non-BDD tests for edge cases
describe('ListingAppealRequestDomainAdapter - Additional Coverage', () => {
	it('should return entity reference when blocker is ObjectId', () => {
		const doc = makeAppealRequestDoc();
		const blockerId = new MongooseSeedwork.ObjectId();
		doc.blocker = blockerId as never;
		const adapter = new ListingAppealRequestDomainAdapter(doc as never);
		const result = adapter.blocker;
		expect(result).toBeDefined();
		expect(result.id).toBe(blockerId.toString());
	});

	it('should throw error when blocker is null in getter', () => {
		const doc = makeAppealRequestDoc();
		doc.blocker = null as never;
		const adapter = new ListingAppealRequestDomainAdapter(doc as never);
		expect(() => adapter.blocker).toThrow('blocker is not populated');
	});

	it('should throw error when blocker is null in loadBlocker', async () => {
		const doc = makeAppealRequestDoc();
		doc.blocker = null as never;
		const adapter = new ListingAppealRequestDomainAdapter(doc as never);
		await expect(adapter.loadBlocker()).rejects.toThrow('blocker is not populated');
	});

	it('should populate blocker when it is ObjectId in loadBlocker', async () => {
		const doc = makeAppealRequestDoc();
		const blockerId = new MongooseSeedwork.ObjectId();
		doc.blocker = blockerId as never;
		const mockPopulate = vi.fn().mockResolvedValue(undefined);
		doc.populate = mockPopulate as never;
		const adapter = new ListingAppealRequestDomainAdapter(doc as never);
		await adapter.loadBlocker();
		expect(mockPopulate).toHaveBeenCalledWith('blocker');
	});

	it('should throw error when user is null in getter', () => {
		const doc = makeAppealRequestDoc();
		doc.user = null as never;
		const adapter = new ListingAppealRequestDomainAdapter(doc as never);
		expect(() => adapter.user).toThrow('user is not populated');
	});

	it('should throw error when user is null in loadUser', async () => {
		const doc = makeAppealRequestDoc();
		doc.user = null as never;
		const adapter = new ListingAppealRequestDomainAdapter(doc as never);
		await expect(adapter.loadUser()).rejects.toThrow('user is not populated');
	});

	it('should throw error when listing is null in getter', () => {
		const doc = makeAppealRequestDoc();
		doc.listing = null as never;
		const adapter = new ListingAppealRequestDomainAdapter(doc as never);
		expect(() => adapter.listing).toThrow('listing is not populated');
	});

	it('should return entity reference with ID when listing is ObjectId in getter', () => {
		const doc = makeAppealRequestDoc();
		const listingId = new MongooseSeedwork.ObjectId();
		doc.listing = listingId as never;
		const adapter = new ListingAppealRequestDomainAdapter(doc as never);
		const result = adapter.listing;
		expect(result.id).toBe(listingId.toString());
	});

	it('should throw error when listing is null in loadListing', async () => {
		const doc = makeAppealRequestDoc();
		doc.listing = null as never;
		const adapter = new ListingAppealRequestDomainAdapter(doc as never);
		await expect(adapter.loadListing()).rejects.toThrow('listing is not populated');
	});
});
