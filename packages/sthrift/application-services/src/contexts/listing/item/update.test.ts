import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type ItemListingUpdateCommand, update } from './update.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'update.feature'));

const test = { for: describeFeature };

test.for(feature, ({ Scenario }) => {
	Scenario('Successfully update listing fields', ({ Given, When, Then }) => {
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

		let dataSources: DataSources;
		let listing: MockListing;
		let repo: { get: ReturnType<typeof vi.fn>; save: ReturnType<typeof vi.fn> };
		let uow: { withScopedTransactionById: ReturnType<typeof vi.fn> };
		let command: ItemListingUpdateCommand;
		let result:
			| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
			| undefined;

		Given('a listing exists with id "listing-1"', () => {
			listing = {
				id: 'listing-1',
				title: 'Old Title',
				description: 'Old Description',
				category: 'Old Category',
				location: 'Old Location',
				sharingPeriodStart: new Date('2024-01-01T00:00:00Z'),
				sharingPeriodEnd: new Date('2024-02-01T00:00:00Z'),
				images: ['old-image'],
				setBlocked: vi.fn(),
			};

			repo = {
				get: vi.fn().mockResolvedValue(listing),
				save: vi
					.fn()
					.mockResolvedValue(
						listing as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
					),
			};

			uow = {
				withScopedTransactionById: vi.fn(
					async (_id: string, fn: (repoArg: typeof repo) => Promise<void>) => {
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

		When('I update the listing with all new field values', async () => {
			repo.save.mockResolvedValue({ ...listing, title: 'Updated Title' });
			command = {
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
			result = await update(dataSources)(command);
		});

		Then('the listing should be saved with all updated fields', () => {
			expect(uow.withScopedTransactionById).toHaveBeenCalledWith(
				'listing-1',
				expect.any(Function),
			);
			expect(listing.title).toBe('Updated Title');
			expect(listing.description).toBe('Updated Description');
			expect(listing.category).toBe('Books');
			expect(listing.location).toBe('Remote');
			expect(listing.sharingPeriodStart.toISOString()).toBe(
				'2025-01-01T00:00:00.000Z',
			);
			expect(listing.sharingPeriodEnd.toISOString()).toBe(
				'2025-02-01T00:00:00.000Z',
			);
			expect(listing.images).toEqual(['new-image']);
			expect(listing.setBlocked).toHaveBeenCalledWith(true);
			expect(result?.title).toBe('Updated Title');
		});
	});

	Scenario('Update listing with date fields', ({ Given, When, Then }) => {
		let dataSources: DataSources;
		let listing: {
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
		let repo: { get: ReturnType<typeof vi.fn>; save: ReturnType<typeof vi.fn> };
		let uow: { withScopedTransactionById: ReturnType<typeof vi.fn> };

		Given('a listing exists with id "listing-2"', () => {
			listing = {
				id: 'listing-2',
				title: 'Test Listing',
				description: 'Test Description',
				category: 'Test Category',
				location: 'Test Location',
				sharingPeriodStart: new Date('2024-01-01T00:00:00Z'),
				sharingPeriodEnd: new Date('2024-02-01T00:00:00Z'),
				images: [],
				setBlocked: vi.fn(),
			};

			repo = {
				get: vi.fn().mockResolvedValue(listing),
				save: vi
					.fn()
					.mockResolvedValue(
						listing as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
					),
			};

			uow = {
				withScopedTransactionById: vi.fn(
					async (_id: string, fn: (repoArg: typeof repo) => Promise<void>) => {
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

		When('I update the listing with ISO string dates', async () => {
			const command: ItemListingUpdateCommand = {
				id: 'listing-2',
				sharingPeriodStart: '2025-06-01T00:00:00Z',
				sharingPeriodEnd: '2025-07-01T00:00:00Z',
			};
			await update(dataSources)(command);
		});

		Then('the dates should be converted to Date objects correctly', () => {
			expect(listing.sharingPeriodStart.toISOString()).toBe(
				'2025-06-01T00:00:00.000Z',
			);
			expect(listing.sharingPeriodEnd.toISOString()).toBe(
				'2025-07-01T00:00:00.000Z',
			);
		});
	});

	Scenario('Handle invalid date format', ({ Given, When, Then }) => {
		let dataSources: DataSources;
		let error: Error | undefined;

		Given('a listing exists with id "listing-3"', () => {
			const listing = {
				id: 'listing-3',
				title: 'Test Listing',
				description: 'Test Description',
				category: 'Test Category',
				location: 'Test Location',
				sharingPeriodStart: new Date('2024-01-01T00:00:00Z'),
				sharingPeriodEnd: new Date('2024-02-01T00:00:00Z'),
				images: [],
				setBlocked: vi.fn(),
			};

			const repo = {
				get: vi.fn().mockResolvedValue(listing),
				save: vi
					.fn()
					.mockResolvedValue(
						listing as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
					),
			};

			const uow = {
				withScopedTransactionById: vi.fn(
					async (_id: string, fn: (repoArg: typeof repo) => Promise<void>) => {
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

		When('I update the listing with invalid date "not-a-date"', async () => {
			try {
				await update(dataSources)({
					id: 'listing-3',
					sharingPeriodStart: 'not-a-date',
				});
			} catch (e) {
				error = e as Error;
			}
		});

		Then(
			'the update should fail with "Invalid date supplied for listing update"',
			() => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Invalid date supplied for listing update');
			},
		);
	});

	Scenario('Save fails due to repository error', ({ Given, When, Then }) => {
		let dataSources: DataSources;
		let error: Error | undefined;

		Given('a listing exists with id "listing-4"', () => {
			const listing = {
				id: 'listing-4',
				title: 'Test Listing',
				description: 'Test Description',
				category: 'Test Category',
				location: 'Test Location',
				sharingPeriodStart: new Date('2024-01-01T00:00:00Z'),
				sharingPeriodEnd: new Date('2024-02-01T00:00:00Z'),
				images: [],
				setBlocked: vi.fn(),
			};

			const repo = {
				get: vi.fn().mockResolvedValue(listing),
				save: vi
					.fn()
					.mockResolvedValueOnce(
						undefined as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
					),
			};

			const uow = {
				withScopedTransactionById: vi.fn(
					async (_id: string, fn: (repoArg: typeof repo) => Promise<void>) => {
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

		When('I update the listing but the repository fails to save', async () => {
			try {
				await update(dataSources)({ id: 'listing-4', title: 'Still Fails' });
			} catch (e) {
				error = e as Error;
			}
		});

		Then('the update should fail with "Item listing update failed"', () => {
			expect(error).toBeDefined();
			expect(error?.message).toBe('Item listing update failed');
		});
	});
});
