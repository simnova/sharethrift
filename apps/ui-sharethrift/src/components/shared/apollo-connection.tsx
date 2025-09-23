import { type FC, useMemo } from 'react';
import { ApolloClient, ApolloLink, ApolloProvider, from } from '@apollo/client';
import { RestLink } from 'apollo-link-rest';
import { useAuth } from 'react-oidc-context';
import {
	ApolloLinkToAddAuthHeaderIfAccessTokenAvailable,
	ApolloLinkToAddCustomHeader,
	BaseApolloLink,
	TerminatingApolloBatchLinkForGraphqlServer,
	TerminatingApolloHttpLinkForGraphqlServer,
} from './apollo-client-links.ts';
import { ApolloManualMergeCacheFix } from './apollo-manual-merge-cache-fix.ts';

const restLinkForCountryDataSource = new RestLink({
	uri: `${import.meta.env['VITE_BLOB_STORAGE_CONFIG_URL']}`,
});
const restLinkForHealthProfessionsDataSource = new RestLink({
	uri: `${import.meta.env['VITE_BLOB_STORAGE_CONFIG_URL']}`,
	customFetch: (uri, options) => fetch(uri, { ...options, cache: 'no-store' }),
});
const apolloBatchHttpLinkForGraphqlDataSource =
	TerminatingApolloBatchLinkForGraphqlServer({
		uri: `${import.meta.env['VITE_FUNCTION_ENDPOINT']}`,
		batchMax: 15,
		batchInterval: 50,
	});

const apolloHttpLinkForGraphqlDataSource =
	TerminatingApolloHttpLinkForGraphqlServer({
		uri: `${import.meta.env['VITE_FUNCTION_ENDPOINT']}`,
	});

export interface ApolloConnectionProps {
	children: React.ReactNode;
}
export const ApolloConnection: FC<ApolloConnectionProps> = (
	props: ApolloConnectionProps,
) => {
	const auth = useAuth();
	/**
	 * linkMap is a map of linkChain, where
	 * - each linkChain has a terminating link that will make the request to the server
	 * - there must be no forwarding link after the terminating link
	 */
	const linkMap = useMemo(() => {
		return {
			countries: restLinkForCountryDataSource,
			healthProfession: restLinkForHealthProfessionsDataSource,
			cacheEnabled: from([
				BaseApolloLink(),
				ApolloLinkToAddAuthHeaderIfAccessTokenAvailable(
					auth.user?.access_token,
				),
				ApolloLinkToAddCustomHeader('Cache-Enabled', 'true'),
				apolloHttpLinkForGraphqlDataSource,
			]),
			default: from([
				BaseApolloLink(),
				ApolloLinkToAddAuthHeaderIfAccessTokenAvailable(
					auth.user?.access_token,
				),
				ApolloLinkToAddCustomHeader('Cache-Enabled', 'false'),
				apolloBatchHttpLinkForGraphqlDataSource,
			]),
		};
	}, [auth.user?.access_token]);

	const client = useMemo(() => {
		return new ApolloClient({
			cache: ApolloManualMergeCacheFix,
			link: ApolloLink.split(
				(operation) =>
					operation.getContext()['headers']?.['Cache-Enabled'] === 'true',
				linkMap.cacheEnabled,
				ApolloLink.split(
					(operation) => operation.operationName in linkMap,
					new ApolloLink((operation) => {
						const link =
							linkMap[operation.operationName as keyof typeof linkMap] ||
							linkMap.default;
						return link.request(operation);
					}),
					linkMap.default,
				),
			),
			devtools: { enabled: import.meta.env['NODE_ENV'] !== 'production' },
		});
	}, [linkMap]);

	return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};
