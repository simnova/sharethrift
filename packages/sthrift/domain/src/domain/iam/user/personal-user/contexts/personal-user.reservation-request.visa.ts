import type { ReservationRequestDomainPermissions } from '../../../../contexts/reservation-request/reservation-request.domain-permissions.ts';
import type { ReservationRequestVisa } from '../../../../contexts/reservation-request/reservation-request.visa.ts';
import type { ReservationRequestEntityReference } from '../../../../contexts/reservation-request/reservation-request/reservation-request.entity.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
export class PersonalUserReservationRequestVisa<
	root extends ReservationRequestEntityReference,
> implements ReservationRequestVisa
{
	private readonly root: root;
	private readonly user: PersonalUserEntityReference;
	constructor(root: root, user: PersonalUserEntityReference) {
		this.root = root;
		this.user = user;
	}

	determineIf(
		func: (
			permissions: Readonly<ReservationRequestDomainPermissions>,
		) => boolean,
	): boolean {
		const updatedPermissions: ReservationRequestDomainPermissions = {
			canCloseRequest:
				this.user.id === this.root.listing.sharer.id ||
				this.user.id === this.root.reserver.id, // either the sharer or reserver can close
			canCancelRequest: this.user.id === this.root.reserver.id, // ???
			canAcceptRequest: this.user.id === this.root.listing.sharer.id, // only sharer can accept
			canRejectRequest: this.user.id === this.root.listing.sharer.id, // only sharer can reject
		};

		return func(updatedPermissions);
	}
}
