import { getGamePhase } from "@/utils/helpers";
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

export type GameProps = Readonly<{ state: GameState }>;

export default function GameView({ state }: GameProps) {
    const authedUser = useUserStore((state) => state.authedUser);
    const [connectPlayer] = useConnectPlayerMutation();

    useEffect(() => {
        if (!authedUser) return;

        const { fkPlayerOneId, fkPlayerTwoId } = state;

        const isAlreadyInGame =
            fkPlayerOneId === authedUser.user.id ||
            fkPlayerTwoId === authedUser.user.id;

        if (!isAlreadyInGame) {
            connectPlayer({
                variables: {
                    input: {
                        gameId: state.gameId,
                    },
                },
            });
        }
    }, [state, connectPlayer, authedUser]);

    return (
        <GameStateListener gameState={state}>
            {({ state, error }) => {
                if (error) {
                    return <div>something went wrong</div>;
                }
                if (isNullish(state)) {
                    return <div>loading...</div>;
                }

                const phase = getGamePhase(state);

                // TODO:
                // 1. show waiting state if player 2 hasn't joined
                // 2. show player has joined and countdown for game starting
                // 3. build a janken mini-game to determine who goes first

                return match(phase)
                    .with(GamePhase.WaitingForPlayers, () => (
                        <div>waiting for players</div>
                    ))
                    .with(GamePhase.CountdownToStart, () => (
                        <div>count down ui</div>
                    ))
                    .with(GamePhase.DeterminingFirstPlayer, () => (
                        <div>determining first player</div>
                    ))
                    .with(GamePhase.InProgress, () => (
                        <div>playing game ui</div>
                    ))
                    .with(GamePhase.Complete, () => <div>game ended</div>)
                    .exhaustive();
            }}
        </GameStateListener>
    );
}
