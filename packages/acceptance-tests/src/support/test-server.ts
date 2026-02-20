import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { applyMiddleware } from 'graphql-middleware';
import depthLimit from 'graphql-depth-limit';
import type { ApplicationServicesFactory } from '@sthrift/application-services';
import { combinedSchema } from '@sthrift/graphql';

interface GraphContext {
	applicationServices: unknown;
}

const MAX_QUERY_DEPTH = 10;

/**
 * Test server using REAL GraphQL schema and resolvers from @sthrift/graphql.
 * 
 * This is your actual Apollo Server running in-process for tests.
 * GraphQLSession tests will make real GraphQL calls to this server, testing:
 * - Real GraphQL resolvers
 * - Domain layer business logic
 * - Full integration (minus database - uses in-memory/mock services)
 * 
 * Following Screenplay.js pattern:
 * "GraphQLSession makes real GraphQL calls to test the full stack"
 */
export class TestServer {
	private server: ApolloServer<GraphContext> | null = null;
	private url: string | null = null;

	constructor(private readonly applicationServicesFactory?: ApplicationServicesFactory) {}

	async start(port = 4000): Promise<string> {
		if (this.server) {
			throw new Error('Test server already started');
		}

		// Use the REAL combined schema with all resolvers
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
		console.log(`[TEST SERVER] Real GraphQL server ready at ${url}`);
		return url;
	}

	async stop(): Promise<void> {
		if (!this.server) {
			return;
		}

		await this.server.stop();
		this.server = null;
		this.url = null;
		console.log('[TEST SERVER] Real GraphQL server stopped');
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
