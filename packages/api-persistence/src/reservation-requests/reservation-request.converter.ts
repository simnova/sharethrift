import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import {
	ReservationRequestState,
	ReservationReason,
	type ReservationRequestProps,
	type ListingEntityReference,
	type ReserverEntityReference
} from '@sthrift/api-domain';
import type { 
	ReservationRequestDocument
} from '@sthrift/api-data-sources-mongoose-models';

/**
 * Type converter for mapping between domain value objects and MongoDB primitive types
 */
export class ReservationRequestConverter extends MongooseSeedwork.MongoTypeConverter<
	ReservationRequestProps,
	ReservationRequestDocument
> {
	toMongo(domainProps: ReservationRequestProps): ReservationRequestDocument {
		return {
			state: domainProps.state.valueOf() as ReservationRequestDocument['state'],
			reservationPeriodStart: domainProps.reservationPeriodStart,
			reservationPeriodEnd: domainProps.reservationPeriodEnd,
			closeRequested: domainProps.closeRequested,
			reason: domainProps.reason?.valueOf(),
			listing: this.toObjectId(domainProps.listing.id),
			reserver: this.toObjectId(domainProps.reserver.id),
			schemaversion: domainProps.schemaVersion,
			createdAt: domainProps.createdAt,
			updatedAt: domainProps.updatedAt,
		} as ReservationRequestDocument;
	}

	toDomain(mongoDocument: ReservationRequestDocument): ReservationRequestProps {
		return {
			id: mongoDocument._id?.toString() || '',
			state: new ReservationRequestState(mongoDocument.state),
			reservationPeriodStart: mongoDocument.reservationPeriodStart,
			reservationPeriodEnd: mongoDocument.reservationPeriodEnd,
			closeRequested: mongoDocument.closeRequested,
			reason: mongoDocument.reason ? new ReservationReason(mongoDocument.reason) : undefined,
			listing: this.createListingEntityReference(mongoDocument.listing.toString()),
			reserver: this.createReserverEntityReference(mongoDocument.reserver.toString()),
			schemaVersion: mongoDocument.schemaversion,
			createdAt: mongoDocument.createdAt,
			updatedAt: mongoDocument.updatedAt,
		};
	}

	/**
	 * Creates a listing entity reference from the ObjectId
	 * In a real implementation, this would fetch the actual listing data
	 */
	private createListingEntityReference(listingId: string): ListingEntityReference {
		// TODO: This should fetch actual listing data from the listing collection
		// For now, return a minimal entity reference
		return {
			id: listingId,
			title: 'Listing Title', // Placeholder
			description: 'Listing Description', // Placeholder
			imageUrl: undefined,
			ownerId: 'owner-id', // Placeholder
		};
	}

	/**
	 * Creates a reserver entity reference from the ObjectId
	 * In a real implementation, this would fetch the actual user data
	 */
	private createReserverEntityReference(reserverId: string): ReserverEntityReference {
		// TODO: This should fetch actual user data from the user collection
		// For now, return a minimal entity reference
		return {
			id: reserverId,
			firstName: 'First', // Placeholder
			lastName: 'Last', // Placeholder
			email: 'user@example.com', // Placeholder
			profileImageUrl: undefined,
		};
	}
}