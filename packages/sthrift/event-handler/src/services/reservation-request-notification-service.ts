import type { TransactionalEmailService } from '@cellix/transactional-email-service';

export class ReservationRequestNotificationService {
	// biome-ignore lint/suspicious/noExplicitAny: Generic domain data source type
	private readonly domainDataSource: any;
	private readonly emailService: TransactionalEmailService;

	constructor(
		// biome-ignore lint/suspicious/noExplicitAny: Generic domain data source type
		domainDataSource: any,
		emailService: TransactionalEmailService,
	) {
		this.domainDataSource = domainDataSource;
		this.emailService = emailService;
	}

	/**
	 * Centralized helper method to get user email from PersonalUser or AdminUser entity
	 */
	// biome-ignore lint/suspicious/noExplicitAny: User entity type is complex and varies
	private getUserEmail(user: any): string | null {
		// For PersonalUser: user.account.email
		if (user?.account?.email) {
			return user.account.email;
		}
		
		// For AdminUser: user.profile.email  
		if (user?.profile?.email) {
			return user.profile.email;
		}
		
		return null;
	}

	/**
	 * Centralized helper method to get user display name from PersonalUser or AdminUser entity
	 */
	// biome-ignore lint/suspicious/noExplicitAny: User entity type is complex and varies
	private getUserDisplayName(user: any, fallback: string = 'Someone'): string {
		// For PersonalUser: user.profile.firstName (+ lastName if available)
		if (user?.profile?.firstName) {
			const lastName = user.profile.lastName ? ` ${user.profile.lastName}` : '';
			return `${user.profile.firstName}${lastName}`;
		}
		
		// For AdminUser: user.profile.name
		if (user?.profile?.name) {
			return user.profile.name;
		}
		
		return fallback;
	}

	/**
	 * Centralized helper method to get user contact info (email + name) from PersonalUser or AdminUser entity
	 */
	// biome-ignore lint/suspicious/noExplicitAny: User entity type is complex and varies
	private getUserContactInfo(user: any, fallbackName: string = 'Someone'): { email: string; name: string } | null {
		const email = this.getUserEmail(user);
		if (!email) {
			return null;
		}
		
		const name = this.getUserDisplayName(user, fallbackName);
		return { email, name };
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

			// Get sharer using PersonalUser UnitOfWork
			try {
				// biome-ignore lint/suspicious/noExplicitAny: Repository type is generic
				await this.domainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction(systemPassport, async (repo: any) => {
					sharer = await repo.getById(sharerId);
				});
			} catch (_error) {
				// Try admin user if personal user fails
				console.log(`User ${sharerId} not found as personal user, trying admin user`);
				try {
					// biome-ignore lint/suspicious/noExplicitAny: Repository type is generic
					await this.domainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction(systemPassport, async (repo: any) => {
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
				// biome-ignore lint/suspicious/noExplicitAny: Repository type is generic
				await this.domainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction(systemPassport, async (repo: any) => {
					reserver = await repo.getById(reserverId);
				});
			} catch (_error) {
				// Try admin user if personal user fails
				console.log(`User ${reserverId} not found as personal user, trying admin user`);
				try {
					// biome-ignore lint/suspicious/noExplicitAny: Repository type is generic
					await this.domainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction(systemPassport, async (repo: any) => {
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
				// biome-ignore lint/suspicious/noExplicitAny: Repository type is generic
				await this.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction(systemPassport, async (repo: any) => {
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

			// Get sharer contact information using centralized helper
			const sharerContactInfo = this.getUserContactInfo(sharer, 'User');
			if (!sharerContactInfo) {
				console.error(
					`Sharer ${sharerId} has no email address`,
				);
				return;
			}

			// Send email to sharer notifying them of the reservation request
			await this.emailService.sendTemplatedEmail(
				'reservation-request-notification',
				sharerContactInfo,
				{
					sharerName: this.getUserDisplayName(sharer, 'User'),
					reserverName: this.getUserDisplayName(reserver, 'Someone'),
					listingTitle: listing.title || 'Unknown Listing',
					reservationStart: new Date(reservationPeriodStart).toLocaleDateString(),
					reservationEnd: new Date(reservationPeriodEnd).toLocaleDateString(),
					reservationRequestId: reservationRequestId,
				},
			);

			console.log(
				`Notification email sent to sharer ${sharerContactInfo.email} for reservation request ${reservationRequestId}`,
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