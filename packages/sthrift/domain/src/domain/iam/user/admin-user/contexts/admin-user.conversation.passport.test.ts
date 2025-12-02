import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminUserConversationPassport } from './admin-user.conversation.passport.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';
import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/conversation.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/admin-user.conversation.passport.feature',
	),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Admin user can access conversations', ({ Given, When, Then }) => {
		const mockUser = {
			id: 'admin-user-123',
			isBlocked: false,
		} as AdminUserEntityReference;
		let passport: AdminUserConversationPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have an admin user conversation passport', () => {
			passport = new AdminUserConversationPassport(mockUser);
		});

		When('I request access to a conversation', () => {
			const mockConversation = {
				id: 'conv-1',
				sharer: { id: 'user-123' },
				reserver: { id: 'user-456' },
			} as ConversationEntityReference;
			visa = passport.forConversation(mockConversation);
		});

		Then('visa should be created with permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario(
		'Admin user passport provides conversation access',
		({ Given, When, Then }) => {
			const mockUser = {
				id: 'admin-user-123',
				isBlocked: false,
			} as AdminUserEntityReference;
			let passport: AdminUserConversationPassport;

			Given('I create an admin user conversation passport', () => {
				passport = new AdminUserConversationPassport(mockUser);
			});

			When('I check the passport', () => {
				// Check passport
			});

			Then('it should be defined', () => {
				expect(passport).toBeDefined();
				expect(passport).toBeInstanceOf(AdminUserConversationPassport);
			});
		},
	);
});
