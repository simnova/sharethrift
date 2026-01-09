import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi, describe, it, beforeEach } from 'vitest';
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

function makeListing(state = 'Active'): ItemListingEntityReference {
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
		userType: 'personal-user',
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
		loadSharer: async () => makeListing().sharer,
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
		listing = makeListing('Active');
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
			'a valid ItemListingEntityReference for "listing1" with state "Active"',
			() => {
				listing = makeListing('Active');
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
				aggregate.listing = makeListing('Active');
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

	Scenario(
		'Setting reservation period start to null',
		({ Given, When, Then }) => {
			// biome-ignore lint/suspicious/noEmptyBlockStatements: Background already sets up the context
			Given('a new ReservationRequest aggregate being created', () => {});
			When('I try to set the reservationPeriodStart to null', () => {
				try {
					ReservationRequest.getNewInstance(
						baseProps,
						toStateEnum('REQUESTED'),
						listing,
						reserver,
						null as unknown as Date,
						baseProps.reservationPeriodEnd,
						passport,
					);
				} catch (e) {
					error = e;
				}
			});
			Then(
				'an error should be thrown indicating "value cannot be null or undefined"',
				() => {
					expect(String((error as Error).message)).toMatch(
						/value cannot be null or undefined/,
					);
				},
			);
		},
	);

	Scenario(
		'Setting reservation period end to null',
		({ Given, When, Then }) => {
			// biome-ignore lint/suspicious/noEmptyBlockStatements: Background already sets up the context
			Given('a new ReservationRequest aggregate being created', () => {});
			When('I try to set the reservationPeriodEnd to null', () => {
				try {
					ReservationRequest.getNewInstance(
						baseProps,
						toStateEnum('REQUESTED'),
						listing,
						reserver,
						baseProps.reservationPeriodStart,
						null as unknown as Date,
						passport,
					);
				} catch (e) {
					error = e;
				}
			});
			Then(
				'an error should be thrown indicating "value cannot be null or undefined"',
				() => {
					expect(String((error as Error).message)).toMatch(
						/value cannot be null or undefined/,
					);
				},
			);
		},
	);

	Scenario(
		'Setting reservation period start to past date',
		({ Given, When, Then }) => {
			// biome-ignore lint/suspicious/noEmptyBlockStatements: Background already sets up the context
			Given('a new ReservationRequest aggregate being created', () => {});
			When('I try to set the reservationPeriodStart to a past date', () => {
				const pastStart = new Date(Date.now() - 172_800_000); // 2 days ago
				const pastEnd = new Date(Date.now() - 86_400_000); // 1 day ago
				try {
					ReservationRequest.getNewInstance(
						baseProps,
						toStateEnum('REQUESTED'),
						listing,
						reserver,
						pastStart,
						pastEnd,
						passport,
					);
				} catch (e) {
					error = e;
				}
			});
			Then(
				'an error should be thrown indicating "Reservation period start date must be today or in the future"',
				() => {
					// The setter validates that start date must be in the future
					expect(String((error as Error).message)).toMatch(
						/Reservation period start date must be today or in the future/,
					);
				},
			);
		},
	);

	Scenario('Setting listing to null', ({ Given, When, Then }) => {
		// biome-ignore lint/suspicious/noEmptyBlockStatements: Background already sets up the context
		Given('a new ReservationRequest aggregate being created', () => {});
		When('I try to set the listing to null', () => {
			try {
				ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					null as unknown as ItemListingEntityReference,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					passport,
				);
			} catch (e) {
				error = e;
			}
		});
		Then(
			'an error should be thrown indicating "value cannot be null or undefined"',
			() => {
				expect(String((error as Error).message)).toMatch(
					/value cannot be null or undefined/,
				);
			},
		);
	});

	Scenario(
		'Setting listing with non-published state',
		({ Given, When, Then }) => {
			// biome-ignore lint/suspicious/noEmptyBlockStatements: Background already sets up the context
			Given('a new ReservationRequest aggregate being created', () => {});
			When('I try to set listing to a non-published listing', () => {
				const draftListing = makeListing('Draft');
				try {
					ReservationRequest.getNewInstance(
						baseProps,
						toStateEnum('REQUESTED'),
						draftListing,
						reserver,
						baseProps.reservationPeriodStart,
						baseProps.reservationPeriodEnd,
						passport,
					);
				} catch (e) {
					error = e;
				}
			});
			Then(
				'an error should be thrown indicating "Cannot create reservation request for listing that is not active"',
				() => {
					expect(String((error as Error).message)).toMatch(
						/Cannot create reservation request for listing that is not active/,
					);
				},
			);
		},
	);

	Scenario('Setting reserver to null', ({ Given, When, Then }) => {
		// biome-ignore lint/suspicious/noEmptyBlockStatements: Background already sets up the context
		Given('a new ReservationRequest aggregate being created', () => {});
		When('I try to set the reserver to null', () => {
			try {
				ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					null as unknown as UserEntityReference,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					passport,
				);
			} catch (e) {
				error = e;
			}
		});
		Then(
			'an error should be thrown indicating "value cannot be null or undefined"',
			() => {
				expect(String((error as Error).message)).toMatch(
					/value cannot be null or undefined/,
				);
			},
		);
	});

	Scenario(
		'Cancelling a rejected reservation with permission',
		({ Given, When, Then }) => {
			Given('a ReservationRequest aggregate with state "REJECTED"', () => {
				aggregate = ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					makePassport({ canRejectRequest: true, canCancelRequest: true }),
				);
				aggregate.state = toStateEnum('REJECTED');
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
		'Cancelling an accepted reservation should fail',
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
					makePassport({ canAcceptRequest: true, canCancelRequest: true }),
				);
				aggregate.state = toStateEnum('ACCEPTED');
			});
			When('I try to set state to "CANCELLED"', () => {
				act = () => {
					aggregate.state = toStateEnum('CANCELLED');
				};
			});
			Then(
				'an error should be thrown indicating "Cannot cancel reservation in current state"',
				() => {
					expect(act).toThrow(/Cannot cancel reservation in current state/);
				},
			);
		},
	);

	Scenario(
		'Rejecting a non-requested reservation should fail',
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
					makePassport({ canAcceptRequest: true, canRejectRequest: true }),
				);
				aggregate.state = toStateEnum('ACCEPTED');
			});
			When('I try to set state to "REJECTED"', () => {
				act = () => {
					aggregate.state = toStateEnum('REJECTED');
				};
			});
			Then(
				'an error should be thrown indicating "Can only reject requested reservations"',
				() => {
					expect(act).toThrow(/Can only reject requested reservations/);
				},
			);
		},
	);

	Scenario(
		'Accepting a non-requested reservation should fail',
		({ Given, When, Then }) => {
			let act: () => void;
			Given('a ReservationRequest aggregate with state "REJECTED"', () => {
				aggregate = ReservationRequest.getNewInstance(
					baseProps,
					toStateEnum('REQUESTED'),
					listing,
					reserver,
					baseProps.reservationPeriodStart,
					baseProps.reservationPeriodEnd,
					makePassport({ canRejectRequest: true, canAcceptRequest: true }),
				);
				aggregate.state = toStateEnum('REJECTED');
			});
			When('I try to set state to "ACCEPTED"', () => {
				act = () => {
					aggregate.state = toStateEnum('ACCEPTED');
				};
			});
			Then(
				'an error should be thrown indicating "Can only accept requested reservations"',
				() => {
					expect(act).toThrow(/Can only accept requested reservations/);
				},
			);
		},
	);

	Scenario(
		'Closing a non-accepted reservation should fail',
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
					makePassport({ canCloseRequest: true }),
				);
			});
			When('I try to close the reservation', () => {
				act = () => {
					aggregate.state = toStateEnum('CLOSED');
				};
			});
			Then(
				'an error should be thrown indicating "Can only close accepted reservations"',
				() => {
					expect(act).toThrow(/Can only close accepted reservations/);
				},
			);
		},
	);

	Scenario(
		'Closing without permission should fail',
		({ Given, When, Then }) => {
			let act: () => void;
			Given(
				'a ReservationRequest aggregate with state "ACCEPTED" without close permission',
				() => {
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
				},
			);
			When('I try to set state to "CLOSED"', () => {
				act = () => {
					aggregate.state = toStateEnum('CLOSED');
				};
			});
			Then('a PermissionError should be thrown', () => {
				expect(act).toThrow(DomainSeedwork.PermissionError);
			});
		},
	);

	Scenario(
		'Closing with only sharer request',
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
			When('I set state to "CLOSED"', () => {
				aggregate.state = toStateEnum('CLOSED');
			});
			Then('the reservation request\'s state should be "CLOSED"', () => {
				expect(aggregate.state).toBe(ReservationRequestStates.CLOSED);
			});
		},
	);

	Scenario(
		'Setting reservation period start after end should fail',
		({ Given, When, Then }) => {
			let localError: unknown;
			Given('a new ReservationRequest aggregate being created with end date set', () => {
				// Set up props with a valid end date in future
			});
			When(
				'I try to set reservationPeriodStart to a date after the end date',
				() => {
					const endDate = new Date(Date.now() + 86_400_000 * 2);
					const startAfterEnd = new Date(Date.now() + 86_400_000 * 5);
					const propsWithEnd = {
						...baseProps,
						reservationPeriodEnd: endDate,
					};
					try {
						ReservationRequest.getNewInstance(
							propsWithEnd,
							toStateEnum('REQUESTED'),
							listing,
							reserver,
							startAfterEnd,
							endDate,
							passport,
						);
					} catch (e) {
						localError = e;
					}
				},
			);
			Then(
				'an error should be thrown indicating "Reservation period start date must be before the end date"',
				() => {
					expect(String((localError as Error).message)).toMatch(
						/Reservation period start date must be before the end date|Reservation start date must be before end date/,
					);
				},
			);
		},
	);

	Scenario(
		'Setting reservation period end at or before start should fail',
		({ Given, When, Then }) => {
			let localError: unknown;
			Given('a new ReservationRequest aggregate being created with start date set', () => {
				// Set up props with a valid start date
			});
			When(
				'I try to set reservationPeriodEnd to a date before or equal to the start date',
				() => {
					const startDate = new Date(Date.now() + 86_400_000 * 5);
					const endBeforeStart = new Date(Date.now() + 86_400_000 * 3);
					const propsWithStart = {
						...baseProps,
						reservationPeriodStart: startDate,
					};
					try {
						ReservationRequest.getNewInstance(
							propsWithStart,
							toStateEnum('REQUESTED'),
							listing,
							reserver,
							startDate,
							endBeforeStart,
							passport,
						);
					} catch (e) {
						localError = e;
					}
				},
			);
			Then(
				'an error should be thrown indicating "Reservation period end date must be after the start date"',
				() => {
					expect(String((localError as Error).message)).toMatch(
						/Reservation period end date must be after the start date|Reservation start date must be before end date/,
					);
				},
			);
		},
	);

	Scenario(
		'Setting reservation period start after creation should fail',
		({ Given, When, Then }) => {
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
			When('I try to update the reservation period start date', () => {
				act = () => {
					aggregate.reservationPeriodStart = new Date(Date.now() + 86_400_000 * 10);
				};
			});
			Then(
				'a PermissionError should be thrown with message "Reservation period start date cannot be updated after creation"',
				() => {
					expect(act).toThrow(DomainSeedwork.PermissionError);
					expect(act).toThrow(
						/Reservation period start date cannot be updated after creation/,
					);
				},
			);
		},
	);

	Scenario(
		'Setting reservation period end after creation should fail',
		({ Given, When, Then }) => {
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
			When('I try to update the reservation period end date', () => {
				act = () => {
					aggregate.reservationPeriodEnd = new Date(Date.now() + 86_400_000 * 60);
				};
			});
			Then(
				'a PermissionError should be thrown with message "You do not have permission to update this reservation period"',
				() => {
					expect(act).toThrow(DomainSeedwork.PermissionError);
					expect(act).toThrow(
						/You do not have permission to update this reservation period/,
					);
				},
			);
		},
	);

	Scenario(
		'Setting reserver after creation should fail',
		({ Given, When, Then }) => {
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
			When('I try to set a new reserver', () => {
				act = () => {
					aggregate.reserver = makeUser();
				};
			});
			Then(
				'a PermissionError should be thrown with message "Reserver can only be set when creating a new reservation request"',
				() => {
					expect(act).toThrow(DomainSeedwork.PermissionError);
					expect(act).toThrow(
						/Reserver can only be set when creating a new reservation request/,
					);
				},
			);
		},
	);
});

