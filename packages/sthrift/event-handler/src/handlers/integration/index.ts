import { Domain } from '@sthrift/domain';
import type { DataSourcesFactory } from '@sthrift/persistence';
import { registerReservationRequestCreatedHandler } from './reservation-request-created--notify-sharer.ts';

export const RegisterIntegrationEventHandlers = (
	dataSourcesFactory: DataSourcesFactory,
	emailService: Domain.Services['TransactionalEmailService'],
): void => {
	registerReservationRequestCreatedHandler(dataSourcesFactory, emailService);
};
