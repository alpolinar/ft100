"use client";

import { Route } from "@/common/routes";
import { Button } from "@/components/ui/button";
import { client } from "@/graphql-client/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { GameState } from "@ods/server-lib";
import Link from "next/link";
import { GameStateListener } from "./GameStateListener";

export type GameContainerProps = Readonly<{ game: GameState }>;

export const GameContainer = ({ game }: GameContainerProps) => {
    return (
        <ApolloProvider client={client}>
            <div className="flex flex-col h-full">
                <div className="p-4">
                    <Link href={Route.home}>
                        <Button>Quit</Button>
                    </Link>
                </div>
                <hr />
                <div className="h-full p-4">
                    <GameStateListener channelId={game.id}>
                        {({ state, loading }) => {
                            return loading ? (
                                <div>loading...</div>
                            ) : (
                                <div>id: {state?.id}</div>
                            );
                        }}
                    </GameStateListener>
                </div>
            </div>
        </ApolloProvider>
    );
};
