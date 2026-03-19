import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ConversationIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from readonly conversation context index', ({ Then, And }) => {
		Then('the ConversationContext function should be exported', () => {
			expect(ConversationIndex.ConversationContext).toBeDefined();
		});

		And('ConversationContext should be a function', () => {
			expect(typeof ConversationIndex.ConversationContext).toBe('function');
		});
	});

	Scenario('Calling ConversationContext returns repository', ({ Given, When, Then }) => {
		let result: ReturnType<typeof ConversationIndex.ConversationContext>;

		Given('a models context and passport', () => {
			// Setup is simple
		});

		When('I call ConversationContext', () => {
			const mockModels = {
				Conversation: { Conversation: {} },
			} as never;
			const mockPassport = {} as never;
			result = ConversationIndex.ConversationContext(mockModels, mockPassport);
		});

		Then('it should return an object with Conversation property', () => {
			expect(result.Conversation).toBeDefined();
		});
	});
});
