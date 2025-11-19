import type { DomainDataSource } from "@sthrift/domain";
import type { SendGrid } from '@sthrift/service-sendgrid';
import { RegisterDomainEventHandlers } from "./domain/index.ts";
import { RegisterIntegrationEventHandlers } from "./integration/index.ts";

export const RegisterEventHandlers = (
    domainDataSource: DomainDataSource,
    sendGridService: SendGrid
) => {
    RegisterDomainEventHandlers(domainDataSource);
    RegisterIntegrationEventHandlers(domainDataSource, sendGridService);
}