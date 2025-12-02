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
					ConversationModel: {} as never,
				},
			} as never;
		});

		And('a valid passport for domain operations', () => {
			mockPassport = {} as never;
		});
	});

	Scenario('Creating Conversation Persistence', ({ When, Then, And }) => {
		let result: ReturnType<typeof ConversationIndex.ConversationPersistence>;

		When('I call ConversationPersistence with models and passport', () => {
			result = ConversationIndex.ConversationPersistence(mockModels, mockPassport);
		});

		Then('I should receive an object with ConversationUnitOfWork property', () => {
			expect(result).toBeDefined();
			expect(result.ConversationUnitOfWork).toBeDefined();
		});

		And('the ConversationUnitOfWork should be properly initialized', () => {
			expect(result.ConversationUnitOfWork).toBeDefined();
		});
	});

	Scenario('ConversationPersistence exports', ({ Then, And }) => {
		Then('ConversationPersistence should be exported from index', () => {
			expect(ConversationIndex.ConversationPersistence).toBeDefined();
		});

		And('ConversationPersistence should be a function', () => {
			expect(typeof ConversationIndex.ConversationPersistence).toBe('function');
		});
	});
});
