import { GraphqlSession } from './graphql-session.ts';

export class MongoSession extends GraphqlSession {

	static override at(apiUrl: string): MongoSession {
		return new MongoSession(apiUrl);
	}
}
