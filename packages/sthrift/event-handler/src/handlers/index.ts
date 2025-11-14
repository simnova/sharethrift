import type { DataSources } from '@sthrift/persistence';
import { RegisterDomainEventHandlers } from './domain/index.ts';
import { RegisterIntegrationEventHandlers } from './integration/index.ts';

export const RegisterEventHandlers = (dataSources: DataSources) => {
	RegisterDomainEventHandlers(dataSources);
	RegisterIntegrationEventHandlers(dataSources.domainDataSource);
};
