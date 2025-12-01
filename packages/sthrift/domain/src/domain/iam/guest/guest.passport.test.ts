import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { GuestPassport } from './guest.passport.ts';
import { GuestUserPassport } from './contexts/guest.user.passport.ts';
import { GuestListingPassport } from './contexts/guest.listing.passport.ts';
import { GuestConversationPassport } from './contexts/guest.conversation.passport.ts';
import { GuestReservationRequestPassport } from './contexts/guest.reservation-request.passport.ts';
import { GuestAccountPlanPassport } from './contexts/guest.account-plan.passport.ts';
import { GuestAppealRequestPassport } from './contexts/guest.appeal-request.passport.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/guest.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	let guestPassport: GuestPassport;

	Scenario('Creating GuestPassport and accessing user passport', ({ When, And, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let userPassport1: any;
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let userPassport2: any;

		When('I create a GuestPassport', () => {
			guestPassport = new GuestPassport();
		});

		And('I access the user property', () => {
			userPassport1 = guestPassport.user;
		});

		Then('it should return a GuestUserPassport instance', () => {
			expect(userPassport1).toBeInstanceOf(GuestUserPassport);
		});

		And('accessing user property again should return the same instance', () => {
			userPassport2 = guestPassport.user;
			expect(userPassport1).toBe(userPassport2);
		});
	});

	Scenario('Creating GuestPassport and accessing listing passport', ({ When, Then, And }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let listingPassport1: any;
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let listingPassport2: any;

		When('I create a GuestPassport', () => {
			guestPassport = new GuestPassport();
		});

		And('I access the listing property', () => {
			listingPassport1 = guestPassport.listing;
		});

		Then('it should return a GuestListingPassport instance', () => {
			expect(listingPassport1).toBeInstanceOf(GuestListingPassport);
		});

		And('accessing listing property again should return the same instance', () => {
			listingPassport2 = guestPassport.listing;
			expect(listingPassport1).toBe(listingPassport2);
		});
	});

	Scenario('Creating GuestPassport and accessing conversation passport', ({ When, Then, And }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let conversationPassport1: any;
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let conversationPassport2: any;

		When('I create a GuestPassport', () => {
			guestPassport = new GuestPassport();
		});

		And('I access the conversation property', () => {
			conversationPassport1 = guestPassport.conversation;
		});

		Then('it should return a GuestConversationPassport instance', () => {
			expect(conversationPassport1).toBeInstanceOf(GuestConversationPassport);
		});
		
		And('accessing conversation property again should return the same instance', () => {
			conversationPassport2 = guestPassport.conversation;
			expect(conversationPassport1).toBe(conversationPassport2);
		});
	});

	Scenario('Creating GuestPassport and accessing reservation request passport', ({ When, Then, And }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let reservationPassport1: any;
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let reservationPassport2: any;

		When('I create a GuestPassport', () => {
			guestPassport = new GuestPassport();
		});

		And('I access the reservationRequest property', () => {
			reservationPassport1 = guestPassport.reservationRequest;
		});

		Then('it should return a GuestReservationRequestPassport instance', () => {
			expect(reservationPassport1).toBeInstanceOf(GuestReservationRequestPassport);
		});

		And('accessing reservationRequest property again should return the same instance', () => {
			reservationPassport2 = guestPassport.reservationRequest;
			expect(reservationPassport1).toBe(reservationPassport2);
		});
	});

	Scenario('Creating GuestPassport and accessing account plan passport', ({ When, Then, And }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let accountPlanPassport1: any;
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let accountPlanPassport2: any;

		When('I create a GuestPassport', () => {
			guestPassport = new GuestPassport();
		});

		And('I access the accountPlan property', () => {
			accountPlanPassport1 = guestPassport.accountPlan;
		});

		Then('it should return a GuestAccountPlanPassport instance', () => {
			expect(accountPlanPassport1).toBeInstanceOf(GuestAccountPlanPassport);
		});

		And('accessing accountPlan property again should return the same instance', () => {
			accountPlanPassport2 = guestPassport.accountPlan;
			expect(accountPlanPassport1).toBe(accountPlanPassport2);
		});
	});

	Scenario('Creating GuestPassport and accessing appeal request passport', ({ When, Then, And }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let appealRequestPassport1: any;
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let appealRequestPassport2: any;

		When('I create a GuestPassport', () => {
			guestPassport = new GuestPassport();
		});

		And('I access the appealRequest property', () => {
			appealRequestPassport1 = guestPassport.appealRequest;
		});

		Then('it should return a GuestAppealRequestPassport instance', () => {
			expect(appealRequestPassport1).toBeInstanceOf(GuestAppealRequestPassport);
		});

		And('accessing appealRequest property again should return the same instance', () => {
			appealRequestPassport2 = guestPassport.appealRequest;
			expect(appealRequestPassport1).toBe(appealRequestPassport2);
		});
	});
});
