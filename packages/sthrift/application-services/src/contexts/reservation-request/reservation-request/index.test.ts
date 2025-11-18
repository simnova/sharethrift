import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DataSources } from '@sthrift/persistence';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { ReservationRequest } from './index.ts';

vi.mock('./create.ts');
vi.mock('./query-by-id.ts');
vi.mock('./query-active-by-reserver-id.ts');
vi.mock('./query-past-by-reserver-id.ts');
vi.mock('./query-active-by-reserver-id-and-listing-id.ts');
vi.mock('./query-overlap-by-listing-id-and-reservation-period.ts');
vi.mock('./query-active-by-listing-id.ts');
vi.mock('./query-listing-requests-by-sharer-id.ts');

import { create } from './create.ts';
import { queryById } from './query-by-id.ts';
import { queryActiveByReserverId } from './query-active-by-reserver-id.ts';
import { queryPastByReserverId } from './query-past-by-reserver-id.ts';
import { queryActiveByReserverIdAndListingId } from './query-active-by-reserver-id-and-listing-id.ts';
import { queryOverlapByListingIdAndReservationPeriod } from './query-overlap-by-listing-id-and-reservation-period.ts';
import { queryActiveByListingId } from './query-active-by-listing-id.ts';
import { queryListingRequestsBySharerId } from './query-listing-requests-by-sharer-id.ts';

// @ts-expect-error - Required for Vitest Cucumber syntax support
const _test = { for: describeFeature };
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
	let mockQueryActiveByReserverIdFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryPastByReserverIdFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryActiveByReserverIdAndListingIdFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryOverlapByListingIdAndReservationPeriodFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryActiveByListingIdFn: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockQueryListingRequestsBySharerIdFn: any;

	BeforeEachScenario(() => {
		vi.clearAllMocks();

		mockCreateFn = vi.fn();
		mockQueryByIdFn = vi.fn();
		mockQueryActiveByReserverIdFn = vi.fn();
		mockQueryPastByReserverIdFn = vi.fn();
		mockQueryActiveByReserverIdAndListingIdFn = vi.fn();
		mockQueryOverlapByListingIdAndReservationPeriodFn = vi.fn();
		mockQueryActiveByListingIdFn = vi.fn();
		mockQueryListingRequestsBySharerIdFn = vi.fn();

		vi.mocked(create).mockReturnValue(mockCreateFn);
		vi.mocked(queryById).mockReturnValue(mockQueryByIdFn);
		vi.mocked(queryActiveByReserverId).mockReturnValue(mockQueryActiveByReserverIdFn);
		vi.mocked(queryPastByReserverId).mockReturnValue(mockQueryPastByReserverIdFn);
		vi.mocked(queryActiveByReserverIdAndListingId).mockReturnValue(mockQueryActiveByReserverIdAndListingIdFn);
		vi.mocked(queryOverlapByListingIdAndReservationPeriod).mockReturnValue(mockQueryOverlapByListingIdAndReservationPeriodFn);
		vi.mocked(queryActiveByListingId).mockReturnValue(mockQueryActiveByListingIdFn);
		vi.mocked(queryListingRequestsBySharerId).mockReturnValue(mockQueryListingRequestsBySharerIdFn);

		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		mockDataSources = {} as any;
		service = ReservationRequest(mockDataSources);
	});

	Scenario(
		'Creating a reservation request through the application service',
		({ Given, When, Then }) => {
			Given('a reservation request application service', () => {
				expect(service).toBeDefined();
			});

			When('I create a reservation request', async () => {
				await service.create({});
			});

			Then('it should delegate to the create function', () => {
				expect(mockCreateFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying a reservation request by ID through the application service',
		({ Given, When, Then }) => {
			Given('a reservation request application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for reservation request with id "req-123"', async () => {
				await service.queryById({ id: 'req-123' });
			});

			Then('it should delegate to the queryById function', () => {
				expect(mockQueryByIdFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying active reservation requests by reserver ID through the application service',
		({ Given, When, Then }) => {
			Given('a reservation request application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for active requests by reserver "reserver-1"', async () => {
				await service.queryActiveByReserverId({ reserverId: 'reserver-1' });
			});

			Then('it should delegate to the queryActiveByReserverId function', () => {
				expect(mockQueryActiveByReserverIdFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying past reservation requests by reserver ID through the application service',
		({ Given, When, Then }) => {
			Given('a reservation request application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for past requests by reserver "reserver-1"', async () => {
				await service.queryPastByReserverId({ reserverId: 'reserver-1' });
			});

			Then('it should delegate to the queryPastByReserverId function', () => {
				expect(mockQueryPastByReserverIdFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying active reservation requests by reserver and listing through the application service',
		({ Given, When, Then }) => {
			Given('a reservation request application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for active requests by reserver "reserver-1" and listing "listing-1"', async () => {
				await service.queryActiveByReserverIdAndListingId({ reserverId: 'reserver-1', listingId: 'listing-1' });
			});

			Then('it should delegate to the queryActiveByReserverIdAndListingId function', () => {
				expect(mockQueryActiveByReserverIdAndListingIdFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying overlapping reservation requests through the application service',
		({ Given, When, Then }) => {
			Given('a reservation request application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for overlapping requests for listing "listing-1"', async () => {
				await service.queryOverlapByListingIdAndReservationPeriod({ listingId: 'listing-1', startDate: new Date(), endDate: new Date() });
			});

			Then('it should delegate to the queryOverlapByListingIdAndReservationPeriod function', () => {
				expect(mockQueryOverlapByListingIdAndReservationPeriodFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying active reservation requests by listing ID through the application service',
		({ Given, When, Then }) => {
			Given('a reservation request application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for active requests by listing "listing-1"', async () => {
				await service.queryActiveByListingId({ listingId: 'listing-1' });
			});

			Then('it should delegate to the queryActiveByListingId function', () => {
				expect(mockQueryActiveByListingIdFn).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Querying reservation requests by sharer ID through the application service',
		({ Given, When, Then }) => {
			Given('a reservation request application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for requests by sharer "sharer-1"', async () => {
				await service.queryListingRequestsBySharerId({ sharerId: 'sharer-1' });
			});

			Then('it should delegate to the queryListingRequestsBySharerId function', () => {
				expect(mockQueryListingRequestsBySharerIdFn).toHaveBeenCalled();
			});
		},
	);
});
