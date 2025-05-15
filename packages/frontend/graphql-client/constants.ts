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
import { match } from "ts-pattern";
import Cookies from "universal-cookie";
import { v4 as uuidv4 } from "uuid";

export enum Applications {
    firstTo100 = "firstTo100",
}

export type AppCookies = Readonly<{
    uuid: string;
    jwt: string;
}>;

export const ft100Cookies: AppCookies = {
    jwt: "385c91cc81f6442cbdd4fe94b99fdc4d",
    uuid: "a903014e16ad47c2809f71382da31b62",
};

type ClientHeaders = Readonly<{
    headers: Record<string, string | undefined>;
    app: Applications;
}>;

export const getCookies = (app: Applications) => {
    return match(app)
        .with(Applications.firstTo100, () => ft100Cookies)
        .exhaustive();
};

export const getJwtToken = (app: Applications) => {
    const cookies = new Cookies();
    const { jwt } = getCookies(app);
    return cookies.get(jwt);
};

export const getUuid = (app: Applications) => {
    const cookies = new Cookies();
    const { uuid } = getCookies(app);
    return cookies.get(uuid);
};

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

export const authMiddleware = ({ headers, app }: ClientHeaders) => {
    return new ApolloLink((operation, forward) => {
        const token = getJwtToken(app);
        const uuid = getUuid(app);

        operation.setContext({
            headers: {
                authorization: token ? `Bearer ${token}` : "",
                uuid,
                "x-client-id": app,
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

export const getSsrLinks = ({ headers, app }: ClientHeaders) =>
    concat(authMiddleware({ headers, app }), httpLink);

export const getClientLinks = ({ headers, app }: ClientHeaders) =>
    wsLink
        ? concat(
              authMiddleware({ headers, app }),
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
        : concat(authMiddleware({ headers, app }), httpLink);
