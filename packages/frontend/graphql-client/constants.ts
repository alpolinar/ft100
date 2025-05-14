import { env } from "@/env";
import {
    ApolloLink,
    DefaultOptions,
    HttpLink,
    concat,
    split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import Cookies from "universal-cookie";
import { v4 as uuidv4 } from "uuid";

type ClientHeaders = Readonly<{
    headers: Record<string, string | undefined>;
}>;

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

export const authMiddleware = ({ headers }: ClientHeaders) => {
    return new ApolloLink((operation, forward) => {
        const cookies = new Cookies();
        const token = cookies.get("ft100");

        operation.setContext({
            headers: {
                authorization: token ? `Bearer ${token}` : "",
                uuid: uuidv4(),
                "x-client-id": "ft100",
                ...headers,
            },
        });

        return forward(operation);
    });
};

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

export const getSsrLinks = ({ headers }: ClientHeaders) =>
    concat(authMiddleware({ headers }), httpLink);

export const getClientLinks = ({ headers }: ClientHeaders) =>
    wsLink
        ? concat(
              authMiddleware({ headers }),
              split(
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
          )
        : concat(authMiddleware({ headers }), httpLink);
