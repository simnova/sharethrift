import { Domain, type DomainDataSource } from '@sthrift/domain';
import type { TransactionalEmailService } from '@sthrift/transactional-email-service';

const { EventBusInstance, ReservationRequestCreated } = Domain.Events;

export default (
	domainDataSource: DomainDataSource,
	emailService: TransactionalEmailService,
) => {
	EventBusInstance.register(ReservationRequestCreated, async (payload) => {
		const { reservationRequestId, listingId, reserverId, sharerId, reservationPeriodStart, reservationPeriodEnd } = payload;
		
		// Use the domain service for sending notification
		const { sendReservationRequestNotification } = Domain.DomainServices;
		
		return await sendReservationRequestNotification(
			reservationRequestId,
			listingId,
			reserverId,
			sharerId,
			reservationPeriodStart,
			reservationPeriodEnd,
			domainDataSource,
			emailService,
		);
	});
};
