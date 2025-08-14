import { ApolloClient, ApolloLink, from, HttpLink } from "@apollo/client";
import type { DefaultContext } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { setContext } from "@apollo/client/link/context";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";
import type { AuthContextProps } from "react-oidc-context";
import { ApolloManualMergeCacheFix } from "./apollo-manual-merge-cache-fix";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { sha256 } from "crypto-hash";

// apollo client instance
export const client = new ApolloClient({
  cache: ApolloManualMergeCacheFix,
  connectToDevTools: import.meta.env.NODE_ENV !== "production",
});

// base apollo link with no customizations
// could be used as a base for the link chain
export const BaseApolloLink = (): ApolloLink =>
  setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
      },
    };
  });

// apollo link to add auth header
export const ApolloLinkToAddAuthHeader = (auth: AuthContextProps): ApolloLink =>
  setContext(async (_, { headers }) => {
    const access_token = auth.isAuthenticated
      ? auth.user?.access_token
      : undefined;
    return {
      headers: {
        ...headers,
        ...(access_token && { Authorization: `Bearer ${access_token}` }),
      },
    };
  });

// apollo link to add custom header
export const ApolloLinkToAddCustomHeader = (
  headerName: string,
  headerValue: string | null | undefined,
  ifTrue?: boolean
): ApolloLink =>
  new ApolloLink((operation, forward) => {
    if (!headerValue || (ifTrue !== undefined && ifTrue === false)) {
      return forward(operation);
    }
    operation.setContext(async (prevContext: DefaultContext) => {
      prevContext.headers[headerName] = headerValue;
      return prevContext;
    });
    return forward(operation);
  });

// apollo link to batch graphql requests
// includes removeTypenameFromVariables link
export const TerminatingApolloBatchLinkForGraphqlServer = (
  config: BatchHttpLink.Options
) => {
  const link = new BatchHttpLink({
    uri: config.uri,
    batchMax: config.batchMax, // No more than 15 operations per batch
    batchInterval: config.batchInterval, // Wait no more than 50ms after first batched operation
  });
  const persistedQueryLink = createPersistedQueryLink({
    sha256,
  }).concat(link);
  return from([removeTypenameFromVariables(), persistedQueryLink]);
};

export const TerminatingApolloHttpLinkForGraphqlServer = (
  config: BatchHttpLink.Options
) => {
  const link = new HttpLink({
    uri: config.uri,
  });

  const persistedQueryLink = createPersistedQueryLink({
    sha256,
    useGETForHashedQueries: true, // use GET for hashed queries
  }).concat(link);
  return from([removeTypenameFromVariables(), persistedQueryLink]);
};
