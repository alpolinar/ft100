import { env } from "@/env";
import { ApolloClient, concat, HttpLink, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const getWsServerEndpoint = () => {
    if (env.NEXT_PUBLIC_SERVER_ENDPOINT) {
        return env.NEXT_PUBLIC_SERVER_ENDPOINT;
    }
    try {
        if (window.location.protocol === "https:") {
            return `wss://${window.location.host}`;
        }
        return `ws://localhost:${env.NEXT_PUBLIC_SERVER_PORT}`;
    } catch {
        return `ws://localhost:${env.NEXT_PUBLIC_SERVER_PORT}`;
    }
};

const wsLink =
    typeof window !== "undefined"
        ? new GraphQLWsLink(
              createClient({
                  url: `${getWsServerEndpoint()}/api/sub`,
              })
          )
        : undefined;

const getServerEndpoint = (): string => {
    if (env.NEXT_PUBLIC_SERVER_ENDPOINT) {
        return env.NEXT_PUBLIC_SERVER_ENDPOINT;
    }
    try {
        if (window.location.protocol === "https:") {
            return window.location.origin;
        }
        return `http://localhost:${env.NEXT_PUBLIC_SERVER_PORT}`;
    } catch {
        return `http://localhost:${env.NEXT_PUBLIC_SERVER_PORT}`;
    }
};

const httpLink = new HttpLink({
    uri: getServerEndpoint(),
});

export const client = new ApolloClient({
    link: wsLink ? concat(wsLink, httpLink) : httpLink,
    cache: new InMemoryCache({
        addTypename: false,
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "no-cache",
            errorPolicy: "ignore",
        },
        query: {
            fetchPolicy: "no-cache",
            errorPolicy: "all",
        },
        mutate: {
            fetchPolicy: "no-cache",
            errorPolicy: "all",
        },
    },
});
