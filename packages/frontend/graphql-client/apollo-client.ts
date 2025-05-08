import { ApolloClient, InMemoryCache } from "@apollo/client";
import { clientLinks, defaultOptions } from "./constants";

export const client = new ApolloClient({
    link: clientLinks,
    cache: new InMemoryCache({
        addTypename: false,
    }),
    defaultOptions,
});
