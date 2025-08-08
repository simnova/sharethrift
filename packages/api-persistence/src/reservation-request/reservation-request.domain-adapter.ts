import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { ReservationRequest } from '@ocom/api-domain';

export class ReservationRequestDomainAdapter {
	
	constructor(private initializedService: MongooseSeedwork.MongooseContextFactory) {}

	toDomain(_mongooseDoc: any): ReservationRequest<any> {
		// Convert Mongoose document to domain entity
		// Implementation will be completed when domain is finalized
		throw new Error('Not implemented yet');
	}

	toPersistence(_domainEntity: ReservationRequest<any>): any {
		// Convert domain entity to Mongoose document
		// Implementation will be completed when domain is finalized
		throw new Error('Not implemented yet');
	}
}