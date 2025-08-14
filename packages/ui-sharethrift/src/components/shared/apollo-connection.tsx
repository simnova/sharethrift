import React from "react";
import type { FC } from "react";
import { ApolloLink, ApolloProvider, from, ApolloClient, InMemoryCache } from "@apollo/client";
import { useAuth } from "react-oidc-context";
import {
  ApolloLinkToAddAuthHeader,
  ApolloLinkToAddCustomHeader,
  BaseApolloLink,
  TerminatingApolloBatchLinkForGraphqlServer,
  TerminatingApolloHttpLinkForGraphqlServer,
} from "./apollo-client-links";

const apolloBatchHttpLinkForGraphqlDataSource =
  TerminatingApolloBatchLinkForGraphqlServer({
    uri: `${import.meta.env.VITE_FUNCTION_ENDPOINT}`,
    batchMax: 15,
    batchInterval: 50,
  });

const apolloHttpLinkForGraphqlDataSource =
  TerminatingApolloHttpLinkForGraphqlServer({
    uri: `${import.meta.env.VITE_FUNCTION_ENDPOINT}`,
  });

export interface ApolloConnectionProps {
  children: React.ReactNode;
}

export const ApolloConnection: FC<ApolloConnectionProps> = ({ children }) => {
  const auth = useAuth();

  // Build linkMap directly here so it's ready before rendering
  const linkMap = {
    cacheEnabled: from([
      BaseApolloLink(),
      ApolloLinkToAddAuthHeader(auth),
      ApolloLinkToAddCustomHeader("Cache-Enabled", "true"),
      apolloHttpLinkForGraphqlDataSource,
    ]),
    default: from([
      BaseApolloLink(),
      ApolloLinkToAddAuthHeader(auth),
      ApolloLinkToAddCustomHeader("Cache-Enabled", "false"),
      apolloBatchHttpLinkForGraphqlDataSource,
    ]),
  };

  const finalLink = ApolloLink.split(
    (operation) => {
      const operationContext = operation.getContext();
      const cacheHeader = operationContext.headers?.["cache-enabled"];
      return cacheHeader === "true";
    },
    linkMap.cacheEnabled,
    ApolloLink.split(
      (operation) => operation.operationName in linkMap,
      new ApolloLink((operation) => {
        const link =
          linkMap[operation.operationName as keyof typeof linkMap] ||
          linkMap.default;
        return link.request(operation);
      }),
      linkMap.default
    )
  );

  const client = new ApolloClient({
    link: finalLink,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
