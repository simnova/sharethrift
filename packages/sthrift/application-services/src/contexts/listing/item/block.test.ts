import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { block } from './block.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/block.feature'),
);

describeFeature(feature, (f) => {
	let mockListing: { setBlocked: ReturnType<typeof vi.fn> };
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
	let blockFunction: (command: { id: string }) => Promise<unknown>;

	f.Background(({ Given }) => {
		Given('the listing repository is available', () => {
			mockListing = {
				setBlocked: vi.fn(),
			};

			mockRepo = {
				getById: vi.fn().mockResolvedValue(mockListing),
				save: vi.fn().mockResolvedValue({ id: 'listing-123', isBlocked: true }),
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

			blockFunction = block(mockDataSources);
		});
	});

	f.Scenario('Successfully blocking a listing', ({ Given, When, Then, And }) => {
		Given('an active listing with id {string}', () => {
			mockRepo.getById.mockResolvedValue(mockListing);
		});

		When('I request to block the listing', async () => {
			thrownError = null;
			try {
				result = await blockFunction({ id: 'listing-123' });
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('the listing should be marked as blocked', () => {
			expect(mockListing.setBlocked).toHaveBeenCalledWith(true);
		});

		And('the listing should be saved to the repository', () => {
			expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
		});

		And('the result should contain the updated listing reference', () => {
			expect(result).toEqual({ id: 'listing-123', isBlocked: true });
		});
	});

	f.Scenario('Failing to block when listing is not found', ({ Given, When, Then }) => {
		Given('the listing with id {string} does not exist', () => {
			mockRepo.getById.mockResolvedValue(null);
		});

		When('I request to block the listing', async () => {
			thrownError = null;
			try {
				result = await blockFunction({ id: 'listing-123' });
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('an error should be thrown with message {string}', () => {
			expect(thrownError).toBeTruthy();
			expect(thrownError?.message).toBe('Listing not found');
		});
	});

	f.Scenario('Failing to block when save returns undefined', ({ Given, And, When, Then }) => {
		Given('an active listing with id {string}', () => {
			mockRepo.getById.mockResolvedValue(mockListing);
		});

		And('the repository save operation returns undefined', () => {
			mockRepo.save.mockResolvedValue(undefined);
		});

		When('I request to block the listing', async () => {
			thrownError = null;
			try {
				result = await blockFunction({ id: 'listing-123' });
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
