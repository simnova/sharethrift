import { ApolloLink, ApolloProvider } from "@apollo/client";
import { type FC, useEffect, useMemo } from "react";
import { useAuth } from "react-oidc-context";
import { 
  client, 
  createApolloLinkChain, 
  type ApolloClientConfig,
  type CustomHeaders
} from "./apollo-client-links";

export interface ApolloConnectionProps {
  children: React.ReactNode;
}

export const ApolloConnection: FC<ApolloConnectionProps> = (props: ApolloConnectionProps) => {
  const auth = useAuth();

  // Configuration for Apollo Client
  const apolloConfig: ApolloClientConfig = useMemo(() => ({
    uri: `${import.meta.env.VITE_FUNCTION_ENDPOINT}`,
    batchMax: 15,
    batchInterval: 50,
    customHeaders: {
      'x-app-version': import.meta.env.VITE_APP_VERSION || '1.0.0',
      // Add more custom headers as needed
    } as CustomHeaders
  }), []);

  // Create the main GraphQL link chain
  const apolloLinkChainForGraphqlDataSource = useMemo(() => 
    createApolloLinkChain(apolloConfig, auth, true), // true for batching
    [apolloConfig, auth]
  );

  // Link map for different data sources (extendable for future needs)
  const linkMap = useMemo(() => ({  
    default: apolloLinkChainForGraphqlDataSource  
  }), [apolloLinkChainForGraphqlDataSource]);

  // Dynamic link that can route operations to different endpoints
  const updateLink = useMemo(() => {  
    return ApolloLink.from([  
      ApolloLink.split(  
        // Route operations based on operation name or context
        // For now, all operations use the default GraphQL endpoint
        (operation) => operation.operationName in linkMap,  
        new ApolloLink((operation, forward) => {  
          const link = linkMap[operation.operationName as keyof typeof linkMap] || linkMap.default;  
          return link.request(operation, forward);  
        }),  
        apolloLinkChainForGraphqlDataSource  
      )  
    ]);  
  }, [linkMap, apolloLinkChainForGraphqlDataSource]); 

  // Update the Apollo Client link whenever auth changes
  useEffect(() => {
    client.setLink(updateLink);
  }, [updateLink]);

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};
