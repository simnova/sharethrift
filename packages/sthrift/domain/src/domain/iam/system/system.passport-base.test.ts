import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { SystemPassportBase, type PermissionsSpec } from './system.passport-base.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/system.passport-base.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Creating SystemPassportBase with no permissions', ({ Given, When, And, Then }) => {
		class TestSystemPassport extends SystemPassportBase {
			getPermissions() {
				return this.permissions;
			}
		}
		let instance: TestSystemPassport;
		let permissions: unknown;

		Given('I have no permissions', () => {
			// No permissions needed
		});

		When('I create a SystemPassportBase with no permissions', () => {
			instance = new TestSystemPassport();
		});

		And('I access the protected permissions property', () => {
			permissions = instance.getPermissions();
		});

		Then('it should return an empty permissions object', () => {
			expect(permissions).toEqual({});
		});
	});

	Scenario('Creating SystemPassportBase with provided permissions', ({ Given, When, And, Then }) => {
		class TestSystemPassport extends SystemPassportBase {
			getPermissions() {
				return this.permissions;
			}
		}
		let instance: TestSystemPassport;
		let permissions: unknown;
		const providedPermissions: Partial<PermissionsSpec> = { canCreateItemListing: true, canCreateUser: false };

		Given('I have a permissions object with canManageListings true and canManageUsers false', () => {
			// Permissions already defined
		});

		When('I create a SystemPassportBase with these permissions', () => {
			instance = new TestSystemPassport(providedPermissions);
		});

		And('I access the protected permissions property', () => {
			permissions = instance.getPermissions();
		});

		Then('it should return the same permissions object', () => {
			expect(permissions).toEqual(providedPermissions);
		});
	});

	Scenario('Creating SystemPassportBase with partial permissions', ({ Given, When, And, Then }) => {
		class TestSystemPassport extends SystemPassportBase {
			getPermissions() {
				return this.permissions;
			}
		}
		let instance: TestSystemPassport;
		let permissions: unknown;
		const partialPermissions: Partial<PermissionsSpec> = { canCreateConversation: true };

		Given('I have a partial permissions object with only canManageConversations true', () => {
			// Partial permissions already defined
		});

		When('I create a SystemPassportBase with these permissions', () => {
			instance = new TestSystemPassport(partialPermissions);
		});

		And('I access the protected permissions property', () => {
			permissions = instance.getPermissions();
		});

		Then('it should return the partial permissions object', () => {
			expect(permissions).toEqual(partialPermissions);
		});
	});

	Scenario('Creating SystemPassportBase with undefined permissions', ({ Given, When, And, Then }) => {
		class TestSystemPassport extends SystemPassportBase {
			getPermissions() {
				return this.permissions;
			}
		}
		let instance: TestSystemPassport;
		let permissions: unknown;

		Given('I pass undefined as permissions', () => {
			// Undefined will be passed
		});

		When('I create a SystemPassportBase with undefined permissions', () => {
			instance = new TestSystemPassport(undefined);
		});

		And('I access the protected permissions property', () => {
			permissions = instance.getPermissions();
		});

		Then('it should return an empty permissions object', () => {
			expect(permissions).toEqual({});
		});
	});
});
