import { MongoClient, ObjectId } from 'mongodb';
import {
	getAllMockAccountPlans,
	getAllMockUsers,
} from '../test-data/index.ts';
import {
	BaseMongoDBTestServer,
	type MongoDBTestServerStartOptions,
} from './base-mongodb-test-server.ts';

const DEFAULT_DB_NAME = 'sharethrift-test';

export async function seedShareThriftReferenceData(
	connectionString: string,
	dbName: string,
): Promise<void> {
	const client = new MongoClient(connectionString);

	try {
		await client.connect();
		const db = client.db(dbName);

		const accountPlans = getAllMockAccountPlans();
		if (accountPlans.length > 0) {
			const operations = accountPlans.map((plan) => ({
				updateOne: {
					filter: { _id: new ObjectId(plan.id) },
					update: {
						$setOnInsert: { _id: new ObjectId(plan.id), ...plan },
					},
					upsert: true,
				},
			}));
			await db.collection('accountplans').bulkWrite(operations);
		}

		const users = getAllMockUsers();
		if (users.length > 0) {
			const operations = users.map((user) => ({
				updateOne: {
					filter: { _id: new ObjectId(user.id) },
					update: {
						$setOnInsert: {
							_id: new ObjectId(user.id),
							userType: 'userType' in user ? user.userType : 'personal-user',
							isBlocked: user.isBlocked,
							hasCompletedOnboarding:
								'hasCompletedOnboarding' in user
									? user.hasCompletedOnboarding
									: false,
							account: user.account,
							schemaVersion: user.schemaVersion,
							createdAt: user.createdAt,
							updatedAt: user.updatedAt,
						},
					},
					upsert: true,
				},
			}));
			await db.collection('users').bulkWrite(operations);
		}
	} finally {
		await client.close();
	}
}

export class MongoDBTestServer extends BaseMongoDBTestServer {
	override async start(
		options?: Partial<MongoDBTestServerStartOptions>,
	): Promise<void> {
		await super.start({
			dbName: options?.dbName ?? DEFAULT_DB_NAME,
			...(options?.port !== undefined && { port: options.port }),
			seedDataFn: options?.seedDataFn ?? seedShareThriftReferenceData,
		});
	}

	static async seedData(
		connectionString: string,
		dbName: string,
	): Promise<void> {
		await seedShareThriftReferenceData(connectionString, dbName);
	}
}
