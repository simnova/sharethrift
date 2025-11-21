import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { update, type ItemListingUpdateCommand } from './update.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/update.feature'),
);

describeFeature(feature, (f) => {
	let mockListing: Record<string, unknown>;
	let mockRepo: {
		get: ReturnType<typeof vi.fn>;
		save: ReturnType<typeof vi.fn>;
	};
	let mockUow: {
		withScopedTransactionById: ReturnType<typeof vi.fn>;
	};
	let mockDataSources: DataSources;
	let thrownError: Error | null;
	let updateFunction: (command: ItemListingUpdateCommand) => Promise<unknown>;

	f.Background(({ Given }) => {
		Given('the listing repository is available', () => {
			mockListing = {
				title: 'Old Title',
			};

			mockRepo = {
				get: vi.fn().mockResolvedValue(mockListing),
				save: vi.fn().mockResolvedValue({ id: 'listing-123' }),
			};

			mockUow = {
				withScopedTransactionById: vi.fn((_id, callback) => {
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
			} as unknown as DataSources;

			updateFunction = update(mockDataSources);
		});
	});

	f.Scenario('Successfully updating listing title', ({ Given, When, Then, And }) => {
		Given('a listing with id {string} and title {string}', () => {
			mockListing = { title: 'Old Title' };
			mockRepo.get.mockResolvedValue(mockListing);
			mockRepo.save.mockResolvedValue({ id: 'listing-123', title: 'New Title' });
		});

		When('I update the listing with title {string}', async () => {
			thrownError = null;
			try {
				await updateFunction({
id: 'listing-123',
title: 'New Title',
});
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('the listing title should be {string}', () => {
			expect(mockListing.title).toBe('New Title');
		});

		And('the listing should be saved to the repository', () => {
			expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
		});
	});

	f.Scenario('Successfully updating multiple fields', ({ Given, When, Then, And }) => {
		Given('a listing with id {string} and multiple fields', () => {
			mockListing = {
				title: 'Old Title',
				description: 'Old Description',
				category: 'Old Category',
				location: 'Old Location',
			};
			mockRepo.get.mockResolvedValue(mockListing);
		});

		When('I update the listing with new values for title, description, category, and location', async () => {
			thrownError = null;
			try {
				await updateFunction({
id: 'listing-123',
title: 'New Title',
description: 'New Description',
category: 'New Category',
location: 'New Location',
});
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('all fields should be updated with the new values', () => {
			expect(mockListing.title).toBe('New Title');
			expect(mockListing.description).toBe('New Description');
			expect(mockListing.category).toBe('New Category');
			expect(mockListing.location).toBe('New Location');
		});

		And('the listing should be saved to the repository', () => {
			expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
		});
	});

	f.Scenario('Successfully updating sharing period dates', ({ Given, When, Then, And }) => {
		Given('a listing with id {string} and no sharing period', () => {
			mockListing = {
				sharingPeriodStart: undefined,
				sharingPeriodEnd: undefined,
			};
			mockRepo.get.mockResolvedValue(mockListing);
		});

		When('I update the listing with sharing period start {string} and end {string}', async () => {
			const startDate = new Date('2025-10-10');
			const endDate = new Date('2025-12-10');
			thrownError = null;
			try {
				await updateFunction({
id: 'listing-123',
sharingPeriodStart: startDate,
sharingPeriodEnd: endDate,
});
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('the sharing period should be set correctly', () => {
			expect(mockListing.sharingPeriodStart).toEqual(new Date('2025-10-10'));
			expect(mockListing.sharingPeriodEnd).toEqual(new Date('2025-12-10'));
		});

		And('the listing should be saved to the repository', () => {
			expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
		});
	});

	f.Scenario('Converting string dates to Date objects', ({ Given, When, Then, And }) => {
		Given('a listing with id {string} and no sharing period start', () => {
			mockListing = {
				sharingPeriodStart: undefined,
			};
			mockRepo.get.mockResolvedValue(mockListing);
		});

		When('I update the listing with sharing period start as string {string}', async () => {
			thrownError = null;
			try {
				await updateFunction({
id: 'listing-123',
sharingPeriodStart: '2025-10-10',
});
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('the sharing period start should be a Date object', () => {
			expect(mockListing.sharingPeriodStart).toBeInstanceOf(Date);
		});

		And('the date should represent {string}', () => {
			expect((mockListing.sharingPeriodStart as Date).toISOString()).toContain('2025-10-10');
		});
	});

	f.Scenario('Failing to update with invalid date string', ({ When, Then }) => {
		When('I update a listing with invalid date string {string}', async () => {
			thrownError = null;
			try {
				await updateFunction({
id: 'listing-123',
sharingPeriodStart: 'invalid-date',
});
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('an error should be thrown with message {string}', () => {
			expect(thrownError).toBeTruthy();
			expect(thrownError?.message).toBe('Invalid date supplied for listing update');
		});
	});

	f.Scenario('Failing to update when UnitOfWork is not available', ({ Given, When, Then }) => {
		Given('the ItemListingUnitOfWork is not available', () => {
			mockDataSources = {
				domainDataSource: {
					Listing: {
						ItemListing: {
							ItemListingUnitOfWork: null,
						},
					},
				},
			} as unknown as DataSources;
			updateFunction = update(mockDataSources);
		});

		When('I update a listing with title {string}', async () => {
			thrownError = null;
			try {
				await updateFunction({
id: 'listing-123',
title: 'New Title',
});
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('an error should be thrown with message {string}', () => {
			expect(thrownError).toBeTruthy();
			expect(thrownError?.message).toBe('ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing');
		});
	});

	f.Scenario('Successfully updating images array', ({ Given, When, Then, And }) => {
		Given('a listing with id {string} and empty images array', () => {
			mockListing = {
				images: [] as string[],
			};
			mockRepo.get.mockResolvedValue(mockListing);
		});

		When('I update the listing with images {string} and {string}', async () => {
			thrownError = null;
			try {
				await updateFunction({
id: 'listing-123',
images: ['img1.png', 'img2.png'],
});
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('the listing images should contain both images', () => {
			expect(mockListing.images).toEqual(['img1.png', 'img2.png']);
		});

		And('the listing should be saved to the repository', () => {
			expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
		});
	});

	f.Scenario('Successfully updating isBlocked status', ({ Given, When, Then, And }) => {
		Given('a listing with id {string}', () => {
			mockListing = {
				setBlocked: vi.fn(),
			};
			mockRepo.get.mockResolvedValue(mockListing);
		});

		When('I update the listing with isBlocked status true', async () => {
			thrownError = null;
			try {
				await updateFunction({
id: 'listing-123',
isBlocked: true,
});
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('the listing setBlocked method should be called with true', () => {
			expect(mockListing.setBlocked).toHaveBeenCalledWith(true);
		});

		And('the listing should be saved to the repository', () => {
			expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
		});
	});
});
