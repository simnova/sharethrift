import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { ObjectId } from 'mongodb';
import { ServiceMongoose } from '@cellix/service-mongoose';
import { getAllMockAccountPlans } from '../test-data/account-plan.test-data.js';
import { getAllMockUsers } from '../test-data/user.test-data.js';

async function seedTestDatabase(
	serviceMongoose: ServiceMongoose,
): Promise<void> {
	const { connection } = serviceMongoose.service;

	const accountPlans = getAllMockAccountPlans();
	if (accountPlans.length > 0) {
		await connection.collection('accountplans').insertMany(
			accountPlans.map((plan) => ({
				_id: new ObjectId(plan.id),
				...plan,
			})),
		);
	}

	const usersList = getAllMockUsers();
	if (usersList.length > 0) {
		await connection.collection('users').insertMany(
			usersList.map((user) => {
				const userRecord = user as unknown as Record<string, unknown>;
				return {
					_id: new ObjectId(String(userRecord['id'])),
					userType: userRecord['userType'],
					isBlocked: userRecord['isBlocked'],
					hasCompletedOnboarding: userRecord['hasCompletedOnboarding'],
					account: userRecord['account'],
					schemaVersion: userRecord['schemaVersion'],
					createdAt: userRecord['createdAt'],
					updatedAt: userRecord['updatedAt'],
				};
			}),
		);
	}
}
export class MongoDBTestServer {
	private replSet: MongoMemoryReplSet | null = null;
	private serviceMongoose: ServiceMongoose | null = null;

	async start(): Promise<void> {
		this.replSet = await MongoMemoryReplSet.create({
			binary: { version: '7.0.14' },
			replSet: { name: 'rs0', count: 1, storageEngine: 'wiredTiger' },
		});
		const uri = this.replSet.getUri();

		this.serviceMongoose = new ServiceMongoose(uri, {
			dbName: 'sharethrift-test',
			autoIndex: true,
			autoCreate: true,
		});
		await this.serviceMongoose.startUp();

		// Clear any previously registered Mongoose models to prevent discriminator conflicts
		// Models will be re-registered by mongooseContextBuilder in the next persistence setup
		const { connection } = this.serviceMongoose.service;
		for (const modelName of Object.keys(connection.models)) {
			try {
				connection.deleteModel(modelName);
			} catch {
				// Model may already be deleted
			}
		}

		await seedTestDatabase(this.serviceMongoose);
	}

	getServiceMongoose(): ServiceMongoose {
		if (!this.serviceMongoose) {
			throw new Error('MongoDBTestServer not started');
		}
		return this.serviceMongoose;
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
}
