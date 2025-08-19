import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { 
	ReservationRequest, 
	ReservationRequestProps
} from '@sthrift/api-domain';
import type { 
	ReservationRequestDocument, 
	ReservationRequestModel
} from '@sthrift/api-data-sources-mongoose-models';
import { ReservationRequestConverter } from './reservation-request.converter.js';

/**
 * Domain adapter for ReservationRequest aggregate.
 * Handles conversion between domain entities and MongoDB documents.
 */
export class ReservationRequestDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<
	ReservationRequest,
	ReservationRequestProps,
	ReservationRequestConverter,
	ReservationRequestDocument,
	typeof ReservationRequestModel
> {
	constructor(model: typeof ReservationRequestModel) {
		super(model, new ReservationRequestConverter());
	}
}