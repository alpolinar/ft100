import { AuthenticatedUser } from "@ods/server-lib";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import Cookies from "universal-cookie";

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

const cookies = new Cookies();

export const useUserStore = create<UserStore>()(
    devtools(
        persist(
            (set) => ({
                ...defaultState,
                removeUser: () => set({ authedUser: null }),
                setUser: (authedUser) => {
                    cookies.set("ft100", authedUser.jwt, {
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
