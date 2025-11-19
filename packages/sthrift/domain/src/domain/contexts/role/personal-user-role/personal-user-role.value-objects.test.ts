import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ValueObjects from './personal-user-role.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-role.value-objects.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Creating a RoleName with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create a RoleName with "Administrator"', () => {
			value = new ValueObjects.RoleName('Administrator').valueOf();
		});
		Then('the value should be "Administrator"', () => {
			expect(value).toBe('Administrator');
		});
	});

	Scenario('Creating a RoleName with minimum length value', ({ When, Then }) => {
		let value: string;
		When('I create a RoleName with "A"', () => {
			value = new ValueObjects.RoleName('A').valueOf();
		});
		Then('the value should be "A"', () => {
			expect(value).toBe('A');
		});
	});

	Scenario('Creating a RoleName with maximum length value', ({ When, Then }) => {
		let value: string;
		When('I create a RoleName with a string of 50 characters', () => {
			value = new ValueObjects.RoleName('a'.repeat(50)).valueOf();
		});
		Then('the value should be that 50-character string', () => {
			expect(value).toBe('a'.repeat(50));
		});
	});

	Scenario('Creating a RoleName with an empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a RoleName with an empty string', () => {
			createEmpty = () => new ValueObjects.RoleName('').valueOf();
		});
		Then('an error should be thrown indicating the value is too short', () => {
			expect(createEmpty).toThrow();
		});
	});

	Scenario('Creating a RoleName with a string longer than 50 characters', ({ When, Then }) => {
		let createTooLong: () => void;
		When('I try to create a RoleName with a string of 51 characters', () => {
			createTooLong = () => new ValueObjects.RoleName('a'.repeat(51)).valueOf();
		});
		Then('an error should be thrown indicating the value is too long', () => {
			expect(createTooLong).toThrow();
		});
	});

	Scenario('Creating a RoleName with null', ({ When, Then }) => {
		let createNull: () => void;
		When('I try to create a RoleName with null', () => {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock data
			createNull = () => new ValueObjects.RoleName(null as any).valueOf();
		});
		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createNull).toThrow();
		});
	});
});
