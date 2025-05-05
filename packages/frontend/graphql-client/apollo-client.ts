import { ApolloClient, InMemoryCache, concat } from "@apollo/client";
import { defaultOptions, httpLink, wsLink } from "./constants";

export const client = new ApolloClient({
    link: wsLink ? concat(wsLink, httpLink) : httpLink,
    cache: new InMemoryCache({
        addTypename: false,
    }),
    defaultOptions,
});
