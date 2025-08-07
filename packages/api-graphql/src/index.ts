import { ApolloServer, type BaseContext } from '@apollo/server';
import {
	startServerAndCreateHandler,
	type AzureFunctionsMiddlewareOptions,
	type AzureFunctionsContextFunctionArgument,
} from './azure-functions.ts';
import type { HttpHandler } from '@azure/functions-v4';
import type { ApiContextSpec } from '@ocom/api-context-spec';

// Define Passport type locally to avoid dependency issues
interface Passport {
	user: {
		id: string;
		email: string;
		name?: string;
		roles?: string[];
	} | null;
	isAuthenticated: boolean;
}

// Simple JWT token validation for development
function validateToken(token?: string): Passport {
	if (!token) {
		return { user: null, isAuthenticated: false };
	}

	// For development, accept any token and create a mock user
	// In production, this would validate the JWT token properly
	if (token === 'mock-access-token-dev' || token.startsWith('Bearer ')) {
		return {
			user: {
				id: 'user-123',
				email: 'john.doe@example.com',
				name: 'John Doe',
				roles: ['user']
			},
			isAuthenticated: true
		};
	}

	return { user: null, isAuthenticated: false };
}

// The GraphQL schema
const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String
  }

  type Query {
    hello: String
    me: User
  }
`;

interface GraphContext extends BaseContext {
	apiContext?: ApiContextSpec;
	passport: Passport;
}

// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) =>
			`Hello ${context.passport.user?.name || 'anonymous'}! API Context: ${JSON.stringify(context.apiContext)}`,
		me: (_parent: unknown, _args: unknown, context: GraphContext) => {
			if (!context.passport.isAuthenticated || !context.passport.user) {
				throw new Error('Not authenticated');
			}
			return context.passport.user;
		},
	},
};

export const graphHandlerCreator = (
	apiContext: ApiContextSpec,
): HttpHandler => {
	// Set up Apollo Server
	const server = new ApolloServer<GraphContext>({
		typeDefs,
		resolvers,
	});
	
	const functionOptions: AzureFunctionsMiddlewareOptions<GraphContext> = {
		context: ({ req }: AzureFunctionsContextFunctionArgument) => {
			// Extract and validate the Authorization header
			const authHeader = req.headers.get('authorization');
			const token = authHeader?.replace('Bearer ', '');
			const passport = validateToken(token);

			return Promise.resolve({
				apiContext: apiContext,
				passport: passport,
			});
		},
	};
	
	return startServerAndCreateHandler(
		server, 
		functionOptions as AzureFunctionsMiddlewareOptions<GraphContext> & { context: NonNullable<AzureFunctionsMiddlewareOptions<GraphContext>['context']> }
	);
};
