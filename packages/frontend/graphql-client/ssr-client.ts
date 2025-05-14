import {
    ApolloClient,
    InMemoryCache,
    registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { headers } from "next/headers";
import { fromEntries } from "remeda";
import Cookies from "universal-cookie";
import { v4 as uuidv4 } from "uuid";
import { defaultOptions, getSsrLinks } from "./constants";

export const { getClient, query, PreloadQuery } = registerApolloClient(
    async () => {
        const hdrs = await headers();
        const appHeaders = fromEntries(hdrs.entries().toArray());
        const host = appHeaders.host;
        const userAgent = appHeaders["user-agent"];
        const appCookies = new Cookies(appHeaders.cookie);
        const token = appCookies.get("ft100");

        return new ApolloClient({
            link: getSsrLinks({
                headers: {
                    uuid: uuidv4(),
                    "x-request-host": host,
                    authorization: `Bearer ${token}`,
                    "user-agent": userAgent,
                },
            }),
            cache: new InMemoryCache({
                addTypename: false,
            }),
            defaultOptions,
        });
    }
);
