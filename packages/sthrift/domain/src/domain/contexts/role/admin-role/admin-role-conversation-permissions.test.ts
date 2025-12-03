import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminRoleConversationPermissions } from './admin-role-conversation-permissions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/admin-role-conversation-permissions.feature',
	),
);

test.for(feature, ({ Scenario }) => {
	const makeConversationPermissions = () =>
		new AdminRoleConversationPermissions({
			canViewAllConversations: true,
			canEditConversations: false,
			canDeleteConversations: false,
			canCloseConversations: true,
			canModerateConversations: true,
		});

	const makeConversationPermissionsAllFalse = () =>
		new AdminRoleConversationPermissions({
			canViewAllConversations: false,
			canEditConversations: false,
			canDeleteConversations: false,
			canCloseConversations: false,
			canModerateConversations: false,
		});

	Scenario(
		'Admin role conversation permissions should have canViewAllConversations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleConversationPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role conversation permissions', () => {
				permissions = makeConversationPermissions();
			});

			When('I access the canViewAllConversations property', () => {
				value = permissions.canViewAllConversations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role conversation permissions should have canEditConversations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleConversationPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role conversation permissions', () => {
				permissions = makeConversationPermissions();
			});

			When('I access the canEditConversations property', () => {
				value = permissions.canEditConversations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role conversation permissions should have canDeleteConversations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleConversationPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role conversation permissions', () => {
				permissions = makeConversationPermissions();
			});

			When('I access the canDeleteConversations property', () => {
				value = permissions.canDeleteConversations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role conversation permissions should have canCloseConversations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleConversationPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role conversation permissions', () => {
				permissions = makeConversationPermissions();
			});

			When('I access the canCloseConversations property', () => {
				value = permissions.canCloseConversations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role conversation permissions should have canModerateConversations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleConversationPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role conversation permissions', () => {
				permissions = makeConversationPermissions();
			});

			When('I access the canModerateConversations property', () => {
				value = permissions.canModerateConversations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Setting canViewAllConversations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleConversationPermissions;

			Given(
				'I have admin role conversation permissions with canViewAllConversations false',
				() => {
					permissions = makeConversationPermissionsAllFalse();
				},
			);

			When('I set canViewAllConversations to true', () => {
				permissions.canViewAllConversations = true;
			});

			Then('canViewAllConversations should be true', () => {
				expect(permissions.canViewAllConversations).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canEditConversations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleConversationPermissions;

			Given(
				'I have admin role conversation permissions with canEditConversations false',
				() => {
					permissions = makeConversationPermissionsAllFalse();
				},
			);

			When('I set canEditConversations to true', () => {
				permissions.canEditConversations = true;
			});

			Then('canEditConversations should be true', () => {
				expect(permissions.canEditConversations).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canDeleteConversations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleConversationPermissions;

			Given(
				'I have admin role conversation permissions with canDeleteConversations false',
				() => {
					permissions = makeConversationPermissionsAllFalse();
				},
			);

			When('I set canDeleteConversations to true', () => {
				permissions.canDeleteConversations = true;
			});

			Then('canDeleteConversations should be true', () => {
				expect(permissions.canDeleteConversations).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canCloseConversations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleConversationPermissions;

			Given(
				'I have admin role conversation permissions with canCloseConversations false',
				() => {
					permissions = makeConversationPermissionsAllFalse();
				},
			);

			When('I set canCloseConversations to true', () => {
				permissions.canCloseConversations = true;
			});

			Then('canCloseConversations should be true', () => {
				expect(permissions.canCloseConversations).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canModerateConversations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleConversationPermissions;

			Given(
				'I have admin role conversation permissions with canModerateConversations false',
				() => {
					permissions = makeConversationPermissionsAllFalse();
				},
			);

			When('I set canModerateConversations to true', () => {
				permissions.canModerateConversations = true;
			});

			Then('canModerateConversations should be true', () => {
				expect(permissions.canModerateConversations).toBe(true);
			});
		},
	);
});
