import { from, ApolloLink, ApolloProvider } from "@apollo/client";
import { type FC, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "react-oidc-context";
// import { useParams } from "react-router-dom";
import { 
  ApolloLinkToAddAuthHeader, 
  client, 
  BaseApolloLink, 
  TerminatingApolloLinkForBatchedGraphqlServer,
  TerminatingApolloLinkForStandardGraphqlServer,
  type CustomHeadersConfig 
} from "./apollo-client-links"

export interface ApolloConnectionProps {
  children: React.ReactNode;
  customHeaders?: CustomHeadersConfig;
  useBatchedRequests?: boolean; // Whether to use batched or standard HTTP link
}
export const ApolloConnection: FC<ApolloConnectionProps> = (props: ApolloConnectionProps) => {
  const { children, customHeaders = {}, useBatchedRequests = true } = props;
  const auth = useAuth();
//   const params = useParams(); // useParams.memberId won't work here because ApolloConnection wraps the Routes, not inside a Route

  // Memoize the terminating link based on configuration
  const terminatingLink = useMemo(() => {
    const endpoint = import.meta.env.VITE_FUNCTION_ENDPOINT || '';
    
    if (useBatchedRequests) {
      return TerminatingApolloLinkForBatchedGraphqlServer({
        uri: endpoint,
        batchMax: 15,
        batchInterval: 50
      });
    } else {
      return TerminatingApolloLinkForStandardGraphqlServer({
        uri: endpoint
      });
    }
  }, [useBatchedRequests]);

  // Memoize the Apollo link chain
  const apolloLinkChainForGraphqlDataSource = useMemo(() => {
    return from([
      BaseApolloLink(customHeaders),
      ApolloLinkToAddAuthHeader(auth),
      // ApolloLinkToAddCustomHeader('community', communityId, (communityId !== 'accounts')),
      // ApolloLinkToAddCustomHeader('member', memberId),
      terminatingLink
    ]);
  }, [auth, customHeaders, terminatingLink]);

  const linkMap = useMemo(() => ({  
    default: apolloLinkChainForGraphqlDataSource  
  }), [apolloLinkChainForGraphqlDataSource]);

  const updateLink = useCallback(() => {  
    return ApolloLink.from([  
      ApolloLink.split(  
        // various options to split:
        // 1. use a custom property in context: (operation) => operation.getContext().dataSource === some DataSourceEnum,
        // 2. check for string name of the query if it is named: (operation) => operation.operationName === "CountryDetails",
        (operation) => operation.operationName in linkMap,  
        new ApolloLink((operation, forward) => {  
          const link = linkMap[operation.operationName as keyof typeof linkMap] || linkMap.default;  
          return link.request(operation, forward);  
        }),  
        apolloLinkChainForGraphqlDataSource  
      )  
    ]);  
  }, [linkMap, apolloLinkChainForGraphqlDataSource]);

  useEffect(() => {
    client.setLink(updateLink());
  }, [updateLink]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
