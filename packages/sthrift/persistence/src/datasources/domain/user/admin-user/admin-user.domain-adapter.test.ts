import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { expect, vi } from 'vitest';
import { AdminUserDomainAdapter } from './admin-user.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.domain-adapter.feature'),
);

function makeRoleDoc(
	overrides: Partial<Models.Role.AdminRole> = {},
): Models.Role.AdminRole {
	return {
		id: new MongooseSeedwork.ObjectId(),
		roleName: 'Test Role',
		isDefault: false,
		roleType: 'admin',
		permissions: {
			userPermissions: {
				canManageUsers: true,
				canViewAllUsers: true,
			},
			rolePermissions: {
				canManageRoles: false,
			},
		},
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
		...overrides,
	} as Models.Role.AdminRole;
}

function makeUserDoc(
	overrides: Partial<Models.User.AdminUser> = {},
): Models.User.AdminUser {
	const base = {
		id: new MongooseSeedwork.ObjectId(),
		userType: 'admin-users',
		isBlocked: false,
		account: {
			accountType: 'admin',
			email: 'admin@example.com',
			username: 'adminuser',
			profile: {
				firstName: 'Admin',
				lastName: 'User',
				aboutMe: 'Admin bio',
				location: {
					address1: '123 Admin St',
					address2: null,
					city: 'Admin City',
					state: 'CA',
					country: 'USA',
					zipCode: '90210',
				},
			},
		},
		role: makeRoleDoc(),
		set<K extends keyof Models.User.AdminUser>(
			key: K,
			value: Models.User.AdminUser[K],
		) {
			this[key] = value;
		},
		populate: vi.fn(function (this: Models.User.AdminUser) {
			return this;
		}),
		...overrides,
	} as Models.User.AdminUser;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.User.AdminUser;
	let adapter: AdminUserDomainAdapter;
	let result: unknown;

	BeforeEachScenario(() => {
		doc = makeUserDoc();
		adapter = new AdminUserDomainAdapter(doc);
		result = undefined;
	});

	Background(({ Given }) => {
		Given('a valid AdminUser document', () => {
			doc = makeUserDoc();
			adapter = new AdminUserDomainAdapter(doc);
		});
	});

	Scenario('Getting the userType property', ({ When, Then }) => {
		When('I get the userType property', () => {
			result = adapter.userType;
		});
		Then('it should return the correct value', () => {
			expect(result).toBe('admin-users');
		});
	});

	Scenario('Setting the userType property', ({ When, Then }) => {
		When('I set the userType property to "SuperAdmin"', () => {
			adapter.userType = 'SuperAdmin';
		});
		Then('the document\'s userType should be "SuperAdmin"', () => {
			expect(doc.userType).toBe('SuperAdmin');
		});
	});

	Scenario('Getting the isBlocked property', ({ When, Then }) => {
		When('I get the isBlocked property', () => {
			result = adapter.isBlocked;
		});
		Then('it should return the correct value', () => {
			expect(result).toBe(false);
		});
	});

	Scenario('Setting the isBlocked property', ({ When, Then }) => {
		When('I set the isBlocked property to true', () => {
			adapter.isBlocked = true;
		});
		Then("the document's isBlocked should be true", () => {
			expect(doc.isBlocked).toBe(true);
		});
	});

	Scenario('Getting the account property', ({ When, Then }) => {
		When('I get the account property', () => {
			result = adapter.account;
		});
		Then(
			'it should return an AdminUserAccountDomainAdapter with the correct data',
			() => {
				expect(result).toBeDefined();
				expect((result as { email: string }).email).toBe('admin@example.com');
			},
		);
	});

	Scenario('Getting the role property', ({ When, Then }) => {
		When('I get the role property', () => {
			result = adapter.role;
		});
		Then('it should return the correct role reference', () => {
			expect(result).toBeDefined();
			expect((result as { roleName: string }).roleName).toBe('Test Role');
		});
	});

	Scenario('Setting the role property', ({ When, Then }) => {
		const newRoleId = new MongooseSeedwork.ObjectId();
		When('I set the role property to a new role', () => {
			adapter.role = { id: newRoleId } as never;
		});
		Then("the document's role should be updated", () => {
			expect(doc.role).toBeInstanceOf(MongooseSeedwork.ObjectId);
			expect((doc.role as MongooseSeedwork.ObjectId).toString()).toBe(
				newRoleId.toString(),
			);
		});
	});
});
