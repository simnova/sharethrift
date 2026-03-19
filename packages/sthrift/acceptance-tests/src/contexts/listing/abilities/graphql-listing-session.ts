import { ApiListingSession } from './api-listing-session.ts';

export class GraphQLListingSession extends ApiListingSession {
	constructor(apiUrl: string) {
		super(apiUrl);
		// GraphQL doesn't need isDraft parameter
		this.config.includeIsDraft = false;
	}
}
