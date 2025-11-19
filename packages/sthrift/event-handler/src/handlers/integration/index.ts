import type { DomainDataSource } from '@sthrift/domain';
import type { SendGrid } from '@sthrift/service-sendgrid';
import { registerReservationRequestCreatedHandler } from './reservation-request-created--notify-sharer.ts';

export const RegisterIntegrationEventHandlers = (
	domainDataSource: DomainDataSource,
	sendGridService: SendGrid,
): void => {
	registerReservationRequestCreatedHandler(domainDataSource, sendGridService);
};
