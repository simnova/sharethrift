import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { pause } from './pause.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/pause.feature'),
);

describeFeature(feature, (f) => {
	let mockListing: { pause: ReturnType<typeof vi.fn> };
	let mockRepo: {
		getById: ReturnType<typeof vi.fn>;
		save: ReturnType<typeof vi.fn>;
	};
	let mockUow: {
		withScopedTransaction: ReturnType<typeof vi.fn>;
	};
	let mockDataSources: DataSources;
	let pauseFunction: (command: { id: string }) => Promise<unknown>;
	let thrownError: Error | null;
	let result: unknown;

	f.Background(({ Given }) => {
		Given('the listing repository is available', () => {
			mockListing = {
				pause: vi.fn(),
			};

			mockRepo = {
				getById: vi.fn().mockResolvedValue(mockListing),
				save: vi.fn().mockResolvedValue({ id: 'listing-123', state: 'Paused' }),
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

			pauseFunction = pause(mockDataSources);
		});
	});

	f.Scenario('Successfully pausing a listing', ({ Given, When, Then, And }) => {
		Given('an active listing with id {string}', () => {
			mockRepo.getById.mockResolvedValue(mockListing);
		});

		When('I request to pause the listing', async () => {
			thrownError = null;
			try {
				result = await pauseFunction({ id: 'listing-123' });
			} catch (error) {
				thrownError = error as Error;
			}
		});

		Then('the listing should be marked as paused', () => {
			expect(mockListing.pause).toHaveBeenCalledTimes(1);
		});

		And('the listing should be saved to the repository', () => {
			expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
		});

		And('the result should contain the paused listing reference', () => {
			expect(result).toEqual({ id: 'listing-123', state: 'Paused' });
		});
	});

	f.Scenario(
		'Failing to pause when listing is not found',
		({ Given, When, Then }) => {
			Given('the listing with id {string} does not exist', () => {
				mockRepo.getById.mockResolvedValue(null);
			});

			When('I request to pause the listing', async () => {
				thrownError = null;
				try {
					result = await pauseFunction({ id: 'listing-123' });
				} catch (error) {
					thrownError = error as Error;
				}
			});

			Then('an error should be thrown with message {string}', () => {
				expect(thrownError).toBeTruthy();
				expect(thrownError?.message).toBe('Listing not found');
			});
		},
	);

	f.Scenario(
		'Failing to pause when save returns undefined',
		({ Given, And, When, Then }) => {
			Given('an active listing with id {string}', () => {
				mockRepo.getById.mockResolvedValue(mockListing);
			});

			And('the repository save operation returns undefined', () => {
				mockRepo.save.mockResolvedValue(undefined);
			});

			When('I request to pause the listing', async () => {
				thrownError = null;
				try {
					result = await pauseFunction({ id: 'listing-123' });
				} catch (error) {
					thrownError = error as Error;
				}
			});

			Then('an error should be thrown with message {string}', () => {
				expect(thrownError).toBeTruthy();
				expect(thrownError?.message).toBe('ItemListing not paused');
			});
		},
	);
});
