import { ApiListingSession } from './api-listing-session.ts';

export class MongoListingSession extends ApiListingSession {
	constructor(apiUrl: string, authToken?: string) {
		super(apiUrl, authToken);
		// MongoDB requires explicit isDraft parameter
		this.config.includeIsDraft = true;
	}
}
