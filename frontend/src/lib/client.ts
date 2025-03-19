"use client";

import { useMemo } from "react";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

/**
 * Create Apollo Client with a single HTTP link and authorization header
 * @param token - Authentication token, if available
 * @returns ApolloClient
 */
export function createApolloClient(token: string) {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API!,
    credentials: "include",
  });

  const authLink = setContext((_req, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
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
 * @param token - Optional authentication token
 * @returns Apollo Client instance
 */
export function useApollo(token?: string): ApolloClient<NormalizedCacheObject> {
  const authToken = useMemo(() => {
    if (typeof window !== "undefined") {
      return token || localStorage.getItem("token") || "";
    }
    return token || ""; // Ensure a fallback value during SSR
  }, [token]);

  return useMemo(() => createApolloClient(authToken), [authToken]);
}
