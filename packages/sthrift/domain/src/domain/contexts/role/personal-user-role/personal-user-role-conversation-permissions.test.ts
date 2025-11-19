import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import {
	PersonalUserRoleConversationPermissions,
	type PersonalUserRoleConversationPermissionsProps,
} from './personal-user-role-conversation-permissions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-role-conversation-permissions.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeConversationPermissionsProps(overrides?: Partial<PersonalUserRoleConversationPermissionsProps>): any {
	return {
		canCreateConversation: true,
		canManageConversation: true,
		canViewConversation: true,
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;
	let permissions: PersonalUserRoleConversationPermissions;

	Background(({ Given }) => {
		Given('I have conversation permissions props', () => {
			props = makeConversationPermissionsProps();
		});
	});

	Scenario('Conversation permissions canCreateConversation should be a boolean', ({ When, Then }) => {
		When('I create a PersonalUserRoleConversationPermissions instance', () => {
			permissions = new PersonalUserRoleConversationPermissions(props);
		});

		Then('canCreateConversation should be a boolean', () => {
			expect(typeof permissions.canCreateConversation).toBe('boolean');
			expect(permissions.canCreateConversation).toBe(true);
		});
	});

	Scenario('Conversation permissions canManageConversation should be a boolean', ({ When, Then }) => {

		When('I create a PersonalUserRoleConversationPermissions instance', () => {
			permissions = new PersonalUserRoleConversationPermissions(props);
		});

		Then('canManageConversation should be a boolean', () => {
			expect(typeof permissions.canManageConversation).toBe('boolean');
			expect(permissions.canManageConversation).toBe(true);
		});
	});

	Scenario('Conversation permissions canViewConversation should be a boolean', ({ When, Then }) => {

		When('I create a PersonalUserRoleConversationPermissions instance', () => {
			permissions = new PersonalUserRoleConversationPermissions(props);
		});

		Then('canViewConversation should be a boolean', () => {
			expect(typeof permissions.canViewConversation).toBe('boolean');
			expect(permissions.canViewConversation).toBe(true);
		});
	});

	Scenario('Conversation permissions should support setter methods', ({ When, Then }) => {
		When('I create a PersonalUserRoleConversationPermissions instance and modify values', () => {
			permissions = new PersonalUserRoleConversationPermissions(props);
			permissions.canCreateConversation = false;
			permissions.canManageConversation = true;
			permissions.canViewConversation = false;
		});

		Then('the values should be updated', () => {
			expect(permissions.canCreateConversation).toBe(false);
			expect(permissions.canManageConversation).toBe(true);
			expect(permissions.canViewConversation).toBe(false);
		});
	});
});
