import { env } from "@/env";
import { DefaultOptions, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
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

export const wsLink =
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

export const httpLink = new HttpLink({
    uri: `${getServerEndpoint()}/api`,
});

export const clientLinks = wsLink
    ? split(
          ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                  definition.kind === "OperationDefinition" &&
                  definition.operation === "subscription"
              );
          },
          wsLink,
          httpLink
      )
    : httpLink;

export const defaultOptions: DefaultOptions = {
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
};
