import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminUserPassport } from './admin-user.passport.ts';
import type { AdminUserEntityReference } from '../../../contexts/user/admin-user/admin-user.entity.ts';
import { AdminUserUserPassport } from './admin-user.user.passport.ts';
import { AdminUserListingPassport } from './contexts/admin-user.listing.passport.ts';
import { AdminUserConversationPassport } from './contexts/admin-user.conversation.passport.ts';
import { AdminUserReservationRequestPassport } from './contexts/admin-user.reservation-request.passport.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.passport.feature'),
);

test.for(feature, ({ Background, Scenario }) => {
	let adminUser: AdminUserEntityReference;
	let passport: AdminUserPassport;

	Background(({ Given }) => {
		Given('a valid AdminUserEntityReference', () => {
			adminUser = {
				id: 'admin-user-123',
			} as AdminUserEntityReference;
		});
	});

	Scenario(
		'Creating an AdminUserPassport with a valid admin user',
		({ When, Then }) => {
			When('I create an AdminUserPassport with the admin user', () => {
				passport = new AdminUserPassport(adminUser);
			});

			Then('the passport should be created successfully', () => {
				expect(passport).toBeInstanceOf(AdminUserPassport);
			});
		},
	);

	Scenario('Accessing the user passport', ({ When, And, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let userPassport: any;

		When('I create an AdminUserPassport with a valid admin user', () => {
			passport = new AdminUserPassport(adminUser);
		});

		And('I access the user property', () => {
			userPassport = passport.user;
		});

		Then('I should receive an AdminUserUserPassport instance', () => {
			expect(userPassport).toBeInstanceOf(AdminUserUserPassport);
		});
	});

	Scenario('Accessing the listing passport', ({ When, And, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let listingPassport: any;

		When('I create an AdminUserPassport with a valid admin user', () => {
			passport = new AdminUserPassport(adminUser);
		});

		And('I access the listing property', () => {
			listingPassport = passport.listing;
		});

		Then('I should receive an AdminUserListingPassport instance', () => {
			expect(listingPassport).toBeInstanceOf(AdminUserListingPassport);
		});
	});

	Scenario('Accessing the conversation passport', ({ When, And, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let conversationPassport: any;

		When('I create an AdminUserPassport with a valid admin user', () => {
			passport = new AdminUserPassport(adminUser);
		});

		And('I access the conversation property', () => {
			conversationPassport = passport.conversation;
		});

		Then('I should receive an AdminUserConversationPassport instance', () => {
			expect(conversationPassport).toBeInstanceOf(AdminUserConversationPassport);
		});
	});

	Scenario(
		'Accessing the reservation request passport',
		({ When, And, Then }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let reservationRequestPassport: any;

			When('I create an AdminUserPassport with a valid admin user', () => {
				passport = new AdminUserPassport(adminUser);
			});

			And('I access the reservationRequest property', () => {
				reservationRequestPassport = passport.reservationRequest;
			});

			Then(
				'I should receive an AdminUserReservationRequestPassport instance',
				() => {
					expect(reservationRequestPassport).toBeInstanceOf(
						AdminUserReservationRequestPassport,
					);
				},
			);
		},
	);
});
