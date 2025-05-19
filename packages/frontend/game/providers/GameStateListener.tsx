import { ApolloError } from "@apollo/client";
import { GameState, useListenToGameUpdatesSubscription } from "@ods/server-lib";
import { useGameStore } from "../zustand/store";
import { useEffect, useRef } from "react";

export type GameStateListenerProps = Readonly<{
    gameState: GameState;
    children: React.FC<
        Readonly<{
            state: GameState | null;
            error?: ApolloError;
        }>
    >;
}>;

export function GameStateListener({
    gameState,
    children,
}: GameStateListenerProps) {
    const game = useGameStore((state) => state.game);
    const setGame = useGameStore((state) => state.setGame);

    const didInit = useRef(false);

    const { data, error } = useListenToGameUpdatesSubscription({
        variables: {
            channelId: gameState.id,
        },
        shouldResubscribe: true,
    });

    useEffect(() => {
        if (!didInit.current) {
            if (!game) {
                setGame(gameState);
            }
            didInit.current = true;
        }
    }, [game, gameState, setGame]);

    useEffect(() => {
        if (data?.listenToGameUpdates) {
            setGame(data.listenToGameUpdates);
        }
    }, [data, setGame]);

    return children({
        state: game,
        error,
    });
}
