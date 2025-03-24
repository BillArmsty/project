"use client";

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { setAccessToken, getAccessToken, isTokenExpired } from '../utils/token';

/**
 * Create Apollo Client with a single HTTP link and authorization header
 * @param token - Authentication token, if available
 * @returns ApolloClient
 */
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
  credentials: "include",
});

// ✅ Refresh token logic
const refreshLink = new TokenRefreshLink({
  accessTokenField: "access_token",
  isTokenValidOrUndefined: async () => {
    const token = getAccessToken();
    return !token || !isTokenExpired();
  },
  fetchAccessToken: () => {
    return fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_API!.replace("/graphql", "")}/auth/refresh-token`, {
      method: "GET",
      credentials: "include",
    });
  },
  handleFetch: (newAccessToken) => {
    setAccessToken(newAccessToken);
  },
  handleError: (err) => {
    console.warn("Failed to refresh token", err);
  },
});

 const client = new ApolloClient({
  link: ApolloLink.from([refreshLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "no-cache", nextFetchPolicy: "no-cache" },
    query: { fetchPolicy: "no-cache" },
    mutate: { fetchPolicy: "no-cache" },
  },
  ssrMode: false,
});


export default client;

