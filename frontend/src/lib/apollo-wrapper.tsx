"use client";

import { ApolloProvider } from "@apollo/client/react";
import { useApollo } from "./client";
import { ReactNode, useEffect, useState } from "react";

interface ApolloWrapperProps {
  children: ReactNode;
}

export default function ApolloWrapper({ children }: ApolloWrapperProps) {
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    setToken(localStorage.getItem("token") || ""); 
  }, []);

  const client = useApollo(token || ""); 

  if (token === null) return null; 

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
