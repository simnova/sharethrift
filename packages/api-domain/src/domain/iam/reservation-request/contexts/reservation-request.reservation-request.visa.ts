import type { ReservationRequestVisa } from '../../../contexts/reservation-request/reservation-request.visa.ts';
import type { ReservationRequestDomainPermissions } from '../../../contexts/reservation-request/reservation-request.domain-permissions.ts';
import type { ReservationRequestPassportBase } from '../reservation-request.passport-base.ts';

export class ReservationRequestReservationRequestVisa implements ReservationRequestVisa {
	private readonly passport: ReservationRequestPassportBase;

	constructor(passport: ReservationRequestPassportBase) {
		this.passport = passport;
	}

	determineIf(predicate: (permissions: Readonly<ReservationRequestDomainPermissions>) => boolean): boolean {
		// Map IAM permissions to context permissions
		const iamPermissions = this.passport.domainPermissions;
		const contextPermissions: ReservationRequestDomainPermissions = {
			canCloseRequest: iamPermissions.canCloseReservationRequest,
			canCancelRequest: iamPermissions.canCancelReservationRequest,
			canAcceptRequest: iamPermissions.canAcceptReservationRequest,
			canRejectRequest: iamPermissions.canRejectReservationRequest,
			canUpdateRequest: iamPermissions.canUpdateReservationRequest,
		};
		return predicate(contextPermissions);
	}

	canCreate(): boolean {
		return this.determineIf(permissions => permissions.canUpdateRequest);
	}

	canUpdate(): boolean {
		return this.determineIf(permissions => permissions.canUpdateRequest);
	}

	canDelete(): boolean {
		return this.determineIf(permissions => permissions.canUpdateRequest);
	}

	canAccept(): boolean {
		return this.determineIf(permissions => permissions.canAcceptRequest);
	}

	canReject(): boolean {
		return this.determineIf(permissions => permissions.canRejectRequest);
	}

	canCancel(): boolean {
		return this.determineIf(permissions => permissions.canCancelRequest);
	}

	canClose(): boolean {
		return this.determineIf(permissions => permissions.canCloseRequest);
	}

	canView(): boolean {
		return this.determineIf(permissions => permissions.canUpdateRequest);
	}
}