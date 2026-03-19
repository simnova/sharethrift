import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';

import * as ValueObjects from './personal-user.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.value-objects.feature'),
);

test.for(feature, ({ Scenario }) => {
	// Username
	Scenario('Creating a Username with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create a Username with "john_doe"', () => {
			value = new ValueObjects.Username('john_doe').valueOf();
		});
		Then('the value should be "john_doe"', () => {
			expect(value).toBe('john_doe');
		});
	});

	Scenario('Creating a Username with minimum length value', ({ When, Then }) => {
		let value: string;
		When('I create a Username with "abc"', () => {
			value = new ValueObjects.Username('abc').valueOf();
		});
		Then('the value should be "abc"', () => {
			expect(value).toBe('abc');
		});
	});

	Scenario('Creating a Username with maximum length value', ({ When, Then }) => {
		let value: string;
		When('I create a Username with a string of 50 characters', () => {
			value = new ValueObjects.Username('a'.repeat(50)).valueOf();
		});
		Then('the value should be that 50-character string', () => {
			expect(value).toBe('a'.repeat(50));
		});
	});

	Scenario('Creating a Username with too short value', ({ When, Then }) => {
		let createShort: () => void;
		When('I try to create a Username with "ab"', () => {
			createShort = () => new ValueObjects.Username('ab').valueOf();
		});
		Then(
			'an error should be thrown indicating the value is too short',
			() => {
				expect(createShort).throws('Username must be at least 3 characters');
			},
		);
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
		When('I try to create a Username with "john@doe"', () => {
			createInvalid = () => new ValueObjects.Username('john@doe').valueOf();
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
		When('I create a FirstName with "John"', () => {
			value = new ValueObjects.FirstName('John').valueOf();
		});
		Then('the value should be "John"', () => {
			expect(value).toBe('John');
		});
	});

	Scenario(
		'Creating a FirstName with maximum length value',
		({ When, Then }) => {
			let value: string;
			When('I create a FirstName with a string of 100 characters', () => {
				value = new ValueObjects.FirstName('J'.repeat(100)).valueOf();
			});
			Then('the value should be that 100-character string', () => {
				expect(value).toBe('J'.repeat(100));
			});
		},
	);

	Scenario('Creating a FirstName with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When('I try to create a FirstName with a string of 101 characters', () => {
			createLong = () => new ValueObjects.FirstName('J'.repeat(101)).valueOf();
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
		When('I create a LastName with "Doe"', () => {
			value = new ValueObjects.LastName('Doe').valueOf();
		});
		Then('the value should be "Doe"', () => {
			expect(value).toBe('Doe');
		});
	});

	Scenario('Creating a LastName with maximum length value', ({ When, Then }) => {
		let value: string;
		When('I create a LastName with a string of 100 characters', () => {
			value = new ValueObjects.LastName('D'.repeat(100)).valueOf();
		});
		Then('the value should be that 100-character string', () => {
			expect(value).toBe('D'.repeat(100));
		});
	});

	Scenario('Creating a LastName with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When('I try to create a LastName with a string of 101 characters', () => {
			createLong = () => new ValueObjects.LastName('D'.repeat(101)).valueOf();
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

	// Address
	Scenario('Creating an Address with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create an Address with "123 Main St"', () => {
			value = new ValueObjects.Address('123 Main St').valueOf();
		});
		Then('the value should be "123 Main St"', () => {
			expect(value).toBe('123 Main St');
		});
	});

	Scenario('Creating an Address with maximum length value', ({ When, Then }) => {
		let value: string;
		When('I create an Address with a string of 200 characters', () => {
			value = new ValueObjects.Address('A'.repeat(200)).valueOf();
		});
		Then('the value should be that 200-character string', () => {
			expect(value).toBe('A'.repeat(200));
		});
	});

	Scenario('Creating an Address with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When('I try to create an Address with a string of 201 characters', () => {
			createLong = () => new ValueObjects.Address('A'.repeat(201)).valueOf();
		});
		Then('an error should be thrown indicating the value is too long', () => {
			expect(createLong).throws('Address cannot exceed 200 characters');
		});
	});

	Scenario('Creating an Address with empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create an Address with an empty string', () => {
			createEmpty = () => new ValueObjects.Address('').valueOf();
		});
		Then(
			'an error should be thrown indicating the value cannot be empty',
			() => {
				expect(createEmpty).throws('Address cannot be empty');
			},
		);
	});

	// City
	Scenario('Creating a City with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create a City with "New York"', () => {
			value = new ValueObjects.City('New York').valueOf();
		});
		Then('the value should be "New York"', () => {
			expect(value).toBe('New York');
		});
	});

	Scenario('Creating a City with maximum length value', ({ When, Then }) => {
		let value: string;
		When('I create a City with a string of 100 characters', () => {
			value = new ValueObjects.City('C'.repeat(100)).valueOf();
		});
		Then('the value should be that 100-character string', () => {
			expect(value).toBe('C'.repeat(100));
		});
	});

	Scenario('Creating a City with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When('I try to create a City with a string of 101 characters', () => {
			createLong = () => new ValueObjects.City('C'.repeat(101)).valueOf();
		});
		Then('an error should be thrown indicating the value is too long', () => {
			expect(createLong).throws('City cannot exceed 100 characters');
		});
	});

	Scenario('Creating a City with empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a City with an empty string', () => {
			createEmpty = () => new ValueObjects.City('').valueOf();
		});
		Then(
			'an error should be thrown indicating the value cannot be empty',
			() => {
				expect(createEmpty).throws('City cannot be empty');
			},
		);
	});

	// State
	Scenario('Creating a State with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create a State with "California"', () => {
			value = new ValueObjects.State('California').valueOf();
		});
		Then('the value should be "California"', () => {
			expect(value).toBe('California');
		});
	});

	Scenario('Creating a State with maximum length value', ({ When, Then }) => {
		let value: string;
		When('I create a State with a string of 100 characters', () => {
			value = new ValueObjects.State('S'.repeat(100)).valueOf();
		});
		Then('the value should be that 100-character string', () => {
			expect(value).toBe('S'.repeat(100));
		});
	});

	Scenario('Creating a State with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When('I try to create a State with a string of 101 characters', () => {
			createLong = () => new ValueObjects.State('S'.repeat(101)).valueOf();
		});
		Then('an error should be thrown indicating the value is too long', () => {
			expect(createLong).throws('State cannot exceed 100 characters');
		});
	});

	Scenario('Creating a State with empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a State with an empty string', () => {
			createEmpty = () => new ValueObjects.State('').valueOf();
		});
		Then(
			'an error should be thrown indicating the value cannot be empty',
			() => {
				expect(createEmpty).throws('State cannot be empty');
			},
		);
	});

	// Country
	Scenario('Creating a Country with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create a Country with "United States"', () => {
			value = new ValueObjects.Country('United States').valueOf();
		});
		Then('the value should be "United States"', () => {
			expect(value).toBe('United States');
		});
	});

	Scenario('Creating a Country with maximum length value', ({ When, Then }) => {
		let value: string;
		When('I create a Country with a string of 100 characters', () => {
			value = new ValueObjects.Country('C'.repeat(100)).valueOf();
		});
		Then('the value should be that 100-character string', () => {
			expect(value).toBe('C'.repeat(100));
		});
	});

	Scenario('Creating a Country with too long value', ({ When, Then }) => {
		let createLong: () => void;
		When('I try to create a Country with a string of 101 characters', () => {
			createLong = () => new ValueObjects.Country('C'.repeat(101)).valueOf();
		});
		Then('an error should be thrown indicating the value is too long', () => {
			expect(createLong).throws('Country cannot exceed 100 characters');
		});
	});

	Scenario('Creating a Country with empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a Country with an empty string', () => {
			createEmpty = () => new ValueObjects.Country('').valueOf();
		});
		Then(
			'an error should be thrown indicating the value cannot be empty',
			() => {
				expect(createEmpty).throws('Country cannot be empty');
			},
		);
	});

	// ZipCode
	Scenario('Creating a ZipCode with a valid 5-digit value', ({ When, Then }) => {
		let value: string;
		When('I create a ZipCode with "12345"', () => {
			value = new ValueObjects.ZipCode('12345').valueOf();
		});
		Then('the value should be "12345"', () => {
			expect(value).toBe('12345');
		});
	});

	Scenario(
		'Creating a ZipCode with a valid 9-digit value',
		({ When, Then }) => {
			let value: string;
			When('I create a ZipCode with "12345-6789"', () => {
				value = new ValueObjects.ZipCode('12345-6789').valueOf();
			});
			Then('the value should be "12345-6789"', () => {
				expect(value).toBe('12345-6789');
			});
		},
	);

	Scenario('Creating a ZipCode with invalid format', ({ When, Then }) => {
		let createInvalid: () => void;
		When('I try to create a ZipCode with "1234"', () => {
			createInvalid = () => new ValueObjects.ZipCode('1234').valueOf();
		});
		Then(
			'an error should be thrown indicating invalid zip code format',
			() => {
				expect(createInvalid).throws('Invalid zip code format');
			},
		);
	});

	Scenario('Creating a ZipCode with empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a ZipCode with an empty string', () => {
			createEmpty = () => new ValueObjects.ZipCode('').valueOf();
		});
		Then(
			'an error should be thrown indicating the value cannot be empty',
			() => {
				expect(createEmpty).throws('Zip code cannot be empty');
			},
		);
	});
});
