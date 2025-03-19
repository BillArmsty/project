// import { cookies } from "next/headers";
import ApolloWrapper from "@/lib/apollo-wrapper";



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const token = (await cookies()).get("token")?.value || "";

  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
