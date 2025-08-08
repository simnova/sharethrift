import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import {
	ReservationRequest,
	ReservationRequestProps,
	ReservationPeriod,
	ReservationRequestStateValue,
	ReservationRequestState,
} from '@ocom/api-domain';

// TODO: Define proper document type based on Mongoose model
type ReservationRequestDocument = unknown;

/**
 * Domain adapter for converting between Mongoose documents and ReservationRequest domain entities.
 * Implements the MongooseDomainAdapter interface for proper separation between persistence and domain concerns.
 */
export class ReservationRequestDomainAdapterImpl implements MongooseSeedwork.MongooseDomainAdapter<
	ReservationRequest<ReservationRequestProps>,
	ReservationRequestProps,
	ReservationRequestDocument
> {
	
	/**
	 * Converts a Mongoose document to a ReservationRequest domain entity.
	 * @param doc - The Mongoose document
	 * @param passport - The passport for creating the domain entity
	 * @returns ReservationRequest domain entity
	 */
	documentToDomainEntity(doc: ReservationRequestDocument, passport: unknown): ReservationRequest<ReservationRequestProps> {
		// TODO: Properly type the document and passport parameters
		const docAny = doc as any;
		
		// Convert document fields to domain value objects
		const reservationPeriod = ReservationPeriod.create(
			docAny.reservationPeriodStart,
			docAny.reservationPeriodEnd
		);

		const state = ReservationRequestStateValue.create(
			docAny.state as ReservationRequestState
		);

		// Build domain entity props
		const props: ReservationRequestProps = {
			id: docAny._id.toString(),
			state,
			reservationPeriod,
			createdAt: docAny.createdAt,
			updatedAt: docAny.updatedAt,
			schemaVersion: docAny.schemaversion,
			listingId: docAny.listing.toString(),
			reserverId: docAny.reserver.toString(),
			closeRequested: docAny.closeRequested,
		};

		// Create and return domain entity
		return new ReservationRequest(props, passport as any); // TODO: Fix passport typing
	}

	/**
	 * Converts a ReservationRequest domain entity to a Mongoose document format.
	 * @param domainEntity - The ReservationRequest domain entity
	 * @returns Document data suitable for Mongoose operations
	 */
	domainEntityToDocument(domainEntity: ReservationRequest<ReservationRequestProps>): ReservationRequestDocument {
		return {
			_id: domainEntity.id,
			state: domainEntity.state.value,
			reservationPeriodStart: domainEntity.reservationPeriod.start,
			reservationPeriodEnd: domainEntity.reservationPeriod.end,
			createdAt: domainEntity.createdAt,
			updatedAt: domainEntity.updatedAt,
			schemaversion: domainEntity.schemaVersion,
			listing: domainEntity.listingId,
			reserver: domainEntity.reserverId,
			closeRequested: domainEntity.closeRequested,
		} as ReservationRequestDocument;
	}

	/**
	 * Converts a Mongoose document to domain entity props.
	 * @param doc - The Mongoose document
	 * @returns ReservationRequestProps
	 */
	documentToDomainProps(doc: ReservationRequestDocument): ReservationRequestProps {
		const docAny = doc as any;
		
		const reservationPeriod = ReservationPeriod.create(
			docAny.reservationPeriodStart,
			docAny.reservationPeriodEnd
		);

		const state = ReservationRequestStateValue.create(
			docAny.state as ReservationRequestState
		);

		return {
			id: docAny._id.toString(),
			state,
			reservationPeriod,
			createdAt: docAny.createdAt,
			updatedAt: docAny.updatedAt,
			schemaVersion: docAny.schemaversion,
			listingId: docAny.listing.toString(),
			reserverId: docAny.reserver.toString(),
			closeRequested: docAny.closeRequested,
		};
	}
}