import type { DomainDataSource } from '@sthrift/domain';
import type { TransactionalEmailService } from '@cellix/transactional-email-service';
import RegisterReservationRequestCreatedHandler from './reservation-request-created.js';

export const RegisterIntegrationEventHandlers = (
	domainDataSource: DomainDataSource,
	emailService: TransactionalEmailService,
): void => {
	RegisterReservationRequestCreatedHandler(domainDataSource, emailService);
};
