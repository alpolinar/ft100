"use client";

import { client } from "@/graphql-client/apollo-client";
import { ApolloProvider } from "@apollo/client";

export default function ApolloClientProvider({
    children,
}: React.PropsWithChildren) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
