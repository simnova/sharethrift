import type { ReservationRequestEntityReference } from '../../../../contexts/reservation-request/reservation-request/index.ts';
import type { ReservationRequestVisa } from '../../../../contexts/reservation-request/reservation-request.visa.ts';
import type { ReservationRequestDomainPermissions } from '../../../../contexts/reservation-request/reservation-request.domain-permissions.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/index.ts';

export class PersonalUserReservationRequestVisa<root extends ReservationRequestEntityReference>
	implements ReservationRequestVisa
{
	private readonly root: root;
	private readonly user: PersonalUserEntityReference;

	constructor(root: root, user: PersonalUserEntityReference) {
		this.root = root;
		this.user = user;
	}

	determineIf(
		func: (permissions: Readonly<ReservationRequestDomainPermissions>) => boolean,
	): boolean {
		// Personal users can manage reservation requests they made or received
		const isRequester = this.root.reserver.id === this.user.id;
		const isSharer = this.root.listing.sharer.id === this.user.id;
		
		const permissions: ReservationRequestDomainPermissions = {
			canCloseRequest: isSharer || isRequester,
			canCancelRequest: isRequester,
			canAcceptRequest: isSharer,
			canRejectRequest: isSharer,
		};

		return func(permissions);
	}
}