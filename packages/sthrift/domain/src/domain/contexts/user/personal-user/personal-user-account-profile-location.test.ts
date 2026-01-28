import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAccountProfileLocation } from './personal-user-account-profile-location.ts';
import type { PersonalUserAccountProfileLocationProps } from './personal-user-account-profile-location.entity.ts';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/personal-user-account-profile-location.feature',
	),
);

function makeLocationProps(
	overrides?: Partial<PersonalUserAccountProfileLocationProps>,
): PersonalUserAccountProfileLocationProps {
	return {
		address1: '123 Main St',
		address2: 'Apt 4B',
		city: 'Test City',
		state: 'TS',
		country: 'Test Country',
		zipCode: '12345',
		...overrides,
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Test mock
function createMockVisa(canEdit: boolean): any {
	return {
		determineIf: (
			fn: (permissions: { isEditingOwnAccount: boolean }) => boolean,
		) => fn({ isEditingOwnAccount: canEdit }),
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Test mock
function createMockRoot(isNew: boolean): any {
	return { isNew };
}

test.for(feature, ({ Scenario }) => {
	Scenario(
		'Location value object can be created with valid props',
		({ Given, When, Then }) => {
			let props: PersonalUserAccountProfileLocationProps;
			let location: PersonalUserAccountProfileLocation;

			Given('I have location props with all fields', () => {
				props = makeLocationProps();
			});

			When('I create a PersonalUserAccountProfileLocation instance', () => {
				const visa = createMockVisa(true) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			Then('it should be created successfully', () => {
				expect(location).toBeDefined();
				expect(location).toBeInstanceOf(PersonalUserAccountProfileLocation);
			});
		},
	);

	Scenario(
		'Location address1 getter returns correct value',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;
			let value: string;

			Given('I have a location instance with address1', () => {
				const props = makeLocationProps({ address1: '456 Oak Ave' });
				const visa = createMockVisa(true) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I access the address1 property', () => {
				value = location.address1;
			});

			Then('it should return the correct address1 value', () => {
				expect(value).toBe('456 Oak Ave');
			});
		},
	);

	Scenario(
		'Location address2 getter returns correct value',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;
			let value: string | null;

			Given('I have a location instance with address2', () => {
				const props = makeLocationProps({ address2: 'Suite 100' });
				const visa = createMockVisa(true) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I access the address2 property', () => {
				value = location.address2;
			});

			Then('it should return the correct address2 value', () => {
				expect(value).toBe('Suite 100');
			});
		},
	);

	Scenario(
		'Location city getter returns correct value',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;
			let value: string;

			Given('I have a location instance with city', () => {
				const props = makeLocationProps({ city: 'Portland' });
				const visa = createMockVisa(true) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I access the city property', () => {
				value = location.city;
			});

			Then('it should return the correct city value', () => {
				expect(value).toBe('Portland');
			});
		},
	);

	Scenario(
		'Location state getter returns correct value',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;
			let value: string;

			Given('I have a location instance with state', () => {
				const props = makeLocationProps({ state: 'OR' });
				const visa = createMockVisa(true) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I access the state property', () => {
				value = location.state;
			});

			Then('it should return the correct state value', () => {
				expect(value).toBe('OR');
			});
		},
	);

	Scenario(
		'Location country getter returns correct value',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;
			let value: string;

			Given('I have a location instance with country', () => {
				const props = makeLocationProps({ country: 'Canada' });
				const visa = createMockVisa(true) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I access the country property', () => {
				value = location.country;
			});

			Then('it should return the correct country value', () => {
				expect(value).toBe('Canada');
			});
		},
	);

	Scenario(
		'Location zipCode getter returns correct value',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;
			let value: string;

			Given('I have a location instance with zipCode', () => {
				const props = makeLocationProps({ zipCode: '97201' });
				const visa = createMockVisa(true) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I access the zipCode property', () => {
				value = location.zipCode;
			});

			Then('it should return the correct zipCode value', () => {
				expect(value).toBe('97201');
			});
		},
	);

	Scenario(
		'Location address1 setter requires valid visa',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;
			let error: Error | undefined;

			Given('I have a location instance with a restrictive visa', () => {
				const props = makeLocationProps();
				const visa = createMockVisa(false) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I attempt to set address1 without permission', () => {
				try {
					location.address1 = '789 New St';
				} catch (e) {
					error = e as Error;
				}
			});

			Then('it should throw a PermissionError', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Unauthorized to set location info');
			});
		},
	);

	Scenario(
		'Location address1 setter works with valid visa',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;

			Given('I have a location instance with a permissive visa', () => {
				const props = makeLocationProps({ address1: '123 Old St' });
				const visa = createMockVisa(true) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I set the address1 property', () => {
				location.address1 = '456 New St';
			});

			Then('the address1 should be updated', () => {
				expect(location.address1).toBe('456 New St');
			});
		},
	);

	Scenario(
		'Location allows setters when entity is new',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;

			Given('I have a location instance for a new entity', () => {
				const props = makeLocationProps({ city: 'Old City' });
				const visa = createMockVisa(false) as UserVisa;
				const root = createMockRoot(true) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I set the city property', () => {
				location.city = 'New City';
			});

			Then('the city should be updated without visa check', () => {
				expect(location.city).toBe('New City');
			});
		},
	);

	Scenario(
		'Location address2 setter works with valid visa',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;

			Given(
				'I have a location instance with permissive visa for address2',
				() => {
					const props = makeLocationProps({ address2: 'Old Suite' });
					const visa = createMockVisa(true) as UserVisa;
					const root = createMockRoot(false) as PersonalUserAggregateRoot;
					location = new PersonalUserAccountProfileLocation(props, visa, root);
				},
			);

			When('I set the address2 property', () => {
				location.address2 = 'New Suite';
			});

			Then('the address2 should be updated', () => {
				expect(location.address2).toBe('New Suite');
			});
		},
	);

	Scenario(
		'Location city setter works with valid visa',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;

			Given('I have a location instance with permissive visa for city', () => {
				const props = makeLocationProps({ city: 'Old City' });
				const visa = createMockVisa(true) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I update the city property', () => {
				location.city = 'New City';
			});

			Then('the city should be updated', () => {
				expect(location.city).toBe('New City');
			});
		},
	);

	Scenario(
		'Location state setter works with valid visa',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;

			Given('I have a location instance with permissive visa for state', () => {
				const props = makeLocationProps({ state: 'Old State' });
				const visa = createMockVisa(true) as UserVisa;
				const root = createMockRoot(false) as PersonalUserAggregateRoot;
				location = new PersonalUserAccountProfileLocation(props, visa, root);
			});

			When('I set the state property', () => {
				location.state = 'New State';
			});

			Then('the state should be updated', () => {
				expect(location.state).toBe('New State');
			});
		},
	);

	Scenario(
		'Location country setter works with valid visa',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;

			Given(
				'I have a location instance with permissive visa for country',
				() => {
					const props = makeLocationProps({ country: 'Old Country' });
					const visa = createMockVisa(true) as UserVisa;
					const root = createMockRoot(false) as PersonalUserAggregateRoot;
					location = new PersonalUserAccountProfileLocation(props, visa, root);
				},
			);

			When('I set the country property', () => {
				location.country = 'New Country';
			});

			Then('the country should be updated', () => {
				expect(location.country).toBe('New Country');
			});
		},
	);

	Scenario(
		'Location zipCode setter works with valid visa',
		({ Given, When, Then }) => {
			let location: PersonalUserAccountProfileLocation;

			Given(
				'I have a location instance with permissive visa for zipCode',
				() => {
					const props = makeLocationProps({ zipCode: '11111' });
					const visa = createMockVisa(true) as UserVisa;
					const root = createMockRoot(false) as PersonalUserAggregateRoot;
					location = new PersonalUserAccountProfileLocation(props, visa, root);
				},
			);

			When('I set the zipCode property', () => {
				location.zipCode = '99999';
			});

			Then('the zipCode should be updated', () => {
				expect(location.zipCode).toBe('99999');
			});
		},
	);
});
