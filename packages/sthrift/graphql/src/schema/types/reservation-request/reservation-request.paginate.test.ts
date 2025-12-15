import { describe, it, expect } from 'vitest';
import { paginateAndFilterListingRequests } from './reservation-request.resolvers.ts';

const baseRequest = {
	id: 'req-1',
	createdAt: new Date('2025-01-01T00:00:00Z'),
	reservationPeriodStart: new Date('2025-01-05T00:00:00Z'),
	reservationPeriodEnd: new Date('2025-01-10T00:00:00Z'),
	listing: { title: 'Cordless Drill' },
	reserver: { id: 'user-1', account: { username: 'alice' } },
} as const;

describe('paginateAndFilterListingRequests', () => {
	it('maps domain shape to UI shape with defaults', () => {
		const result = paginateAndFilterListingRequests([baseRequest], {
			page: 1,
			pageSize: 10,
			statusFilters: [],
		});

		expect(result.items).toHaveLength(1);
		const item = result.items[0];
		if (!item) {
			throw new Error('Expected a single item in results');
		}
		expect(item.title).toBe('Cordless Drill');
		expect(item.image).toBe('/assets/item-images/placeholder.png');
		expect(item.requestedBy).toBe('@alice');
		expect(item.requestedOn).toBe('2025-01-01T00:00:00.000Z');
		expect(item.reservationPeriod).toBe('2025-01-05 - 2025-01-10');
		expect(item.status).toBe('Pending');
		expect(item._raw.id).toBe('req-1');
	});

	it('filters by searchText (case-insensitive)', () => {
		const result = paginateAndFilterListingRequests(
			[
				{ ...baseRequest, id: 'a', listing: { title: 'Camera' } },
				{ ...baseRequest, id: 'b', listing: { title: 'Drone' } },
			],
			{ page: 1, pageSize: 10, statusFilters: [], searchText: 'camera' },
		);

		expect(result.items.map((i) => i.id)).toEqual(['a']);
	});

	it('filters by statusFilters', () => {
		const result = paginateAndFilterListingRequests(
			[
				{ ...baseRequest, id: 'a', state: 'Pending' },
				{ ...baseRequest, id: 'b', state: 'Accepted' },
			],
			{ page: 1, pageSize: 10, statusFilters: ['Accepted'] },
		);

		expect(result.items.map((i) => i.id)).toEqual(['b']);
	});

	it('supports sorting with nulls and mixed values', () => {
		const resultAsc = paginateAndFilterListingRequests(
			[
				{ ...baseRequest, id: 'a', reserver: { account: { username: 'alice' } } },
				{ ...baseRequest, id: 'b', reserver: { id: 'user-2', account: { username: 'bob' } } },
				{ ...baseRequest, id: 'c', reserver: { id: 'user-1', account: { username: 'cara' } } },
			],
			{
				page: 1,
				pageSize: 10,
				statusFilters: [],
				sorter: { field: 'requestedById', order: 'ascend' },
			},
		);

		expect(resultAsc.items.map((i) => i.id)).toEqual(['a', 'c', 'b']);

		const resultDesc = paginateAndFilterListingRequests(
			[
				{ ...baseRequest, id: 'a', reserver: { account: { username: 'alice' } } },
				{ ...baseRequest, id: 'b', reserver: { id: 'user-2', account: { username: 'bob' } } },
				{ ...baseRequest, id: 'c', reserver: { id: 'user-1', account: { username: 'cara' } } },
			],
			{
				page: 1,
				pageSize: 10,
				statusFilters: [],
				sorter: { field: 'requestedById', order: 'descend' },
			},
		);

		expect(resultDesc.items.map((i) => i.id)).toEqual(['b', 'c', 'a']);
	});

	it('paginates results correctly', () => {
		const requests = Array.from({ length: 25 }).map((_, index) => ({
			...baseRequest,
			id: `req-${index + 1}`,
		}));

		const page2 = paginateAndFilterListingRequests(requests, {
			page: 2,
			pageSize: 10,
			statusFilters: [],
		});

		expect(page2.items).toHaveLength(10);
		expect(page2.items[0]?.id).toBe('req-11');
		expect(page2.total).toBe(25);
		expect(page2.page).toBe(2);
		expect(page2.pageSize).toBe(10);
	});
});
