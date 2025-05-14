import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getClientLinks, defaultOptions } from "./constants";

export const client = new ApolloClient({
    link: getClientLinks({ headers: {} }),
    cache: new InMemoryCache({
        addTypename: false,
    }),
    defaultOptions,
});
