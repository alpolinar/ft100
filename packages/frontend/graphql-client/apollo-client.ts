import { ApolloClient, InMemoryCache } from "@apollo/client";
import { getClientLinks, defaultOptions, Applications } from "./constants";

export const client = new ApolloClient({
    link: getClientLinks({ headers: {}, app: Applications.firstTo100 }),
    cache: new InMemoryCache({
        addTypename: false,
    }),
    defaultOptions,
});
