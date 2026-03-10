import { GraphqlSession } from './graphql-session.js';

export class MongoSession extends GraphqlSession {

	static override at(apiUrl: string): MongoSession {
		return new MongoSession(apiUrl);
	}
}
