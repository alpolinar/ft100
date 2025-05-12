import { GameState } from "@ods/server-lib";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Model = {
    game: GameState | null;
};

type Actions = Readonly<{
    setGame: (game: GameState) => void;
    removeGame: () => void;
}>;

type GameStore = Model & Actions;

const defaultState: Model = {
    game: null,
};

export const useGameStore = create<GameStore>()(
    devtools(
        persist(
            (set) => ({
                ...defaultState,
                removeGame: () => set({ game: null }),
                setGame: (game) => set({ game }),
            }),
            {
                name: "game-state",
            }
        ),
        { name: "GameStore" }
    )
);
