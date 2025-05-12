import { AuthenticatedUser } from "@ods/server-lib";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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

export const useUserStore = create<UserStore>()(
    devtools(
        persist(
            (set) => ({
                ...defaultState,
                removeUser: () => set({ authedUser: null }),
                setUser: (authedUser) => set({ authedUser }),
            }),
            { name: "user-state" }
        ),
        { name: "UserStore" }
    )
);
