import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { describe, expect, it, vi } from 'vitest';
import {
	queryListingRequestsBySharerId,
	type ReservationRequestQueryListingRequestsBySharerIdCommand,
} from './query-listing-requests-by-sharer-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/query-listing-requests-by-sharer-id.feature',
	),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: ReservationRequestQueryListingRequestsBySharerIdCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getListingRequestsBySharerId: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {
			sharerId: 'user-123',
			page: 1,
			pageSize: 10,
			searchText: '',
			statusFilters: [],
			sorter: { field: 'requestedOn', order: 'descend' },
		};
		result = undefined;
	});

	Scenario(
		"Successfully retrieving reservation requests for sharer's listings",
		({ Given, And, When, Then }) => {
			Given('a valid sharer ID "user-123"', () => {
				command = {
					sharerId: 'user-123',
					page: 1,
					pageSize: 10,
					searchText: '',
					statusFilters: [],
					sorter: { field: 'requestedOn', order: 'descend' },
				};
			});

			And('the sharer has listings with 4 reservation requests', () => {
				const mockRequests = [
					{
						id: 'req-1',
						state: 'Requested',
						listing: { id: 'listing-1', sharer: { id: 'sharer-123' } },
					},
					{
						id: 'req-2',
						state: 'Requested',
						listing: { id: 'listing-1', sharer: { id: 'sharer-123' } },
					},
					{
						id: 'req-3',
						state: 'Requested',
						listing: { id: 'listing-2', sharer: { id: 'sharer-123' } },
					},
					{
						id: 'req-4',
						state: 'Requested',
						listing: { id: 'listing-2', sharer: { id: 'sharer-123' } },
					},
				];
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getListingRequestsBySharerId.mockResolvedValue(
					mockRequests,
				);
			});

			When(
				'the queryListingRequestsBySharerId command is executed',
				async () => {
					const queryFn = queryListingRequestsBySharerId(mockDataSources);
					result = await queryFn(command);
				},
			);

			Then('4 listing requests should be returned in a page', () => {
				expect(result).toBeDefined();
				expect(result.items.length).toBe(4);
				expect(result.total).toBe(4);
			});
		},
	);

	Scenario(
		'Retrieving requests for sharer with no listings or requests',
		({ Given, And, When, Then }) => {
			Given('a valid sharer ID "user-456"', () => {
				command = {
					sharerId: 'user-456',
					page: 1,
					pageSize: 10,
					searchText: '',
					statusFilters: [],
					sorter: { field: 'requestedOn', order: 'descend' },
				};
			});

			And('the sharer has no reservation requests', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getListingRequestsBySharerId.mockResolvedValue(
					[],
				);
			});

			When(
				'the queryListingRequestsBySharerId command is executed',
				async () => {
					const queryFn = queryListingRequestsBySharerId(mockDataSources);
					result = await queryFn(command);
				},
			);

			Then('an empty page should be returned', () => {
				expect(result).toBeDefined();
				expect(result.items.length).toBe(0);
				expect(result.total).toBe(0);
			});
		},
	);
});

