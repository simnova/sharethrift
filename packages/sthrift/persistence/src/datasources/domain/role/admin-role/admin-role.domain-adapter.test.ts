import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { expect, vi } from 'vitest';
import { AdminRoleDomainAdapter } from './admin-role.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-role.domain-adapter.feature'),
);

function makeAdminRoleDoc() {
	const base = {
		_id: 'role-1',
		roleName: 'Admin',
		roleType: 'admin',
		isDefault: false,
		permissions: {} as Models.Role.AdminRolePermissions,
		set(key: keyof Models.Role.AdminRole, value: unknown) {
			(this as Models.Role.AdminRole)[key] = value as never;
		},
	} as unknown as Models.Role.AdminRole;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.Role.AdminRole;
	let adapter: AdminRoleDomainAdapter;

	BeforeEachScenario(() => {
		doc = makeAdminRoleDoc();
		adapter = new AdminRoleDomainAdapter(doc);
	});

	Background(({ Given, And }) => {
		Given('an AdminRole document from the database', () => {
			// Document created in BeforeEachScenario
		});
		And('an AdminRoleDomainAdapter wrapping the document', () => {
			// Adapter created in BeforeEachScenario
		});
	});

	Scenario('Accessing admin role properties', ({ Then, And }) => {
		Then('the domain adapter should have a roleName property', () => {
			expect(adapter.roleName).toBeDefined();
		});

		And('the domain adapter should have a roleType property', () => {
			expect(adapter.roleType).toBeDefined();
		});

		And('the domain adapter should have an isDefault property', () => {
			expect(adapter.isDefault).toBeDefined();
		});

		And('the domain adapter should have a permissions property', () => {
			expect(adapter.permissions).toBeDefined();
		});
	});

	Scenario('Modifying admin role name', ({ When, Then }) => {
		When('I set the roleName to "Super Admin"', () => {
			adapter.roleName = 'Super Admin';
		});

		Then('the roleName should be "Super Admin"', () => {
			expect(adapter.roleName).toBe('Super Admin');
		});
	});

	Scenario('Modifying admin role isDefault', ({ When, Then }) => {
		When('I set the isDefault to true', () => {
			adapter.isDefault = true;
		});

		Then('the isDefault should be true', () => {
			expect(adapter.isDefault).toBe(true);
		});
	});
});
