"use client";

import ApolloWrapper from "../lib/apollo-wrapper";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <ApolloWrapper>{children}</ApolloWrapper>;
} 