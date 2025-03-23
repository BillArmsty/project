import { Inter } from "next/font/google";
import "../styles/globals.css";
import ClientLayout from "./client-layout";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ThemeProvider>
  );
}
