import {
    GamePhase,
    GameState,
    useConnectPlayerMutation,
} from "@ods/server-lib";
import { useEffect } from "react";
import { isNullish } from "remeda";
import { match } from "ts-pattern";
import { GameStateListener } from "../providers/GameStateListener";
import { useUserStore } from "@/user/zustand/store";
import { useGameStore } from "../zustand/store";
import GameStartCountdown from "./GameStartCountdown";

export type GameProps = Readonly<{ state: GameState }>;

export default function GameView({ state }: GameProps) {
    const authedUser = useUserStore((state) => state.authedUser);
    const setGame = useGameStore((state) => state.setGame);
    const [connectPlayer] = useConnectPlayerMutation();

    useEffect(() => {
        if (!authedUser) return;

        const { fkPlayerOneId, fkPlayerTwoId } = state;

        const isAlreadyInGame =
            fkPlayerOneId === authedUser.user.id ||
            fkPlayerTwoId === authedUser.user.id;

        if (!isAlreadyInGame) {
            console.log("if");
            connectPlayer({
                variables: {
                    input: {
                        gameId: state.gameId,
                    },
                },
                onCompleted: (data) => {
                    setGame(data.connectPlayer);
                },
            });
        }
    }, [state, connectPlayer, authedUser, setGame]);

    return (
        <GameStateListener gameState={state}>
            {({ state, error }) => {
                if (error) {
                    return <div>something went wrong</div>;
                }
                if (isNullish(state)) {
                    return <div>loading...</div>;
                }

                // TODO:
                // 1. show waiting state if player 2 hasn't joined
                // 2. show player has joined and countdown for game starting
                // 3. build a janken mini-game to determine who goes first

                return match(state)
                    .with({ phase: GamePhase.WaitingForPlayers }, () => (
                        <div>waiting for players</div>
                    ))
                    .with(
                        { phase: GamePhase.CountdownToStart },
                        ({ countdownEndsAt, serverTime }) => (
                            <GameStartCountdown
                                countdownEndsAt={countdownEndsAt}
                                serverTime={serverTime}
                            />
                        )
                    )
                    .with({ phase: GamePhase.InProgress }, () => (
                        <div>playing game ui</div>
                    ))
                    .with({ phase: GamePhase.Complete }, () => (
                        <div>game ended</div>
                    ))
                    .exhaustive();
            }}
        </GameStateListener>
    );
}
