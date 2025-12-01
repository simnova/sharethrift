import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import { ReservationRequest } from './reservation-request.ts';
import { ReservationRequestStates } from './reservation-request.value-objects.ts';
import type { ReservationRequestProps } from './reservation-request.entity.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import type { Passport } from '../../passport.ts';
import type { UserEntityReference } from '../../user/index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/reservation-request.feature'),
);

function makePassport(
	perms: Partial<{
		canAcceptRequest: boolean;
		canRejectRequest: boolean;
		canCancelRequest: boolean;
		canCloseRequest: boolean;
	}> = {},
): Passport {
	const defaults = {
		canAcceptRequest: true,
		canRejectRequest: true,
		canCancelRequest: true,
		canCloseRequest: true,
	};
	const final = { ...defaults, ...perms };
	return vi.mocked({
		reservationRequest: {
			forReservationRequest: vi.fn(() => ({
				determineIf: (fn: (p: typeof final) => boolean) => fn(final),
			})),
		},
		listing: { forItemListing: vi.fn(() => ({ determineIf: () => true })) },
		user: {
			forPersonalUser: vi.fn(() => ({ determineIf: () => true })),
			forUser: vi.fn(() => ({ determineIf: () => true })),
		},
		conversation: {
			forConversation: vi.fn(() => ({ determineIf: () => true })),
		},
	} as unknown as Passport);
}

function makeListing(state = 'Published'): ItemListingEntityReference {
	return {
		id: 'listing-1',
		sharer: {
			id: 'sharer-1',
			userType: 'personal',
			isBlocked: false,
			hasCompletedOnboarding: true,
			// biome-ignore lint/suspicious/noExplicitAny: test mock data
			role: {} as any,
			// biome-ignore lint/suspicious/noExplicitAny: test mock data
			loadRole: async () => ({}) as any,
			// biome-ignore lint/suspicious/noExplicitAny: test mock data
			account: {} as any,
			schemaVersion: '1',
			createdAt: new Date('2024-01-01T00:00:00Z'),
			updatedAt: new Date('2024-01-02T00:00:00Z'),
		} as UserEntityReference,
		title: 'Listing',
		description: 'Desc',
		category: 'General',
		location: 'Somewhere',
		sharingPeriodStart: new Date(Date.now() + 3_600_000),
		sharingPeriodEnd: new Date(Date.now() + 7_200_000),
		state,
		createdAt: new Date('2024-01-01T00:00:00Z'),
		updatedAt: new Date('2024-01-02T00:00:00Z'),
		schemaVersion: '1',
		listingType: 'item',
	} as ItemListingEntityReference;
}

function makeUser(): UserEntityReference {
	return {
		id: 'reserver-1',
		userType: 'personal',
		isBlocked: false,
		hasCompletedOnboarding: true,
		// biome-ignore lint/suspicious/noExplicitAny: test mock data
		role: {} as any,
		// biome-ignore lint/suspicious/noExplicitAny: test mock data
		loadRole: async () => ({}) as any,
		// biome-ignore lint/suspicious/noExplicitAny: test mock data
		account: {} as any,
		schemaVersion: '1',
		createdAt: new Date('2024-01-01T00:00:00Z'),
		updatedAt: new Date('2024-01-02T00:00:00Z'),
	} as UserEntityReference;
}

function makeBaseProps(
	overrides: Partial<ReservationRequestProps> = {},
): ReservationRequestProps {
	const tomorrow = new Date(Date.now() + 86_400_000);
	const nextMonth = new Date(Date.now() + 86_400_000 * 30);
	return {
		id: 'rr-1',
		state: ReservationRequestStates.REQUESTED,
		reservationPeriodStart: tomorrow,
		reservationPeriodEnd: nextMonth,
		createdAt: new Date('2024-01-01T00:00:00Z'),
		updatedAt: new Date('2024-01-02T00:00:00Z'),
		schemaVersion: '1',
		listing: makeListing(),
		loadListing: async () => makeListing(),
		reserver: makeUser(),
		loadReserver: async () => makeUser(),
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		...overrides,
	};
}

function toStateEnum(value: string): string {
	const mapping: Record<string, string> = {
		REQUESTED: ReservationRequestStates.REQUESTED,
		ACCEPTED: ReservationRequestStates.ACCEPTED,
		REJECTED: ReservationRequestStates.REJECTED,
		CANCELLED: ReservationRequestStates.CANCELLED,
		CLOSED: ReservationRequestStates.CLOSED,
	};
	return mapping[value] ?? value;
}

