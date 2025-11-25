import type { ReservationRequestDomainPermissions } from '../../../../contexts/reservation-request/reservation-request.domain-permissions.ts';
import type { ReservationRequestVisa } from '../../../../contexts/reservation-request/reservation-request.visa.ts';
import type { ReservationRequestEntityReference } from '../../../../contexts/reservation-request/reservation-request/reservation-request.entity.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';

export class AdminUserReservationRequestVisa<
	root extends ReservationRequestEntityReference,
> implements ReservationRequestVisa
{
	private readonly root: root;
	private readonly admin: AdminUserEntityReference;

	constructor(root: root, admin: AdminUserEntityReference) {
		this.root = root;
		this.admin = admin;
	}

	determineIf(
		func: (
			permissions: Readonly<ReservationRequestDomainPermissions>,
		) => boolean,
	): boolean {
		// AdminUser permissions based on their role
		const rolePermissions = this.admin.role?.permissions;

		const updatedPermissions: ReservationRequestDomainPermissions = {
			// Admins can edit reservation requests if they have moderation permissions
			canEditReservationRequest:
				rolePermissions?.listingPermissions?.canModerateListings ?? false,
		};

		return func(updatedPermissions);
	}
}
