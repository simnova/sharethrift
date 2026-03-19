import { ApolloLink, type DefaultContext, HttpLink } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { SetContextLink } from '@apollo/client/link/context';
import { PersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';

// base apollo link with no customizations
// could be used as a base for the link chain
export const BaseApolloLink = (): ApolloLink =>
	new SetContextLink((prevContext) => {
		return {
			...prevContext,
			headers: {
				...prevContext['headers'],
			},
		};
	});

// apollo link to add auth header
export const ApolloLinkToAddAuthHeaderIfAccessTokenAvailable = (
	access_token: string | undefined,
): ApolloLink =>
	new SetContextLink((prevContext) => {
		return {
			...prevContext,
			headers: {
				...prevContext['headers'],
				...(access_token && { Authorization: `Bearer ${access_token}` }),
			},
		};
	});

// apollo link to add custom header
export const ApolloLinkToAddCustomHeader = (
	headerName: string,
	headerValue: string | null | undefined,
	ifTrue?: boolean,
): ApolloLink =>
	new ApolloLink((operation, forward) => {
		if (!headerValue || (ifTrue !== undefined && ifTrue === false)) {
			return forward(operation);
		}
		operation.setContext((prevContext: DefaultContext) => {
			prevContext['headers'][headerName] = headerValue;
			return prevContext;
		});
		return forward(operation);
	});

// apollo link to batch graphql requests
// Note: BatchHttpLink in v4 automatically strips __typename from variables
export const TerminatingApolloBatchLinkForGraphqlServer = (
	config: BatchHttpLink.Options,
) => {
	const link = new BatchHttpLink({
		uri: config.uri,
		batchMax: config.batchMax, // No more than 15 operations per batch
		batchInterval: config.batchInterval, // Wait no more than 50ms after first batched operation
	});

    const persistedQueryLink = new PersistedQueryLink({
		sha256,
	}).concat(link);

	return ApolloLink.from([persistedQueryLink]);
};

export const TerminatingApolloHttpLinkForGraphqlServer = (
	config: BatchHttpLink.Options,
) => {
	const link = new HttpLink({
		uri: config.uri,
	});

	const persistedQueryLink = new PersistedQueryLink({
		sha256,
		useGETForHashedQueries: true,
	});
	return ApolloLink.from([persistedQueryLink, link]);
};
