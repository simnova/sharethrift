import type { TestServer } from '@cellix/serenity-framework/servers';
import { ServiceMongoose } from '@cellix/service-mongoose';
import { mongoDbName, testMongoServer } from './test-mongo-server.ts';

class MongooseTestServer implements TestServer {
	private service: ServiceMongoose | undefined;

	async start(): Promise<void> {
		this.service = new ServiceMongoose(testMongoServer.getConnectionString(), {
			autoCreate: true,
			autoIndex: true,
			dbName: mongoDbName,
		});
		await this.service.startUp();
	}

	async stop(): Promise<void> {
		await this.service?.shutDown();
		this.service = undefined;
	}

	isRunning(): boolean {
		return this.service !== undefined;
	}
	getUrl(): string {
		return '';
	}

	getService(): ServiceMongoose {
		if (!this.service) throw new Error('MongooseTestServer not started');
		return this.service;
	}
}

export const mongooseTestServer = new MongooseTestServer();
