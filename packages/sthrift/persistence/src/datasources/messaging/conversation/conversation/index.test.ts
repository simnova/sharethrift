import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as MessagingConversationIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from messaging conversation index', ({ Then, And }) => {
		Then('the MessagingConversationRepositoryImpl function should be exported', () => {
			expect(MessagingConversationIndex.MessagingConversationRepositoryImpl).toBeDefined();
		});

		And('MessagingConversationRepositoryImpl should be a function', () => {
			expect(typeof MessagingConversationIndex.MessagingConversationRepositoryImpl).toBe('function');
		});
	});
});
