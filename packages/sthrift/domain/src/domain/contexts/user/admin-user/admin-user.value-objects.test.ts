import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';

import * as ValueObjects from './admin-user.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.value-objects.feature'),
);

test.for(feature, ({ Scenario }) => {
	// Username
	Scenario('Creating a Username with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create a Username with "admin_user"', () => {
			value = new ValueObjects.Username('admin_user').valueOf();
		});
		Then('the value should be "admin_user"', () => {
			expect(value).toBe('admin_user');
		});
	});

	Scenario(
		'Creating a Username with minimum length value',
		({ When, Then }) => {
			let value: string;
			When('I create a Username with "abc"', () => {
				value = new ValueObjects.Username('abc').valueOf();
			});
			Then('the value should be "abc"', () => {
				expect(value).toBe('abc');
			});
		},
	);

	Scenario(
		'Creating a Username with maximum length value',
		({ When, Then }) => {
			let value: string;
			When('I create a Username with a string of 50 characters', () => {
				value = new ValueObjects.Username('a'.repeat(50)).valueOf();
			});
			Then('the value should be that 50-character string', () => {
				expect(value).toBe('a'.repeat(50));
			});
		},
	);

	Scenario('Creating a Username with too short value', ({ When, Then }) => {
		let createShort: () => void;
		When('I try to create a Username with "ab"', () => {
			createShort = () => new ValueObjects.Username('ab').valueOf();
		});
		Then('an error should be thrown indicating the value is too short', () => {
			expect(createShort).throws('Username must be at least 3 characters');
		});
	});

	Scenario('Creating a Username with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When('I try to create a Username with a string of 51 characters', () => {
			createLong = () => new ValueObjects.Username('a'.repeat(51)).valueOf();
		});
		Then('an error should be thrown indicating the value is too long', () => {
			expect(createLong).throws('Username cannot exceed 50 characters');
		});
	});

	Scenario('Creating a Username with invalid characters', ({ When, Then }) => {
		let createInvalid: () => void;
		When('I try to create a Username with "admin@user"', () => {
			createInvalid = () => new ValueObjects.Username('admin@user').valueOf();
		});
		Then(
			'an error should be thrown indicating the value contains invalid characters',
			() => {
				expect(createInvalid).throws(
					'Username can only contain letters, numbers, dots, underscores, and hyphens',
				);
			},
		);
	});

	Scenario('Creating a Username with empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a Username with an empty string', () => {
			createEmpty = () => new ValueObjects.Username('').valueOf();
		});
		Then(
			'an error should be thrown indicating the value cannot be empty',
			() => {
				expect(createEmpty).throws('Username cannot be empty');
			},
		);
	});

	// FirstName
	Scenario('Creating a FirstName with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create a FirstName with "Admin"', () => {
			value = new ValueObjects.FirstName('Admin').valueOf();
		});
		Then('the value should be "Admin"', () => {
			expect(value).toBe('Admin');
		});
	});

	Scenario(
		'Creating a FirstName with maximum length value',
		({ When, Then }) => {
			let value: string;
			When('I create a FirstName with a string of 100 characters', () => {
				value = new ValueObjects.FirstName('A'.repeat(100)).valueOf();
			});
			Then('the value should be that 100-character string', () => {
				expect(value).toBe('A'.repeat(100));
			});
		},
	);

	Scenario('Creating a FirstName with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When('I try to create a FirstName with a string of 101 characters', () => {
			createLong = () => new ValueObjects.FirstName('A'.repeat(101)).valueOf();
		});
		Then('an error should be thrown indicating the value is too long', () => {
			expect(createLong).throws('First name cannot exceed 100 characters');
		});
	});

	Scenario('Creating a FirstName with empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a FirstName with an empty string', () => {
			createEmpty = () => new ValueObjects.FirstName('').valueOf();
		});
		Then(
			'an error should be thrown indicating the value cannot be empty',
			() => {
				expect(createEmpty).throws('First name cannot be empty');
			},
		);
	});

	// LastName
	Scenario('Creating a LastName with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create a LastName with "User"', () => {
			value = new ValueObjects.LastName('User').valueOf();
		});
		Then('the value should be "User"', () => {
			expect(value).toBe('User');
		});
	});

	Scenario(
		'Creating a LastName with maximum length value',
		({ When, Then }) => {
			let value: string;
			When('I create a LastName with a string of 100 characters', () => {
				value = new ValueObjects.LastName('U'.repeat(100)).valueOf();
			});
			Then('the value should be that 100-character string', () => {
				expect(value).toBe('U'.repeat(100));
			});
		},
	);

	Scenario('Creating a LastName with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When('I try to create a LastName with a string of 101 characters', () => {
			createLong = () => new ValueObjects.LastName('U'.repeat(101)).valueOf();
		});
		Then('an error should be thrown indicating the value is too long', () => {
			expect(createLong).throws('Last name cannot exceed 100 characters');
		});
	});

	Scenario('Creating a LastName with empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a LastName with an empty string', () => {
			createEmpty = () => new ValueObjects.LastName('').valueOf();
		});
		Then(
			'an error should be thrown indicating the value cannot be empty',
			() => {
				expect(createEmpty).throws('Last name cannot be empty');
			},
		);
	});
});
