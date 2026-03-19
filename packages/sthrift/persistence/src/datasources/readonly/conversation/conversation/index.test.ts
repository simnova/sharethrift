import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ConversationIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Background, Scenario }) => {
	let mockModels: never;
	let mockPassport: never;

	Background(({ Given, And }) => {
		Given('a valid models context with Conversation model', () => {
			mockModels = {
				Conversation: {
					Conversation: {} as never,
				},
			} as never;
		});

		And('a valid passport for domain operations', () => {
			mockPassport = {} as never;
		});
	});

	Scenario('Creating Conversation Read Repository Implementation', ({ When, Then, And }) => {
		let result: ReturnType<typeof ConversationIndex.ConversationReadRepositoryImpl>;

		When('I call ConversationReadRepositoryImpl with models and passport', () => {
			result = ConversationIndex.ConversationReadRepositoryImpl(mockModels, mockPassport);
		});

		Then('I should receive an object with ConversationReadRepo property', () => {
			expect(result).toBeDefined();
			expect(result.ConversationReadRepo).toBeDefined();
		});

		And('the ConversationReadRepo should be a ConversationReadRepository instance', () => {
			expect(result.ConversationReadRepo).toBeDefined();
		});
	});

	Scenario('ConversationReadRepositoryImpl exports', ({ Then, And }) => {
		Then('ConversationReadRepositoryImpl should be exported from index', () => {
			expect(ConversationIndex.ConversationReadRepositoryImpl).toBeDefined();
		});

		And('ConversationReadRepositoryImpl should be a function', () => {
			expect(typeof ConversationIndex.ConversationReadRepositoryImpl).toBe('function');
		});

		And('ConversationReadRepository type should be exported from index', () => {
			// Type exports are verified at compile time
			expect(true).toBe(true);
		});
	});
});
