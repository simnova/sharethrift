import type { InMemoryCache } from '@apollo/client';
import { ApolloClient, ApolloLink } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { ApolloProvider } from '@apollo/client/react';
import { type FC, useMemo } from 'react';
import { useAuth } from 'react-oidc-context';
import {
	ApolloLinkToAddAuthHeaderIfAccessTokenAvailable,
	ApolloLinkToAddCustomHeader,
	BaseApolloLink,
	TerminatingApolloBatchLinkForGraphqlServer,
	TerminatingApolloHttpLinkForGraphqlServer,
} from './apollo-client-links.ts';

interface ApolloConnectionConfig {
	blobStorageUrl: string;
	functionEndpoint: string;
	isProduction: boolean;
	cache: InMemoryCache;
}

interface ApolloConnectionProps {
	config: ApolloConnectionConfig;
	children: React.ReactNode;
}

export type { ApolloConnectionConfig };

export const ApolloConnection: FC<ApolloConnectionProps> = ({
	config,
	children,
}) => {
	const auth = useAuth();
	const accessToken = auth.user?.access_token;
	const idToken = auth.user?.id_token;

	const restLinkForCountryDataSource = useMemo(
		() => new HttpLink({ uri: config.blobStorageUrl }),
		[config.blobStorageUrl],
	);

	const restLinkForHealthProfessionsDataSource = useMemo(
		() =>
			new HttpLink({
				uri: config.blobStorageUrl,
				fetch: (uri: RequestInfo | URL, options?: RequestInit) =>
					fetch(uri, { ...options, cache: 'no-store' }),
			}),
		[config.blobStorageUrl],
	);

	const apolloBatchHttpLinkForGraphqlDataSource = useMemo(
		() =>
			TerminatingApolloBatchLinkForGraphqlServer({
				uri: config.functionEndpoint,
				batchMax: 15,
				batchInterval: 50,
			}),
		[config.functionEndpoint],
	);

	const apolloHttpLinkForGraphqlDataSource = useMemo(
		() =>
			TerminatingApolloHttpLinkForGraphqlServer({
				uri: config.functionEndpoint,
			}),
		[config.functionEndpoint],
	);

	const linkMap = useMemo(() => {
		return {
			countries: restLinkForCountryDataSource,
			healthProfession: restLinkForHealthProfessionsDataSource,
			cacheEnabled: ApolloLink.from([
				BaseApolloLink(),
				ApolloLinkToAddAuthHeaderIfAccessTokenAvailable(accessToken, idToken),
				ApolloLinkToAddCustomHeader('Cache-Enabled', 'true'),
				apolloHttpLinkForGraphqlDataSource,
			]),
			default: ApolloLink.from([
				BaseApolloLink(),
				ApolloLinkToAddAuthHeaderIfAccessTokenAvailable(accessToken, idToken),
				ApolloLinkToAddCustomHeader('Cache-Enabled', 'false'),
				apolloBatchHttpLinkForGraphqlDataSource,
			]),
		};
	}, [
		accessToken,
		idToken,
		restLinkForCountryDataSource,
		restLinkForHealthProfessionsDataSource,
		apolloHttpLinkForGraphqlDataSource,
		apolloBatchHttpLinkForGraphqlDataSource,
	]);

	const client = useMemo(() => {
		return new ApolloClient({
			cache: config.cache,
			link: ApolloLink.split(
				(operation) =>
					// biome-ignore lint/complexity/useLiteralKeys: Apollo context headers are typed via an index signature.
					operation.getContext()['headers']?.['Cache-Enabled'] === 'true',
				linkMap.cacheEnabled,
				ApolloLink.split(
					(operation) =>
						!!operation.operationName && operation.operationName in linkMap,
					new ApolloLink((operation, forward) => {
						const link =
							linkMap[operation.operationName as keyof typeof linkMap] ||
							linkMap.default;
						return link.request(operation, forward);
					}),
					linkMap.default,
				),
			),
			devtools: { enabled: !config.isProduction },
		});
	}, [linkMap, config.cache, config.isProduction]);

	return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
