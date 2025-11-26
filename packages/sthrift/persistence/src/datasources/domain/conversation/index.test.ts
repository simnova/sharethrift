import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ConversationIndex from './index.ts';
import type { ModelsContext } from '../../../models-context.ts';
import type { Domain } from '@sthrift/domain';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from conversation context index', ({ Then, And }) => {
		Then('the ConversationContextPersistence function should be exported', () => {
			expect(ConversationIndex.ConversationContextPersistence).toBeDefined();
		});

		And('ConversationContextPersistence should be a function', () => {
			expect(typeof ConversationIndex.ConversationContextPersistence).toBe('function');
		});
	});

	Scenario('Creating Conversation Context Persistence', ({ Given, And, When, Then }) => {
		let mockModels: ModelsContext;
		let mockPassport: Domain.Passport;
		let result: ReturnType<typeof ConversationIndex.ConversationContextPersistence>;

		Given('a mock ModelsContext with Conversation models', () => {
			mockModels = {
				Conversation: {
					ConversationModel: {} as unknown,
				},
			} as ModelsContext;
		});

		And('a mock Passport', () => {
			mockPassport = {} as Domain.Passport;
		});

		When('I call ConversationContextPersistence with models and passport', () => {
			result = ConversationIndex.ConversationContextPersistence(mockModels, mockPassport);
		});

		Then('it should return an object with Conversation property', () => {
			expect(result.Conversation).toBeDefined();
		});
	});
});
