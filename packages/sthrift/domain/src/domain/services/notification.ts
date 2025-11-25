import type { DomainDataSource } from '../../index.ts';

interface EmailRecipient {
	email: string;
	name?: string;
}

interface EmailTemplateData {
	[key: string]: string | number | boolean | Date;
}

interface TransactionalEmailService {
	sendTemplatedEmail(
		templateName: string,
		recipient: EmailRecipient,
		templateData: EmailTemplateData,
	): Promise<void>;
}

export const sendReservationRequestNotification = async (
	reservationRequestId: string,
	listingId: string,
	reserverId: string,
	sharerId: string,
	reservationPeriodStart: Date | string,
	reservationPeriodEnd: Date | string,
	domainDataSource: DomainDataSource,
	emailService: TransactionalEmailService,
): Promise<void> => {
	console.log(
		`Processing ReservationRequestCreated notification for reservation ${reservationRequestId}`,
	);

	try {
		// Use the Unit of Work pattern to get repositories with the correct scope
		// For notification purposes, we'll use a system passport (no specific user context needed)
		const { PassportFactory } = await import('../contexts/passport.ts');
		const systemPassport = PassportFactory.forSystem();
		
		// biome-ignore lint/suspicious/noExplicitAny: Complex cross-domain types, using any for simplicity
		let sharer: any;
		// biome-ignore lint/suspicious/noExplicitAny: Complex cross-domain types, using any for simplicity
		let reserver: any; 
		// biome-ignore lint/suspicious/noExplicitAny: Complex cross-domain types, using any for simplicity
		let listing: any;

		// Get sharer using PersonalUser UnitOfWork
		try {
			await domainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction(systemPassport, async (repo) => {
				sharer = await repo.getById(sharerId);
			});
		} catch (_error) {
			// Try admin user if personal user fails
			console.log(`User ${sharerId} not found as personal user, trying admin user`);
			try {
				await domainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction(systemPassport, async (repo) => {
					sharer = await repo.getById(sharerId);
				});
			} catch (_error) {
				console.error(`User ${sharerId} not found as admin user either`);
			}
		}

		if (!sharer) {
			console.error(
				`Sharer with ID ${sharerId} not found for reservation ${reservationRequestId}`,
			);
			return;
		}

		// Get reserver using PersonalUser UnitOfWork
		try {
			await domainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction(systemPassport, async (repo) => {
				reserver = await repo.getById(reserverId);
			});
		} catch (_error) {
			// Try admin user if personal user fails
			console.log(`User ${reserverId} not found as personal user, trying admin user`);
			try {
				await domainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction(systemPassport, async (repo) => {
					reserver = await repo.getById(reserverId);
				});
			} catch (_error) {
				console.error(`User ${reserverId} not found as admin user either`);
			}
		}

		if (!reserver) {
			console.error(
				`Reserver with ID ${reserverId} not found for reservation ${reservationRequestId}`,
			);
			return;
		}

		// Get listing using ItemListing UnitOfWork
		try {
			await domainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction(systemPassport, async (repo) => {
				listing = await repo.getById(listingId);
			});
		} catch (error) {
			console.error(`Listing ${listingId} not found: ${error}`);
			return;
		}

		if (!listing) {
			console.error(
				`Listing with ID ${listingId} not found for reservation ${reservationRequestId}`,
			);
			return;
		}

		// Get sharer email
		const sharerEmail = sharer.email || sharer.account?.email;
		if (!sharerEmail) {
			console.error(
				`Sharer ${sharerId} has no email address`,
			);
			return;
		}

		// Send email to sharer notifying them of the reservation request
		await emailService.sendTemplatedEmail(
			'reservation-request-notification',
			{
				email: sharerEmail,
				name: sharer.displayName || sharer.firstName || sharer.account?.profile?.firstName || 'User',
			},
			{
				sharerName: sharer.displayName || sharer.firstName || sharer.account?.profile?.firstName || 'User',
				reserverName:
					reserver.displayName || reserver.firstName || reserver.account?.profile?.firstName || 'Someone',
				listingTitle: listing.title || 'Unknown Listing',
				reservationStart: new Date(reservationPeriodStart).toLocaleDateString(),
				reservationEnd: new Date(reservationPeriodEnd).toLocaleDateString(),
				reservationRequestId: reservationRequestId,
			},
		);

		console.log(
			`Notification email sent to sharer ${sharerEmail} for reservation request ${reservationRequestId}`,
		);
	} catch (error) {
		console.error(
			`Error processing ReservationRequestCreated notification for reservation ${reservationRequestId}:`,
			error,
		);
		// Don't throw - we don't want to fail the transaction
	}
};