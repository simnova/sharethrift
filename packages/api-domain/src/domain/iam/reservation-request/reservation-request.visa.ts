import type { Visa } from '@cellix/domain-seedwork/src/passport-seedwork/visa.ts';
import type { ReservationRequestPermissions } from '../../contexts/reservation-requests/reservation-request.aggregate.js';
import { ReservationRequestPassportBase } from './reservation-request.passport-base.js';

/**
 * Visa implementation for ReservationRequest operations.
 * Implements permission logic based on user role and reservation request state.
 */
export class ReservationRequestVisa extends ReservationRequestPassportBase implements Visa<ReservationRequestPermissions> {
	
	/**
	 * Determines if the user has the specified permissions
	 */
	public determineIf(func: (permissions: Readonly<ReservationRequestPermissions>) => boolean): boolean {
		const permissions = this.calculatePermissions();
		return func(permissions);
	}

	/**
	 * Calculates the effective permissions for the current user and reservation request state
	 */
	private calculatePermissions(): ReservationRequestPermissions {
		const state = this.currentState;
		
		return {
			// Only reserver can cancel (when pending, accepted, or rejected)
			canCancel: this.isReserver && ['pending', 'accepted', 'rejected'].includes(state),
			
			// Only listing owner can accept (when pending)
			canAccept: this.isListingOwner && state === 'pending',
			
			// Only listing owner can reject (when pending)
			canReject: this.isListingOwner && state === 'pending',
			
			// Either reserver or listing owner can close (when accepted or closing)
			canClose: (this.isReserver || this.isListingOwner) && ['accepted', 'closing'].includes(state),
			
			// Only reserver can request close (when accepted)
			canRequestClose: this.isReserver && state === 'accepted',
			
			// Only reserver can update their own reservation (when pending)
			canUpdate: this.isReserver && state === 'pending',
			
			// Only listing owner can delete reservation requests
			canDelete: this.isListingOwner,
		};
	}
}