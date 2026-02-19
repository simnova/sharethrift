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

	Scenario('Creating a listing with images', ({ Given, And, When, Then }) => {
		Given('valid listing details', () => {
			command.title = 'Camera';
			command.description = 'DSLR Camera';
			command.category = 'Electronics';
		});

		And('images are provided', () => {
			command.images = ['image1.jpg', 'image2.jpg'];
			const mockListing = {
				id: 'listing-789',
				title: 'Camera',
				images: ['image1.jpg', 'image2.jpg'],
			};
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

		Then('a listing with images should be created', () => {
			expect(result).toBeDefined();
			expect(result.images).toEqual(['image1.jpg', 'image2.jpg']);
		});
	});

	Scenario('Creating a listing with expiration date', ({ Given, And, When, Then }) => {
		Given('valid listing details', () => {
			command.title = 'Limited Time Offer';
			command.description = 'Item available for limited time';
			command.category = 'Specials';
		});

		And('an expiration date is provided', () => {
			command.expiresAt = new Date('2025-12-31T23:59:59Z');
			const mockListing = {
				id: 'listing-exp-123',
				title: 'Limited Time Offer',
				expiresAt: new Date('2025-12-31T23:59:59Z'),
			};
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

		Then('a listing with expiration date should be created', () => {
			expect(result).toBeDefined();
			expect(result.expiresAt).toEqual(new Date('2025-12-31T23:59:59Z'));
		});
	});

	Scenario(
		'Creating a listing with isDraft explicitly set to false',
		({ Given, And, When, Then }) => {
			Given('valid listing details', () => {
				command.title = 'Hammer';
				command.description = 'Claw hammer';
				command.category = 'Hand Tools';
			});

			And('the isDraft flag is false', () => {
				command.isDraft = false;
				const mockListing = {
					id: 'listing-999',
					title: 'Hammer',
					isDraft: false,
				};
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

			Then('a non-draft listing should be created', () => {
				expect(result).toBeDefined();
				expect(result.isDraft).toBe(false);
			});
		},
	);

	Scenario(
		'Creating a listing fails when save returns undefined',
		({ Given, And, When, Then }) => {
			let error: Error | undefined;

			Given('valid listing details', () => {
				command.title = 'Failed Listing';
				command.description = 'This will fail';
				command.category = 'Test';
			});

			And('the repository save returns undefined', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.domainDataSource as any
				).Listing.ItemListing.ItemListingUnitOfWork.withScopedTransaction.mockImplementation(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
					async (callback: any) => {
						const mockRepo = {
							getNewInstance: vi.fn().mockResolvedValue({}),
							save: vi.fn().mockResolvedValue(undefined),
						};
						await callback(mockRepo);
					},
				);
			});

			When('the create command is executed', async () => {
				const createFn = create(mockDataSources);
				try {
					await createFn(command);
				} catch (e) {
					error = e as Error;
				}
			});

			Then(
				'an error should be thrown with message "ItemListing not created"',
				() => {
					expect(error).toBeDefined();
					expect(error?.message).toBe('ItemListing not created');
				},
			);
		},
	);
});
