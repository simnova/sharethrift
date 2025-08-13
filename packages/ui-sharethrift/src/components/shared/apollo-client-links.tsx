import { ApolloClient, ApolloLink, type DefaultContext, InMemoryCache, from, HttpLink } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import type { AuthContextProps } from 'react-oidc-context';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { setContext } from '@apollo/client/link/context';

// Types for custom headers
export interface CustomHeaders {
  [key: string]: string | undefined;
}

export interface ApolloClientConfig {
  uri: string;
  batchMax?: number;
  batchInterval?: number;
  customHeaders?: CustomHeaders;
}

// Generate a unique request ID for each request
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get client ID (could be from environment or generated)
const getClientId = (): string => {
  return import.meta.env.VITE_CLIENT_ID || 'ui-sharethrift';
};

// Apollo client instance
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: import.meta.env.NODE_ENV !== 'production'
});

// Base apollo link that adds standard custom headers
export const BaseApolloLink = (customHeaders?: CustomHeaders): ApolloLink => 
  setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        'x-client-id': getClientId(),
        'x-request-id': generateRequestId(),
        ...customHeaders
      }
    };
  });

// Apollo link to add authentication header
export const ApolloLinkToAddAuthHeader = (auth: AuthContextProps): ApolloLink => 
  setContext((_, { headers }) => {
    const accessToken = auth.isAuthenticated ? auth.user?.access_token : undefined;
    return {
      headers: {
        ...headers,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      }
    };
  });

// Apollo link to add a single custom header with conditional logic
export const ApolloLinkToAddCustomHeader = (
  headerName: string, 
  headerValue: string | null | undefined, 
  condition?: boolean
): ApolloLink => new ApolloLink((operation, forward) => {
  if (!headerValue || (condition !== undefined && condition === false)) {
    return forward(operation);
  }
  operation.setContext((prevContext: DefaultContext) => ({
    ...prevContext,
    headers: {
      ...(prevContext.headers || {}),
      [headerName]: headerValue
    }
  }));
  return forward(operation);
});

// Apollo link to add multiple custom headers
export const ApolloLinkToAddCustomHeaders = (headers: CustomHeaders): ApolloLink =>
  setContext((_, { headers: existingHeaders }) => {
    return {
      headers: {
        ...existingHeaders,
        ...headers
      }
    };
  });

// Terminating link for batch GraphQL requests
export const TerminatingApolloLinkForGraphqlServer = (config: ApolloClientConfig) => {
  const batchHttpLink = new BatchHttpLink({
    uri: config.uri,
    batchMax: config.batchMax || 15, // No more than 15 operations per batch
    batchInterval: config.batchInterval || 50 // Wait no more than 50ms after first batched operation
  });
  return from([removeTypenameFromVariables(), batchHttpLink]);
};

// Terminating link for standard GraphQL requests (non-batched)
export const TerminatingApolloLinkForStandardGraphql = (config: ApolloClientConfig) => {
  const httpLink = new HttpLink({
    uri: config.uri
  });
  return from([removeTypenameFromVariables(), httpLink]);
};

// Factory function to create a complete Apollo Link chain
export const createApolloLinkChain = (
  config: ApolloClientConfig,
  auth: AuthContextProps,
  useBatching: boolean = true
) => {
  const terminatingLink = useBatching 
    ? TerminatingApolloLinkForGraphqlServer(config)
    : TerminatingApolloLinkForStandardGraphql(config);

  return from([
    BaseApolloLink(config.customHeaders),
    ApolloLinkToAddAuthHeader(auth),
    terminatingLink
  ]);
};