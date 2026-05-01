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
				// biome-ignore lint/complexity/useLiteralKeys: DefaultContext uses an index signature in TypeScript.
				...prevContext['headers'],
			},
		};
	});

// Apollo can bootstrap before the OIDC callback has populated both token fields.
// Fall back to id_token so protected GraphQL calls still carry a bearer token.
export const ApolloLinkToAddAuthHeaderIfAccessTokenAvailable = (
	access_token: string | undefined,
	id_token?: string | undefined,
): ApolloLink =>
	new SetContextLink((prevContext) => {
		const bearerToken = access_token ?? id_token;
		return {
			...prevContext,
			headers: {
				// biome-ignore lint/complexity/useLiteralKeys: DefaultContext uses an index signature in TypeScript.
				...prevContext['headers'],
				...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
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
			// biome-ignore lint/complexity/useLiteralKeys: DefaultContext uses an index signature in TypeScript.
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
