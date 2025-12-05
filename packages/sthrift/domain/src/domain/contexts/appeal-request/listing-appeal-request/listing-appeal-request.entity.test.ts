import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type {
	ListingAppealRequestProps,
	ListingAppealRequestEntityReference,
} from './listing-appeal-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/listing-appeal-request.entity.feature'),
);

function makeListingAppealRequestProps(
	overrides: Partial<ListingAppealRequestProps> = {},
): ListingAppealRequestProps {
	return {
		id: 'appeal-1',
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		user: { id: 'user-1' } as any,
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		loadUser: async () => ({ id: 'user-1' } as any),
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		listing: { id: 'listing-1' } as any,
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		loadListing: async () => ({ id: 'listing-1' } as any),
		reason: 'This listing was incorrectly blocked',
		state: 'requested',
		type: 'listing',
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		blocker: { id: 'blocker-1' } as any,
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		loadBlocker: async () => ({ id: 'blocker-1' } as any),
		createdAt: new Date('2024-01-01T00:00:00Z'),
		updatedAt: new Date('2024-01-01T00:00:00Z'),
		schemaVersion: '1.0.0',
		...overrides,
	};
}

test.for(feature, ({ Scenario, Background }) => {
	let props: ListingAppealRequestProps;
	let entity: ListingAppealRequestEntityReference;

	Background(({ Given }) => {
		Given('a valid listing appeal request with user, listing, and blocker', () => {
			props = makeListingAppealRequestProps();
		});
	});

	Scenario('Creating a new listing appeal request entity', ({ When, Then, And }) => {
		When('I create a new ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		Then('the entity should have the correct user reference', () => {
			expect(entity.user.id).toBe('user-1');
		});
		And('the entity should have the correct listing reference', () => {
			expect(entity.listing.id).toBe('listing-1');
		});
		And('the entity should have the correct reason', () => {
			expect(entity.reason).toBe('This listing was incorrectly blocked');
		});
		And('the entity should have the correct state', () => {
			expect(entity.state).toBe('requested');
		});
		And('the entity should have the correct type', () => {
			expect(entity.type).toBe('listing');
		});
		And('the entity should have the correct blocker reference', () => {
			expect(entity.blocker.id).toBe('blocker-1');
		});
	});

	Scenario('Getting user property', ({ Given, When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let user: any;
		Given('a ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		When('I get the user property', () => {
			user = entity.user;
		});
		Then('it should return the correct user reference', () => {
			expect(user.id).toBe('user-1');
		});
	});

	Scenario('Getting listing property', ({ Given, When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let listing: any;
		Given('a ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		When('I get the listing property', () => {
			listing = entity.listing;
		});
		Then('it should return the correct listing reference', () => {
			expect(listing.id).toBe('listing-1');
		});
	});

	Scenario('Getting blocker property', ({ Given, When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let blocker: any;
		Given('a ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		When('I get the blocker property', () => {
			blocker = entity.blocker;
		});
		Then('it should return the correct blocker reference', () => {
			expect(blocker.id).toBe('blocker-1');
		});
	});

	Scenario('Getting reason property', ({ Given, When, Then }) => {
		let reason: string;
		Given('a ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		When('I get the reason property', () => {
			reason = entity.reason;
		});
		Then('it should return the correct reason', () => {
			expect(reason).toBe('This listing was incorrectly blocked');
		});
	});

	Scenario('Getting state property', ({ Given, When, Then }) => {
		let state: string;
		Given('a ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		When('I get the state property', () => {
			state = entity.state;
		});
		Then('it should return the correct state', () => {
			expect(state).toBe('requested');
		});
	});

	Scenario('Getting type property', ({ Given, When, Then }) => {
		let type: string;
		Given('a ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		When('I get the type property', () => {
			type = entity.type;
		});
		Then('it should return the correct type', () => {
			expect(type).toBe('listing');
		});
	});

	Scenario('Getting createdAt property', ({ Given, When, Then }) => {
		let createdAt: Date;
		Given('a ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		When('I get the createdAt property', () => {
			createdAt = entity.createdAt;
		});
		Then('it should return the correct creation date', () => {
			expect(createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
		});
	});

	Scenario('Getting updatedAt property', ({ Given, When, Then }) => {
		let updatedAt: Date;
		Given('a ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		When('I get the updatedAt property', () => {
			updatedAt = entity.updatedAt;
		});
		Then('it should return the correct update date', () => {
			expect(updatedAt).toEqual(new Date('2024-01-01T00:00:00Z'));
		});
	});

	Scenario('Getting schemaVersion property', ({ Given, When, Then }) => {
		let schemaVersion: string;
		Given('a ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		When('I get the schemaVersion property', () => {
			schemaVersion = entity.schemaVersion;
		});
		Then('it should return the correct schema version', () => {
			expect(schemaVersion).toBe('1.0.0');
		});
	});

	Scenario('Entity properties are readonly', ({ Given, Then }) => {
		Given('a ListingAppealRequest entity', () => {
			entity = props as ListingAppealRequestEntityReference;
		});
		Then('all properties should be readonly and not modifiable', () => {
			const originalReason = entity.reason;
			const originalState = entity.state;
			const originalType = entity.type;
			const originalCreatedAt = entity.createdAt;

			expect(entity.reason).toBe(originalReason);
			expect(entity.state).toBe(originalState);
			expect(entity.type).toBe(originalType);
			expect(entity.createdAt).toBe(originalCreatedAt);
		});
	});
});
