import { ServiceMongoose } from '@cellix/service-mongoose';
import { MongoClient } from 'mongodb';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

const MONGO_BINARY_VERSION = '7.0.14';

export type MongoDBSeedDataFunction = (
	connectionString: string,
	dbName: string,
) => Promise<void>;

export interface MongoDBTestServerStartOptions {
	dbName: string;
	port?: number;
	seedDataFn?: MongoDBSeedDataFunction;
}

/**
 * In-memory MongoDB replica set with a Mongoose service attached. Generic over
 * schema — callers supply the db name and (optionally) a seed function to
 * populate reference data.
 */
export class BaseMongoDBTestServer {
	private replSet: MongoMemoryReplSet | null = null;
	private serviceMongoose: ServiceMongoose | null = null;
	private dbName = '';

	async start(options: MongoDBTestServerStartOptions): Promise<void> {
		this.dbName = options.dbName;

		const config = {
			binary: { version: MONGO_BINARY_VERSION },
			replSet: { name: 'rs0', count: 1, storageEngine: 'wiredTiger' as const },
			...(options.port && { instanceOpts: [{ port: options.port }] }),
		};

		this.replSet = await MongoMemoryReplSet.create(config);
		const uri = this.replSet.getUri();

		this.serviceMongoose = new ServiceMongoose(uri, {
			dbName: this.dbName,
			autoIndex: true,
			autoCreate: true,
		});
		await this.serviceMongoose.startUp();

		const { connection } = this.serviceMongoose.service;
		for (const modelName of Object.keys(connection.models)) {
			try {
				connection.deleteModel(modelName);
			} catch {
				/* already deleted */
			}
		}

		if (options.seedDataFn) {
			await options.seedDataFn(uri, this.dbName);
		}
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
}
