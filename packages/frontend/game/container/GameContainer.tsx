"use client";

import { GameState } from "@ods/server-lib";
import { GameStateListener } from "../providers/GameStateListener";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Route } from "@/common/routes";
import { isNullish } from "remeda";

export type GameContainerProps = Readonly<{ game: GameState }>;

export const GameContainer = ({ game }: GameContainerProps) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <Link href={Route.home}>
                    <Button>Quit</Button>
                </Link>
            </div>
            <hr />
            <div className="h-full p-4">
                <GameStateListener gameState={game}>
                    {({ state, error }) => {
                        return error ? (
                            <div>something went wrong</div>
                        ) : isNullish(state) ? (
                            <div>loading...</div>
                        ) : (
                            <div>id: {state.id}</div>
                        );
                    }}
                </GameStateListener>
            </div>
        </div>
    );
};
