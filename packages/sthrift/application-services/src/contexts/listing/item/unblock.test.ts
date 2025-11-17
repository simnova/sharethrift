import { describe, expect, it, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';
import { unblock, type ItemListingUnblockCommand } from './unblock.ts';

type MockListing = {
	id: string;
	setBlocked: ReturnType<typeof vi.fn>;
};

const createDataSources = (options?: {
	listing?: MockListing | undefined;
	saveResult?: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | undefined;
}) => {
	const listing: MockListing | undefined = options?.listing ?? {
		id: 'listing-1',
		setBlocked: vi.fn(),
	};

	const repo = {
		getById: vi.fn().mockResolvedValue(listing),
		save: vi.fn().mockResolvedValue(
			options?.saveResult ??
				(listing as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference),
		),
	};

	const uow = {
		withScopedTransaction: vi.fn(async (fn: (repoArg: typeof repo) => Promise<void>) => {
			await fn(repo);
		}),
	};

	const dataSources = {
		domainDataSource: {
			Listing: {
				ItemListing: {
					ItemListingUnitOfWork: uow,
				},
			},
		},
	} as unknown as DataSources;

	return { dataSources, listing, repo, uow };
};

describe('Item listing unblock command', () => {
	it('updates blocked status via the unit of work transaction', async () => {
		const { dataSources, listing, repo, uow } = createDataSources();
		const command: ItemListingUnblockCommand = {
			id: 'listing-1',
			isBlocked: false,
		};

		const result = await unblock(dataSources)(command);

		expect(uow.withScopedTransaction).toHaveBeenCalledWith(expect.any(Function));
		expect(repo.getById).toHaveBeenCalledWith('listing-1');
		expect(listing?.setBlocked).toHaveBeenCalledWith(false);
		expect(repo.save).toHaveBeenCalledWith(listing);
		expect(result).toEqual(listing);
	});

	it('throws when the listing cannot be found', async () => {
		const { dataSources, repo } = createDataSources({ listing: undefined });
		repo.getById.mockResolvedValueOnce(undefined);
		await expect(
			unblock(dataSources)({ id: 'missing', isBlocked: true }),
		).rejects.toThrow('Listing not found');
	});

	it('throws when the repository does not persist the update', async () => {
		const { dataSources, repo } = createDataSources({});
		repo.save.mockResolvedValueOnce(undefined as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference);
		await expect(
			unblock(dataSources)({ id: 'listing-1', isBlocked: true }),
		).rejects.toThrow('ItemListing not updated');
	});
});