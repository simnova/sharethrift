import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { cancel, type ItemListingCancelCommand } from './cancel.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/cancel.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ItemListingCancelCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let error: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: {
							withScopedTransaction: vi.fn(async (callback) => {
								const mockRepo = {
									getById: vi.fn(),
									save: vi.fn(),
								};
								await callback(mockRepo);
							}),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { id: 'listing-123' };
		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully cancelling an active listing',
		({ Given, And, When, Then }) => {
			Given('a valid listing ID "listing-123"', () => {
				command = { id: 'listing-123' };
			});

			And('the listing exists and is active', () => {
				const mockListing = {
					id: 'listing-123',
					state: 'Active',
					cancel: vi.fn(),
				};

				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.domainDataSource as any
				).Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction.mockImplementation(
     // biome-ignore lint/suspicious/noExplicitAny: Test mock callback
					async (callback: any) => {
						const mockRepo = {
							getById: vi.fn().mockResolvedValue(mockListing),
							save: vi
								.fn()
								.mockResolvedValue({ ...mockListing, state: 'Cancelled' }),
						};
						await callback(mockRepo);
					},
				);
			});

			When('the cancel command is executed', async () => {
				const cancelFn = cancel(mockDataSources);
				try {
					result = await cancelFn(command);
				} catch (err) {
					error = err;
				}
			});

			Then('the listing should be cancelled', () => {
				expect(error).toBeUndefined();
				expect(result).toBeDefined();
				expect(result.state).toBe('Cancelled');
			});
		},
	);

	Scenario(
		'Attempting to cancel a non-existent listing',
		({ Given, And, When, Then }) => {
			Given('a listing ID "listing-999"', () => {
				command = { id: 'listing-999' };
			});

			And('the listing does not exist', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.domainDataSource as any
				).Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction.mockImplementation(
     // biome-ignore lint/suspicious/noExplicitAny: Test mock callback
					async (callback: any) => {
						const mockRepo = {
							getById: vi.fn().mockResolvedValue(undefined),
							save: vi.fn(),
						};
						await callback(mockRepo);
					},
				);
			});

			When('the cancel command is executed', async () => {
				const cancelFn = cancel(mockDataSources);
				try {
					result = await cancelFn(command);
				} catch (err) {
					error = err;
				}
			});

			Then('an error "Listing not found" should be thrown', () => {
				expect(error).toBeDefined();
				expect(error.message).toBe('Listing not found');
			});
		},
	);
});
