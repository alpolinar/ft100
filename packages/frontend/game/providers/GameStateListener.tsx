import { ApolloError } from "@apollo/client";
import { GameState, useListenToGameUpdatesSubscription } from "@ods/server-lib";
import { useEffect, useState } from "react";

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
    const [state, setState] = useState<GameState | null>(gameState);
    const { data, error } = useListenToGameUpdatesSubscription({
        variables: {
            channelId: gameState.id,
        },
        shouldResubscribe: true,
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (data?.listenToGameUpdates) {
            setState(data.listenToGameUpdates);
        }
    }, [data]);

    return children({
        state,
        error,
    });
}
