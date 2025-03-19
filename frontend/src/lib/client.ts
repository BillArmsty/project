"use client";

import { useMemo } from "react";
import { setContext } from "@apollo/client/link/context";
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";

/**
 * Create Apollo Client with a single HTTP link and authorization header
 * @param newToken - Token if provided, else an empty string
 * @returns ApolloClient
 */
export function createApolloClient(newToken: string) {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API, 
    credentials: "include",
  });

  const authLink = setContext((_req, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: newToken ? `Bearer ${newToken}` : "",
      },
    };
  });

  const link = authLink.concat(httpLink);

  return new ApolloClient({
    ssrMode: typeof window === "undefined", // Enable SSR mode
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
      query: {
        fetchPolicy: "cache-first",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
}

/**
 * Hook to create Apollo Client, ensuring SSR safety
 * @param token - Optional authentication token
 * @returns Apollo Client instance
 */
export function useApollo(token?: string): ApolloClient<NormalizedCacheObject> {
  return useMemo(() => {
    if (typeof window === "undefined") return createApolloClient(""); // Avoid SSR mismatches
    return createApolloClient(token!);
  }, [token]);
}
