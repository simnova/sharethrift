import { ApiListingSession } from './api-listing-session.js';

export class MongoListingSession extends ApiListingSession {
	constructor(apiUrl: string) {
		super(apiUrl);
		// MongoDB requires explicit isDraft parameter
		this.config.includeIsDraft = true;
	}
}
