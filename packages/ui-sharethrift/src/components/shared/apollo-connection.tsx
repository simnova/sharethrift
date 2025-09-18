import { type FC, useMemo } from "react";
import { ApolloClient, ApolloLink, ApolloProvider, from } from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import { useAuth } from "react-oidc-context";
import {
  ApolloLinkToAddAuthHeader,
  ApolloLinkToAddCustomHeader,
  BaseApolloLink,
  TerminatingApolloBatchLinkForGraphqlServer,
  TerminatingApolloHttpLinkForGraphqlServer,
} from "./apollo-client-links";
import { ApolloManualMergeCacheFix } from "./apollo-manual-merge-cache-fix";

const restLinkForCountryDataSource = new RestLink({ uri: `${import.meta.env.VITE_BLOB_STORAGE_CONFIG_URL}` });
const restLinkForHealthProfessionsDataSource = new RestLink({
  uri: `${import.meta.env.VITE_BLOB_STORAGE_CONFIG_URL}`,
  customFetch: (uri, options) => fetch(uri, { ...options, cache: "no-store" }),
});
const apolloBatchHttpLinkForGraphqlDataSource = TerminatingApolloBatchLinkForGraphqlServer({
  uri: `${import.meta.env.VITE_FUNCTION_ENDPOINT}`,
  batchMax: 15,
  batchInterval: 50,
});

const apolloHttpLinkForGraphqlDataSource = TerminatingApolloHttpLinkForGraphqlServer({
  uri: `${import.meta.env.VITE_FUNCTION_ENDPOINT}`,
});

export interface ApolloConnectionProps {
  children: React.ReactNode;
}
export const ApolloConnection: FC<ApolloConnectionProps> = (props: ApolloConnectionProps) => {
  const auth = useAuth();

  const access_token = auth.isAuthenticated ? auth.user?.access_token : undefined;

  /**
   * linkMap is a map of linkChain, where
   * - each linkChain has a terminating link that will make the request to the server
   * - there must be no forwarding link after the terminating link
   */
  const linkMap = useMemo(
    () => ({
      countries: restLinkForCountryDataSource,
      healthProfession: restLinkForHealthProfessionsDataSource,
      cacheEnabled: from([
        BaseApolloLink(),
        ApolloLinkToAddAuthHeader(access_token),
        ApolloLinkToAddCustomHeader("Cache-Enabled", "true"),
        apolloHttpLinkForGraphqlDataSource,
      ]),
      default: from([
        BaseApolloLink(),
        ApolloLinkToAddAuthHeader(access_token),
        ApolloLinkToAddCustomHeader("Cache-Enabled", "false"),
        apolloBatchHttpLinkForGraphqlDataSource,
      ]),
    }),
    [access_token]
  );

  const client = useMemo(
    () =>
      new ApolloClient({
        cache: ApolloManualMergeCacheFix,
        link: ApolloLink.split(
          (operation) => operation.getContext().headers?.["Cache-Enabled"] === "true",
          linkMap.cacheEnabled,
          ApolloLink.split(
            (operation) => operation.operationName in linkMap,
            new ApolloLink((operation) => {
              const link = linkMap[operation.operationName as keyof typeof linkMap] || linkMap.default;
              return link.request(operation);
            }),
            linkMap.default
          )
        ),
        devtools: { enabled: import.meta.env.NODE_ENV !== "production" },
      }),
    [access_token]
  );

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};
