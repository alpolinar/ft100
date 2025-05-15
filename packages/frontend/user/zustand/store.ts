import { AuthenticatedUser } from "@ods/server-lib";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import Cookies from "universal-cookie";
import { Applications, getCookies } from "@/graphql-client/constants";

type Model = {
    authedUser: AuthenticatedUser | null;
};

type Actions = Readonly<{
    setUser: (user: AuthenticatedUser) => void;
    removeUser: () => void;
}>;

type UserStore = Model & Actions;

const defaultState: Model = {
    authedUser: null,
};

const appCookies = getCookies(Applications.firstTo100);
const cookies = new Cookies();

export const useUserStore = create<UserStore>()(
    devtools(
        persist(
            (set) => ({
                ...defaultState,
                removeUser: () => {
                    cookies.remove(appCookies.jwt, { path: "/", secure: true });
                    return set(defaultState);
                },
                setUser: (authedUser) => {
                    cookies.set(appCookies.jwt, authedUser.jwt, {
                        path: "/",
                        maxAge: 2592000, // One Month
                        secure: true,
                    });
                    return set({ authedUser });
                },
            }),
            { name: "user-state" }
        ),
        { name: "UserStore" }
    )
);
