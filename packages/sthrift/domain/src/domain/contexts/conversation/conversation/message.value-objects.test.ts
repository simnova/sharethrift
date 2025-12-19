import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';

import * as ValueObjects from './message.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/message.value-objects.feature'),
);

test.for(feature, ({ Scenario }) => {
	// AuthorId
	Scenario('Creating an AuthorId with valid value', ({ When, Then }) => {
		let value: string;
		When('I create an AuthorId with "507f1f77bcf86cd799439011"', () => {
			value = new ValueObjects.AuthorId('507f1f77bcf86cd799439011').valueOf();
		});
		Then('the value should be "507f1f77bcf86cd799439011"', () => {
			expect(value).toBe('507f1f77bcf86cd799439011');
		});
	});

	Scenario('Creating an AuthorId with invalid value', ({ When, Then }) => {
		let createInvalid: () => void;
		When('I try to create an AuthorId with "invalid-id"', () => {
			createInvalid = () => new ValueObjects.AuthorId('invalid-id').valueOf();
		});
		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createInvalid).throws();
		});
	});

	// MessagingMessageId
	Scenario(
		'Creating a MessagingMessageId with valid value',
		({ When, Then }) => {
			let value: string;
			When('I create a MessagingMessageId with "MSG123456"', () => {
				value = new ValueObjects.MessagingMessageId('MSG123456').valueOf();
			});
			Then('the value should be "MSG123456"', () => {
				expect(value).toBe('MSG123456');
			});
		},
	);

	Scenario(
		'Creating a MessagingMessageId with empty string',
		({ When, Then }) => {
			let createEmpty: () => void;
			When('I try to create a MessagingMessageId with empty string', () => {
				createEmpty = () => new ValueObjects.MessagingMessageId('').valueOf();
			});
			Then(
				'an error should be thrown indicating the value is too short',
				() => {
					expect(createEmpty).throws('Too short');
				},
			);
		},
	);

	Scenario(
		'Creating a MessagingMessageId with too long value',
		({ When, Then }) => {
			let createLong: () => void;
			When(
				'I try to create a MessagingMessageId with a string of 256 characters',
				() => {
					createLong = () =>
						new ValueObjects.MessagingMessageId('a'.repeat(256)).valueOf();
				},
			);
			Then('an error should be thrown indicating the value is too long', () => {
				expect(createLong).throws('Too long');
			});
		},
	);

	Scenario(
		'Creating a MessagingMessageId with whitespace that gets trimmed',
		({ When, Then }) => {
			let value: string;
			When('I create a MessagingMessageId with "  MSG123456  "', () => {
				value = new ValueObjects.MessagingMessageId('  MSG123456  ').valueOf();
			});
			Then('the value should be "MSG123456"', () => {
				expect(value).toBe('MSG123456');
			});
		},
	);

	// MessageText
	Scenario('Creating a MessageText with valid value', ({ When, Then }) => {
		let value: string;
		When('I create a MessageText with "Hello, this is a test message"', () => {
			value = new ValueObjects.MessageText(
				'Hello, this is a test message',
			).valueOf();
		});
		Then('the value should be "Hello, this is a test message"', () => {
			expect(value).toBe('Hello, this is a test message');
		});
	});

	Scenario('Creating a MessageText with empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a MessageText with empty string', () => {
			createEmpty = () => new ValueObjects.MessageText('').valueOf();
		});
		Then('an error should be thrown indicating the value is too short', () => {
			expect(createEmpty).throws('Too short');
		});
	});

	Scenario('Creating a MessageText with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When(
			'I try to create a MessageText with a string of 2001 characters',
			() => {
				createLong = () =>
					new ValueObjects.MessageText('a'.repeat(2001)).valueOf();
			},
		);
		Then('an error should be thrown indicating the value is too long', () => {
			expect(createLong).throws('Too long');
		});
	});

	Scenario(
		'Creating a MessageText with whitespace that gets trimmed',
		({ When, Then }) => {
			let value: string;
			When('I create a MessageText with "  Hello World  "', () => {
				value = new ValueObjects.MessageText('  Hello World  ').valueOf();
			});
			Then('the value should be "Hello World"', () => {
				expect(value).toBe('Hello World');
			});
		},
	);

	Scenario('Using the ANONYMOUS_AUTHOR_ID constant', ({ When, Then }) => {
		let value: string;
		When('I use the ANONYMOUS_AUTHOR_ID constant', () => {
			value = ValueObjects.ANONYMOUS_AUTHOR_ID;
		});
		Then('the value should be "000000000000000000000000"', () => {
			expect(value).toBe('000000000000000000000000');
		});
	});
});
