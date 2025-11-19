import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { create, type ReservationRequestCreateCommand } from './create.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/create.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ReservationRequestCreateCommand;
	let result:
		| Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference
		| undefined;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let error: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUserReadRepo: any;

	BeforeEachScenario(() => {
		mockUserReadRepo = {
			getByEmail: vi.fn(),
		};

		// Create wrapper functions that delegate to getByEmail
		const getUserByIdSpy = vi.fn();
		const getUserByEmailSpy = vi.fn((email: string) => {
			return mockUserReadRepo.getByEmail(email);
		});

		mockDataSources = {
			readonlyDataSource: {
				Listing: {
					ItemListing: {
						ItemListingReadRepo: {
							getById: vi.fn(),
						},
					},
				},
				User: {
					PersonalUser: {
						PersonalUserReadRepo: mockUserReadRepo,
					},
					getUserById: getUserByIdSpy,
					getUserByEmail: getUserByEmailSpy,
				},
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getOverlapActiveReservationRequestsForListing: vi.fn(),
						},
					},
				},
			},
			domainDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestUnitOfWork: {
							withScopedTransaction: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {
			listingId: 'listing-123',
			reservationPeriodStart: new Date('2024-01-01'),
			reservationPeriodEnd: new Date('2024-01-07'),
			reserverEmail: 'reserver@example.com',
		};

		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully creating a reservation request',
		({ Given, And, When, Then }) => {
			Given('a valid listing ID "listing-123"', () => {
				// Already set in command
			});

			And('a valid reserver email "reserver@example.com"', () => {
				// Already set in command
			});

			And(
				'a valid reservation period from "2024-01-01" to "2024-01-07"',
				() => {
					// Already set in command
				},
			);

			And('the listing exists', () => {
				const mockListing = {
					id: 'listing-123',
					sharer: { id: 'sharer-123' },
				};
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).Listing.ItemListing.ItemListingReadRepo.getById.mockResolvedValue(
					mockListing,
				);
			});

			And('the reserver exists', () => {
				const mockReserver = {
					id: 'user-123',
					account: { email: 'reserver@example.com' },
				};
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).User.PersonalUser.PersonalUserReadRepo.getByEmail.mockResolvedValue(
					mockReserver,
				);
			});

			And('there are no overlapping reservation requests', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getOverlapActiveReservationRequestsForListing.mockResolvedValue(
					[],
				);
			});

			When('the create command is executed', async () => {
				const mockNewRequest = {
					id: 'req-new',
					state: 'Requested',
					listing: { id: 'listing-123' },
					reserver: { id: 'user-123' },
				};

				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.domainDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork.withScopedTransaction.mockImplementation(
     // biome-ignore lint/suspicious/noExplicitAny: Test mock callback
					async (callback: any) => {
						const repo = {
							getNewInstance: vi.fn().mockResolvedValue(mockNewRequest),
							save: vi.fn().mockResolvedValue(mockNewRequest),
						};
						await callback(repo);
					},
				);

				const createFn = create(mockDataSources);
				result = await createFn(command);
			});

			Then('a new reservation request should be created', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('req-new');
			});

			And('the reservation request should have status "Requested"', () => {
				expect(result?.state).toBe('Requested');
			});
		},
	);

	Scenario(
		'Creating reservation request when listing not found',
		({ Given, And, When, Then }) => {
			Given('a listing ID "listing-999" that does not exist', () => {
				command.listingId = 'listing-999';
			});

			And('a valid reserver email "reserver@example.com"', () => {
				// Already set in command
			});

			And(
				'a valid reservation period from "2024-01-01" to "2024-01-07"',
				() => {
					// Already set in command
				},
			);

			When('the create command is executed', async () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).Listing.ItemListing.ItemListingReadRepo.getById.mockResolvedValue(
					null,
				);

				const createFn = create(mockDataSources);
				try {
					await createFn(command);
				} catch (e) {
					error = e;
				}
			});

			Then('an error should be thrown with message "Listing not found"', () => {
				expect(error).toBeDefined();
				expect(error.message).toBe('Listing not found');
			});
		},
	);

	Scenario(
		'Creating reservation request when reserver not found',
		({ Given, And, When, Then }) => {
			Given('a valid listing ID "listing-123"', () => {
				// Already set in command
			});

			And('a reserver email "unknown@example.com" that does not exist', () => {
				command.reserverEmail = 'unknown@example.com';
			});

			And(
				'a valid reservation period from "2024-01-01" to "2024-01-07"',
				() => {
					// Already set in command
				},
			);

			And('the listing exists', () => {
				const mockListing = {
					id: 'listing-123',
					sharer: { id: 'sharer-123' },
				};
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).Listing.ItemListing.ItemListingReadRepo.getById.mockResolvedValue(
					mockListing,
				);
			});

			When('the create command is executed', async () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).User.PersonalUser.PersonalUserReadRepo.getByEmail.mockResolvedValue(
					null,
				);

				const createFn = create(mockDataSources);
				try {
					await createFn(command);
				} catch (e) {
					error = e;
				}
			});

			Then(
				'an error should be thrown with message "Reserver not found. Ensure that you are logged in."',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe(
						'Reserver not found. Ensure that you are logged in.',
					);
				},
			);
		},
	);

	Scenario(
		'Creating reservation request with overlapping period',
		({ Given, And, When, Then }) => {
			Given('a valid listing ID "listing-123"', () => {
				// Already set in command
			});

			And('a valid reserver email "reserver@example.com"', () => {
				// Already set in command
			});

			And(
				'a valid reservation period from "2024-01-01" to "2024-01-07"',
				() => {
					// Already set in command
				},
			);

			And('the listing exists', () => {
				const mockListing = {
					id: 'listing-123',
					sharer: { id: 'sharer-123' },
				};
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).Listing.ItemListing.ItemListingReadRepo.getById.mockResolvedValue(
					mockListing,
				);
			});

			And('the reserver exists', () => {
				const mockReserver = {
					id: 'user-123',
					account: { email: 'reserver@example.com' },
				};
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).User.PersonalUser.PersonalUserReadRepo.getByEmail.mockResolvedValue(
					mockReserver,
				);
			});

			And('there are overlapping active reservation requests', () => {
				const overlappingRequests = [
					{
						id: 'req-existing',
						state: 'Requested',
						listing: { id: 'listing-123' },
					},
				];
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getOverlapActiveReservationRequestsForListing.mockResolvedValue(
					overlappingRequests,
				);
			});

			When('the create command is executed', async () => {
				const createFn = create(mockDataSources);
				try {
					await createFn(command);
				} catch (e) {
					error = e;
				}
			});

			Then(
				'an error should be thrown with message "Reservation period overlaps with existing active reservation requests"',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe(
						'Reservation period overlaps with existing active reservation requests',
					);
				},
			);
		},
	);
});
