import {
    ApolloClient,
    InMemoryCache,
    registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { defaultOptions, httpLink } from "./constants";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
    return new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache({
            addTypename: false,
        }),
        defaultOptions,
    });
});
