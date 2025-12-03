import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { AdminUserProfile } from './admin-user-account-profile.ts';
import type { AdminUserProfileProps } from './admin-user-account-profile.entity.ts';
import type { UserVisa } from '../user.visa.ts';
import type { AdminUserAggregateRoot } from './admin-user.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user-account-profile.feature'),
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

function makeProfileProps(
	overrides: Partial<AdminUserProfileProps> = {},
): AdminUserProfileProps {
	return {
		firstName: 'John',
		lastName: 'Doe',
		aboutMe: 'Test bio',
		location: {
			address1: '123 Test St',
			address2: null,
			city: 'Test City',
			state: 'TS',
			country: 'USA',
			zipCode: '12345',
		},
		...overrides,
	};
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let visa: UserVisa;
	let root: AdminUserAggregateRoot;
	let profileProps: AdminUserProfileProps;
	let profile: AdminUserProfile;

	BeforeEachScenario(() => {
		visa = makeVisa(true);
		root = makeRoot(false);
		profileProps = makeProfileProps();
		profile = new AdminUserProfile(profileProps, visa, root);
	});

	Background(({ Given, And }) => {
		Given('I have a valid user visa', () => {
			visa = makeVisa(true);
		});
		And('I have an admin user aggregate root', () => {
			root = makeRoot(false);
		});
		And('I have admin user profile props', () => {
			profileProps = makeProfileProps();
		});
	});

	Scenario(
		'Getting firstName property',
		({ Given, When, Then }) => {
			Given('an admin user profile with firstName "John"', () => {
				profileProps = makeProfileProps({ firstName: 'John' });
				profile = new AdminUserProfile(profileProps, visa, root);
			});

			When('I access the firstName property', () => {
				// Access the property
			});

			Then('it should return "John"', () => {
				expect(profile.firstName).toBe('John');
			});
		},
	);

	Scenario(
		'Getting lastName property',
		({ Given, When, Then }) => {
			Given('an admin user profile with lastName "Doe"', () => {
				profileProps = makeProfileProps({ lastName: 'Doe' });
				profile = new AdminUserProfile(profileProps, visa, root);
			});

			When('I access the lastName property', () => {
				// Access the property
			});

			Then('it should return "Doe"', () => {
				expect(profile.lastName).toBe('Doe');
			});
		},
	);

	Scenario(
		'Getting aboutMe property',
		({ Given, When, Then }) => {
			Given('an admin user profile with aboutMe "Test bio"', () => {
				profileProps = makeProfileProps({ aboutMe: 'Test bio' });
				profile = new AdminUserProfile(profileProps, visa, root);
			});

			When('I access the aboutMe property', () => {
				// Access the property
			});

			Then('it should return "Test bio"', () => {
				expect(profile.aboutMe).toBe('Test bio');
			});
		},
	);

	Scenario(
		'Setting firstName with proper permissions',
		({ Given, And, When, Then }) => {
			Given('an admin user profile', () => {
				profileProps = makeProfileProps();
				visa = makeVisa(true);
				root = makeRoot(false);
				profile = new AdminUserProfile(profileProps, visa, root);
			});

			And('the user is editing their own account', () => {
				// Already set in makeVisa(true)
			});

			When('I set firstName to "Jane"', () => {
				profile.firstName = 'Jane';
			});

			Then('the firstName should be updated', () => {
				expect(profile.firstName).toBe('Jane');
			});
		},
	);

	Scenario(
		'Setting firstName without permissions',
		({ Given, And, When, Then }) => {
			let setWithoutPermission: () => void;

			Given('an admin user profile', () => {
				profileProps = makeProfileProps();
				visa = makeVisa(false);
				root = makeRoot(false);
				profile = new AdminUserProfile(profileProps, visa, root);
			});

			And('the user is not editing their own account', () => {
				// Already set in makeVisa(false)
			});

			When('I attempt to set firstName', () => {
				setWithoutPermission = () => {
					profile.firstName = 'Jane';
				};
			});

			Then('a permission error should be thrown', () => {
				expect(setWithoutPermission).toThrow(DomainSeedwork.PermissionError);
				expect(setWithoutPermission).throws(
					'Unauthorized to set account profile details',
				);
			});
		},
	);

	Scenario(
		'Getting location property',
		({ Given, When, Then }) => {
			Given('an admin user profile', () => {
				profileProps = makeProfileProps();
				profile = new AdminUserProfile(profileProps, visa, root);
			});

			When('I access the location property', () => {
				// Access the property
			});

			Then('it should return an AdminUserAccountProfileLocation instance', () => {
				expect(profile.location).toBeDefined();
				expect(profile.location.city).toBe('Test City');
			});
		},
	);
});
