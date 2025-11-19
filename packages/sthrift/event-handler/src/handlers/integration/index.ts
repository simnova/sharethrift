import type { DataSourcesFactory } from '@sthrift/persistence';
import type { SendGrid } from '@sthrift/service-sendgrid';
import { registerReservationRequestCreatedHandler } from './reservation-request-created--notify-sharer.ts';

export const RegisterIntegrationEventHandlers = (
	dataSourcesFactory: DataSourcesFactory,
	sendGridService: SendGrid,
): void => {
	registerReservationRequestCreatedHandler(dataSourcesFactory, sendGridService);
};
