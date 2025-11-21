import type { DomainDataSource } from '@sthrift/domain';
import type { TransactionalEmailService } from '@sthrift/transactional-email-service';
import { registerReservationRequestCreatedHandler } from './reservation-request-created.js';

export const RegisterIntegrationEventHandlers = (
	domainDataSource: DomainDataSource,
	emailService: TransactionalEmailService,
): void => {
	registerReservationRequestCreatedHandler(domainDataSource, emailService);
};
