import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { deleteListings, type ItemListingDeleteCommand } from './delete.ts';

type MockListing = {
	id: string;
	sharer: { id: string };
	requestDelete: ReturnType<typeof vi.fn>;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'delete.feature'));

const test = { for: describeFeature };

test.for(feature, ({ Scenario }) => {
	Scenario(
		'Successfully delete an owned listing without active reservations',
		({ Given, And, When, Then }) => {
			let dataSources: DataSources;
			let listing: MockListing;
			let repo: {
				get: ReturnType<typeof vi.fn>;
				save: ReturnType<typeof vi.fn>;
			};
			let userRepo: {
				getByEmail: ReturnType<typeof vi.fn>;
			};
			let result: boolean;

			Given('a listing exists with id "listing-123"', () => {
				listing = {
					id: 'listing-123',
					sharer: { id: 'user-123' },
					requestDelete: vi.fn(),
				};

				repo = {
					get: vi.fn().mockResolvedValue(listing),
					save: vi.fn().mockResolvedValue(true),
				};
			});

			And('the listing is owned by user "user@example.com"', () => {
				userRepo = {
					getByEmail: vi
						.fn()
						.mockResolvedValue({ id: 'user-123', email: 'user@example.com' }),
				};
			});

			And('the listing has no active reservation requests', () => {
				const uow = {
					withScopedTransaction: vi.fn(
						async (fn: (repoArg: typeof repo) => Promise<void>) => {
							await fn(repo);
						},
					),
				};

				const reservationRepo = {
					getActiveByListingId: vi.fn().mockResolvedValue([]),
				};

				dataSources = {
					domainDataSource: {
						Listing: {
							ItemListing: {
								ItemListingUnitOfWork: uow,
							},
						},
					},
					readonlyDataSource: {
						User: {
							PersonalUser: {
								PersonalUserReadRepo: userRepo,
							},
						},
						ReservationRequest: {
							ReservationRequest: {
								ReservationRequestReadRepo: reservationRepo,
							},
						},
					},
				} as unknown as DataSources;
			});

			When(
				'I delete the listing with id "listing-123" as user "user@example.com"',
				async () => {
					const command: ItemListingDeleteCommand = {
						id: 'listing-123',
						userEmail: 'user@example.com',
					};
					result = await deleteListings(dataSources)(command);
				},
			);

			Then('the listing should be deleted successfully', () => {
				expect(result).toBe(true);
				expect(listing.requestDelete).toHaveBeenCalledTimes(1);
				expect(repo.save).toHaveBeenCalledWith(listing);
			});
		},
	);

	Scenario(
		'Prevent deletion when active reservation requests exist',
		({ Given, And, When, Then }) => {
			let dataSources: DataSources;
			let deletePromise: Promise<boolean>;

			Given('a listing exists with id "listing-456"', () => {
				// Setup in next step
			});

			And('the listing is owned by user "user@example.com"', () => {
				// Setup in next step
			});

			And('the listing has 2 active reservation requests', () => {
				const userRepo = {
					getByEmail: vi
						.fn()
						.mockResolvedValue({ id: 'user-456', email: 'user@example.com' }),
				};

				const reservationRepo = {
					getActiveByListingId: vi
						.fn()
						.mockResolvedValue([{ id: 'rr-1' }, { id: 'rr-2' }]),
				};

				dataSources = {
					domainDataSource: {
						Listing: {
							ItemListing: {
								ItemListingUnitOfWork: {},
							},
						},
					},
					readonlyDataSource: {
						User: {
							PersonalUser: {
								PersonalUserReadRepo: userRepo,
							},
						},
						ReservationRequest: {
							ReservationRequest: {
								ReservationRequestReadRepo: reservationRepo,
							},
						},
					},
				} as unknown as DataSources;
			});

			When(
				'I try to delete the listing with id "listing-456" as user "user@example.com"',
				() => {
					const command: ItemListingDeleteCommand = {
						id: 'listing-456',
						userEmail: 'user@example.com',
					};
					deletePromise = deleteListings(dataSources)(command);
				},
			);
			Then(
				'an error should be thrown indicating active reservations must be resolved',
				async () => {
					await expect(deletePromise).rejects.toThrow(
						'Cannot delete listing with active reservation requests',
					);
				},
			);
		},
	);

	Scenario(
		'Prevent deletion by non-owner via visa permissions',
		({ Given, And, When, Then }) => {
			let dataSources: DataSources;
			let deletePromise: Promise<boolean>;

			Given('a listing exists with id "listing-789"', () => {
				// Setup in next step
			});

			And('the listing is owned by user "owner@example.com"', () => {
				const listing = {
					id: 'listing-789',
					sharer: { id: 'owner-789' },
					requestDelete: vi.fn().mockImplementation(() => {
						throw new Error(
							'You do not have permission to delete this listing',
						);
					}),
				};

				const repo = {
					get: vi.fn().mockResolvedValue(listing),
					save: vi.fn(),
				};

				const uow = {
					withScopedTransaction: vi.fn(
						async (fn: (repoArg: typeof repo) => Promise<void>) => {
							await fn(repo);
						},
					),
				};

				const userRepo = {
					getByEmail: vi.fn().mockResolvedValue({
						id: 'other-user',
						email: 'other@example.com',
					}),
				};

				const reservationRepo = {
					getActiveByListingId: vi.fn().mockResolvedValue([]),
				};

				dataSources = {
					domainDataSource: {
						Listing: {
							ItemListing: {
								ItemListingUnitOfWork: uow,
							},
						},
					},
					readonlyDataSource: {
						User: {
							PersonalUser: {
								PersonalUserReadRepo: userRepo,
							},
						},
						ReservationRequest: {
							ReservationRequest: {
								ReservationRequestReadRepo: reservationRepo,
							},
						},
					},
				} as unknown as DataSources;
			});

			When(
				'I try to delete the listing with id "listing-789" as user "other@example.com"',
				() => {
					const command: ItemListingDeleteCommand = {
						id: 'listing-789',
						userEmail: 'other@example.com',
					};
					deletePromise = deleteListings(dataSources)(command);
				},
			);
			Then('a permission error should be thrown', async () => {
				await expect(deletePromise).rejects.toThrow(
					'You do not have permission to delete this listing',
				);
			});
		},
	);

	Scenario('Handle user not found error', ({ Given, When, Then }) => {
		let dataSources: DataSources;
		let deletePromise: Promise<boolean>;

		Given('a listing exists with id "listing-999"', () => {
			const userRepo = {
				getByEmail: vi.fn().mockResolvedValue(null),
			};

			dataSources = {
				domainDataSource: {
					Listing: {
						ItemListing: {
							ItemListingUnitOfWork: {},
						},
					},
				},
				readonlyDataSource: {
					User: {
						PersonalUser: {
							PersonalUserReadRepo: userRepo,
						},
					},
					ReservationRequest: {
						ReservationRequest: {
							ReservationRequestReadRepo: {
								getActiveByListingId: vi.fn(),
							},
						},
					},
				},
			} as unknown as DataSources;
		});

		When(
			'I try to delete the listing with id "listing-999" as user "nonexistent@example.com"',
			() => {
				const command: ItemListingDeleteCommand = {
					id: 'listing-999',
					userEmail: 'nonexistent@example.com',
				};
				deletePromise = deleteListings(dataSources)(command);
			},
		);
		Then('an error should be thrown indicating user not found', async () => {
			await expect(deletePromise).rejects.toThrow('User not found');
		});
	});
});
