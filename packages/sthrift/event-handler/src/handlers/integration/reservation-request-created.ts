import { Domain, type DomainDataSource } from '@sthrift/domain';
import type { TransactionalEmailService } from '@cellix/transactional-email-service';
import { ReservationRequestNotificationService } from '../../services/reservation-request-notification-service.js';

const { EventBusInstance, ReservationRequestCreated } = Domain.Events;

export default (
	domainDataSource: DomainDataSource,
	emailService: TransactionalEmailService,
) => {
	const notificationService = new ReservationRequestNotificationService(
		domainDataSource,
		emailService,
	);

	EventBusInstance.register(ReservationRequestCreated, async (payload) => {
		const { reservationRequestId, listingId, reserverId, sharerId, reservationPeriodStart, reservationPeriodEnd } = payload;
		
		return await notificationService.sendReservationRequestNotification(
			reservationRequestId,
			listingId,
			reserverId,
			sharerId,
			reservationPeriodStart,
			reservationPeriodEnd,
		);
	});
};
