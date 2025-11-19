import type { DataSourcesFactory } from '@sthrift/persistence';
import type { SendGrid } from '@sthrift/service-sendgrid';
import { RegisterDomainEventHandlers } from "./domain/index.ts";
import { RegisterIntegrationEventHandlers } from "./integration/index.ts";

export const RegisterEventHandlers = (
    dataSourcesFactory: DataSourcesFactory,
    sendGridService: SendGrid
) => {
    RegisterDomainEventHandlers(dataSourcesFactory);
    RegisterIntegrationEventHandlers(dataSourcesFactory, sendGridService);
}