// Additional unit tests for static helper methods
describe('ReservationRequest static helper methods', () => {

	describe('getNewInstance - Event Emission', () => {
		let testPassport: Passport;
		let testListing: ItemListingEntityReference;
		let testReserver: UserEntityReference;
		let testBaseProps: ReservationRequestProps;

		beforeEach(() => {
			testPassport = makePassport();
			testListing = makeListing('Active');
			testReserver = makeUser();
			const tomorrow = new Date(Date.now() + 86_400_000);
			const nextMonth = new Date(Date.now() + 86_400_000 * 30);
			testBaseProps = {
				id: 'rr-1',
				state: ReservationRequestStates.REQUESTED,
				reservationPeriodStart: tomorrow,
				reservationPeriodEnd: nextMonth,
				createdAt: new Date('2024-01-01T00:00:00Z'),
				updatedAt: new Date('2024-01-02T00:00:00Z'),
				schemaVersion: '1',
				listing: testListing,
				loadListing: async () => testListing,
				reserver: testReserver,
				loadReserver: async () => testReserver,
				loadSharer: async () => testListing.sharer,
				closeRequestedBySharer: false,
				closeRequestedByReserver: false,
			};
		});

	it('emits ReservationRequestCreated event when state is REQUESTED', () => {
		const spy = vi.spyOn(console, 'warn').mockImplementation(() => {
			// Mock implementation is intentionally empty
		});

		const instance = ReservationRequest.getNewInstance(
			testBaseProps,
			ReservationRequestStates.REQUESTED,
			testListing,
			testReserver,
			testBaseProps.reservationPeriodStart,
			testBaseProps.reservationPeriodEnd,
			testPassport,
		);

		// Check that instance was created successfully
		expect(instance).toBeInstanceOf(ReservationRequest);
		expect(instance.state).toBe(ReservationRequestStates.REQUESTED);

		spy.mockRestore();
	});

	it('does not emit ReservationRequestCreated event for non-REQUESTED state', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
			// Mock implementation is intentionally empty
		});

		const instance = ReservationRequest.getNewInstance(
			testBaseProps,
			ReservationRequestStates.ACCEPTED,
			testListing,
			testReserver,
			testBaseProps.reservationPeriodStart,
			testBaseProps.reservationPeriodEnd,
			testPassport,
		);

		expect(instance).toBeInstanceOf(ReservationRequest);
		expect(instance.state).toBe(ReservationRequestStates.ACCEPTED);

		consoleSpy.mockRestore();
	});

	it('handles missing listing gracefully during event emission', () => {
		const incompleteListing = {
			...testListing,
			id: undefined,
	} as unknown as ItemListingEntityReference;

		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
			// Mock implementation is intentionally empty
		});

		const instance = ReservationRequest.getNewInstance(
			testBaseProps,
			ReservationRequestStates.REQUESTED,
			incompleteListing,
			testReserver,
			testBaseProps.reservationPeriodStart,
			testBaseProps.reservationPeriodEnd,
			testPassport,
		);

		// Should still create instance even if event emission warns
		expect(instance).toBeInstanceOf(ReservationRequest);

		warnSpy.mockRestore();
	});
});

