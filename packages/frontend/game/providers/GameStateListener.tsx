"use client";

import { ApolloError } from "@apollo/client";
import { GameState, useListenToGameUpdatesSubscription } from "@ods/server-lib";
import { useGameStore } from "../store/store";
import { useEffect } from "react";

export const GameStateListener = ({
    gameState,
    children,
}: Readonly<{
    gameState: GameState;
    children: React.FC<
        Readonly<{
            state: GameState | null;
            loading: boolean;
            error?: ApolloError;
        }>
    >;
}>) => {
    const game = useGameStore((state) => state.game);
    const setGame = useGameStore((state) => state.setGame);

    const { data, error } = useListenToGameUpdatesSubscription({
        variables: {
            channelId: gameState.id,
        },
    });

    useEffect(() => {
        if (!game) {
            setGame(data?.listenToGameUpdates || gameState);
        }
    }, [data, game, gameState, setGame]);

    return children({
        state: game,
        loading: game === null,
        error,
    });
};
