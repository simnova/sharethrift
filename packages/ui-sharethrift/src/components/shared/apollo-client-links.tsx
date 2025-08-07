import { ApolloClient, ApolloLink, type DefaultContext, InMemoryCache, from } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { setContext } from '@apollo/client/link/context';

// apollo client instance
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: import.meta.env.NODE_ENV !== 'production'
});


// base apollo link with no customizations
// could be used as a base for the link chain
export const BaseApolloLink = (): ApolloLink => setContext((_, { headers }) => {
  return {
    headers: {
      ...headers
    }
  };
});


// apollo link to add auth header
export const ApolloLinkToAddAuthHeader = (auth: any): ApolloLink => 
  setContext((_, { headers }) => {
    // Handle both OIDC and simple auth user structures
    let access_token: string | undefined;
    
    if (auth.isAuthenticated) {
      // For OIDC auth
      if (auth.user?.access_token) {
        access_token = auth.user.access_token;
      }
      // For simple auth or other structures
      else if (typeof auth.user === 'object' && auth.user?.access_token) {
        access_token = auth.user.access_token;
      }
    }
    
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

// apollo link to batch graphql requests
// includes removeTypenameFromVariables link
export const TerminatingApolloLinkForGraphqlServer= (config: BatchHttpLink.Options) => {
  const batchHttpLink = new BatchHttpLink({
    uri: config.uri,
    batchMax: config.batchMax, // No more than 15 operations per batch
    batchInterval: config.batchInterval // Wait no more than 50ms after first batched operation
  });
  return from([removeTypenameFromVariables(), batchHttpLink]);
};