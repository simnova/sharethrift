import type { DomainDataSource } from "@sthrift/domain";
import type { TransactionalEmailService } from '@sthrift/transactional-email-service';
import { RegisterDomainEventHandlers } from "./domain/index.ts";
import { RegisterIntegrationEventHandlers } from "./integration/index.ts";

export const RegisterEventHandlers = (
    domainDataSource: DomainDataSource,
    emailService: TransactionalEmailService,
) => {
    RegisterDomainEventHandlers(domainDataSource);
    RegisterIntegrationEventHandlers(domainDataSource, emailService);
}