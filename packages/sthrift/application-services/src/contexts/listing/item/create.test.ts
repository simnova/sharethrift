import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { create, type ItemListingCreateCommand } from './create.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/create.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ItemListingCreateCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: {
							withScopedTransaction: vi.fn(async (callback) => {
								const mockRepo = {
									getNewInstance: vi.fn(),
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

		command = {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock sharer
			sharer: { id: 'user-123' } as any,
			title: 'Test Listing',
			description: 'A test listing',
			category: 'Tools',
			location: 'New York',
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
		};
		result = undefined;
	});

	Scenario(
		'Successfully creating a new listing',
		({ Given, And, When, Then }) => {
			Given('valid listing details', () => {
				command.title = 'Lawnmower';
				command.description = 'Gas powered lawnmower';
				command.category = 'Garden Tools';
			});

			And('a valid sharer "user-123"', () => {
				// biome-ignore lint/suspicious/noExplicitAny: Test mock sharer
				command.sharer = { id: 'user-123' } as any;
				const mockListing = { id: 'listing-123', title: 'Lawnmower' };
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.domainDataSource as any
				).Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction.mockImplementation(
     // biome-ignore lint/suspicious/noExplicitAny: Test mock callback
					async (callback: any) => {
						const mockRepo = {
							getNewInstance: vi.fn().mockResolvedValue(mockListing),
							save: vi.fn().mockResolvedValue(mockListing),
						};
						await callback(mockRepo);
					},
				);
			});

			When('the create command is executed', async () => {
				const createFn = create(mockDataSources);
				result = await createFn(command);
			});

			Then('a new listing should be created', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('listing-123');
			});
		},
	);

	Scenario('Creating a draft listing', ({ Given, And, When, Then }) => {
		Given('valid listing details', () => {
			command.title = 'Drill';
			command.description = 'Cordless drill';
			command.category = 'Power Tools';
		});

		And('the isDraft flag is true', () => {
			command.isDraft = true;
			const mockListing = { id: 'listing-456', title: 'Drill', isDraft: true };
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.domainDataSource as any
			).Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction.mockImplementation(
    // biome-ignore lint/suspicious/noExplicitAny: Test mock callback
				async (callback: any) => {
					const mockRepo = {
						getNewInstance: vi.fn().mockResolvedValue(mockListing),
						save: vi.fn().mockResolvedValue(mockListing),
					};
					await callback(mockRepo);
				},
			);
		});

		When('the create command is executed', async () => {
			const createFn = create(mockDataSources);
			result = await createFn(command);
		});

		Then('a draft listing should be created', () => {
			expect(result).toBeDefined();
			expect(result.isDraft).toBe(true);
		});
	});
});
