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

import { BatchHttpLink } from "@apollo/client/link/batch-http";



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
  /*
  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_FUNCTION_ENDPOINT}`,
  });
  */
  const httpLink = new BatchHttpLink({ 
    uri: `${process.env.REACT_APP_FUNCTION_ENDPOINT}`,
    batchMax: 15, // No more than 15 operations per batch
    batchInterval: 50 // Wait no more than 50ms after first batched operation
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
