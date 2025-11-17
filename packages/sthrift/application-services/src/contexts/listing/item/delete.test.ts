import { describe, expect, it, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { deleteListings, type ItemListingDeleteCommand } from './delete.ts';

type MockListing = {
	id: string;
	sharer: { id: string };
	requestDelete: ReturnType<typeof vi.fn>;
};

const createDataSources = (options?: {
	listing?: Partial<MockListing>;
	reservations?: unknown[];
}) => {
	const listing: MockListing = {
		id: 'listing-1',
		sharer: { id: 'user-1' },
		requestDelete: vi.fn(),
		...options?.listing,
	};

	const repo = {
		get: vi.fn().mockResolvedValue(listing),
		save: vi.fn().mockResolvedValue(true),
	};

	const uow = {
		withScopedTransaction: vi.fn(async (fn: (repoArg: typeof repo) => Promise<void>) => {
			await fn(repo);
		}),
	};

	const reservationRepo = {
		getActiveByListingId: vi
			.fn()
			.mockResolvedValue(options?.reservations ?? []),
	};

	const dataSources = {
		domainDataSource: {
			Listing: {
				ItemListing: {
					ItemListingUnitOfWork: uow,
				},
			},
		},
		readonlyDataSource: {
			ReservationRequest: {
				ReservationRequest: {
					ReservationRequestReadRepo: reservationRepo,
				},
			},
		},
	} as unknown as DataSources;

	return { dataSources, listing, repo, reservationRepo, uow };
};

describe('Item listing delete command', () => {
	it('deletes when user owns listing and no reservations exist', async () => {
		const { dataSources, listing, repo, reservationRepo, uow } = createDataSources();
		const command: ItemListingDeleteCommand = {
			id: 'listing-1',
			userId: 'user-1',
		};

		const result = await deleteListings(dataSources)(command);

		expect(result).toBe(true);
		expect(reservationRepo.getActiveByListingId).toHaveBeenCalledWith('listing-1');
		expect(uow.withScopedTransaction).toHaveBeenCalledTimes(1);
		expect(repo.get).toHaveBeenCalledWith('listing-1');
		expect(listing.requestDelete).toHaveBeenCalledTimes(1);
		expect(repo.save).toHaveBeenCalledWith(listing);
	});

	it('throws when active reservation requests block deletion', async () => {
		const { dataSources } = createDataSources({
			reservations: [{ id: 'rr-1' }],
		});
		const command: ItemListingDeleteCommand = {
			id: 'listing-1',
			userId: 'user-1',
		};

		await expect(deleteListings(dataSources)(command)).rejects.toThrow(
			'Cannot delete listing with active reservation requests',
		);
	});

	it('throws when user is not the listing owner', async () => {
		const { dataSources } = createDataSources({
			listing: {
				sharer: { id: 'someone-else' },
			},
		});
		const command: ItemListingDeleteCommand = {
			id: 'listing-1',
			userId: 'user-1',
		};

		await expect(deleteListings(dataSources)(command)).rejects.toThrow(
			'You do not have permission to delete this listing',
		);
	});

	it('throws a descriptive error when the unit of work is missing', async () => {
		const dataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: undefined,
					},
				},
			},
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getActiveByListingId: vi.fn(),
						},
					},
				},
			},
		} as unknown as DataSources;

		await expect(
			deleteListings(dataSources)({ id: 'listing-1', userId: 'user-1' }),
		).rejects.toThrow(
			'ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing',
		);
	});
});