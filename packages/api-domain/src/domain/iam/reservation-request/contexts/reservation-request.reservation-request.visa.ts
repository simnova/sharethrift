import type { ReservationRequestVisa } from '../../../contexts/reservation-request/reservation-request.visa.ts';
import type { ReservationRequestPassportBase, ReservationRequestDomainPermissions } from '../reservation-request.passport-base.ts';

export class ReservationRequestReservationRequestVisa implements ReservationRequestVisa {
	private readonly passport: ReservationRequestPassportBase;

	constructor(passport: ReservationRequestPassportBase) {
		this.passport = passport;
	}

	determineIf(predicate: (permissions: ReservationRequestDomainPermissions) => boolean): boolean {
		return this.passport.determineIf(predicate);
	}

	canCreate(): boolean {
		return this.determineIf(permissions => permissions.canCreateReservationRequest);
	}

	canUpdate(): boolean {
		return this.determineIf(permissions => permissions.canUpdateReservationRequest);
	}

	canDelete(): boolean {
		return this.determineIf(permissions => permissions.canDeleteReservationRequest);
	}

	canAccept(): boolean {
		return this.determineIf(permissions => permissions.canAcceptReservationRequest);
	}

	canReject(): boolean {
		return this.determineIf(permissions => permissions.canRejectReservationRequest);
	}

	canCancel(): boolean {
		return this.determineIf(permissions => permissions.canCancelReservationRequest);
	}

	canClose(): boolean {
		return this.determineIf(permissions => permissions.canCloseReservationRequest);
	}

	canView(): boolean {
		return this.determineIf(permissions => permissions.canViewReservationRequest);
	}
}