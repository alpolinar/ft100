"use client";

import { Route } from "@/common/routes";
import { Button } from "@/components/ui/button";
import { generateGameId } from "@/utils/helpers";
import { useCreateGameMutation } from "@ods/server-lib";
import Link from "next/link";
import { join } from "node:path";
import { useState } from "react";
import { useGameStore } from "../store/store";

const GameDashboardContainer = () => {
    const [gameId, setGameId] = useState("");
    const { setGame } = useGameStore();

    const [createGameMutation] = useCreateGameMutation();

    const handleCreateGame = () => {
        const gameId = generateGameId();
        createGameMutation({
            variables: {
                input: {
                    gameId,
                },
            },
            onCompleted: ({ createGame }) => {
                setGameId(gameId);
                setGame(createGame);
            },
            onError: (err) => {
                setGameId("");
                console.log("failed to create game", err.message);
            },
        });
    };

    return (
        <div>
            <p>build a UI for creating a game and a join button</p>
            <Button onClick={handleCreateGame} disabled={gameId !== ""}>
                create game
            </Button>
            <Link href={join(Route.join, gameId)}>
                <Button disabled={!gameId}>Join</Button>
            </Link>
        </div>
    );
};

export default GameDashboardContainer;
