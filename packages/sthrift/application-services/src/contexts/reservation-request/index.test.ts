import { describe, it, expect, beforeEach } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { ReservationRequest } from './index.ts';

describe('ReservationRequest Context Factory', () => {
	// biome-ignore lint/suspicious/noExplicitAny: Test mock type
	let mockDataSources: any;

	beforeEach(() => {
		mockDataSources = {
			domainDataSource: {},
			readonlyDataSource: {},
		} as DataSources;
	});

	it('should create ReservationRequest context with all services', () => {
		const context = ReservationRequest(mockDataSources);

		expect(context).toBeDefined();
		expect(context.ReservationRequest).toBeDefined();
	});

	it('should have ReservationRequest service with all required methods', () => {
		const context = ReservationRequest(mockDataSources);

		expect(context.ReservationRequest.create).toBeDefined();
		expect(context.ReservationRequest.queryById).toBeDefined();
		expect(context.ReservationRequest.queryActiveByListingId).toBeDefined();
		expect(context.ReservationRequest.queryActiveByReserverId).toBeDefined();
		expect(
			context.ReservationRequest.queryActiveByReserverIdAndListingId,
		).toBeDefined();
		expect(
			context.ReservationRequest.queryListingRequestsBySharerId,
		).toBeDefined();
		expect(
			context.ReservationRequest.queryOverlapByListingIdAndReservationPeriod,
		).toBeDefined();
		expect(context.ReservationRequest.queryPastByReserverId).toBeDefined();
	});
});
