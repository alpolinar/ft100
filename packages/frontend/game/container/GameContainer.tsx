"use client";

import { Route } from "@/common/routes";
import { Button } from "@/components/ui/button";
import { GameState } from "@ods/server-lib";
import Link from "next/link";
import GameView from "../views/GameView";

export type GameContainerProps = Readonly<{ game: GameState }>;

export function GameContainer({ game }: GameContainerProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <Link href={Route.home}>
                    <Button>Quit</Button>
                </Link>
            </div>
            <hr />
            <div className="h-full p-4">
                <GameView state={game} />
            </div>
        </div>
    );
}
