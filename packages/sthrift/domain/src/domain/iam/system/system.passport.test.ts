import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { SystemAccountPlanPassport } from './contexts/system.account-plan.passport.ts';
import { SystemAppealRequestPassport } from './contexts/system.appeal-request.passport.ts';
import { SystemConversationPassport } from './contexts/system.conversation.passport.ts';
import { SystemListingPassport } from './contexts/system.listing.passport.ts';
import { SystemReservationRequestPassport } from './contexts/system.reservation-request.ts';
import { SystemUserPassport } from './contexts/system.user.passport.ts';
import { SystemPassport } from './system.passport.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/system.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	let systemPassport: SystemPassport;

	Scenario(
		'Creating SystemPassport and accessing user passport',
		({ Given, When, And, Then }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let userPassport1: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let userPassport2: any;

			Given('I have a set of system permissions', () => {
				// System permissions are built into SystemPassport
			});

			When('I create a SystemPassport with those permissions', () => {
				systemPassport = new SystemPassport();
			});

			And('I access the user property', () => {
				userPassport1 = systemPassport.user;
			});

			Then(
				'it should return a SystemUserPassport instance initialized with those permissions',
				() => {
					expect(userPassport1).toBeInstanceOf(SystemUserPassport);
				},
			);

			And(
				'accessing user property again should return the same instance',
				() => {
					userPassport2 = systemPassport.user;
					expect(userPassport1).toBe(userPassport2);
				},
			);
		},
	);

	Scenario(
		'Creating SystemPassport and accessing listing passport',
		({ Given, When, And, Then }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let listingPassport1: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let listingPassport2: any;

			Given('I have a set of system permissions', () => {
				// System permissions are built into SystemPassport
			});

			When('I create a SystemPassport with those permissions', () => {
				systemPassport = new SystemPassport();
			});

			And('I access the listing property', () => {
				listingPassport1 = systemPassport.listing;
			});

			Then(
				'it should return a SystemListingPassport instance initialized with those permissions',
				() => {
					expect(listingPassport1).toBeInstanceOf(SystemListingPassport);
				},
			);

			And(
				'accessing listing property again should return the same instance',
				() => {
					listingPassport2 = systemPassport.listing;
					expect(listingPassport1).toBe(listingPassport2);
				},
			);
		},
	);

	Scenario(
		'Creating SystemPassport and accessing conversation passport',
		({ Given, When, And, Then }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let conversationPassport1: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let conversationPassport2: any;

			Given('I have a set of system permissions', () => {
				// System permissions are built into SystemPassport
			});

			When('I create a SystemPassport with those permissions', () => {
				systemPassport = new SystemPassport();
			});

			And('I access the conversation property', () => {
				conversationPassport1 = systemPassport.conversation;
			});

			Then(
				'it should return a SystemConversationPassport instance initialized with those permissions',
				() => {
					expect(conversationPassport1).toBeInstanceOf(
						SystemConversationPassport,
					);
				},
			);

			And(
				'accessing conversation property again should return the same instance',
				() => {
					conversationPassport2 = systemPassport.conversation;
					expect(conversationPassport1).toBe(conversationPassport2);
				},
			);
		},
	);

	Scenario(
		'Creating SystemPassport and accessing reservation request passport',
		({ Given, When, And, Then }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let reservationPassport1: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let reservationPassport2: any;

			Given('I have a set of system permissions', () => {
				// System permissions are built into SystemPassport
			});

			When('I create a SystemPassport with those permissions', () => {
				systemPassport = new SystemPassport();
			});

			And('I access the reservationRequest property', () => {
				reservationPassport1 = systemPassport.reservationRequest;
			});

			Then(
				'it should return a SystemReservationRequestPassport instance initialized with those permissions',
				() => {
					expect(reservationPassport1).toBeInstanceOf(
						SystemReservationRequestPassport,
					);
				},
			);

			And(
				'accessing reservationRequest property again should return the same instance',
				() => {
					reservationPassport2 = systemPassport.reservationRequest;
					expect(reservationPassport1).toBe(reservationPassport2);
				},
			);
		},
	);

	Scenario(
		'Creating SystemPassport and accessing account plan passport',
		({ Given, When, And, Then }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let accountPlanPassport1: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let accountPlanPassport2: any;

			Given('I have a set of system permissions', () => {
				// System permissions are built into SystemPassport
			});

			When('I create a SystemPassport with those permissions', () => {
				systemPassport = new SystemPassport();
			});

			And('I access the accountPlan property', () => {
				accountPlanPassport1 = systemPassport.accountPlan;
			});

			Then(
				'it should return a SystemAccountPlanPassport instance initialized with those permissions',
				() => {
					expect(accountPlanPassport1).toBeInstanceOf(
						SystemAccountPlanPassport,
					);
				},
			);

			And(
				'accessing accountPlan property again should return the same instance',
				() => {
					accountPlanPassport2 = systemPassport.accountPlan;
					expect(accountPlanPassport1).toBe(accountPlanPassport2);
				},
			);
		},
	);

	Scenario(
		'Creating SystemPassport and accessing appeal request passport',
		({ Given, When, And, Then }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let appealRequestPassport1: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let appealRequestPassport2: any;

			Given('I have a set of system permissions', () => {
				// System permissions are built into SystemPassport
			});

			When('I create a SystemPassport with those permissions', () => {
				systemPassport = new SystemPassport();
			});

			And('I access the appealRequest property', () => {
				appealRequestPassport1 = systemPassport.appealRequest;
			});

			Then(
				'it should return a SystemAppealRequestPassport instance initialized with those permissions',
				() => {
					expect(appealRequestPassport1).toBeInstanceOf(
						SystemAppealRequestPassport,
					);
				},
			);

			And(
				'accessing appealRequest property again should return the same instance',
				() => {
					appealRequestPassport2 = systemPassport.appealRequest;
					expect(appealRequestPassport1).toBe(appealRequestPassport2);
				},
			);
		},
	);
});
