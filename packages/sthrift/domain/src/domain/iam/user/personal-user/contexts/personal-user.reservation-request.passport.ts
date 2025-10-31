import type { ReservationRequestEntityReference } from '../../../../contexts/reservation-request/reservation-request/index.ts';
import type { ReservationRequestPassport } from '../../../../contexts/reservation-request/reservation-request.passport.ts';
import type { ReservationRequestVisa } from '../../../../contexts/reservation-request/reservation-request.visa.ts';
import type { ReservationRequestDomainPermissions } from '../../../../contexts/reservation-request/reservation-request.domain-permissions.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';

export class PersonalUserReservationRequestPassport
	extends PersonalUserPassportBase
	implements ReservationRequestPassport
{
	forReservationRequest(root: ReservationRequestEntityReference): ReservationRequestVisa {
		return {
			determineIf: (func: (permissions: Readonly<ReservationRequestDomainPermissions>) => boolean): boolean => {
				// Personal users can manage reservation requests they made or received
				const isRequester = root.reserver.id === this._user.id;
				const isSharer = root.listing.sharer.id === this._user.id;
				
				const permissions: ReservationRequestDomainPermissions = {
					canCloseRequest: isSharer || isRequester,
					canCancelRequest: isRequester,
					canAcceptRequest: isSharer,
					canRejectRequest: isSharer,
				};

				return func(permissions);
			}
		};
	}
}