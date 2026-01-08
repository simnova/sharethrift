import { describe, expect, it } from 'vitest';
import * as reservationRequestModule from './reservation-request.resolvers.ts';

describe('reservation-request.resolvers exports', () => {
	it('does not export paginateAndFilterListingRequests', () => {
		expect(
			(reservationRequestModule as unknown as Record<string, unknown>)[
				'paginateAndFilterListingRequests'
			],
		).toBeUndefined();
	});
});
