import { GameState } from "@ods/server-lib";
import { GameStateListener } from "../providers/GameStateListener";
import { isNullish } from "remeda";

export type GameProps = Readonly<{ state: GameState }>;

export default function GameView({ state }: GameProps) {
    return (
        <GameStateListener gameState={state}>
            {({ state, error }) => {
                if (error) {
                    return <div>something went wrong</div>;
                }
                if (isNullish(state)) {
                    return <div>loading...</div>;
                }
                return <div>id: {state.id}</div>;
            }}
        </GameStateListener>
    );
}
