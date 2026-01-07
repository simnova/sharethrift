import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';

import * as ValueObjects from './conversation.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.value-objects.feature'),
);

test.for(feature, ({ Scenario }) => {
	// TwilioConversationSid
	Scenario(
		'Creating a TwilioConversationSid with valid value',
		({ When, Then }) => {
			let value: string;
			When(
				'I create a TwilioConversationSid with "CH12345678901234567890123456789012"',
				() => {
					value = new ValueObjects.TwilioConversationSid(
						'CH12345678901234567890123456789012',
					).valueOf();
				},
			);
			Then('the value should be "CH12345678901234567890123456789012"', () => {
				expect(value).toBe('CH12345678901234567890123456789012');
			});
		},
	);

	Scenario(
		'Creating a TwilioConversationSid with invalid prefix',
		({ When, Then }) => {
			let createInvalid: () => void;
			When(
				'I try to create a TwilioConversationSid with "XX12345678901234567890123456789012"',
				() => {
					createInvalid = () =>
						new ValueObjects.TwilioConversationSid(
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
		'Creating a TwilioConversationSid with too short value',
		({ When, Then }) => {
			let createShort: () => void;
			When(
				'I try to create a TwilioConversationSid with a string of 33 characters',
				() => {
					createShort = () =>
						new ValueObjects.TwilioConversationSid(
							`CH${'1'.repeat(31)}`,
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
		'Creating a TwilioConversationSid with too long value',
		({ When, Then }) => {
			let createLong: () => void;
			When(
				'I try to create a TwilioConversationSid with a string of 35 characters',
				() => {
					createLong = () =>
						new ValueObjects.TwilioConversationSid(
							`CH${'1'.repeat(33)}`,
						).valueOf();
				},
			);
			Then('an error should be thrown indicating the value is too long', () => {
				expect(createLong).throws('Too long');
			});
		},
	);

	Scenario('Creating a TwilioConversationSid with null', ({ When, Then }) => {
		let createNull: () => void;
		When('I try to create a TwilioConversationSid with null', () => {
			createNull = () => {
				// @ts-expect-error
				new ValueObjects.TwilioConversationSid(null).valueOf();
			};
		});
		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createNull).throws(/Wrong raw value type/i);
		});
	});

	// TwilioParticipantSid
	Scenario(
		'Creating a TwilioParticipantSid with valid value',
		({ When, Then }) => {
			let value: string;
			When(
				'I create a TwilioParticipantSid with "MB12345678901234567890123456789012"',
				() => {
					value = new ValueObjects.TwilioParticipantSid(
						'MB12345678901234567890123456789012',
					).valueOf();
				},
			);
			Then('the value should be "MB12345678901234567890123456789012"', () => {
				expect(value).toBe('MB12345678901234567890123456789012');
			});
		},
	);

	Scenario(
		'Creating a TwilioParticipantSid with invalid prefix',
		({ When, Then }) => {
			let createInvalid: () => void;
			When(
				'I try to create a TwilioParticipantSid with "XX12345678901234567890123456789012"',
				() => {
					createInvalid = () =>
						new ValueObjects.TwilioParticipantSid(
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
		'Creating a TwilioParticipantSid with too short value',
		({ When, Then }) => {
			let createShort: () => void;
			When(
				'I try to create a TwilioParticipantSid with a string of 33 characters',
				() => {
					createShort = () =>
						new ValueObjects.TwilioParticipantSid(
							`MB${'1'.repeat(31)}`,
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
		'Creating a TwilioParticipantSid with too long value',
		({ When, Then }) => {
			let createLong: () => void;
			When(
				'I try to create a TwilioParticipantSid with a string of 35 characters',
				() => {
					createLong = () =>
						new ValueObjects.TwilioParticipantSid(
							`MB${'1'.repeat(33)}`,
						).valueOf();
				},
			);
			Then('an error should be thrown indicating the value is too long', () => {
				expect(createLong).throws('Too long');
			});
		},
	);

	Scenario('Creating a TwilioParticipantSid with null', ({ When, Then }) => {
		let createNull: () => void;
		When('I try to create a TwilioParticipantSid with null', () => {
			createNull = () => {
				// @ts-expect-error
				new ValueObjects.TwilioParticipantSid(null).valueOf();
			};
		});
		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createNull).throws(/Wrong raw value type/i);
		});
	});
});
