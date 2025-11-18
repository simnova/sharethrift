import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';
import { unblock, type ItemListingUnblockCommand } from './unblock.ts';

type MockListing = {
	id: string;
	setBlocked: ReturnType<typeof vi.fn>;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'unblock.feature'));

const test = { for: describeFeature };

test.for(feature, ({ Scenario }) => {
	Scenario('Successfully unblock a listing', ({ Given, When, Then, And }) => {
		let dataSources: DataSources;
		let listing: MockListing;
		let result: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;

		Given('a listing exists with id "listing-123"', () => {
			listing = {
				id: 'listing-123',
				setBlocked: vi.fn(),
			};
		});

		And('the listing is currently blocked', () => {
			const repo = {
				getById: vi.fn().mockResolvedValue(listing),
				save: vi.fn().mockResolvedValue(
					listing as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
				),
			};

			const uow = {
				withScopedTransaction: vi.fn(
					async (fn: (repoArg: typeof repo) => Promise<void>) => {
						await fn(repo);
					},
				),
			};

			dataSources = {
				domainDataSource: {
					Listing: {
						ItemListing: {
							ItemListingUnitOfWork: uow,
						},
					},
				},
			} as unknown as DataSources;
		});

		When('I unblock the listing with id "listing-123"', async () => {
			const command: ItemListingUnblockCommand = {
				id: 'listing-123',
			};
			result = await unblock(dataSources)(command);
		});

		Then('the listing isBlocked flag should be set to false', () => {
			expect(listing.setBlocked).toHaveBeenCalledWith(false);
		});

		And('the listing should be saved successfully', () => {
			expect(result).toEqual(listing);
		});
	});

	Scenario('Handle listing not found', ({ When, Then }) => {
		let dataSources: DataSources;
		let unblockPromise: Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;

		When('I try to unblock a listing with id "nonexistent-listing"', async () => {
			const repo = {
				getById: vi.fn().mockResolvedValue(undefined),
				save: vi.fn(),
			};

			const uow = {
				withScopedTransaction: vi.fn(
					async (fn: (repoArg: typeof repo) => Promise<void>) => {
						await fn(repo);
					},
				),
			};

			dataSources = {
				domainDataSource: {
					Listing: {
						ItemListing: {
							ItemListingUnitOfWork: uow,
						},
					},
				},
			} as unknown as DataSources;

			const command: ItemListingUnblockCommand = {
				id: 'nonexistent-listing',
			};
			unblockPromise = unblock(dataSources)(command);
		});

		Then('an error should be thrown indicating listing not found', async () => {
			await expect(unblockPromise).rejects.toThrow('Listing not found');
		});
	});

	Scenario('Handle save failure', ({ Given, When, Then, And }) => {
		let dataSources: DataSources;
		let unblockPromise: Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;

		Given('a listing exists with id "listing-456"', () => {
			// Setup in next step
		});

		And('the repository will fail to save', () => {
			const listing = {
				id: 'listing-456',
				setBlocked: vi.fn(),
			};

			const repo = {
				getById: vi.fn().mockResolvedValue(listing),
				save: vi.fn().mockResolvedValue(undefined),
			};

			const uow = {
				withScopedTransaction: vi.fn(
					async (fn: (repoArg: typeof repo) => Promise<void>) => {
						await fn(repo);
					},
				),
			};

			dataSources = {
				domainDataSource: {
					Listing: {
						ItemListing: {
							ItemListingUnitOfWork: uow,
						},
					},
				},
			} as unknown as DataSources;
		});

		When('I try to unblock the listing with id "listing-456"', async () => {
			const command: ItemListingUnblockCommand = {
				id: 'listing-456',
			};
			unblockPromise = unblock(dataSources)(command);
		});

		Then('an error should be thrown indicating save failure', async () => {
			await expect(unblockPromise).rejects.toThrow('ItemListing not updated');
		});
	});
});