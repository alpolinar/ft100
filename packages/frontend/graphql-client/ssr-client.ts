import {
    ApolloClient,
    InMemoryCache,
    registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { headers } from "next/headers";
import { fromEntries } from "remeda";
import Cookies from "universal-cookie";
import {
    Applications,
    defaultOptions,
    getCookies,
    getSsrLinks,
} from "./constants";

export const { getClient, query, PreloadQuery } = registerApolloClient(
    async () => {
        const hdrs = await headers();
        const appHeaders = fromEntries(hdrs.entries().toArray());
        const host = appHeaders.host;
        const userAgent = appHeaders["user-agent"];
        const cookies = new Cookies(appHeaders.cookie);
        const appCookies = getCookies(Applications.firstTo100);
        const token = cookies.get(appCookies.jwt);
        const uuid = cookies.get(appCookies.uuid);

        return new ApolloClient({
            link: getSsrLinks({
                app: Applications.firstTo100,
                headers: {
                    uuid,
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
