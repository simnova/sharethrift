import type { TransactionalEmailService } from '@cellix/transactional-email-service';
import type { DomainDataSource } from '@sthrift/domain';

export class ReservationRequestNotificationService {
	private readonly domainDataSource: DomainDataSource;
	private readonly emailService: TransactionalEmailService;

	constructor(
		domainDataSource: DomainDataSource,
		emailService: TransactionalEmailService,
	) {
		this.domainDataSource = domainDataSource;
		this.emailService = emailService;
	}

	async sendReservationRequestNotification(
		reservationRequestId: string,
		listingId: string,
		reserverId: string,
		sharerId: string,
		reservationPeriodStart: Date | string,
		reservationPeriodEnd: Date | string,
	): Promise<void> {
		console.log(
			`Processing ReservationRequestCreated notification for reservation ${reservationRequestId}`,
		);

		try {
			// Use the Unit of Work pattern to get repositories with the correct scope
			// For notification purposes, we'll use a system passport (no specific user context needed)
			const Domain = await import('@sthrift/domain');
			const { PassportFactory } = Domain.Domain;
			const systemPassport = PassportFactory.forSystem();
			
			// biome-ignore lint/suspicious/noExplicitAny: Complex cross-domain types, using any for simplicity
			let sharer: any;
			// biome-ignore lint/suspicious/noExplicitAny: Complex cross-domain types, using any for simplicity
			let reserver: any; 
			// biome-ignore lint/suspicious/noExplicitAny: Complex cross-domain types, using any for simplicity
			let listing: any;

			// Get sharer using PersonalUser UnitOfWork, fallback to AdminUser
			try {
				// biome-ignore lint/suspicious/noExplicitAny: Repository type is generic
				await this.domainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction(systemPassport, async (repo: any) => {
					sharer = await repo.getById(sharerId);
				});
			} catch (personalUserError) {
				// Try admin user if personal user fails
				console.log(`User ${sharerId} not found as personal user, trying admin user`, personalUserError);
				try {
					// biome-ignore lint/suspicious/noExplicitAny: Repository type is generic
					await this.domainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction(systemPassport, async (repo: any) => {
						sharer = await repo.getById(sharerId);
					});
				} catch (adminUserError) {
					console.error(`User ${sharerId} not found as admin user either`, adminUserError);
					throw new Error(`Failed to load sharer with ID ${sharerId}: tried both PersonalUser and AdminUser`);
				}
			}

			if (!sharer) {
				console.error(
					`Sharer with ID ${sharerId} not found for reservation ${reservationRequestId}`,
				);
				return;
			}

			// Get reserver using PersonalUser UnitOfWork, fallback to AdminUser
			try {
				// biome-ignore lint/suspicious/noExplicitAny: Repository type is generic
				await this.domainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction(systemPassport, async (repo: any) => {
					reserver = await repo.getById(reserverId);
				});
			} catch (personalUserError) {
				// Try admin user if personal user fails
				console.log(`User ${reserverId} not found as personal user, trying admin user`, personalUserError);
				try {
					// biome-ignore lint/suspicious/noExplicitAny: Repository type is generic
					await this.domainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction(systemPassport, async (repo: any) => {
						reserver = await repo.getById(reserverId);
					});
				} catch (adminUserError) {
					console.error(`User ${reserverId} not found as admin user either`, adminUserError);
					throw new Error(`Failed to load reserver with ID ${reserverId}: tried both PersonalUser and AdminUser`);
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
				// biome-ignore lint/suspicious/noExplicitAny: Repository type is generic
				await this.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction(systemPassport, async (repo: any) => {
					listing = await repo.getById(listingId);
				});
			} catch (listingError) {
				console.error(`Listing ${listingId} not found:`, listingError);
				throw new Error(`Failed to load listing with ID ${listingId}`);
			}

			if (!listing) {
				console.error(
					`Listing with ID ${listingId} not found for reservation ${reservationRequestId}`,
				);
				return;
			}

			// Get sharer email - check both account (PersonalUser) and profile (AdminUser)
			const sharerEmail = sharer?.account?.email ?? sharer?.profile?.email ?? null;
			if (!sharerEmail) {
				console.error(
					`Sharer ${sharerId} has no email address`,
				);
				return;
			}

			// Get sharer display name - handle both PersonalUser and AdminUser structures
			const sharerName = sharer?.profile?.firstName 
				? `${sharer.profile.firstName}${sharer.profile.lastName ? ` ${sharer.profile.lastName}` : ''}`
				: (sharer?.profile?.name || 'User');

			// Get reserver display name - handle both PersonalUser and AdminUser structures
			const reserverName = reserver?.profile?.firstName 
				? `${reserver.profile.firstName}${reserver.profile.lastName ? ` ${reserver.profile.lastName}` : ''}`
				: (reserver?.profile?.name || 'Someone');

			// Send email to sharer notifying them of the reservation request
			await this.emailService.sendTemplatedEmail(
				'reservation-request-notification',
				{ email: sharerEmail, name: sharerName },
				{
					sharerName: sharerName,
					reserverName: reserverName,
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
	}
}