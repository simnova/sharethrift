import { DomainSeedwork } from '@cellix/domain-seedwork';
import { ReservationRequestState, type ReservationReason } from './reservation-request.value-objects.js';
import type { ListingEntityReference, ReserverEntityReference } from './reservation-request.entity-references.js';

export interface ReservationRequestProps extends DomainSeedwork.DomainEntityProps {
	readonly listing: Readonly<ListingEntityReference>;
	readonly reserver: Readonly<ReserverEntityReference>;
	readonly state: ReservationRequestState;
	readonly reservationPeriodStart: Date;
	readonly reservationPeriodEnd: Date;
	readonly closeRequested: boolean;
	readonly reason: ReservationReason | undefined;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly schemaVersion: number;
}

export interface ReservationRequestEntityReference extends Readonly<ReservationRequestProps> {}

export interface ReservationRequestPassport {
	determineIf(permissions: (permissions: ReservationRequestPermissions) => boolean): boolean;
}

export interface ReservationRequestPermissions {
	canCancel: boolean;
	canAccept: boolean;
	canReject: boolean;
	canClose: boolean;
	canRequestClose: boolean;
	canUpdate: boolean;
	canDelete: boolean;
}

export class ReservationRequest extends DomainSeedwork.AggregateRoot<ReservationRequestProps, ReservationRequestPassport> implements ReservationRequestEntityReference {
	
	get listing() {
		return this.props.listing;
	}

	get reserver() {
		return this.props.reserver;
	}

	get state() {
		return this.props.state;
	}

	get reservationPeriodStart() {
		return this.props.reservationPeriodStart;
	}

	get reservationPeriodEnd() {
		return this.props.reservationPeriodEnd;
	}

	get closeRequested() {
		return this.props.closeRequested;
	}

	get reason() {
		return this.props.reason;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get schemaVersion() {
		return this.props.schemaVersion;
	}

	/**
	 * Factory method to create a new reservation request
	 */
	public static getNewInstance(
		props: Omit<ReservationRequestProps, 'id' | 'createdAt' | 'updatedAt' | 'schemaVersion'>,
		passport: ReservationRequestPassport,
		id?: string
	): ReservationRequest {
		const now = new Date();
		return new ReservationRequest({
			...props,
			id: id || crypto.randomUUID(),
			createdAt: now,
			updatedAt: now,
			schemaVersion: 1,
		}, passport);
	}

	/**
	 * Accept the reservation request
	 */
	public accept(): void {
		if (!this.passport.determineIf(permissions => permissions.canAccept)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to accept this reservation request'
			);
		}

		if (this.props.state.valueOf() !== 'pending') {
			throw new Error('Reservation request can only be accepted when in pending state');
		}

		// Update props via object assignment
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).state = new ReservationRequestState('accepted');
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).updatedAt = new Date();
	}

	/**
	 * Reject the reservation request
	 */
	public reject(reason?: ReservationReason): void {
		if (!this.passport.determineIf(permissions => permissions.canReject)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to reject this reservation request'
			);
		}

		if (this.props.state.valueOf() !== 'pending') {
			throw new Error('Reservation request can only be rejected when in pending state');
		}

		// Update props via object assignment
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).state = new ReservationRequestState('rejected');
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).reason = reason;
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).updatedAt = new Date();
	}

	/**
	 * Cancel the reservation request
	 */
	public cancel(reason?: ReservationReason): void {
		if (!this.passport.determineIf(permissions => permissions.canCancel)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to cancel this reservation request'
			);
		}

		const currentState = this.props.state.valueOf();
		if (!['pending', 'accepted', 'rejected'].includes(currentState)) {
			throw new Error(`Reservation request cannot be cancelled from ${currentState} state`);
		}

		// Update props via object assignment
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).state = new ReservationRequestState('cancelled');
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).reason = reason;
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).updatedAt = new Date();
	}

	/**
	 * Request close of the reservation
	 */
	public requestClose(): void {
		if (!this.passport.determineIf(permissions => permissions.canRequestClose)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to request close for this reservation'
			);
		}

		if (this.props.state.valueOf() !== 'accepted') {
			throw new Error('Reservation can only be closed when in accepted state');
		}

		// Update props via object assignment
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).state = new ReservationRequestState('closing');
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).closeRequested = true;
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).updatedAt = new Date();
	}

	/**
	 * Close the reservation
	 */
	public close(): void {
		if (!this.passport.determineIf(permissions => permissions.canClose)) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to close this reservation'
			);
		}

		const currentState = this.props.state.valueOf();
		if (!['closing', 'accepted'].includes(currentState)) {
			throw new Error(`Reservation cannot be closed from ${currentState} state`);
		}

		// Update props via object assignment
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).state = new ReservationRequestState('closed');
		// biome-ignore lint/suspicious/noExplicitAny: Required for mutating readonly props in domain pattern
		(this.props as any).updatedAt = new Date();
	}
}