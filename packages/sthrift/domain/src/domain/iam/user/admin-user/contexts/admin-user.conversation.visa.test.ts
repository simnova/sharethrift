import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { AdminUserConversationVisa } from './admin-user.conversation.visa.ts';
import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/index.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.conversation.visa.feature'),
);

function makeAdminUser(
	canEditUsers = false,
	canModerateListings = false,
	canViewAllUsers = false,
): AdminUserEntityReference {
	return vi.mocked({
		id: 'admin-1',
		isBlocked: false,
		role: {
			permissions: {
				userPermissions: {
					canEditUsers,
					canViewAllUsers,
				},
				listingPermissions: {
					canModerateListings,
				},
			},
		},
	} as unknown as AdminUserEntityReference);
}

function makeConversationRoot(): ConversationEntityReference {
	return vi.mocked({
		id: 'conversation-1',
	} as unknown as ConversationEntityReference);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let admin: AdminUserEntityReference;
	let conversationRoot: ConversationEntityReference;
	let visa: AdminUserConversationVisa<ConversationEntityReference>;
	let result: boolean;

	BeforeEachScenario(() => {
		admin = makeAdminUser();
		conversationRoot = makeConversationRoot();
		visa = new AdminUserConversationVisa(conversationRoot, admin);
		result = false;
	});

	Background(({ Given, And }) => {
		Given('an admin user with role permissions', () => {
			admin = makeAdminUser();
		});
		And('a conversation entity reference', () => {
			conversationRoot = makeConversationRoot();
		});
	});

	Scenario(
		'Admin can create conversation with user edit permissions',
		({ Given, When, Then }) => {
			Given('the admin has canEditUsers permission', () => {
				admin = makeAdminUser(true, false, false);
				visa = new AdminUserConversationVisa(conversationRoot, admin);
			});

			When('I check if admin can create conversation', () => {
				result = visa.determineIf((p) => p.canCreateConversation);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Admin cannot create conversation without user edit permissions',
		({ Given, When, Then }) => {
			Given('the admin does not have canEditUsers permission', () => {
				admin = makeAdminUser(false, false, false);
				visa = new AdminUserConversationVisa(conversationRoot, admin);
			});

			When('I check if admin can create conversation', () => {
				result = visa.determineIf((p) => p.canCreateConversation);
			});

			Then('the permission should be denied', () => {
				expect(result).toBe(false);
			});
		},
	);

	Scenario(
		'Admin can manage conversation with moderation permissions',
		({ Given, When, Then }) => {
			Given('the admin has canModerateListings permission', () => {
				admin = makeAdminUser(false, true, false);
				visa = new AdminUserConversationVisa(conversationRoot, admin);
			});

			When('I check if admin can manage conversation', () => {
				result = visa.determineIf((p) => p.canManageConversation);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Admin can view conversation with view all users permission',
		({ Given, When, Then }) => {
			Given('the admin has canViewAllUsers permission', () => {
				admin = makeAdminUser(false, false, true);
				visa = new AdminUserConversationVisa(conversationRoot, admin);
			});

			When('I check if admin can view conversation', () => {
				result = visa.determineIf((p) => p.canViewConversation);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);
});
