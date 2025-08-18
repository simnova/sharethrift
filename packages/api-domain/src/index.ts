import * as Domain from './domain/index.ts';
export * as Domain from './domain/index.ts';
export * from './domain/contexts/index.ts'

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface DomainDataSource {
  domainContexts: {
    listing?: {
      item?: {
        getItemListingUnitOfWork: () => Domain.Contexts.ItemListingUnitOfWork;
      };
    }
  }
}