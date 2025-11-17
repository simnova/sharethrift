import { describe, expect, it, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import type { Domain } from '@sthrift/domain';
import { update, type ItemListingUpdateCommand } from './update.ts';

type MockListing = {
	id: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images: string[];
	setBlocked: ReturnType<typeof vi.fn>;
};

const createDataSources = (listingOverrides?: Partial<MockListing>) => {
	const listing: MockListing = {
		id: 'listing-1',
		title: 'Old Title',
		description: 'Old Description',
		category: 'Old Category',
		location: 'Old Location',
		sharingPeriodStart: new Date('2024-01-01T00:00:00Z'),
		sharingPeriodEnd: new Date('2024-02-01T00:00:00Z'),
		images: ['old-image'],
		setBlocked: vi.fn(),
		...listingOverrides,
	};

	const repo = {
		get: vi.fn().mockResolvedValue(listing),
		save: vi.fn().mockResolvedValue(
			listing as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
		),
	};

	const uow = {
		withScopedTransactionById: vi.fn(async (_id: string, fn: (repoArg: typeof repo) => Promise<void>) => {
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

describe('Item listing update command', () => {
	it('updates provided fields, converts dates, and returns the saved listing', async () => {
		const { dataSources, listing, repo, uow } = createDataSources();
		repo.save.mockResolvedValue({ ...listing, title: 'Updated Title' });
		const command: ItemListingUpdateCommand = {
			id: 'listing-1',
			title: 'Updated Title',
			description: 'Updated Description',
			category: 'Books',
			location: 'Remote',
			sharingPeriodStart: '2025-01-01T00:00:00Z',
			sharingPeriodEnd: new Date('2025-02-01T00:00:00Z'),
			images: ['new-image'],
			isBlocked: true,
		};

		const result = await update(dataSources)(command);

		expect(uow.withScopedTransactionById).toHaveBeenCalledWith('listing-1', expect.any(Function));
		expect(listing.title).toBe('Updated Title');
		expect(listing.description).toBe('Updated Description');
		expect(listing.category).toBe('Books');
		expect(listing.location).toBe('Remote');
		expect(listing.sharingPeriodStart.toISOString()).toBe('2025-01-01T00:00:00.000Z');
		expect(listing.sharingPeriodEnd.toISOString()).toBe('2025-02-01T00:00:00.000Z');
		expect(listing.images).toEqual(['new-image']);
		expect(listing.setBlocked).toHaveBeenCalledWith(true);
		expect(result?.title).toBe('Updated Title');
	});

	it('throws when invalid dates are provided', async () => {
		const { dataSources } = createDataSources();
		await expect(
			update(dataSources)({ id: 'listing-1', sharingPeriodStart: 'not-a-date' }),
		).rejects.toThrow('Invalid date supplied for listing update');
	});

	it('throws when the repository does not return an updated entity reference', async () => {
		const { dataSources, repo } = createDataSources();
		repo.save.mockResolvedValueOnce(undefined as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference);
		await expect(
			update(dataSources)({ id: 'listing-1', title: 'Still Fails' }),
		).rejects.toThrow('Item listing update failed');
	});
});