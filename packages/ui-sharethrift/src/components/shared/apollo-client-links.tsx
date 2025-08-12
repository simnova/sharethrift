import { ApolloClient, ApolloLink, type DefaultContext, InMemoryCache, from, HttpLink } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import type { AuthContextProps } from 'react-oidc-context';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { setContext } from '@apollo/client/link/context';

// Utility function to generate unique request IDs
const generateRequestId = (): string => {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Utility function to get client ID (can be enhanced to use actual client identification)
const getClientId = (): string => {
  return 'ui-sharethrift-client';
};

// Interface for custom headers configuration
interface CustomHeadersConfig {
  [key: string]: string | (() => string) | undefined;
}

// Default custom headers that are always added
const defaultCustomHeaders: CustomHeadersConfig = {
  'x-client-id': getClientId,
  'x-request-id': generateRequestId
};

// apollo client instance
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: import.meta.env.NODE_ENV !== 'production'
});


// base apollo link with automatic custom headers
// includes default headers and allows for additional custom headers
export const BaseApolloLink = (additionalHeaders: CustomHeadersConfig = {}): ApolloLink => 
  setContext((_, { headers }) => {
    const allCustomHeaders = { ...defaultCustomHeaders, ...additionalHeaders };
    const resolvedHeaders: Record<string, string> = {};

    // Resolve all custom headers (whether they are functions or values)
    Object.entries(allCustomHeaders).forEach(([key, value]) => {
      if (value !== undefined) {
        resolvedHeaders[key] = typeof value === 'function' ? value() : value;
      }
    });

    return {
      headers: {
        ...headers,
        ...resolvedHeaders
      }
    };
  });


// apollo link to add auth header
export const ApolloLinkToAddAuthHeader = (auth: AuthContextProps): ApolloLink => 
  setContext((_, { headers }) => {
    const access_token = auth.isAuthenticated ? auth.user?.access_token : undefined;
    return {
      headers: {
        ...headers,
        ...(access_token && { Authorization: `Bearer ${access_token}` })
      }
    };
  });

  export const ApolloLinkToAddCustomHeader = (headerName: string, headerValue: string | null | undefined, ifTrue?: boolean): ApolloLink => new ApolloLink((operation, forward) => {
  if(!headerValue || (ifTrue !== undefined && ifTrue === false)) {
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

// Standard HTTP Link for single GraphQL requests
// includes removeTypenameFromVariables link
export const TerminatingApolloLinkForStandardGraphqlServer = (config: { uri: string }) => {
  const httpLink = new HttpLink({
    uri: config.uri
  });
  return from([removeTypenameFromVariables(), httpLink]);
};

// Batch HTTP Link for batched GraphQL requests
// includes removeTypenameFromVariables link
export const TerminatingApolloLinkForBatchedGraphqlServer = (config: BatchHttpLink.Options) => {
  const batchHttpLink = new BatchHttpLink({
    uri: config.uri,
    batchMax: config.batchMax || 15, // No more than 15 operations per batch
    batchInterval: config.batchInterval || 50 // Wait no more than 50ms after first batched operation
  });
  return from([removeTypenameFromVariables(), batchHttpLink]);
};

// Backward compatibility alias
export const TerminatingApolloLinkForGraphqlServer = TerminatingApolloLinkForBatchedGraphqlServer;

// Export types and utilities for external use
export type { CustomHeadersConfig };
export { generateRequestId, getClientId, defaultCustomHeaders };