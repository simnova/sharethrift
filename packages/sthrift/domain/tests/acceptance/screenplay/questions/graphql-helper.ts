// Shared GraphQL helper for querying listings
import { GraphQLClient } from 'graphql-request';

export interface ListingData {
	id: string;
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: string;
	sharingPeriodEnd: string;
}

export const createGraphQLClient = (endpoint = 'http://localhost:7071/api/graphql'): GraphQLClient => {
	return new GraphQLClient(endpoint);
};

export const DEFAULT_GRAPHQL_ENDPOINT = 'http://localhost:7071/api/graphql';
