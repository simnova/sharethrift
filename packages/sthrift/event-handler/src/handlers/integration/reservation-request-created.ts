import { Domain, type DomainDataSource } from '@sthrift/domain';
import type { TransactionalEmailService } from '@cellix/transactional-email-service';
import { ReservationRequestNotificationService } from '../../services/reservation-request-notification-service.js';

const { EventBusInstance, ReservationRequestCreated } = Domain.Events;

const registerReservationRequestCreatedHandler = (
	domainDataSource: DomainDataSource,
	emailService: TransactionalEmailService,
): void => {
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

export default registerReservationRequestCreatedHandler;
