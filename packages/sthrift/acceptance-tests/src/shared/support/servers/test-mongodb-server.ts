import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongoClient, ObjectId } from 'mongodb';
import { ServiceMongoose } from '@cellix/service-mongoose';
import { getAllMockAccountPlans } from '../test-data/account-plan.test-data.ts';
import { getAllMockUsers } from '../test-data/user.test-data.ts';

const MONGO_BINARY_VERSION = '7.0.14';
const DEFAULT_DB_NAME = 'sharethrift-test';

// In-memory MongoDB with seeded reference data (users, account plans)
export class MongoDBTestServer {
	private replSet: MongoMemoryReplSet | null = null;
	private serviceMongoose: ServiceMongoose | null = null;
	private dbName: string = DEFAULT_DB_NAME;

	async start(options?: { port?: number; dbName?: string }): Promise<void> {
		this.dbName = options?.dbName ?? DEFAULT_DB_NAME;

		this.replSet = await MongoMemoryReplSet.create({
			binary: { version: MONGO_BINARY_VERSION },
			replSet: { name: 'rs0', count: 1, storageEngine: 'wiredTiger' },
			instanceOpts: options?.port ? [{ port: options.port }] : undefined,
		});
		const uri = this.replSet.getUri();

		this.serviceMongoose = new ServiceMongoose(uri, {
			dbName: this.dbName,
			autoIndex: true,
			autoCreate: true,
		});
		await this.serviceMongoose.startUp();

		// Clear stale Mongoose model registrations from previous runs
		const { connection } = this.serviceMongoose.service;
		for (const modelName of Object.keys(connection.models)) {
			try {
				connection.deleteModel(modelName);
			} catch {
				// Model may already be deleted
			}
		}

		await MongoDBTestServer.seedData(uri, this.dbName);
	}

	getServiceMongoose(): ServiceMongoose {
		if (!this.serviceMongoose) {
			throw new Error('MongoDBTestServer not started');
		}
		return this.serviceMongoose;
	}

	getConnectionString(): string {
		if (!this.replSet) {
			throw new Error('MongoDBTestServer not started');
		}
		return this.replSet.getUri();
	}

	async stop(): Promise<void> {
		if (this.serviceMongoose) {
			await this.serviceMongoose.shutDown();
			this.serviceMongoose = null;
		}
		if (this.replSet) {
			await this.replSet.stop();
			this.replSet = null;
		}
	}

	isRunning(): boolean {
		return this.serviceMongoose !== null;
	}

	// Check whether MongoDB is reachable
	static async isReachable(connectionString: string): Promise<boolean> {
		const client = new MongoClient(connectionString, {
			serverSelectionTimeoutMS: 3_000,
			connectTimeoutMS: 3_000,
		});
		try {
			await client.connect();
			await client.db().command({ ping: 1 });
			return true;
		} catch {
			return false;
		} finally {
			await client.close();
		}
	}

	// Upsert reference data (users, account plans) into MongoDB
	static async seedData(
		connectionString: string,
		dbName: string,
	): Promise<void> {
		const client = new MongoClient(connectionString);
		try {
			await client.connect();
			const db = client.db(dbName);

			const accountPlans = getAllMockAccountPlans();
			if (accountPlans.length > 0) {
				const ops = accountPlans.map((plan) => ({
					updateOne: {
						filter: { _id: new ObjectId(plan.id) },
						update: {
							$setOnInsert: { _id: new ObjectId(plan.id), ...plan },
						},
						upsert: true,
					},
				}));
				await db.collection('accountplans').bulkWrite(ops);
			}

			const usersList = getAllMockUsers();
			if (usersList.length > 0) {
				const ops = usersList.map((user) => ({
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
				await db.collection('users').bulkWrite(ops);
			}
		} finally {
			await client.close();
		}
	}
}
