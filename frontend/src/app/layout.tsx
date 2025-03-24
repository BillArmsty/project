import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Sidebar from "@/components/Sidebar";
import ApolloWrapper from "@/lib/apollo-wrapper";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <ThemeProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ApolloWrapper>
            <div style={{ display: "flex", height: "100vh" }}>
              <Sidebar />
              <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
            </div>
          </ApolloWrapper>
        </body>
      </html>
    </ThemeProvider>
  );
}
