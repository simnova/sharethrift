import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminRoleReservationRequestPermissions } from './admin-role-reservation-request-permissions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/admin-role-reservation-request-permissions.feature',
	),
);

test.for(feature, ({ Scenario }) => {
	const makeReservationRequestPermissions = () =>
		new AdminRoleReservationRequestPermissions({
			canViewAllReservations: true,
			canApproveReservations: true,
			canRejectReservations: true,
			canCancelReservations: true,
			canEditReservations: false,
			canModerateReservations: true,
		});

	const makeReservationRequestPermissionsAllFalse = () =>
		new AdminRoleReservationRequestPermissions({
			canViewAllReservations: false,
			canApproveReservations: false,
			canRejectReservations: false,
			canCancelReservations: false,
			canEditReservations: false,
			canModerateReservations: false,
		});

	Scenario(
		'Admin role reservation request permissions should have canViewAllReservations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role reservation request permissions', () => {
				permissions = makeReservationRequestPermissions();
			});

			When('I access the canViewAllReservations property', () => {
				value = permissions.canViewAllReservations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role reservation request permissions should have canApproveReservations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role reservation request permissions', () => {
				permissions = makeReservationRequestPermissions();
			});

			When('I access the canApproveReservations property', () => {
				value = permissions.canApproveReservations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role reservation request permissions should have canRejectReservations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role reservation request permissions', () => {
				permissions = makeReservationRequestPermissions();
			});

			When('I access the canRejectReservations property', () => {
				value = permissions.canRejectReservations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role reservation request permissions should have canCancelReservations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role reservation request permissions', () => {
				permissions = makeReservationRequestPermissions();
			});

			When('I access the canCancelReservations property', () => {
				value = permissions.canCancelReservations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role reservation request permissions should have canEditReservations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role reservation request permissions', () => {
				permissions = makeReservationRequestPermissions();
			});

			When('I access the canEditReservations property', () => {
				value = permissions.canEditReservations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role reservation request permissions should have canModerateReservations',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role reservation request permissions', () => {
				permissions = makeReservationRequestPermissions();
			});

			When('I access the canModerateReservations property', () => {
				value = permissions.canModerateReservations;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Setting canViewAllReservations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;

			Given(
				'I have admin role reservation request permissions with canViewAllReservations false',
				() => {
					permissions = makeReservationRequestPermissionsAllFalse();
				},
			);

			When('I set canViewAllReservations to true', () => {
				permissions.canViewAllReservations = true;
			});

			Then('canViewAllReservations should be true', () => {
				expect(permissions.canViewAllReservations).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canApproveReservations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;

			Given(
				'I have admin role reservation request permissions with canApproveReservations false',
				() => {
					permissions = makeReservationRequestPermissionsAllFalse();
				},
			);

			When('I set canApproveReservations to true', () => {
				permissions.canApproveReservations = true;
			});

			Then('canApproveReservations should be true', () => {
				expect(permissions.canApproveReservations).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canRejectReservations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;

			Given(
				'I have admin role reservation request permissions with canRejectReservations false',
				() => {
					permissions = makeReservationRequestPermissionsAllFalse();
				},
			);

			When('I set canRejectReservations to true', () => {
				permissions.canRejectReservations = true;
			});

			Then('canRejectReservations should be true', () => {
				expect(permissions.canRejectReservations).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canCancelReservations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;

			Given(
				'I have admin role reservation request permissions with canCancelReservations false',
				() => {
					permissions = makeReservationRequestPermissionsAllFalse();
				},
			);

			When('I set canCancelReservations to true', () => {
				permissions.canCancelReservations = true;
			});

			Then('canCancelReservations should be true', () => {
				expect(permissions.canCancelReservations).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canEditReservations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;

			Given(
				'I have admin role reservation request permissions with canEditReservations false',
				() => {
					permissions = makeReservationRequestPermissionsAllFalse();
				},
			);

			When('I set canEditReservations to true', () => {
				permissions.canEditReservations = true;
			});

			Then('canEditReservations should be true', () => {
				expect(permissions.canEditReservations).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canModerateReservations should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleReservationRequestPermissions;

			Given(
				'I have admin role reservation request permissions with canModerateReservations false',
				() => {
					permissions = makeReservationRequestPermissionsAllFalse();
				},
			);

			When('I set canModerateReservations to true', () => {
				permissions.canModerateReservations = true;
			});

			Then('canModerateReservations should be true', () => {
				expect(permissions.canModerateReservations).toBe(true);
			});
		},
	);
});
