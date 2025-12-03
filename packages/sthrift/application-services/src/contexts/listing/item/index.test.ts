import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DataSources } from '@sthrift/persistence';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { ItemListing } from './index.ts';

vi.mock('./create.ts');
vi.mock('./query-by-id.ts');
vi.mock('./query-by-sharer.ts');
vi.mock('./query-all.ts');
vi.mock('./cancel.ts');
vi.mock('./query-paged.ts');
vi.mock('./update.ts');

import { create } from './create.ts';
import { queryById } from './query-by-id.ts';
import { queryBySharer } from './query-by-sharer.ts';
import { queryAll } from './query-all.ts';
import { cancel } from './cancel.ts';
import { queryPaged } from './query-paged.ts';
import { update } from './update.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, './features/index.feature'),
);

describeFeature(feature, ({ Scenario, BeforeEachScenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let service: any;
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockCreateFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryByIdFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryBySharerFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryAllFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockCancelFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryPagedFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockUpdateFn: any;

	BeforeEachScenario(() => {
		vi.clearAllMocks();

		mockCreateFn = vi.fn();
		mockQueryByIdFn = vi.fn();
		mockQueryBySharerFn = vi.fn();
		mockQueryAllFn = vi.fn();
		mockCancelFn = vi.fn();
		mockQueryPagedFn = vi.fn();
		mockUpdateFn = vi.fn();

		vi.mocked(create).mockReturnValue(mockCreateFn);
		vi.mocked(queryById).mockReturnValue(mockQueryByIdFn);
		vi.mocked(queryBySharer).mockReturnValue(mockQueryBySharerFn);
		vi.mocked(queryAll).mockReturnValue(mockQueryAllFn);
		vi.mocked(cancel).mockReturnValue(mockCancelFn);
		vi.mocked(queryPaged).mockReturnValue(mockQueryPagedFn);
		vi.mocked(update).mockReturnValue(mockUpdateFn);

		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		mockDataSources = {} as any;
		service = ItemListing(mockDataSources);
	});

	Scenario(
		'Creating an item listing through the application service',
		({ Given, When, Then }) => {
			Given('an item listing application service', () => {
				expect(service).toBeDefined();
			});

			When('I create an item listing', async () => {
				await service.create({});
			});

			Then('it should delegate to the create function', () => {
				expect(mockCreateFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying an item listing by ID through the application service',
		({ Given, When, Then }) => {
			Given('an item listing application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for listing with id "listing-123"', async () => {
				await service.queryById({ id: 'listing-123' });
			});

			Then('it should delegate to the queryById function', () => {
				expect(mockQueryByIdFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying item listings by sharer through the application service',
		({ Given, When, Then }) => {
			Given('an item listing application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for listings by sharer "sharer-1"', async () => {
				await service.queryBySharer({ sharerId: 'sharer-1' });
			});

			Then('it should delegate to the queryBySharer function', () => {
				expect(mockQueryBySharerFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying all item listings through the application service',
		({ Given, When, Then }) => {
			Given('an item listing application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for all listings', async () => {
				await service.queryAll();
			});

			Then('it should delegate to the queryAll function', () => {
				expect(mockQueryAllFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Cancelling an item listing through the application service',
		({ Given, When, Then }) => {
			Given('an item listing application service', () => {
				expect(service).toBeDefined();
			});

			When('I cancel listing "listing-123"', async () => {
				await service.cancel({ id: 'listing-123' });
			});

			Then('it should delegate to the cancel function', () => {
				expect(mockCancelFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying paged item listings through the application service',
		({ Given, When, Then }) => {
			Given('an item listing application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for paged listings', async () => {
				await service.queryPaged({ page: 1 });
			});

			Then('it should delegate to the queryPaged function', () => {
				expect(mockQueryPagedFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Updating an item listing through the application service',
		({ Given, When, Then }) => {
			Given('an item listing application service', () => {
				expect(service).toBeDefined();
			});

			When('I update listing "listing-123"', async () => {
				await service.update({ id: 'listing-123' });
			});

			Then('it should delegate to the update function', () => {
				expect(mockUpdateFn).toHaveBeenCalled();
			});
		},
	);
});
