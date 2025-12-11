import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { unblock } from './unblock.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/unblock.feature'),
);

describeFeature(feature, (f) => {
	let mockListing: { blocked?: boolean };
	let mockRepo: {
		getById: ReturnType<typeof vi.fn>;
		save: ReturnType<typeof vi.fn>;
	};
	let mockUow: {
		withScopedTransaction: ReturnType<typeof vi.fn>;
	};
	let mockDataSources: DataSources;
	let thrownError: Error | null;
	let result: unknown;
	let unblockFunction: (command: { id: string }) => Promise<unknown>;

	f.Background(({ Given }) => {
		Given('the listing repository is available', () => {
			mockListing = {};

			mockRepo = {
				getById: vi.fn().mockResolvedValue(mockListing),
				save: vi.fn().mockResolvedValue({ id: 'listing-123', isBlocked: false }),
			};

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
			} as unknown as DataSources;

			unblockFunction = unblock(mockDataSources);
		});
	});

	f.Scenario('Successfully unblocking a listing', ({ Given, When, Then, And }) => {
		Given('a blocked listing with id {string}', () => {
			mockRepo.getById.mockResolvedValue(mockListing);
		});

		When('I request to unblock the listing', async () => {
			thrownError = null;
			try {
				result = await unblockFunction({ id: 'listing-123' });
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('the listing should be marked as unblocked', () => {
			expect(mockListing.blocked).toBe(false);
		});

		And('the listing should be saved to the repository', () => {
			expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
		});

		And('the result should contain the updated listing reference', () => {
			expect(result).toEqual({ id: 'listing-123', isBlocked: false });
		});
	});

	f.Scenario('Failing to unblock when listing is not found', ({ Given, When, Then }) => {
		Given('the listing with id {string} does not exist', () => {
			mockRepo.getById.mockResolvedValue(null);
		});

		When('I request to unblock the listing', async () => {
			thrownError = null;
			try {
				result = await unblockFunction({ id: 'listing-123' });
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('an error should be thrown with message {string}', () => {
			expect(thrownError).toBeTruthy();
			expect(thrownError?.message).toBe('Listing not found');
		});
	});

	f.Scenario('Failing to unblock when save returns undefined', ({ Given, And, When, Then }) => {
		Given('a blocked listing with id {string}', () => {
			mockRepo.getById.mockResolvedValue(mockListing);
		});

		And('the repository save operation returns undefined', () => {
			mockRepo.save.mockResolvedValue(undefined);
		});

		When('I request to unblock the listing', async () => {
			thrownError = null;
			try {
				result = await unblockFunction({ id: 'listing-123' });
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('an error should be thrown with message {string}', () => {
			expect(thrownError).toBeTruthy();
			expect(thrownError?.message).toBe('ItemListing not updated');
		});
	});
});
