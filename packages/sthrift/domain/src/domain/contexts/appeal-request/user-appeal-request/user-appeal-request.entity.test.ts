import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type {
	UserAppealRequestProps,
	UserAppealRequestEntityReference,
} from './user-appeal-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/user-appeal-request.entity.feature'),
);

function makeUserAppealRequestProps(
	overrides: Partial<UserAppealRequestProps> = {},
): UserAppealRequestProps {
	return {
		id: 'appeal-1',
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		user: { id: 'user-1' } as any,
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		loadUser: async () => ({ id: 'user-1' } as any),
		reason: 'This user was incorrectly blocked',
		state: 'requested',
		type: 'user',
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
	let props: UserAppealRequestProps;
	let entity: UserAppealRequestEntityReference;

	Background(({ Given }) => {
		Given('a valid user appeal request with user and blocker', () => {
			props = makeUserAppealRequestProps();
		});
	});

	Scenario('Creating a new user appeal request entity', ({ When, Then, And }) => {
		When('I create a new UserAppealRequest entity', () => {
			entity = props as UserAppealRequestEntityReference;
		});
		Then('the entity should have the correct user reference', () => {
			expect(entity.user.id).toBe('user-1');
		});
		And('the entity should have the correct reason', () => {
			expect(entity.reason).toBe('This user was incorrectly blocked');
		});
		And('the entity should have the correct state', () => {
			expect(entity.state).toBe('requested');
		});
		And('the entity should have the correct type', () => {
			expect(entity.type).toBe('user');
		});
		And('the entity should have the correct blocker reference', () => {
			expect(entity.blocker.id).toBe('blocker-1');
		});
	});

	Scenario('Getting user property', ({ Given, When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let user: any;
		Given('a UserAppealRequest entity', () => {
			entity = props as UserAppealRequestEntityReference;
		});
		When('I get the user property', () => {
			user = entity.user;
		});
		Then('it should return the correct user reference', () => {
			expect(user.id).toBe('user-1');
		});
	});

	Scenario('Entity properties are readonly', ({ Given, Then }) => {
		Given('a UserAppealRequest entity', () => {
			entity = props as UserAppealRequestEntityReference;
		});
		Then('all properties should be readonly and not modifiable', () => {
			const originalReason = entity.reason;
			const originalState = entity.state;
			expect(entity.reason).toBe(originalReason);
			expect(entity.state).toBe(originalState);
		});
	});
});
