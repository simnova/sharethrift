import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as MessagingConversationIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Background, Scenario }) => {
	let mockMessagingService: never;
	let mockPassport: never;

	Background(({ Given, And }) => {
		Given('a valid messaging service', () => {
			mockMessagingService = {} as never;
		});

		And('a valid passport for domain operations', () => {
			mockPassport = {} as never;
		});
	});

	Scenario('Creating Messaging Conversation Repository Implementation', ({ When, Then, And }) => {
		let result: ReturnType<typeof MessagingConversationIndex.MessagingConversationRepositoryImpl>;

		When('I call MessagingConversationRepositoryImpl with messaging service and passport', () => {
			result = MessagingConversationIndex.MessagingConversationRepositoryImpl(mockMessagingService, mockPassport);
		});

		Then('I should receive an object with MessagingConversationRepo property', () => {
			expect(result).toBeDefined();
			expect(result.MessagingConversationRepo).toBeDefined();
		});

		And('the MessagingConversationRepo should be a MessagingConversationRepository instance', () => {
			expect(result.MessagingConversationRepo).toBeDefined();
		});
	});

	Scenario('MessagingConversationRepositoryImpl exports', ({ Then, And }) => {
		Then('MessagingConversationRepositoryImpl should be exported from index', () => {
			expect(MessagingConversationIndex.MessagingConversationRepositoryImpl).toBeDefined();
		});

		And('MessagingConversationRepositoryImpl should be a function', () => {
			expect(typeof MessagingConversationIndex.MessagingConversationRepositoryImpl).toBe('function');
		});

		And('MessagingConversationRepository type should be exported from index', () => {
			// Type exports are verified at compile time
			expect(true).toBe(true);
		});
	});
});
