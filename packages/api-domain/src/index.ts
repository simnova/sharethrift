export * as Domain from './domain/index.ts';
// import type { Contexts } from './domain/index.ts';

export interface DomainDataSource {
    domainContexts: unknown; //TODO: Replace 'unknown' with a specific type if available
}