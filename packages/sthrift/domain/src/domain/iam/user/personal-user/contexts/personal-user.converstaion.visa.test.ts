import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserConversationVisa } from './personal-user.converstaion.visa.ts';
import type { ConversationEntityReference } from '../../../../contexts/conversation/conversation/conversation.entity.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.converstaion.visa.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Personal user can view conversation as reserver', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockSharer = { id: 'sharer-456', isBlocked: false } as PersonalUserEntityReference;
		const mockConversation = {
			id: 'conv-789',
			reserver: mockUser,
			sharer: mockSharer,
		} as ConversationEntityReference;
		let visa: PersonalUserConversationVisa<ConversationEntityReference>;
		let canView: boolean;

		Given('I have a conversation where personal user is the reserver', () => {
			visa = new PersonalUserConversationVisa(mockConversation, mockUser);
		});

		When('I check if user can view the conversation', () => {
			canView = visa.determineIf((p) => p.canViewConversation);
		});

		Then('permission should be granted', () => {
			expect(canView).toBe(true);
		});
	});

	Scenario('Personal user can view conversation as sharer', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockReserver = { id: 'reserver-456', isBlocked: false } as PersonalUserEntityReference;
		const mockConversation = {
			id: 'conv-789',
			reserver: mockReserver,
			sharer: mockUser,
		} as ConversationEntityReference;
		let visa: PersonalUserConversationVisa<ConversationEntityReference>;
		let canView: boolean;

		Given('I have a conversation where personal user is the sharer', () => {
			visa = new PersonalUserConversationVisa(mockConversation, mockUser);
		});

		When('I check if user can view the conversation', () => {
			canView = visa.determineIf((p) => p.canViewConversation);
		});

		Then('permission should be granted', () => {
			expect(canView).toBe(true);
		});
	});

	Scenario('Personal user cannot view conversation when not a participant', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockReserver = { id: 'reserver-456', isBlocked: false } as PersonalUserEntityReference;
		const mockSharer = { id: 'sharer-789', isBlocked: false } as PersonalUserEntityReference;
		const mockConversation = {
			id: 'conv-999',
			reserver: mockReserver,
			sharer: mockSharer,
		} as ConversationEntityReference;
		let visa: PersonalUserConversationVisa<ConversationEntityReference>;
		let canView: boolean;

		Given('I have a conversation where personal user is not a participant', () => {
			visa = new PersonalUserConversationVisa(mockConversation, mockUser);
		});

		When('I check if user can view the conversation', () => {
			canView = visa.determineIf((p) => p.canViewConversation);
		});

		Then('permission should be denied', () => {
			expect(canView).toBe(false);
		});
	});

	Scenario('Personal user can create conversations', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockReserver = { id: 'reserver-456', isBlocked: false } as PersonalUserEntityReference;
		const mockConversation = {
			id: 'conv-789',
			reserver: mockReserver,
			sharer: mockUser,
		} as ConversationEntityReference;
		let visa: PersonalUserConversationVisa<ConversationEntityReference>;
		let canCreate: boolean;

		Given('I have a personal user with conversation visa', () => {
			visa = new PersonalUserConversationVisa(mockConversation, mockUser);
		});

		When('I check if user can create a conversation', () => {
			canCreate = visa.determineIf((p) => p.canCreateConversation);
		});

		Then('permission should be granted', () => {
			expect(canCreate).toBe(true);
		});
	});

	Scenario('Personal user cannot manage conversations', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockReserver = { id: 'reserver-456', isBlocked: false } as PersonalUserEntityReference;
		const mockConversation = {
			id: 'conv-789',
			reserver: mockReserver,
			sharer: mockUser,
		} as ConversationEntityReference;
		let visa: PersonalUserConversationVisa<ConversationEntityReference>;
		let canManage: boolean;

		Given('I have a personal user with conversation visa', () => {
			visa = new PersonalUserConversationVisa(mockConversation, mockUser);
		});

		When('I check if user can manage a conversation', () => {
			canManage = visa.determineIf((p) => p.canManageConversation);
		});

		Then('permission should be denied', () => {
			expect(canManage).toBe(false);
		});
	});

	Scenario('Conversation visa is created properly', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockReserver = { id: 'reserver-456', isBlocked: false } as PersonalUserEntityReference;
		const mockConversation = {
			id: 'conv-789',
			reserver: mockReserver,
			sharer: mockUser,
		} as ConversationEntityReference;
		let visa: PersonalUserConversationVisa<ConversationEntityReference>;

		Given('I create a conversation visa', () => {
			visa = new PersonalUserConversationVisa(mockConversation, mockUser);
		});

		When('I check the visa', () => {
			// Visa instance is ready for verification
		});

		Then('it should have determineIf function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});
});
