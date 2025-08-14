export * as Domain from './domain/index.ts';
export * from './domain/contexts/index.ts';

export interface DomainDataSource {
	domainContexts: {
		itemListing?: {
			getItemListingUnitOfWork: (
				inProcEventBusInstance: unknown,
				nodeEventBusInstance: unknown,
			) => unknown;
		};
	};
}
