import { MongoMemoryTestServer } from '@cellix/serenity-framework/servers';
import { seedShareThriftReferenceData } from '@sthrift-verification/verification-shared/test-data';

export const mongoDbName = 'sharethrift-test';

export const testMongoServer = new MongoMemoryTestServer({
	dbName: mongoDbName,
	port: 50_000,
	replSetName: 'rs0',
	seedData: ({ connectionString, dbName }) => seedShareThriftReferenceData(connectionString, dbName),
});
