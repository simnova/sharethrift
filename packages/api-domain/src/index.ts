export * as Domain from './domain/index.ts';
export * from './domain/contexts/index.ts';
// import type { Contexts } from './domain/index.ts';

export interface DomainDataSource {
	domainContexts: {
		reservationRequest?: {
			getReservationRequestUnitOfWork: (
				inProcEventBusInstance: unknown,
				nodeEventBusInstance: unknown,
			) => unknown;
		};
		itemListing?: {
			getItemListingUnitOfWork: (
				inProcEventBusInstance: unknown,
				nodeEventBusInstance: unknown,
			) => unknown;
		};
	};
}