test.for(feature, ({ Background, Scenario, BeforeEachScenario }) => {
	let passport: Passport;
	let baseProps: ReservationRequestProps;
	let aggregate: ReservationRequest<ReservationRequestProps>;
	let error: unknown;
	let listing: ItemListingEntityReference;
	let reserver: UserEntityReference;

	BeforeEachScenario(() => {
		passport = makePassport();
		listing = makeListing('Published');
		reserver = makeUser();
		baseProps = makeBaseProps({ listing, reserver });
		aggregate =
			undefined as unknown as ReservationRequest<ReservationRequestProps>;
		error = undefined;
	});

	Background(({ Given, And }) => {
		Given('a valid Passport with reservation request permissions', () => {
			passport = makePassport();
		});
		And('a valid PersonalUserEntityReference for "reserverUser"', () => {
			reserver = makeUser();
		});
		And(
			'a valid ItemListingEntityReference for "listing1" with state "Published"',
			() => {
				listing = makeListing('Published');
			},
		);
		And(
			'base reservation request properties with state "REQUESTED", listing "listing1", reserver "reserverUser", valid reservation period, and timestamps',
			() => {
				baseProps = makeBaseProps({ listing, reserver });
			},
		);
	});

	Scenario(
		'Creating a new reservation request instance',
		({ When, Then, And }) => {
			When(
				'I create a new ReservationRequest aggregate using getNewInstance with state "REQUESTED", listing "listing1", reserver "reserverUser", reservationPeriodStart "tomorrow", and reservationPeriodEnd "next month"',
				() => {
					aggregate = ReservationRequest.getNewInstance(
						baseProps,
						toStateEnum('REQUESTED'),
						listing,
						reserver,
						baseProps.reservationPeriodStart,
						baseProps.reservationPeriodEnd,
						passport,
					);
				},
			);
			Then('the reservation request\'s state should be "REQUESTED"', () => {
				expect(aggregate.state).toBe(ReservationRequestStates.REQUESTED);
			});
			And(
				'the reservation request\'s listing should reference "listing1"',
				() => {
					expect(aggregate.listing.id).toBe('listing-1');
				},
			);
			And(
				'the reservation request\'s reserver should reference "reserverUser"',
				() => {
					expect(aggregate.reserver.id).toBe('reserver-1');
				},
			);
		},
	);

	Scenario(
		'Setting reservation period start in the past',
		({ Given, When, Then }) => {
			// biome-ignore lint/suspicious/noEmptyBlockStatements: Background already sets up the context
			Given('a new ReservationRequest aggregate being created', () => {});
			When('I try to set the reservationPeriodStart to a past date', () => {
				const past = new Date(Date.now() - 86_400_000);
				try {
					ReservationRequest.getNewInstance(
						{ ...baseProps, reservationPeriodStart: past },
						toStateEnum('REQUESTED'),
						listing,
						reserver,
						past,
						baseProps.reservationPeriodEnd,
						passport,
					);
				} catch (e) {
					error = e;
				}
			});
			Then(
				'an error should be thrown indicating "Reservation period start date must be today or in the future"',
				() => {
					expect(String((error as Error).message)).toMatch(
						/Reservation period start date must be today or in the future/,
					);
				},
			);
		},
	);

	Scenario('Setting reservation period end before start', ({ When, Then }) => {
		When(
			'I try to set reservationPeriodEnd to a date before reservationPeriodStart',
			() => {
				const start = new Date(Date.now() + 86_400_000 * 3);
				const endBefore = new Date(Date.now() + 86_400_000 * 2);
				try {
					ReservationRequest.getNewInstance(
						{
							...baseProps,
							reservationPeriodStart: start,
							reservationPeriodEnd: endBefore,
						},
						toStateEnum('REQUESTED'),
						listing,
						reserver,
						start,
						endBefore,
						passport,
					);
				} catch (e) {
					error = e;
				}
			},
		);
		Then(
			'an error should be thrown indicating "Reservation start date must be before end date"',
			() => {
				expect(String((error as Error).message)).toMatch(
					/Reservation start date must be before end date/,
				);
			},
		);
	});

	Scenario('Setting reserver after creation', ({ Given, When, Then }) => {
		let act: () => void;
		Given('an existing ReservationRequest aggregate', () => {
			aggregate = ReservationRequest.getNewInstance(
				baseProps,
				toStateEnum('REQUESTED'),
				listing,
				reserver,
				baseProps.reservationPeriodStart,
				baseProps.reservationPeriodEnd,
				passport,
			);
		});
		When('I try to set a new listing', () => {
			act = () => {
				aggregate.listing = makeListing('Published');
			};
		});
		Then(
			'a PermissionError should be thrown with message "Listing can only be set when creating a new reservation request"',
			() => {
				expect(act).toThrow(DomainSeedwork.PermissionError);
				expect(act).toThrow(
					/Listing can only be set when creating a new reservation request/,
				);
			},
		);
	});

	Scenario(
		'Accepting a requested reservation with permission',
		({ Given, When, Then }) => {
			Given('a ReservationRequest aggregate with state "REQUESTED"', () => {
				aggregate = ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					makePassport({ canAcceptRequest: true }),
				);
			});
			When('I set state to "ACCEPTED"', () => {
				aggregate.state = toStateEnum('ACCEPTED');
			});
			Then('the reservation request\'s state should be "ACCEPTED"', () => {
				expect(aggregate.state).toBe(ReservationRequestStates.ACCEPTED);
			});
		},
	);

	Scenario(
		'Accepting a reservation without permission',
		({ Given, When, Then }) => {
			let act: () => void;
			Given('a ReservationRequest aggregate with state "REQUESTED"', () => {
				aggregate = ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					makePassport({ canAcceptRequest: false }),
				);
			});
			When('I try to set state to "ACCEPTED"', () => {
				act = () => {
					aggregate.state = toStateEnum('ACCEPTED');
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(act).toThrow(DomainSeedwork.PermissionError);
			});
		},
	);

	Scenario(
		'Rejecting a requested reservation with permission',
		({ Given, When, Then }) => {
			Given('a ReservationRequest aggregate with state "REQUESTED"', () => {
				aggregate = ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					makePassport({ canRejectRequest: true }),
				);
			});
			When('I set state to "REJECTED"', () => {
				aggregate.state = toStateEnum('REJECTED');
			});
			Then('the reservation request\'s state should be "REJECTED"', () => {
				expect(aggregate.state).toBe(ReservationRequestStates.REJECTED);
			});
		},
	);

	Scenario(
		'Rejecting a reservation without permission',
		({ Given, When, Then }) => {
			let act: () => void;
			Given('a ReservationRequest aggregate with state "REQUESTED"', () => {
				aggregate = ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					makePassport({ canRejectRequest: false }),
				);
			});
			When('I try to set state to "REJECTED"', () => {
				act = () => {
					aggregate.state = toStateEnum('REJECTED');
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(act).toThrow(DomainSeedwork.PermissionError);
			});
		},
	);

	Scenario(
		'Cancelling a requested reservation with permission',
		({ Given, When, Then }) => {
			Given('a ReservationRequest aggregate with state "REQUESTED"', () => {
				aggregate = ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					makePassport({ canCancelRequest: true }),
				);
			});
			When('I set state to "CANCELLED"', () => {
				aggregate.state = toStateEnum('CANCELLED');
			});
			Then('the reservation request\'s state should be "CANCELLED"', () => {
				expect(aggregate.state).toBe(ReservationRequestStates.CANCELLED);
			});
		},
	);

	Scenario(
		'Cancelling a reservation without permission',
		({ Given, When, Then }) => {
			let act: () => void;
			Given('a ReservationRequest aggregate with state "REQUESTED"', () => {
				aggregate = ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					makePassport({ canCancelRequest: false }),
				);
			});
			When('I try to set state to "CANCELLED"', () => {
				act = () => {
					aggregate.state = toStateEnum('CANCELLED');
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(act).toThrow(DomainSeedwork.PermissionError);
			});
		},
	);

	Scenario(
		'Closing an accepted reservation when both parties requested close',
		({ Given, And, When, Then }) => {
			Given('a ReservationRequest aggregate with state "ACCEPTED"', () => {
				aggregate = ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					makePassport({ canCloseRequest: true, canAcceptRequest: true }),
				);
				aggregate.state = toStateEnum('ACCEPTED');
			});
			And('closeRequestedBySharer is true', () => {
				aggregate.closeRequestedBySharer = true;
			});
			And('closeRequestedByReserver is true', () => {
				aggregate.closeRequestedByReserver = true;
			});
			When('I set state to "CLOSED"', () => {
				aggregate.state = toStateEnum('CLOSED');
			});
			Then('the reservation request\'s state should be "CLOSED"', () => {
				expect(aggregate.state).toBe(ReservationRequestStates.CLOSED);
			});
		},
	);

	Scenario(
		'Closing an accepted reservation without any close request',
		({ Given, When, Then }) => {
			let act: () => void;
			Given('a ReservationRequest aggregate with state "ACCEPTED"', () => {
				aggregate = ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					makePassport({ canCloseRequest: true, canAcceptRequest: true }),
				);
				aggregate.state = toStateEnum('ACCEPTED');
			});
			When('I try to set state to "CLOSED"', () => {
				act = () => {
					aggregate.state = toStateEnum('CLOSED');
				};
			});
			Then(
				'an error should be thrown indicating "Can only close reservation requests if at least one user requested it"',
				() => {
					expect(act).toThrow(
						/Can only close reservation requests if at least one user requested it/,
					);
				},
			);
		},
	);

	Scenario('Requesting close without permission', ({ Given, When, Then }) => {
		let act: () => void;
		Given('a ReservationRequest aggregate with state "ACCEPTED"', () => {
			aggregate = ReservationRequest.getNewInstance(
				baseProps,
				toStateEnum('REQUESTED'),
				listing,
				reserver,
				baseProps.reservationPeriodStart,
				baseProps.reservationPeriodEnd,
				makePassport({ canAcceptRequest: true, canCloseRequest: false }),
			);
			aggregate.state = toStateEnum('ACCEPTED');
		});
		When('I try to set closeRequestedBySharer to true', () => {
			act = () => {
				aggregate.closeRequestedBySharer = true;
			};
		});
		Then('a PermissionError should be thrown', () => {
			expect(act).toThrow(DomainSeedwork.PermissionError);
		});
	});

	Scenario('Requesting close in invalid state', ({ Given, When, Then }) => {
		let act: () => void;
		Given('a ReservationRequest aggregate with state "REQUESTED"', () => {
			aggregate = ReservationRequest.getNewInstance(
				baseProps,
				toStateEnum('REQUESTED'),
				listing,
				reserver,
				baseProps.reservationPeriodStart,
				baseProps.reservationPeriodEnd,
				makePassport({ canCloseRequest: true }),
			);
		});
		When('I try to set closeRequestedByReserver to true', () => {
			act = () => {
				aggregate.closeRequestedByReserver = true;
			};
		});
		Then(
			'an error should be thrown indicating "Cannot close reservation in current state"',
			() => {
				expect(act).toThrow(/Cannot close reservation in current state/);
			},
		);
	});

	Scenario('Loading linked entities', ({ Given, When, Then }) => {
		let loadedListing: ItemListingEntityReference;
		let loadedReserver: UserEntityReference;
		Given('a ReservationRequest aggregate', () => {
			aggregate = ReservationRequest.getNewInstance(
				baseProps,
				toStateEnum('REQUESTED'),
				listing,
				reserver,
				baseProps.reservationPeriodStart,
				baseProps.reservationPeriodEnd,
				passport,
			);
		});
		When('I call loadListing', async () => {
			loadedListing = await aggregate.loadListing();
		});
		Then('it should return the associated listing', () => {
			expect(loadedListing.id).toBe('listing-1');
		});
		When('I call loadReserver', async () => {
			loadedReserver = await aggregate.loadReserver();
		});
		Then('it should return the associated reserver', () => {
			expect(loadedReserver.id).toBe('reserver-1');
		});
	});

	Scenario('Reading audit fields', ({ Given, Then, And }) => {
		Given('a ReservationRequest aggregate', () => {
			aggregate = ReservationRequest.getNewInstance(
				baseProps,
				toStateEnum('REQUESTED'),
				listing,
				reserver,
				baseProps.reservationPeriodStart,
				baseProps.reservationPeriodEnd,
				passport,
			);
		});
		Then('createdAt should return the correct date', () => {
			expect(aggregate.createdAt.toISOString()).toBe(
				'2024-01-01T00:00:00.000Z',
			);
		});
		And('updatedAt should return the correct date', () => {
			expect(aggregate.updatedAt.toISOString()).toBe(
				'2024-01-02T00:00:00.000Z',
			);
		});
		And('schemaVersion should return the correct version', () => {
			expect(aggregate.schemaVersion).toBe('1');
		});
	});
});
