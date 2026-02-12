import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { RoleName } from './admin-role.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-role.value-objects.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Creating a RoleName with valid input', ({ When, Then }) => {
		let value: string;

		When('I create a RoleName with "Administrator"', () => {
			const roleName = new RoleName('Administrator');
			value = roleName.valueOf();
		});

		Then('the value should be "Administrator"', () => {
			expect(value).toBe('Administrator');
		});
	});

	Scenario('Creating a RoleName with null', ({ When, Then }) => {
		let createNull: () => void;

		When('I try to create a RoleName with null', () => {
			createNull = () => {
				// @ts-expect-error - testing invalid input
				new RoleName(null).valueOf();
			};
		});

		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createNull).toThrow(/Wrong raw value type/i);
		});
	});

	Scenario('Creating a RoleName with empty string', ({ When, Then }) => {
		let createEmpty: () => void;

		When('I try to create a RoleName with an empty string', () => {
			createEmpty = () => {
				new RoleName('').valueOf();
			};
		});

		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createEmpty).toThrow('Too short');
		});
	});

	Scenario(
		'Creating a RoleName with a string exceeding max length',
		({ When, Then }) => {
			let createLong: () => void;

			When(
				'I try to create a RoleName with a string longer than 50 characters',
				() => {
					createLong = () => {
						new RoleName('A'.repeat(51)).valueOf();
					};
				},
			);

			Then('an error should be thrown indicating the value is too long', () => {
				expect(createLong).toThrow('Too long');
			});
		},
	);
});
