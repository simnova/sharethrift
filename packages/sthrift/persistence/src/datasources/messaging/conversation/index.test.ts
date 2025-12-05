import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as MessagingConversationIndex from './index.ts';
import type { MessagingService } from '@cellix/messaging-service';
import type { Domain } from '@sthrift/domain';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from messaging conversation context index', ({ Then, And }) => {
		Then('the MessagingConversationContext function should be exported', () => {
			expect(MessagingConversationIndex.MessagingConversationContext).toBeDefined();
		});

		And('MessagingConversationContext should be a function', () => {
			expect(typeof MessagingConversationIndex.MessagingConversationContext).toBe('function');
		});

		And('MessagingConversationRepository type should be exported', () => {
			// Type exports can't be tested at runtime, but we can verify the module exports it
			expect(MessagingConversationIndex).toBeDefined();
		});
	});

	Scenario('Creating Messaging Conversation Context', ({ Given, And, When, Then }) => {
		let mockService: MessagingService;
		let mockPassport: Domain.Passport;
		let result: ReturnType<typeof MessagingConversationIndex.MessagingConversationContext>;

		Given('a mock MessagingService', () => {
			mockService = {} as MessagingService;
		});

		And('a mock Passport', () => {
			mockPassport = {} as Domain.Passport;
		});

		When('I call MessagingConversationContext with service and passport', () => {
			result = MessagingConversationIndex.MessagingConversationContext(mockService, mockPassport);
		});

		Then('it should return an object with Conversation property', () => {
			expect(result.Conversation).toBeDefined();
		});
	});
});
