import { Domain } from '@sthrift/domain';
import type { DataSourcesFactory } from '@sthrift/persistence';
import { RegisterDomainEventHandlers } from "./domain/index.ts";
import { RegisterIntegrationEventHandlers } from "./integration/index.ts";

export const RegisterEventHandlers = (
    dataSourcesFactory: DataSourcesFactory,
    emailService: Domain.Services['TransactionalEmailService']
) => {
    RegisterDomainEventHandlers(dataSourcesFactory);
    RegisterIntegrationEventHandlers(dataSourcesFactory, emailService);
}