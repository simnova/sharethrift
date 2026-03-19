import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserPassport } from './personal-user.passport.ts';
import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/personal-user.entity.ts';
import { PersonalUserUserPassport } from './contexts/personal-user.user.passport.ts';
import { PersonalUserListingPassport } from './contexts/personal-user.listing.passport.ts';
import { PersonalUserConversationPassport } from './contexts/personal-user.conversation.passport.ts';
import { PersonalUserReservationRequestPassport } from './contexts/personal-user.reservation-request.passport.ts';
import { PersonalUserAccountPlanPassport } from './contexts/personal-user.account-plan.passport.ts';
import { PersonalUserAppealRequestPassport } from './contexts/personal-user.appeal-request.passport.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.passport.feature'),
);

test.for(feature, ({ Background, Scenario }) => {
	let personalUser: PersonalUserEntityReference;
	let passport: PersonalUserPassport;

	Background(({ Given }) => {
		Given('a valid PersonalUserEntityReference', () => {
			personalUser = {
				id: 'user123',
			} as PersonalUserEntityReference;
		});
	});

	Scenario('Creating a PersonalUserPassport with a valid personal user', ({ When, Then }) => {
		When('I create a PersonalUserPassport with the personal user', () => {
			passport = new PersonalUserPassport(personalUser);
		});

		Then('the passport should be created successfully', () => {
			expect(passport).toBeInstanceOf(PersonalUserPassport);
		});
	});

	Scenario('Accessing the user passport', ({ When, And, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let userPassport: any;

		When('I create a PersonalUserPassport with a valid personal user', () => {
			passport = new PersonalUserPassport(personalUser);
		});

		And('I access the user property', () => {
			userPassport = passport.user;
		});

		Then('I should receive a PersonalUserUserPassport instance', () => {
			expect(userPassport).toBeInstanceOf(PersonalUserUserPassport);
		});
	});

	Scenario('Accessing the listing passport', ({ When, And, Then }) => {
		When('I create a PersonalUserPassport with a valid personal user', () => {
			passport = new PersonalUserPassport(personalUser);
		});

		And('I access the listing property', () => {
			// Property access happens in the Then step
		});

		Then('I should receive a PersonalUserListingPassport instance', () => {
			expect(passport.listing).toBeInstanceOf(PersonalUserListingPassport);
		});
	});

	Scenario('Accessing the conversation passport', ({ When, And, Then }) => {
		When('I create a PersonalUserPassport with a valid personal user', () => {
			passport = new PersonalUserPassport(personalUser);
		});

		And('I access the conversation property', () => {
			// Property access happens in the Then step
		});

		Then('I should receive a PersonalUserConversationPassport instance', () => {
			expect(passport.conversation).toBeInstanceOf(PersonalUserConversationPassport);
		});
	});

	Scenario('Accessing the reservation request passport', ({ When, And, Then }) => {
		When('I create a PersonalUserPassport with a valid personal user', () => {
			passport = new PersonalUserPassport(personalUser);
		});

		And('I access the reservationRequest property', () => {
			// Property access happens in the Then step
		});

		Then('I should receive a PersonalUserReservationRequestPassport instance', () => {
			expect(passport.reservationRequest).toBeInstanceOf(PersonalUserReservationRequestPassport);
		});
	});

	Scenario('Accessing the account plan passport', ({ When, And, Then }) => {
		When('I create a PersonalUserPassport with a valid personal user', () => {
			passport = new PersonalUserPassport(personalUser);
		});

		And('I access the accountPlan property', () => {
			// Property access happens in the Then step
		});

		Then('I should receive a PersonalUserAccountPlanPassport instance', () => {
			expect(passport.accountPlan).toBeInstanceOf(PersonalUserAccountPlanPassport);
		});
	});

	Scenario('Accessing the appeal request passport', ({ When, And, Then }) => {
		When('I create a PersonalUserPassport with a valid personal user', () => {
			passport = new PersonalUserPassport(personalUser);
		});

		And('I access the appealRequest property', () => {
			// Property access happens in the Then step
		});

		Then('I should receive a PersonalUserAppealRequestPassport instance', () => {
			expect(passport.appealRequest).toBeInstanceOf(PersonalUserAppealRequestPassport);
		});
	});
});
