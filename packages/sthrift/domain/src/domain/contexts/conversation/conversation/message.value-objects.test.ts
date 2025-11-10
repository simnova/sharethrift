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
	// TwilioMessageSid
	Scenario(
		'Creating a TwilioMessageSid with valid value',
		({ When, Then }) => {
			let value: string;
			When(
				'I create a TwilioMessageSid with "IM12345678901234567890123456789012"',
				() => {
					value = new ValueObjects.TwilioMessageSid(
						'IM12345678901234567890123456789012',
					).valueOf();
				},
			);
			Then('the value should be "IM12345678901234567890123456789012"', () => {
				expect(value).toBe('IM12345678901234567890123456789012');
			});
		},
	);

	Scenario(
		'Creating a TwilioMessageSid with invalid prefix',
		({ When, Then }) => {
			let createInvalid: () => void;
			When(
				'I try to create a TwilioMessageSid with "XX12345678901234567890123456789012"',
				() => {
					createInvalid = () =>
						new ValueObjects.TwilioMessageSid(
							'XX12345678901234567890123456789012',
						).valueOf();
				},
			);
			Then('an error should be thrown indicating the value is invalid', () => {
				expect(createInvalid).throws("Value doesn't match pattern");
			});
		},
	);

	Scenario(
		'Creating a TwilioMessageSid with too short value',
		({ When, Then }) => {
			let createShort: () => void;
			When(
				'I try to create a TwilioMessageSid with a string of 33 characters',
				() => {
					createShort = () =>
						new ValueObjects.TwilioMessageSid(
							`IM${'1'.repeat(31)}`,
						).valueOf();
				},
			);
			Then(
				'an error should be thrown indicating the value is too short',
				() => {
					expect(createShort).throws('Too short');
				},
			);
		},
	);

	Scenario(
		'Creating a TwilioMessageSid with too long value',
		({ When, Then }) => {
			let createLong: () => void;
			When(
				'I try to create a TwilioMessageSid with a string of 35 characters',
				() => {
					createLong = () =>
						new ValueObjects.TwilioMessageSid(
							`IM${'1'.repeat(33)}`,
						).valueOf();
				},
			);
			Then('an error should be thrown indicating the value is too long', () => {
				expect(createLong).throws('Too long');
			});
		},
	);

	Scenario('Creating a TwilioMessageSid with null', ({ When, Then }) => {
		let createNull: () => void;
		When('I try to create a TwilioMessageSid with null', () => {
			createNull = () => {
				// @ts-expect-error
				new ValueObjects.TwilioMessageSid(null).valueOf();
			};
		});
		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createNull).throws(/Wrong raw value type/i);
		});
	});

	// MessageContent
	Scenario(
		'Creating a MessageContent with valid value',
		({ When, Then }) => {
			let value: string;
			When(
				'I create a MessageContent with "Hello, this is a test message"',
				() => {
					value = new ValueObjects.MessageContent(
						'Hello, this is a test message',
					).valueOf();
				},
			);
			Then('the value should be "Hello, this is a test message"', () => {
				expect(value).toBe('Hello, this is a test message');
			});
		},
	);

	Scenario(
		'Creating a MessageContent with leading and trailing whitespace',
		({ When, Then }) => {
			let value: string;
			When(
				'I create a MessageContent with "  Hello  "',
				() => {
					value = new ValueObjects.MessageContent(
						'  Hello  ',
					).valueOf();
				},
			);
			Then('the value should be "Hello"', () => {
				expect(value).toBe('Hello');
			});
		},
	);

	Scenario(
		'Creating a MessageContent with minimum length',
		({ When, Then }) => {
			let value: string;
			When(
				'I create a MessageContent with "A"',
				() => {
					value = new ValueObjects.MessageContent('A').valueOf();
				},
			);
			Then('the value should be "A"', () => {
				expect(value).toBe('A');
			});
		},
	);

	Scenario(
		'Creating a MessageContent with maximum length',
		({ When, Then }) => {
			let value: string;
			const maxString = 'A'.repeat(2000);
			When(
				'I create a MessageContent with a string of 2000 characters',
				() => {
					value = new ValueObjects.MessageContent(maxString).valueOf();
				},
			);
			Then('the value should be the 2000 character string', () => {
				expect(value).toBe(maxString);
			});
		},
	);

	Scenario(
		'Creating a MessageContent with empty string',
		({ When, Then }) => {
			let createEmpty: () => void;
			When(
				'I try to create a MessageContent with an empty string',
				() => {
					createEmpty = () =>
						new ValueObjects.MessageContent('').valueOf();
				},
			);
			Then(
				'an error should be thrown indicating the value is too short',
				() => {
					expect(createEmpty).throws('Too short');
				},
			);
		},
	);

	Scenario(
		'Creating a MessageContent with too long value',
		({ When, Then }) => {
			let createLong: () => void;
			When(
				'I try to create a MessageContent with a string of 2001 characters',
				() => {
					createLong = () =>
						new ValueObjects.MessageContent('A'.repeat(2001)).valueOf();
				},
			);
			Then('an error should be thrown indicating the value is too long', () => {
				expect(createLong).throws('Too long');
			});
		},
	);

	Scenario('Creating a MessageContent with null', ({ When, Then }) => {
		let createNull: () => void;
		When('I try to create a MessageContent with null', () => {
			createNull = () => {
				// @ts-expect-error
				new ValueObjects.MessageContent(null).valueOf();
			};
		});
		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createNull).throws(/Wrong raw value type/i);
		});
	});
});