describe('queryListingRequestsBySharerId (unit)', () => {
	function makeMockDataSources(requests: unknown[]): DataSources {
		return {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getListingRequestsBySharerId: vi
								.fn()
								.mockResolvedValue(requests),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;
	}

	it('filters by trimmed, case-insensitive searchText', async () => {
		const mockDataSources = makeMockDataSources([
			{ id: 'req-1', state: 'Requested', listing: { title: 'Red Bike' } },
			{ id: 'req-2', state: 'Requested', listing: { title: 'Blue Car' } },
		]);

		const command: ReservationRequestQueryListingRequestsBySharerIdCommand = {
			sharerId: 'user-123',
			page: 1,
			pageSize: 10,
			searchText: '  BIKE  ',
			statusFilters: [],
			sorter: { field: 'requestedOn', order: 'descend' },
		};

		const queryFn = queryListingRequestsBySharerId(mockDataSources);
		const result = await queryFn(command);
		expect(result.total).toBe(1);
		expect(result.items[0]?.title).toBe('Red Bike');
	});

	it('filters by statusFilters when provided', async () => {
		const mockDataSources = makeMockDataSources([
			{ id: 'req-1', state: 'Accepted', listing: { title: 'Item A' } },
			{ id: 'req-2', state: 'Requested', listing: { title: 'Item B' } },
		]);

		const command: ReservationRequestQueryListingRequestsBySharerIdCommand = {
			sharerId: 'user-123',
			page: 1,
			pageSize: 10,
			searchText: '',
			statusFilters: ['Accepted'],
			sorter: { field: 'requestedOn', order: 'descend' },
		};

		const queryFn = queryListingRequestsBySharerId(mockDataSources);
		const result = await queryFn(command);
		expect(result.total).toBe(1);
		expect(result.items[0]?.status).toBe('Accepted');
	});

	it('maps fallback values when listing/reserver/date fields are missing', async () => {
		const mockDataSources = makeMockDataSources([
			{
				id: 'req-1',
				state: undefined,
				listing: 'not-an-object',
				reserver: { account: { username: null } },
				createdAt: 'not-a-date',
				reservationPeriodStart: 'not-a-date',
				reservationPeriodEnd: null,
			},
		]);

		const command: ReservationRequestQueryListingRequestsBySharerIdCommand = {
			sharerId: 'user-123',
			page: 1,
			pageSize: 10,
			searchText: '',
			statusFilters: [],
			sorter: { field: 'requestedOn', order: 'descend' },
		};

		const queryFn = queryListingRequestsBySharerId(mockDataSources);
		const result = await queryFn(command);
		expect(result.items[0]?.title).toBe('Unknown');
		expect(result.items[0]?.requestedBy).toBe('@unknown');
		expect(result.items[0]?.status).toBe('Pending');
		expect(result.items[0]?.reservationPeriod).toContain('N/A');
		expect(result.items[0]?.requestedOn).toMatch(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:/,
		);
	});

	it('maps username, dates, and listing title when provided', async () => {
		const mockDataSources = makeMockDataSources([
			{
				id: 'req-1',
				state: 'Requested',
				listing: { title: 'Cordless Drill' },
				reserver: { account: { username: 'bob' } },
				createdAt: new Date('2025-01-01T00:00:00.000Z'),
				reservationPeriodStart: new Date('2025-02-01T00:00:00.000Z'),
				reservationPeriodEnd: new Date('2025-02-03T00:00:00.000Z'),
			},
		]);

		const command: ReservationRequestQueryListingRequestsBySharerIdCommand = {
			sharerId: 'user-123',
			page: 1,
			pageSize: 10,
			searchText: '',
			statusFilters: [],
			sorter: { field: 'requestedOn', order: 'descend' },
		};

		const queryFn = queryListingRequestsBySharerId(mockDataSources);
		const result = await queryFn(command);
		expect(result.items[0]?.title).toBe('Cordless Drill');
		expect(result.items[0]?.requestedBy).toBe('@bob');
		expect(result.items[0]?.requestedOn).toBe('2025-01-01T00:00:00.000Z');
		expect(result.items[0]?.reservationPeriod).toBe('2025-02-01 - 2025-02-03');
	});

	it('falls back to "Unknown" when listing has a title field but it is undefined', async () => {
		const mockDataSources = makeMockDataSources([
			{ id: 'req-1', state: 'Requested', listing: { title: undefined } },
		]);

		const command: ReservationRequestQueryListingRequestsBySharerIdCommand = {
			sharerId: 'user-123',
			page: 1,
			pageSize: 10,
			searchText: '',
			statusFilters: [],
			sorter: { field: 'requestedOn', order: 'descend' },
		};

		const queryFn = queryListingRequestsBySharerId(mockDataSources);
		const result = await queryFn(command);
		expect(result.items[0]?.title).toBe('Unknown');
	});

	it('does not throw when sorting by an unknown field (null/undefined compare path)', async () => {
		const mockDataSources = makeMockDataSources([
			{ id: 'req-1', state: 'Requested', listing: { title: 'Item A' } },
			{ id: 'req-2', state: 'Requested', listing: { title: 'Item B' } },
		]);

		const command: ReservationRequestQueryListingRequestsBySharerIdCommand = {
			sharerId: 'user-123',
			page: 1,
			pageSize: 10,
			searchText: '',
			statusFilters: [],
			sorter: { field: 'doesNotExist', order: 'ascend' },
		};

		const queryFn = queryListingRequestsBySharerId(mockDataSources);
		const result = await queryFn(command);
		expect(result.total).toBe(2);
		expect(result.items).toHaveLength(2);
	});

	it('sorts by title ascending', async () => {
		const mockDataSources = makeMockDataSources([
			{ id: 'req-1', state: 'Requested', listing: { title: 'C' } },
			{ id: 'req-2', state: 'Requested', listing: { title: 'A' } },
			{ id: 'req-3', state: 'Requested', listing: { title: 'B' } },
		]);

		const command: ReservationRequestQueryListingRequestsBySharerIdCommand = {
			sharerId: 'user-123',
			page: 1,
			pageSize: 10,
			searchText: '',
			statusFilters: [],
			sorter: { field: 'title', order: 'ascend' },
		};

		const queryFn = queryListingRequestsBySharerId(mockDataSources);
		const result = await queryFn(command);
		expect(result.items.map((i) => i.title)).toEqual(['A', 'B', 'C']);
	});

	it('sorts by title descending', async () => {
		const mockDataSources = makeMockDataSources([
			{ id: 'req-1', state: 'Requested', listing: { title: 'A' } },
			{ id: 'req-2', state: 'Requested', listing: { title: 'C' } },
			{ id: 'req-3', state: 'Requested', listing: { title: 'B' } },
		]);

		const command: ReservationRequestQueryListingRequestsBySharerIdCommand = {
			sharerId: 'user-123',
			page: 1,
			pageSize: 10,
			searchText: '',
			statusFilters: [],
			sorter: { field: 'title', order: 'descend' },
		};

		const queryFn = queryListingRequestsBySharerId(mockDataSources);
		const result = await queryFn(command);
		expect(result.items.map((i) => i.title)).toEqual(['C', 'B', 'A']);
	});
});
