import { ApolloGraphQLTestServer, type TestServer } from '@cellix/serenity-framework/servers';
import type { ApplicationServices } from '@sthrift/application-services';
import { combinedSchema } from '@sthrift/graphql';
import { applyMiddleware } from 'graphql-middleware';
import { createMockApplicationServicesFactory } from '../shared/support/application-services/mock-application-services.ts';
import { mongooseTestServer } from './mongoose-test-server.ts';

class ApiGraphQLTestServer implements TestServer {
	private factory: ReturnType<typeof createMockApplicationServicesFactory> | undefined;
	private readonly server = new ApolloGraphQLTestServer<{
		applicationServices: ApplicationServices;
	}>({
		schema: applyMiddleware(combinedSchema),
		introspection: true,
		context: async ({ req }) => {
			this.factory ??= createMockApplicationServicesFactory(mongooseTestServer.getService());
			const applicationServices = await this.factory.forRequest(req.headers.authorization);
			if (!applicationServices) throw new Error('ApplicationServicesFactory required for test server');
			return { applicationServices };
		},
	});

	start(): Promise<void> {
		return this.server.start();
	}
	async stop(): Promise<void> {
		await this.server.stop();
		this.factory = undefined;
	}
	isRunning(): boolean {
		return this.server.isRunning();
	}
	getUrl(): string {
		return this.server.getUrl();
	}
}

export const apiGraphQLTestServer = new ApiGraphQLTestServer();
