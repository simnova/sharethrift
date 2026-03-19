import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { deleteListings } from './delete.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/delete.feature'),
);

test.for(feature, ({ Background, Scenario }) => {
	let mockListing: { requestDelete: ReturnType<typeof vi.fn> };
	let mockRepo: {
		get: ReturnType<typeof vi.fn>;
		save: ReturnType<typeof vi.fn>;
	};
	let mockUow: {
		withScopedTransaction: ReturnType<typeof vi.fn>;
	};
	let mockUser: { email: string; id: string } | null;
	let mockActiveReservations: unknown[];
	let mockDataSources: DataSources;
	let thrownError: Error | null;
	let deleteFunction: (command: { id: string; userEmail: string }) => Promise<boolean>;

	Background(({ Given, And }) => {
		Given('a valid user with email {string}', () => {
			mockUser = {
				email: 'test@example.com',
				id: 'user-123',
			};
		});

		And('the user owns an item listing with id {string}', () => {
			mockListing = {
				requestDelete: vi.fn(),
			};
			mockRepo = {
				get: vi.fn().mockResolvedValue(mockListing),
				save: vi.fn().mockResolvedValue(mockListing),
			};
		});

		And('the listing repository is available', () => {
			mockUow = {
				withScopedTransaction: vi.fn((callback) => {
					return callback(mockRepo);
				}),
			};

			mockDataSources = {
				domainDataSource: {
					Listing: {
						ItemListing: {
							ItemListingUnitOfWork: mockUow,
						},
					},
				},
				readonlyDataSource: {
					User: {
						PersonalUser: {
							PersonalUserReadRepo: {
								getByEmail: vi.fn().mockResolvedValue(mockUser),
							},
						},
					},
					ReservationRequest: {
						ReservationRequest: {
							ReservationRequestReadRepo: {
								getActiveByListingId: vi.fn().mockResolvedValue([]),
							},
						},
					},
				},
			} as unknown as DataSources;

			// Create the curried function once
			deleteFunction = deleteListings(mockDataSources);
		});
	});

	Scenario(
'Successfully deleting a listing with no active reservations',
({ Given, When, Then, And }) => {
			Given('there are no active reservation requests for the listing', () => {
				mockActiveReservations = [];
				(
					mockDataSources.readonlyDataSource.ReservationRequest
						.ReservationRequest.ReservationRequestReadRepo
						.getActiveByListingId as ReturnType<typeof vi.fn>
				).mockResolvedValue(mockActiveReservations);
			});

			When('the user requests to delete the listing', async () => {
				thrownError = null;
				try {
					await deleteFunction({
id: 'listing-123',
userEmail: 'test@example.com',
});
				} catch (error) {
					thrownError = error as Error;
				}
			});

			Then('the listing should be marked as deleted', () => {
				expect(mockListing.requestDelete).toHaveBeenCalledOnce();
			});

			And('the listing should be saved to the repository', () => {
				expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
			});
		},
	);

	Scenario(
'Failing to delete a listing with active reservations',
({ Given, When, Then, And }) => {
			Given(
'there are {int} active reservation requests for the listing',
() => {
					mockActiveReservations = [
						{ id: 'reservation-1', state: 'Pending' },
						{ id: 'reservation-2', state: 'Pending' },
					];
					(
						mockDataSources.readonlyDataSource.ReservationRequest
							.ReservationRequest.ReservationRequestReadRepo
							.getActiveByListingId as ReturnType<typeof vi.fn>
					).mockResolvedValue(mockActiveReservations);
				},
			);

			When('the user requests to delete the listing', async () => {
				thrownError = null;
				try {
					await deleteFunction({
id: 'listing-123',
userEmail: 'test@example.com',
});
				} catch (error) {
					thrownError = error as Error;
				}
			});

			Then(
'an error should be thrown with message {string}',
() => {
					expect(thrownError).toBeTruthy();
					expect(thrownError?.message).toContain(
'Cannot delete listing with active reservation requests',
);
				},
			);

			And('the listing should not be marked as deleted', () => {
				expect(mockListing.requestDelete).not.toHaveBeenCalled();
			});
		},
	);

	Scenario('Failing to delete when user is not found', ({ Given, When, Then }) => {
		Given('the user email {string} does not exist', () => {
			(
				mockDataSources.readonlyDataSource.User.PersonalUser
					.PersonalUserReadRepo.getByEmail as ReturnType<typeof vi.fn>
			).mockResolvedValue(null);
		});

		When(
'the user with email {string} requests to delete the listing',
async () => {
				thrownError = null;
				try {
					await deleteFunction({
id: 'listing-123',
userEmail: 'nonexistent@example.com',
});
				} catch (error) {
					thrownError = error as Error;
				}
			},
		);

		Then('an error should be thrown with message {string}', () => {
			expect(thrownError).toBeTruthy();
			expect(thrownError?.message).toBe('User not found');
		});
	});

	Scenario(
'Failing to delete when listing is not found',
({ Given, When, Then }) => {
			Given('the listing with id {string} does not exist', () => {
				mockRepo.get.mockResolvedValue(null);
			});

			When(
'the user requests to delete the listing with id {string}',
async () => {
					thrownError = null;
					try {
						await deleteFunction({
id: 'nonexistent-listing',
userEmail: 'test@example.com',
});
					} catch (error) {
						thrownError = error as Error;
					}
				},
			);

			Then('an error should be thrown with message {string}', () => {
				expect(thrownError).toBeTruthy();
				// The error will be thrown by the domain when listing.requestDelete() is called on null
				expect(thrownError?.message).toBeTruthy();
			});
		},
	);

	Scenario(
		'Failing to delete when unit of work is not available',
		({ Given, When, Then }) => {
			Given('the unit of work is not available', () => {
				mockDataSources = {
					domainDataSource: {
						Listing: {
							ItemListing: {
								ItemListingUnitOfWork: undefined,
							},
						},
					},
					readonlyDataSource: mockDataSources.readonlyDataSource,
				} as unknown as DataSources;
				deleteFunction = deleteListings(mockDataSources);
			});

			When('the user requests to delete the listing', async () => {
				thrownError = null;
				try {
					await deleteFunction({
						id: 'listing-123',
						userEmail: 'test@example.com',
					});
				} catch (error) {
					thrownError = error as Error;
				}
			});

			Then('an error should be thrown with message {string}', () => {
				expect(thrownError).toBeTruthy();
				expect(thrownError?.message).toBe(
					'ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing',
				);
			});
		},
	);
});
