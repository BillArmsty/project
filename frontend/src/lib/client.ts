"use client";

import { useMemo } from "react";
import { setContext } from "@apollo/client/link/context";
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";

/**
 * Create Apollo Client with a single HTTP link and authorization header
 * @param newToken  - new token if provided the user is authenticated, else not
 * @returns ApolloClient
 */
export function createApolloClient(newToken: string) {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API!, 
    credentials: "include",
  });

  const authLink = setContext((_req, { headers }) => ({
    headers: {
      ...headers,
      authorization: newToken ? `Bearer ${newToken}` : "",
    },
  }));

  return new ApolloClient({
    ssrMode: false, 
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}

/**
 * React Hook to create Apollo Client with a token
 * @param token  - Optional authentication token
 * @returns Apollo Client instance
 */
export function useApollo(token?: string): ApolloClient<NormalizedCacheObject> {
  return useMemo(() => createApolloClient(token || ""), [token]);
}
