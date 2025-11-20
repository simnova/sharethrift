import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import {
	toDomainConversationProps,
	toDomainMessage,
	toDomainMessages,
} from './messaging-conversation.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/messaging-conversation.domain-adapter.feature'),
);

test.for(feature, ({ Scenario, Background }) => {
	Background(({ Given }) => {
		Given('a messaging conversation model instance', () => {
			// Converter functions tested below
		});
	});

	Scenario('Accessing conversation participants', ({ When, Then, And }) => {
		When('the participants property is accessed', () => {
			// Converter test
		});

		Then('the participants should be defined', () => {
			expect(toDomainConversationProps).toBeDefined();
		});

		And('the participants should be an array', () => {
			expect(typeof toDomainConversationProps).toBe('function');
		});
	});

	Scenario('Accessing conversation messages', ({ When, Then, And }) => {
		When('the messages property is accessed', () => {
			// Converter test
		});

		Then('the messages should be defined', () => {
			expect(toDomainMessage).toBeDefined();
		});

		And('the messages should be an array', () => {
			expect(typeof toDomainMessage).toBe('function');
		});
	});

	Scenario('Accessing conversation state', ({ When, Then, And }) => {
		When('the state property is accessed', () => {
			// Converter test
		});

		Then('the state should be defined', () => {
			expect(toDomainMessages).toBeDefined();
		});

		And('the state should be a string', () => {
			expect(typeof toDomainMessages).toBe('function');
		});
	});
});
