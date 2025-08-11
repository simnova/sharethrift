import type { Passport } from '../../contexts/passport.ts';
import { ReservationRequestPassportBase, type AuthenticatedPrincipal, type ReservationRequestDomainPermissions } from './reservation-request.passport-base.ts';
import { ReservationRequestReservationRequestVisa } from './contexts/reservation-request.reservation-request.visa.ts';
import type { ReservationRequestVisa } from '../../contexts/reservation-request/reservation-request.visa.ts';

export class ReservationRequestPassport extends ReservationRequestPassportBase implements Passport {
	private readonly _reservationRequestVisa: ReservationRequestVisa;

	constructor(principal: AuthenticatedPrincipal, permissions: ReservationRequestDomainPermissions) {
		super(principal, permissions);
		this._reservationRequestVisa = new ReservationRequestReservationRequestVisa(this);
	}

	public get reservationRequest(): ReservationRequestVisa {
		return this._reservationRequestVisa;
	}

	// Required by Passport interface - will be expanded as other contexts are added
	[key: string]: unknown;
}