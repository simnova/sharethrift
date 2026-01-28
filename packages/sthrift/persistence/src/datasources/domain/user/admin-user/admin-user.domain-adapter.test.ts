import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import { AdminRoleDomainAdapter } from '../../role/admin-role/admin-role.domain-adapter.ts';
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

	Scenario('Setting role property with missing id throws error', ({ When, Then }) => {
		When('I set the role property to a reference missing id', () => {
			// Test happens in Then block
		});
		Then('an error should be thrown indicating role reference is missing id', () => {
			expect(() => {
				adapter.role = {} as never;
			}).toThrow('role reference is missing id');
		});
	});

	Scenario('Loading role when it is an ObjectId', ({ When, Then }) => {
		When('I call loadRole on an adapter with role as ObjectId', async () => {
			const oid = new MongooseSeedwork.ObjectId();
			doc = makeUserDoc();
			doc.role = oid as unknown as Models.Role.AdminRole;
			doc.populate = vi.fn().mockResolvedValue({
				...doc,
				role: makeRoleDoc(),
			});
			adapter = new AdminUserDomainAdapter(doc);
			result = await adapter.loadRole();
		});
		Then('it should populate and return an AdminRoleDomainAdapter', () => {
			expect(doc.populate).toHaveBeenCalledWith('role');
			expect(result).toBeDefined();
		});
	});

	Scenario('Accessing nested account properties', ({ When, Then }) => {
		When('I access account email, username, and profile properties', () => {
			const account = adapter.account;
			result = {
				email: account.email,
				username: account.username,
				profile: account.profile,
			};
		});
		Then('all nested properties should be accessible', () => {
			expect(result).toBeDefined();
			expect((result as { email: string }).email).toBe('admin@example.com');
			expect((result as { username: string }).username).toBe('adminuser');
			expect((result as { profile: unknown }).profile).toBeDefined();
		});
	});

	Scenario('Accessing nested profile location properties', ({ When, Then }) => {
		When('I access profile location properties', () => {
			const account = adapter.account;
			const profile = account.profile;
			const location = profile.location;
			result = {
				address1: location.address1,
				city: location.city,
				state: location.state,
				country: location.country,
				zipCode: location.zipCode,
			};
		});
		Then('all location properties should be accessible', () => {
			expect(result).toBeDefined();
			expect((result as { address1: string }).address1).toBe('123 Admin St');
			expect((result as { city: string }).city).toBe('Admin City');
			expect((result as { state: string }).state).toBe('CA');
			expect((result as { country: string }).country).toBe('USA');
			expect((result as { zipCode: string }).zipCode).toBe('90210');
		});
	});
});

// Additional non-BDD tests for edge cases
import { describe, it } from 'vitest';

describe('AdminUserDomainAdapter - Additional Coverage', () => {
	it('should initialize profile when undefined', () => {
		const doc = {
			account: {
				profile: undefined,
				set: vi.fn(),
			} as unknown as Models.User.AdminUserAccount,
		} as Models.User.AdminUser;
		const adapter = new AdminUserDomainAdapter(doc);
		const profile = adapter.account.profile;
		expect(profile).toBeDefined();
		expect(doc.account.set).toHaveBeenCalledWith('profile', {});
	});

	it('should initialize location in profile when undefined', () => {
		const doc = {
			account: {
				profile: {
					location: undefined,
					set: vi.fn(),
				} as unknown as Models.User.AdminUserAccountProfile,
			} as Models.User.AdminUserAccount,
		} as Models.User.AdminUser;
		const adapter = new AdminUserDomainAdapter(doc);
		const location = adapter.account.profile.location;
		expect(location).toBeDefined();
		expect(doc.account.profile.set).toHaveBeenCalledWith('location', {});
	});

	it('should throw error when role is null in getter', () => {
		const doc = {} as Models.User.AdminUser;
		doc.role = null as never;
		const adapter = new AdminUserDomainAdapter(doc);
		expect(() => adapter.role).toThrow('role is not populated');
	});

	it('should throw TypeError when role is ObjectId in getter', () => {
		const doc = {} as Models.User.AdminUser;
		const roleId = new MongooseSeedwork.ObjectId();
		doc.role = roleId as never;
		const adapter = new AdminUserDomainAdapter(doc);
		expect(() => adapter.role).toThrow(TypeError);
		expect(() => adapter.role).toThrow('role is not populated');
	});

	it('should throw error when role is null in loadRole', async () => {
		const doc = {} as Models.User.AdminUser;
		doc.role = null as never;
		const adapter = new AdminUserDomainAdapter(doc);
		await expect(adapter.loadRole()).rejects.toThrow('role is not populated');
	});

	it('should set role with entity reference object', () => {
		const doc = {
			set: vi.fn(),
		} as unknown as Models.User.AdminUser;
		const adapter = new AdminUserDomainAdapter(doc);
		const roleId = new MongooseSeedwork.ObjectId().toString();
		const roleEntity = {
			id: roleId,
			name: 'Test Role',
			permissions: [],
		};
		adapter.role = roleEntity as never;
		// It should call set with an ObjectId
		expect(doc.set).toHaveBeenCalled();
		const call = (doc.set as ReturnType<typeof vi.fn>).mock.calls[0];
		expect(call[0]).toBe('role');
		expect(call[1]).toBeInstanceOf(MongooseSeedwork.ObjectId);
	});

	it('should set role with AdminRole instance', () => {
		const doc = {
			set: vi.fn(),
		} as unknown as Models.User.AdminUser;
		const adapter = new AdminUserDomainAdapter(doc);
		const roleDoc = makeRoleDoc();
		const roleAdapter = new AdminRoleDomainAdapter(roleDoc);
		const roleEntity = new Domain.Contexts.User.Role.AdminRole.AdminRole(roleAdapter);
		adapter.role = roleEntity as never;
		expect(doc.set).toHaveBeenCalledWith('role', roleDoc);
	});
});
