import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserConversationVisa } from './personal-user.conversation.visa.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/conversation.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.conversation.visa.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Conversation visa evaluates permissions for participants', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockConversation = {
			id: 'conv-1',
			sharer: { id: 'user-123' },
			reserver: { id: 'user-456' },
		} as ConversationEntityReference;
		let visa: PersonalUserConversationVisa<ConversationEntityReference>;
		let canView: boolean;

		Given('I have a conversation visa as participant', () => {
			visa = new PersonalUserConversationVisa(mockConversation, mockUser);
		});

		When('I check view permission', () => {
			canView = visa.determineIf((p) => p.canViewConversation);
		});

		Then('participant can view conversation', () => {
			expect(canView).toBe(true);
		});
	});

	Scenario('Conversation visa is created properly', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockConversation = {
			id: 'conv-1',
			sharer: { id: 'user-123' },
			reserver: { id: 'user-456' },
		} as ConversationEntityReference;
		let visa: PersonalUserConversationVisa<ConversationEntityReference>;

		Given('I create a conversation visa', () => {
			visa = new PersonalUserConversationVisa(mockConversation, mockUser);
		});

		When('I check the visa', () => {
			// Check visa
		});

		Then('it should have determineIf function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});
});
