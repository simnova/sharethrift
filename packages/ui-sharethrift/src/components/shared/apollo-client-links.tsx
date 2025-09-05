import { ApolloClient, ApolloLink, type DefaultContext, HttpLink } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { setContext } from "@apollo/client/link/context";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";
import { ApolloManualMergeCacheFix } from "./apollo-manual-merge-cache-fix";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { sha256 } from "crypto-hash";

// apollo client instance
export const client = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_FUNCTION_ENDPOINT }),
  cache: ApolloManualMergeCacheFix,
  devtools: {
    enabled: import.meta.env.NODE_ENV !== "production", // or false
  },
});

// base apollo link with no customizations
// could be used as a base for the link chain
export const BaseApolloLink = (): ApolloLink =>
  // biome-ignore lint/suspicious/useAwait: <explanation>
  setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
      },
    };
  });

// apollo link to add auth header
export const ApolloLinkToAddAuthHeader = (access_token: string | undefined): ApolloLink =>
  // biome-ignore lint/suspicious/useAwait: <explanation>
  setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...(access_token && { Authorization: `Bearer ${access_token}` }),
      },
    };
  });

// apollo link to add custom header
export const ApolloLinkToAddCustomHeader = (headerName: string, headerValue: string | null | undefined, ifTrue?: boolean): ApolloLink =>
  new ApolloLink((operation, forward) => {
    if (!headerValue || (ifTrue !== undefined && ifTrue === false)) {
      return forward(operation);
    }
    // biome-ignore lint/suspicious/useAwait: <explanation>
    operation.setContext(async (prevContext: DefaultContext) => {
      prevContext.headers[headerName] = headerValue;
      return prevContext;
    });
    return forward(operation);
  });

// apollo link to batch graphql requests
// includes removeTypenameFromVariables link
export const TerminatingApolloBatchLinkForGraphqlServer = (config: BatchHttpLink.Options) => {
  const link = new BatchHttpLink({
    uri: config.uri,
    batchMax: config.batchMax, // No more than 15 operations per batch
    batchInterval: config.batchInterval, // Wait no more than 50ms after first batched operation
  });
  const persistedQueryLink = createPersistedQueryLink({
    sha256,
  }).concat(link);
  return ApolloLink.from([removeTypenameFromVariables(), persistedQueryLink]);
};

export const TerminatingApolloHttpLinkForGraphqlServer = (config: BatchHttpLink.Options) => {
  const link = new HttpLink({
    uri: config.uri,
  });

  const persistedQueryLink = createPersistedQueryLink({
    sha256,
    useGETForHashedQueries: true, // use GET for hashed queries
  }).concat(link);
  return ApolloLink.from([removeTypenameFromVariables(), persistedQueryLink]);
};
