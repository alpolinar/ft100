"use client";

import { ApolloError } from "@apollo/client";
import { GameState, useListenToGameUpdatesSubscription } from "@ods/server-lib";

export const GameStateListener = ({
    channelId,
    children,
}: Readonly<{
    channelId: string;
    children: React.FC<
        Readonly<{
            state?: GameState;
            loading: boolean;
            error?: ApolloError;
        }>
    >;
}>) => {
    const { data, loading, error } = useListenToGameUpdatesSubscription({
        variables: {
            channelId,
        },
    });

    return children({
        state: data?.listenToGameUpdates,
        loading,
        error,
    });
};
