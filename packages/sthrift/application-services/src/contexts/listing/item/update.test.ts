import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type ItemListingUpdateCommand, update } from './update.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/update.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ItemListingUpdateCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: {
							withScopedTransactionById: vi.fn(async (id, callback) => {
								const mockListing = {
									id,
									setBlocked: vi.fn(),
									setDeleted: vi.fn(),
								};
								const mockRepo = {
									get: vi.fn().mockResolvedValue(mockListing),
									save: vi.fn().mockResolvedValue(mockListing),
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
	});

	Scenario('Successfully blocking a listing', ({ Given, And, When, Then }) => {
		Given('a valid listing ID "listing-123"', () => {
			command.id = 'listing-123';
		});

		And('the listing exists', () => {
			command.isBlocked = true;
		});

		When('the update command is executed with isBlocked true', async () => {
			const updateFn = update(mockDataSources);
			result = await updateFn(command);
		});

		Then('the listing should be blocked', () => {
			expect(result).toBeUndefined();
   // biome-ignore lint/suspicious/noExplicitAny: Test mock access
			const mockUow = (mockDataSources.domainDataSource as any).Listing
				.ItemListing.ItemListingUnitOfWork;
			expect(mockUow.withScopedTransactionById).toHaveBeenCalledWith(
				'listing-123',
				expect.any(Function),
			);
		});
	});

	Scenario('Successfully deleting a listing', ({ Given, And, When, Then }) => {
		Given('a valid listing ID "listing-123"', () => {
			command.id = 'listing-123';
		});

		And('the listing exists', () => {
			command.isDeleted = true;
		});

		When('the update command is executed with isDeleted true', async () => {
			const updateFn = update(mockDataSources);
			result = await updateFn(command);
		});

		Then('the listing should be deleted', () => {
			expect(result).toBeUndefined();
   // biome-ignore lint/suspicious/noExplicitAny: Test mock access
			const mockUow = (mockDataSources.domainDataSource as any).Listing
				.ItemListing.ItemListingUnitOfWork;
			expect(mockUow.withScopedTransactionById).toHaveBeenCalledWith(
				'listing-123',
				expect.any(Function),
			);
		});
	});
});
