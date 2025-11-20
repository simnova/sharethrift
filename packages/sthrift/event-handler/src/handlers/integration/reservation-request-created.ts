import type { DomainDataSource } from '@sthrift/domain';
import { ReservationRequestCreated } from '@sthrift/domain';
import type { TransactionalEmailService } from '@sthrift/transactional-email-service';

/**
 * Event handler for ReservationRequestCreated integration events
 * Sends notification email to the listing owner (sharer) when a reservation request is created
 */
export const registerReservationRequestCreatedHandler = (
	domainDataSource: DomainDataSource,
	emailService: TransactionalEmailService,
): void => {
	domainDataSource.eventBus.register(
		ReservationRequestCreated,
		async (event) => {
			console.log(
				`Processing ReservationRequestCreated event for reservation ${event.payload.reservationRequestId}`,
			);

			try {
				// Fetch the sharer (listing owner) information
				const sharerRepository = domainDataSource.userRepository;
				const sharer = await sharerRepository.getById(event.payload.sharerId);

				if (!sharer) {
					console.error(
						`Sharer with ID ${event.payload.sharerId} not found for reservation ${event.payload.reservationRequestId}`,
					);
					return;
				}

				// Fetch the reserver information
				const reserverRepository = domainDataSource.userRepository;
				const reserver = await reserverRepository.getById(
					event.payload.reserverId,
				);

				if (!reserver) {
					console.error(
						`Reserver with ID ${event.payload.reserverId} not found for reservation ${event.payload.reservationRequestId}`,
					);
					return;
				}

				// Fetch the listing information
				const listingRepository = domainDataSource.itemListingRepository;
				const listing = await listingRepository.getById(event.payload.listingId);

				if (!listing) {
					console.error(
						`Listing with ID ${event.payload.listingId} not found for reservation ${event.payload.reservationRequestId}`,
					);
					return;
				}

				// Get sharer email
				const sharerEmail = sharer.email;
				if (!sharerEmail) {
					console.error(
						`Sharer ${event.payload.sharerId} has no email address`,
					);
					return;
				}

				// Send email to sharer notifying them of the reservation request
				await emailService.sendTemplatedEmail(
					'reservation-request-notification',
					{
						email: sharerEmail,
						name: sharer.displayName || sharer.firstName || 'User',
					},
					{
						sharerName: sharer.displayName || sharer.firstName || 'User',
						reserverName:
							reserver.displayName || reserver.firstName || 'Someone',
						listingTitle: listing.title,
						reservationStart: event.payload.reservationPeriodStart.toLocaleDateString(),
						reservationEnd: event.payload.reservationPeriodEnd.toLocaleDateString(),
						reservationRequestId: event.payload.reservationRequestId,
					},
				);

				console.log(
					`Notification email sent to sharer ${sharerEmail} for reservation request ${event.payload.reservationRequestId}`,
				);
			} catch (error) {
				console.error(
					`Error processing ReservationRequestCreated event for reservation ${event.payload.reservationRequestId}:`,
					error,
				);
				// Don't throw - we don't want to fail the transaction
			}
		},
	);
};
