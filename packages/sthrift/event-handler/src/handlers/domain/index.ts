import { InProcEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { createOnAcceptance } from '@sthrift/application-services';

export const RegisterDomainEventHandlers = (dataSources: DataSources): void => {
	// Register handler for automatic conversation creation on reservation acceptance
	InProcEventBusInstance.register(
		Domain.Contexts.ReservationRequest.ReservationRequest
			.ReservationRequestAcceptedEvent,
		async (
			payload: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestAcceptedEventProps,
		) => {
			console.log(
				`[EventHandler] ReservationRequestAccepted: ${payload.reservationRequestId}`,
				{
					listingId: payload.listingId,
					sharerId: payload.sharerId,
					reserverId: payload.reserverId,
				},
			);

			// Create conversation automatically
			await createOnAcceptance(dataSources)({
				reservationRequestId: payload.reservationRequestId,
				listingId: payload.listingId,
				sharerId: payload.sharerId,
				reserverId: payload.reserverId,
			});
		},
	);

	console.log('[EventHandlers] Registered: ReservationRequestAccepted');
};