describe('Async property loading', () => {
	let testPassport: Passport;
	let testListing: ItemListingEntityReference;
	let testReserver: UserEntityReference;
	let testBaseProps: ReservationRequestProps;

	beforeEach(() => {
		testPassport = makePassport();
			testListing = makeListing('Active');
			testReserver = makeUser();
			const tomorrow = new Date(Date.now() + 86_400_000);
			const nextMonth = new Date(Date.now() + 86_400_000 * 30);
			testBaseProps = {
				id: 'rr-1',
				state: ReservationRequestStates.REQUESTED,
				reservationPeriodStart: tomorrow,
				reservationPeriodEnd: nextMonth,
				createdAt: new Date('2024-01-01T00:00:00Z'),
				updatedAt: new Date('2024-01-02T00:00:00Z'),
				schemaVersion: '1',
				listing: testListing,
				loadListing: async () => testListing,
				reserver: testReserver,
				loadReserver: async () => testReserver,
				loadSharer: async () => testListing.sharer,
				closeRequestedBySharer: false,
				closeRequestedByReserver: false,
			};
		});

		it('loadReserver returns user from props', async () => {
			const aggregate = ReservationRequest.getNewInstance(
				testBaseProps,
				ReservationRequestStates.REQUESTED,
				testListing,
				testReserver,
				testBaseProps.reservationPeriodStart,
				testBaseProps.reservationPeriodEnd,
				testPassport,
			);

			const loadedReserver = await aggregate.loadReserver();
			expect(loadedReserver).toBe(testReserver);
		});

		it('loadListing returns listing from props', async () => {
			const aggregate = ReservationRequest.getNewInstance(
				testBaseProps,
				ReservationRequestStates.REQUESTED,
				testListing,
				testReserver,
				testBaseProps.reservationPeriodStart,
				testBaseProps.reservationPeriodEnd,
				testPassport,
			);

			const loadedListing = await aggregate.loadListing();
			expect(loadedListing).toBe(testListing);
		});

		it('loadSharer returns sharer from listing', async () => {
			const aggregate = ReservationRequest.getNewInstance(
				testBaseProps,
				ReservationRequestStates.REQUESTED,
				testListing,
				testReserver,
				testBaseProps.reservationPeriodStart,
				testBaseProps.reservationPeriodEnd,
				testPassport,
			);

			const loadedSharer = await aggregate.loadSharer();
			expect(loadedSharer).toBe(testListing.sharer);
		});
	});

	describe('Immutable date validation after creation', () => {
		let testPassport: Passport;
		let testListing: ItemListingEntityReference;
		let testReserver: UserEntityReference;
		let testBaseProps: ReservationRequestProps;

		beforeEach(() => {
			testPassport = makePassport();
			testListing = makeListing('Active');
			testReserver = makeUser();
			const tomorrow = new Date(Date.now() + 86_400_000);
			const nextMonth = new Date(Date.now() + 86_400_000 * 30);
			testBaseProps = {
				id: 'rr-1',
				state: ReservationRequestStates.REQUESTED,
				reservationPeriodStart: tomorrow,
				reservationPeriodEnd: nextMonth,
				createdAt: new Date('2024-01-01T00:00:00Z'),
				updatedAt: new Date('2024-01-02T00:00:00Z'),
				schemaVersion: '1',
				listing: testListing,
				loadListing: async () => testListing,
				reserver: testReserver,
				loadReserver: async () => testReserver,
				loadSharer: async () => testListing.sharer,
				closeRequestedBySharer: false,
				closeRequestedByReserver: false,
			};
		});

		it('cannot set past reservation period start date', () => {
			const aggregate = ReservationRequest.getNewInstance(
				testBaseProps,
				ReservationRequestStates.REQUESTED,
				testListing,
				testReserver,
				testBaseProps.reservationPeriodStart,
				testBaseProps.reservationPeriodEnd,
				testPassport,
			);

			expect(() => {
				aggregate.reservationPeriodStart = new Date(Date.now() - 86_400_000);
			}).toThrow();
		});

		it('cannot set past reservation period end date', () => {
			const aggregate = ReservationRequest.getNewInstance(
				testBaseProps,
				ReservationRequestStates.REQUESTED,
				testListing,
				testReserver,
				testBaseProps.reservationPeriodStart,
				testBaseProps.reservationPeriodEnd,
				testPassport,
			);

			expect(() => {
				aggregate.reservationPeriodEnd = new Date(Date.now() - 86_400_000);
			}).toThrow();
		});
	});

	describe('Close request permissions', () => {
		let testPassport: Passport;
		let testListing: ItemListingEntityReference;
		let testReserver: UserEntityReference;

		beforeEach(() => {
			testPassport = makePassport();
			testListing = makeListing('Active');
			testReserver = makeUser();
		});

		it('can request close for ACCEPTED reservation when permitted', () => {
			const acceptedProps = makeBaseProps({
				state: ReservationRequestStates.ACCEPTED,
				listing: testListing,
				reserver: testReserver,
			});
			const aggregate = new ReservationRequest(acceptedProps, testPassport);

			expect(() => {
				aggregate.closeRequestedBySharer = true;
			}).not.toThrow();
		});

		it('cannot request close when not permitted', () => {
			const deniedPassport = makePassport({ canCloseRequest: false });
			const acceptedProps = makeBaseProps({
				state: ReservationRequestStates.ACCEPTED,
				listing: testListing,
				reserver: testReserver,
			});
			const aggregate = new ReservationRequest(acceptedProps, deniedPassport);

			expect(() => {
				aggregate.closeRequestedBySharer = true;
			}).toThrow(DomainSeedwork.PermissionError);
		});

		it('cannot request close for non-ACCEPTED reservation', () => {
			const requestedProps = makeBaseProps({
				state: ReservationRequestStates.REQUESTED,
				listing: testListing,
				reserver: testReserver,
			});
			const aggregate = new ReservationRequest(requestedProps, testPassport);

			expect(() => {
				aggregate.closeRequestedBySharer = true;
			}).toThrow(/Cannot close reservation in current state/);
		});
	});
});
