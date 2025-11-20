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
});
