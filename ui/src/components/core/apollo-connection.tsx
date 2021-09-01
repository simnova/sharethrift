import React, { FC, useEffect } from "react";
import App from "../../App";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useMsal } from "../msal-react-lite";



const ApolloConnection: FC<any> = () => {
  const { getAuthToken, isLoggedIn } = useMsal();

  const withToken = setContext(async (_, { headers }) => {
    const token = await getAuthToken();
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : null,
      },
    };
  });

  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_FUNCTION_ENDPOINT}/api/graphql`,
  });

  const client = new ApolloClient({
    link: from([withToken, httpLink]),
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    if (!isLoggedIn) {
      (async () => {
        await client.resetStore(); //clear Apollo cache when user loggs off
      })();
    }
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

export default ApolloConnection;
