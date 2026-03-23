import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { applyMiddleware } from 'graphql-middleware';
import depthLimit from 'graphql-depth-limit';
import type { ApplicationServices, ApplicationServicesFactory } from '@sthrift/application-services';
import { combinedSchema } from '@sthrift/graphql';

interface GraphContext {
	applicationServices: ApplicationServices;
}

const MAX_QUERY_DEPTH = 10;

// Real GraphQL Apollo Server for tests
export class TestServer {
	private server: ApolloServer<GraphContext> | null = null;
	private url: string | null = null;

	constructor(private readonly applicationServicesFactory?: ApplicationServicesFactory) {}

	async start(port = 0): Promise<string> {
		if (this.server) {
			throw new Error('Test server already started');
		}

		const securedSchema = applyMiddleware(combinedSchema);

		this.server = new ApolloServer<GraphContext>({
			schema: securedSchema,
			allowBatchedHttpRequests: true,
			validationRules: [depthLimit(MAX_QUERY_DEPTH)],
			introspection: true, // Enable for tests
		});

		const { url } = await startStandaloneServer(this.server, {
			listen: { port },
			context: async ({ req }) => {
				// Extract headers just like Azure Functions handler does
				const authHeader = req.headers.authorization ?? undefined;
				const hints = {
					memberId: req.headers['x-member-id'] as string | undefined,
					communityId: req.headers['x-community-id'] as string | undefined,
				};

				// Use ApplicationServicesFactory to get real application services
				const applicationServices = this.applicationServicesFactory
					? await this.applicationServicesFactory.forRequest(authHeader, hints)
					: undefined;

				if (!applicationServices) {
					throw new Error('ApplicationServicesFactory required for test server');
				}

				return {
					applicationServices,
				};
			},
		});

		this.url = url;
		return url;
	}

	async stop(): Promise<void> {
		if (!this.server) {
			return;
		}

		await this.server.stop();
		this.server = null;
		this.url = null;
	}

	getUrl(): string {
		if (!this.url) {
			throw new Error('Test server not started');
		}
		return this.url;
	}

	isRunning(): boolean {
		return this.server !== null;
	}
}
