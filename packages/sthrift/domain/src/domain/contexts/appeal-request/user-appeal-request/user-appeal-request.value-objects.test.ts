import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ValueObjects from './user-appeal-request.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/user-appeal-request.value-objects.feature'),
);

test.for(feature, ({ Scenario }) => {
	// Reason
	Scenario('Creating a Reason with valid value', ({ When, Then }) => {
		let value: string;
		When('I create a Reason with "This user was incorrectly blocked and should be restored"', () => {
			value = new ValueObjects.Reason('This user was incorrectly blocked and should be restored').valueOf();
		});
		Then('the value should be "This user was incorrectly blocked and should be restored"', () => {
			expect(value).toBe('This user was incorrectly blocked and should be restored');
		});
	});

	Scenario('Creating a Reason with leading and trailing whitespace', ({ When, Then }) => {
		let value: string;
		When('I create a Reason with "  This user was incorrectly blocked  "', () => {
			value = new ValueObjects.Reason('  This user was incorrectly blocked  ').valueOf();
		});
		Then('the value should be "This user was incorrectly blocked"', () => {
			expect(value).toBe('This user was incorrectly blocked');
		});
	});

	Scenario('Creating a Reason with minimum length value', ({ When, Then }) => {
		let value: string;
		When('I create a Reason with "Ten chars!"', () => {
			value = new ValueObjects.Reason('Ten chars!').valueOf();
		});
		Then('the value should be "Ten chars!"', () => {
			expect(value).toBe('Ten chars!');
		});
	});

	Scenario('Creating a Reason with maximum length value', ({ When, Then }) => {
		let value: string;
		When('I create a Reason with a string of 1000 characters', () => {
			value = new ValueObjects.Reason('a'.repeat(1000)).valueOf();
		});
		Then('the value should be that 1000-character string', () => {
			expect(value).toBe('a'.repeat(1000));
		});
	});

	Scenario('Creating a Reason with empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a Reason with an empty string', () => {
			createEmpty = () => new ValueObjects.Reason('').valueOf();
		});
		Then('an error should be thrown indicating the reason cannot be empty', () => {
			expect(createEmpty).toThrow('Reason cannot be empty');
		});
	});

	Scenario('Creating a Reason with too short value', ({ When, Then }) => {
		let createShort: () => void;
		When('I try to create a Reason with "Too short"', () => {
			createShort = () => new ValueObjects.Reason('Too short').valueOf();
		});
		Then('an error should be thrown indicating the reason must be at least 10 characters', () => {
			expect(createShort).toThrow('Reason must be at least 10 characters');
		});
	});

	Scenario('Creating a Reason with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When('I try to create a Reason with a string of 1001 characters', () => {
			createLong = () => new ValueObjects.Reason('a'.repeat(1001)).valueOf();
		});
		Then('an error should be thrown indicating the reason cannot exceed 1000 characters', () => {
			expect(createLong).toThrow('Reason cannot exceed 1000 characters');
		});
	});

	// State
	Scenario('Creating a State with valid requested value', ({ When, Then }) => {
		let value: string;
		When('I create a State with "requested"', () => {
			value = new ValueObjects.State('requested').valueOf();
		});
		Then('the value should be "requested"', () => {
			expect(value).toBe('requested');
		});
	});

	Scenario('Creating a State with valid denied value', ({ When, Then }) => {
		let value: string;
		When('I create a State with "denied"', () => {
			value = new ValueObjects.State('denied').valueOf();
		});
		Then('the value should be "denied"', () => {
			expect(value).toBe('denied');
		});
	});

	Scenario('Creating a State with valid accepted value', ({ When, Then }) => {
		let value: string;
		When('I create a State with "accepted"', () => {
			value = new ValueObjects.State('accepted').valueOf();
		});
		Then('the value should be "accepted"', () => {
			expect(value).toBe('accepted');
		});
	});

	Scenario('Creating a State with invalid value', ({ When, Then }) => {
		let createInvalid: () => void;
		When('I try to create a State with "invalid_state"', () => {
			createInvalid = () => new ValueObjects.State('invalid_state').valueOf();
		});
		Then('an error should be thrown indicating invalid state', () => {
			expect(createInvalid).toThrow('Invalid state');
		});
	});

	// Type
	Scenario('Creating a Type with valid user value', ({ When, Then }) => {
		let value: string;
		When('I create a Type with "user"', () => {
			value = new ValueObjects.Type('user').valueOf();
		});
		Then('the value should be "user"', () => {
			expect(value).toBe('user');
		});
	});

	Scenario('Creating a Type with valid listing value', ({ When, Then }) => {
		let value: string;
		When('I create a Type with "listing"', () => {
			value = new ValueObjects.Type('listing').valueOf();
		});
		Then('the value should be "listing"', () => {
			expect(value).toBe('listing');
		});
	});

	Scenario('Creating a Type with invalid value', ({ When, Then }) => {
		let createInvalid: () => void;
		When('I try to create a Type with "invalid_type"', () => {
			createInvalid = () => new ValueObjects.Type('invalid_type').valueOf();
		});
		Then('an error should be thrown indicating invalid type', () => {
			expect(createInvalid).toThrow('Invalid type');
		});
	});
});
