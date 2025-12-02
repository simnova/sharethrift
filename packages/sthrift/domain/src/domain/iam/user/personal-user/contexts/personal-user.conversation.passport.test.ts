import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserConversationPassport } from './personal-user.conversation.passport.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/conversation.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.conversation.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Personal user can access conversations', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserConversationPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a personal user conversation passport', () => {
			passport = new PersonalUserConversationPassport(mockUser);
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

	Scenario('Personal user passport provides conversation access', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserConversationPassport;

		Given('I create a personal user conversation passport', () => {
			passport = new PersonalUserConversationPassport(mockUser);
		});

		When('I check the passport', () => {
			// Check passport
		});

		Then('it should be defined', () => {
			expect(passport).toBeDefined();
			expect(passport).toBeInstanceOf(PersonalUserConversationPassport);
		});
	});
});
