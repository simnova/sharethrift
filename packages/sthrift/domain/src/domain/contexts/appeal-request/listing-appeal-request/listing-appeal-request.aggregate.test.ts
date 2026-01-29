import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import { ListingAppealRequest } from './listing-appeal-request.aggregate.ts';
import type { ListingAppealRequestProps } from './listing-appeal-request.entity.ts';
import type { Passport } from '../../passport.ts';
import type { AppealRequestVisa } from '../appeal-request.visa.ts';
import { PersonalUser } from '../../user/personal-user/personal-user.aggregate.ts';
import { ItemListing } from '../../listing/item/item-listing.aggregate.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/listing-appeal-request.aggregate.feature'),
);

test.for(feature, ({ Background, BeforeEachScenario, Scenario }) => {
	let passport: Passport;
	let visa: AppealRequestVisa;
	let appealRequest: ListingAppealRequest<ListingAppealRequestProps>;
	let hasPermission = true;

	Background(({ Given }) => {
		Given('a valid passport with appeal request permissions', () => {
			// Mock passport with appeal request visa
			visa = {
				determineIf: (
					check: (permissions: {
						canUpdateAppealRequestState: boolean;
					}) => boolean,
				) => {
					return check({ canUpdateAppealRequestState: hasPermission });
				},
			} as AppealRequestVisa;

			passport = {
				appealRequest: {
					forListingAppealRequest: () => visa,
				},
				user: {
					// biome-ignore lint/suspicious/noExplicitAny: Test mock
					forPersonalUser: (_entity: any) => ({}),
				},
				listing: {
					// biome-ignore lint/suspicious/noExplicitAny: Test mock
					forItemListing: (_entity: any) => ({}),
				},
			} as unknown as Passport;
		});
	});

	BeforeEachScenario(() => {
		hasPermission = true;
	});

	Scenario(
		'Creating a new ListingAppealRequest instance',
		({ When, Then, And }) => {
			let userId: string;
			let listingId: string;
			let reason: string;
			let blockerId: string;

			When(
				'I create a new ListingAppealRequest with userId "user123", listingId "listing456", reason "This listing was incorrectly blocked", and blockerId "blocker789"',
				() => {
					userId = 'user123';
					listingId = 'listing456';
					reason = 'This listing was incorrectly blocked';
					blockerId = 'blocker789';

					const props: ListingAppealRequestProps = {
						id: 'appeal1',
						// biome-ignore lint/suspicious/noExplicitAny: Test mock data
						user: { id: userId } as any,
						// biome-ignore lint/suspicious/noExplicitAny: Test mock data
						listing: { id: listingId } as any,
						reason: '',
						state: '',
						type: '',
						// biome-ignore lint/suspicious/noExplicitAny: Test mock data
						blocker: { id: blockerId } as any,
						createdAt: new Date(),
						updatedAt: new Date(),
						schemaVersion: '1.0',
						// biome-ignore lint/suspicious/noExplicitAny: Test mock data
						loadUser: async () => ({ id: userId }) as any,
						// biome-ignore lint/suspicious/noExplicitAny: Test mock data
						loadListing: async () => ({ id: listingId }) as any,
						// biome-ignore lint/suspicious/noExplicitAny: Test mock data
						loadBlocker: async () => ({ id: blockerId }) as any,
					};

					appealRequest = ListingAppealRequest.getNewInstance(
						props,
						passport,
						userId,
						listingId,
						reason,
						blockerId,
					);
				},
			);

			Then('the user id should be "user123"', () => {
				expect(appealRequest.user.id).toBe('user123');
			});

			And('the listing id should be "listing456"', () => {
				expect(appealRequest.listing.id).toBe('listing456');
			});

			And('the reason should be "This listing was incorrectly blocked"', () => {
				expect(appealRequest.reason).toBe(
					'This listing was incorrectly blocked',
				);
			});

			And('the state should be "requested"', () => {
				expect(appealRequest.state).toBe('requested');
			});

			And('the type should be "listing"', () => {
				expect(appealRequest.type).toBe('listing');
			});

			And('the blocker id should be "blocker789"', () => {
				expect(appealRequest.blocker.id).toBe('blocker789');
			});
		},
	);

	Scenario('Getting the reason', ({ When, Then }) => {
		let reasonValue: string;

		When('I get the reason from the appeal request', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason for appeal',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			reasonValue = appealRequest.reason;
		});

		Then('the reason should match the stored value', () => {
			expect(reasonValue).toBe('Test reason for appeal');
		});
	});

	Scenario('Setting the reason with permission', ({ Given, When, Then }) => {
		Given('the passport has permission to update appeal request state', () => {
			hasPermission = true;
		});

		When('I set the reason to "Updated reason for appeal"', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Original reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			appealRequest.reason = 'Updated reason for appeal';
		});

		Then('the reason should be "Updated reason for appeal"', () => {
			expect(appealRequest.reason).toBe('Updated reason for appeal');
		});
	});

	Scenario('Setting the reason without permission', ({ Given, When, Then }) => {
		let setReasonError: () => void;

		Given(
			'the passport does not have permission to update appeal request state',
			() => {
				hasPermission = false;
			},
		);

		When('I try to set the reason to "Unauthorized change"', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Original reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			setReasonError = () => {
				appealRequest.reason = 'Unauthorized change';
			};
		});

		Then(
			'a permission error should be thrown with message "You do not have permission to update the reason"',
			() => {
				expect(setReasonError).toThrow(DomainSeedwork.PermissionError);
				expect(setReasonError).toThrow(
					'You do not have permission to update the reason',
				);
			},
		);
	});

	Scenario('Getting the state', ({ When, Then }) => {
		let stateValue: string;

		When('I get the state from the appeal request', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			stateValue = appealRequest.state;
		});

		Then('the state should match the stored value', () => {
			expect(stateValue).toBe('requested');
		});
	});

	Scenario('Setting the state with permission', ({ Given, When, Then }) => {
		Given('the passport has permission to update appeal request state', () => {
			hasPermission = true;
		});

		When('I set the state to "accepted"', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			appealRequest.state = 'accepted';
		});

		Then('the state should be "accepted"', () => {
			expect(appealRequest.state).toBe('accepted');
		});
	});

	Scenario('Setting the state without permission', ({ Given, When, Then }) => {
		let setStateError: () => void;

		Given(
			'the passport does not have permission to update appeal request state',
			() => {
				hasPermission = false;
			},
		);

		When('I try to set the state to "accepted"', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			setStateError = () => {
				appealRequest.state = 'accepted';
			};
		});

		Then(
			'a permission error should be thrown with message "You do not have permission to update the state"',
			() => {
				expect(setStateError).toThrow(DomainSeedwork.PermissionError);
				expect(setStateError).toThrow(
					'You do not have permission to update the state',
				);
			},
		);
	});

	Scenario('Getting the user reference', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let userReference: any;

		When('I get the user from the appeal request', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			userReference = appealRequest.user;
		});

		Then('the user reference should be a PersonalUser entity', () => {
			expect(userReference).toBeInstanceOf(PersonalUser);
			expect(userReference.id).toBe('user1');
		});
	});

	Scenario('Getting the listing reference', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let listingReference: any;

		When('I get the listing from the appeal request', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			listingReference = appealRequest.listing;
		});

		Then('the listing reference should be an ItemListing entity', () => {
			expect(listingReference).toBeInstanceOf(ItemListing);
			expect(listingReference.id).toBe('listing1');
		});
	});

	Scenario('Getting the blocker reference', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let blockerReference: any;

		When('I get the blocker from the appeal request', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			blockerReference = appealRequest.blocker;
		});

		Then('the blocker reference should be a PersonalUser entity', () => {
			expect(blockerReference).toBeInstanceOf(PersonalUser);
			expect(blockerReference.id).toBe('blocker1');
		});
	});

	Scenario('Getting the type', ({ When, Then }) => {
		let typeValue: string;

		When('I get the type from the appeal request', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			typeValue = appealRequest.type;
		});

		Then('the type should be "listing"', () => {
			expect(typeValue).toBe('listing');
		});
	});

	Scenario('Getting createdAt timestamp', ({ When, Then }) => {
		let createdAtValue: Date;

		When('I get the createdAt from the appeal request', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			createdAtValue = appealRequest.createdAt;
		});

		Then('the createdAt should be a valid Date', () => {
			expect(createdAtValue).toBeInstanceOf(Date);
		});
	});

	Scenario('Getting updatedAt timestamp', ({ When, Then }) => {
		let updatedAtValue: Date;

		When('I get the updatedAt from the appeal request', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			updatedAtValue = appealRequest.updatedAt;
		});

		Then('the updatedAt should be a valid Date', () => {
			expect(updatedAtValue).toBeInstanceOf(Date);
		});
	});

	Scenario('Getting schemaVersion', ({ When, Then }) => {
		let schemaVersionValue: string;

		When('I get the schemaVersion from the appeal request', () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			schemaVersionValue = appealRequest.schemaVersion;
		});

		Then('the schemaVersion should be a non-empty string', () => {
			expect(schemaVersionValue).toBe('1.0');
			expect(typeof schemaVersionValue).toBe('string');
			expect(schemaVersionValue.length).toBeGreaterThan(0);
		});
	});

	Scenario('Loading the user asynchronously', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		let loadedUser: any;

		When('I call loadUser on the appeal request', async () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1', userType: 'personal' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			loadedUser = await appealRequest.loadUser();
		});

		Then('the loaded user should be a PersonalUser entity', () => {
			expect(loadedUser).toBeDefined();
			expect(loadedUser.id).toBe('user1');
		});
	});

	Scenario('Loading the listing asynchronously', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		let loadedListing: any;

		When('I call loadListing on the appeal request', async () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				loadListing: async () =>
					// biome-ignore lint/suspicious/noExplicitAny: Test mock data
					({ id: 'listing1', title: 'Test Listing' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadBlocker: async () => ({ id: 'blocker1' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			loadedListing = await appealRequest.loadListing();
		});

		Then('the loaded listing should be an ItemListing entity', () => {
			expect(loadedListing).toBeDefined();
			expect(loadedListing.id).toBe('listing1');
		});
	});

	Scenario('Loading the blocker asynchronously', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test mock data
		let loadedBlocker: any;

		When('I call loadBlocker on the appeal request', async () => {
			const props: ListingAppealRequestProps = {
				id: 'appeal1',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				user: { id: 'user1' } as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				listing: { id: 'listing1' } as any,
				reason: 'Test reason',
				state: 'requested',
				type: 'listing',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				blocker: { id: 'blocker1' } as any,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0',
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadUser: async () => ({ id: 'user1' }) as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test mock data
				loadListing: async () => ({ id: 'listing1' }) as any,
				loadBlocker: async () =>
					// biome-ignore lint/suspicious/noExplicitAny: Test mock data
					({ id: 'blocker1', userType: 'personal' }) as any,
			};

			appealRequest = new ListingAppealRequest(props, passport);
			loadedBlocker = await appealRequest.loadBlocker();
		});

		Then('the loaded blocker should be a PersonalUser entity', () => {
			expect(loadedBlocker).toBeDefined();
			expect(loadedBlocker.id).toBe('blocker1');
		});
	});
});
