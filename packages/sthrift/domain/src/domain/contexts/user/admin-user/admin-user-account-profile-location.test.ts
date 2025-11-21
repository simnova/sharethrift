import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { AdminUserAccountProfileLocation } from './admin-user-account-profile-location.ts';
import type { AdminUserAccountProfileLocationProps } from './admin-user-account-profile-location.entity.ts';
import type { UserVisa } from '../user.visa.ts';
import type { AdminUserAggregateRoot } from './admin-user.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user-account-profile-location.feature'),
);

function makeVisa(isEditingOwn = true): UserVisa {
	return vi.mocked({
		determineIf: (fn: (p: { isEditingOwnAccount: boolean }) => boolean) =>
			fn({ isEditingOwnAccount: isEditingOwn }),
	} as unknown as UserVisa);
}

function makeRoot(isNew = false): AdminUserAggregateRoot {
	return vi.mocked({
		isNew,
	} as unknown as AdminUserAggregateRoot);
}

function makeLocationProps(
	overrides: Partial<AdminUserAccountProfileLocationProps> = {},
): AdminUserAccountProfileLocationProps {
	return {
		address1: '123 Main St',
		address2: null,
		city: 'New York',
		state: 'NY',
		country: 'USA',
		zipCode: '10001',
		...overrides,
	};
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let visa: UserVisa;
	let root: AdminUserAggregateRoot;
	let locationProps: AdminUserAccountProfileLocationProps;
	let location: AdminUserAccountProfileLocation;

	BeforeEachScenario(() => {
		visa = makeVisa(true);
		root = makeRoot(false);
		locationProps = makeLocationProps();
		location = new AdminUserAccountProfileLocation(locationProps, visa, root);
	});

	Background(({ Given, And }) => {
		Given('I have a valid user visa', () => {
			visa = makeVisa(true);
		});
		And('I have an admin user aggregate root', () => {
			root = makeRoot(false);
		});
		And('I have admin user location props', () => {
			locationProps = makeLocationProps();
		});
	});

	Scenario(
		'Getting address1 property',
		({ Given, When, Then }) => {
			Given('an admin user location with address1 "123 Main St"', () => {
				locationProps = makeLocationProps({ address1: '123 Main St' });
				location = new AdminUserAccountProfileLocation(
					locationProps,
					visa,
					root,
				);
			});

			When('I access the address1 property', () => {
				// Access the property
			});

			Then('it should return "123 Main St"', () => {
				expect(location.address1).toBe('123 Main St');
			});
		},
	);

	Scenario(
		'Getting city property',
		({ Given, When, Then }) => {
			Given('an admin user location with city "New York"', () => {
				locationProps = makeLocationProps({ city: 'New York' });
				location = new AdminUserAccountProfileLocation(
					locationProps,
					visa,
					root,
				);
			});

			When('I access the city property', () => {
				// Access the property
			});

			Then('it should return "New York"', () => {
				expect(location.city).toBe('New York');
			});
		},
	);

	Scenario(
		'Getting state property',
		({ Given, When, Then }) => {
			Given('an admin user location with state "NY"', () => {
				locationProps = makeLocationProps({ state: 'NY' });
				location = new AdminUserAccountProfileLocation(
					locationProps,
					visa,
					root,
				);
			});

			When('I access the state property', () => {
				// Access the property
			});

			Then('it should return "NY"', () => {
				expect(location.state).toBe('NY');
			});
		},
	);

	Scenario(
		'Getting country property',
		({ Given, When, Then }) => {
			Given('an admin user location with country "USA"', () => {
				locationProps = makeLocationProps({ country: 'USA' });
				location = new AdminUserAccountProfileLocation(
					locationProps,
					visa,
					root,
				);
			});

			When('I access the country property', () => {
				// Access the property
			});

			Then('it should return "USA"', () => {
				expect(location.country).toBe('USA');
			});
		},
	);

	Scenario(
		'Getting zipCode property',
		({ Given, When, Then }) => {
			Given('an admin user location with zipCode "10001"', () => {
				locationProps = makeLocationProps({ zipCode: '10001' });
				location = new AdminUserAccountProfileLocation(
					locationProps,
					visa,
					root,
				);
			});

			When('I access the zipCode property', () => {
				// Access the property
			});

			Then('it should return "10001"', () => {
				expect(location.zipCode).toBe('10001');
			});
		},
	);

	Scenario(
		'Setting address1 with proper permissions',
		({ Given, And, When, Then }) => {
			Given('an admin user location', () => {
				locationProps = makeLocationProps();
				visa = makeVisa(true);
				root = makeRoot(false);
				location = new AdminUserAccountProfileLocation(
					locationProps,
					visa,
					root,
				);
			});

			And('the user is editing their own account', () => {
				// Already set in makeVisa(true)
			});

			When('I set address1 to "456 Elm St"', () => {
				location.address1 = '456 Elm St';
			});

			Then('the address1 should be updated', () => {
				expect(location.address1).toBe('456 Elm St');
			});
		},
	);

	Scenario(
		'Setting location fields without permissions',
		({ Given, And, When, Then }) => {
			let setWithoutPermission: () => void;

			Given('an admin user location', () => {
				locationProps = makeLocationProps();
				visa = makeVisa(false);
				root = makeRoot(false);
				location = new AdminUserAccountProfileLocation(
					locationProps,
					visa,
					root,
				);
			});

			And('the user is not editing their own account', () => {
				// Already set in makeVisa(false)
			});

			When('I attempt to set address1', () => {
				setWithoutPermission = () => {
					location.address1 = '456 Elm St';
				};
			});

			Then('a permission error should be thrown', () => {
				expect(setWithoutPermission).toThrow(DomainSeedwork.PermissionError);
				expect(setWithoutPermission).throws(
					'Unauthorized to set location info',
				);
			});
		},
	);
});
