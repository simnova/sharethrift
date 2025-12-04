import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { AdminUserAccount } from './admin-user-account.ts';
import type { AdminUserAccountProps } from './admin-user-account.entity.ts';
import type { UserVisa } from '../user.visa.ts';
import type { AdminUserAggregateRoot } from './admin-user.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user-account.feature'),
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

function makeAccountProps(
	overrides: Partial<AdminUserAccountProps> = {},
): AdminUserAccountProps {
	return {
		accountType: 'admin',
		email: 'test@example.com',
		username: 'testuser',
		profile: {
			firstName: 'Test',
			lastName: 'User',
			aboutMe: 'Test bio',
			location: {
				address1: '123 Test St',
				address2: null,
				city: 'Test City',
				state: 'TS',
				country: 'USA',
				zipCode: '12345',
			},
		},
		...overrides,
	};
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let visa: UserVisa;
	let root: AdminUserAggregateRoot;
	let accountProps: AdminUserAccountProps;
	let account: AdminUserAccount;

	BeforeEachScenario(() => {
		visa = makeVisa(true);
		root = makeRoot(false);
		accountProps = makeAccountProps();
		account = new AdminUserAccount(accountProps, visa, root);
	});

	Background(({ Given, And }) => {
		Given('I have a valid user visa', () => {
			visa = makeVisa(true);
		});
		And('I have an admin user aggregate root', () => {
			root = makeRoot(false);
		});
		And('I have admin user account props', () => {
			accountProps = makeAccountProps();
		});
	});

	Scenario(
		'Getting accountType property',
		({ Given, When, Then }) => {
			Given('an admin user account with accountType "admin"', () => {
				accountProps = makeAccountProps({ accountType: 'admin' });
				account = new AdminUserAccount(accountProps, visa, root);
			});

			When('I access the accountType property', () => {
				// Access the property
			});

			Then('it should return "admin"', () => {
				expect(account.accountType).toBe('admin');
			});
		},
	);

	Scenario(
		'Getting email property',
		({ Given, When, Then }) => {
			Given('an admin user account with email "test@example.com"', () => {
				accountProps = makeAccountProps({ email: 'test@example.com' });
				account = new AdminUserAccount(accountProps, visa, root);
			});

			When('I access the email property', () => {
				// Access the property
			});

			Then('it should return "test@example.com"', () => {
				expect(account.email).toBe('test@example.com');
			});
		},
	);

	Scenario(
		'Getting username property',
		({ Given, When, Then }) => {
			Given('an admin user account with username "testuser"', () => {
				accountProps = makeAccountProps({ username: 'testuser' });
				account = new AdminUserAccount(accountProps, visa, root);
			});

			When('I access the username property', () => {
				// Access the property
			});

			Then('it should return "testuser"', () => {
				expect(account.username).toBe('testuser');
			});
		},
	);

	Scenario(
		'Setting accountType with proper permissions',
		({ Given, And, When, Then }) => {
			Given('an admin user account', () => {
				accountProps = makeAccountProps();
				visa = makeVisa(true);
				root = makeRoot(false);
				account = new AdminUserAccount(accountProps, visa, root);
			});

			And('the user is editing their own account', () => {
				// Already set in makeVisa(true)
			});

			When('I set accountType to "superadmin"', () => {
				account.accountType = 'superadmin';
			});

			Then('the accountType should be updated', () => {
				expect(account.accountType).toBe('superadmin');
			});
		},
	);

	Scenario(
		'Setting accountType without permissions',
		({ Given, And, When, Then }) => {
			let setWithoutPermission: () => void;

			Given('an admin user account', () => {
				accountProps = makeAccountProps();
				visa = makeVisa(false);
				root = makeRoot(false);
				account = new AdminUserAccount(accountProps, visa, root);
			});

			And('the user is not editing their own account', () => {
				// Already set in makeVisa(false)
			});

			When('I attempt to set accountType', () => {
				setWithoutPermission = () => {
					account.accountType = 'superadmin';
				};
			});

			Then('a permission error should be thrown', () => {
				expect(setWithoutPermission).toThrow(DomainSeedwork.PermissionError);
				expect(setWithoutPermission).throws(
					'Unauthorized to set account details',
				);
			});
		},
	);

	Scenario(
		'Getting profile property',
		({ Given, When, Then }) => {
			Given('an admin user account', () => {
				accountProps = makeAccountProps();
				account = new AdminUserAccount(accountProps, visa, root);
			});

			When('I access the profile property', () => {
				// Access the property
			});

			Then('it should return an AdminUserProfile instance', () => {
				expect(account.profile).toBeDefined();
				expect(account.profile.firstName).toBe('Test');
			});
		},
	);
});
