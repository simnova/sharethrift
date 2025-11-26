import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ConversationIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from conversation readonly index', ({ Then, And }) => {
		Then('the getConversationReadRepository function should be exported', () => {
			expect(ConversationIndex.ConversationReadRepositoryImpl).toBeDefined();
		});

		And('getConversationReadRepository should be a function', () => {
			expect(typeof ConversationIndex.ConversationReadRepositoryImpl).toBe('function');
		});
	});

	Scenario('Calling ConversationReadRepositoryImpl returns repository', ({ Given, When, Then }) => {
		let result: ReturnType<typeof ConversationIndex.ConversationReadRepositoryImpl>;
		const mockModels = {
			Conversation: {
				Conversation: {} as never,
			},
		} as never;
		const mockPassport = {} as never;

		Given('a models context and passport', () => {
			// Setup done above
		});

		When('I call ConversationReadRepositoryImpl', () => {
			result = ConversationIndex.ConversationReadRepositoryImpl(mockModels, mockPassport);
		});

		Then('it should return an object with ConversationReadRepo', () => {
			expect(result).toBeDefined();
			expect(result.ConversationReadRepo).toBeDefined();
		});
	});
});
