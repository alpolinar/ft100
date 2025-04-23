import { GameState } from "@ods/server-lib";
import { GameEntity } from "./game.entity";

export const convertToGameState = (e: GameEntity): GameState => {
    return {
        id: e.id,
        currentTotal: e.currentTotal,
        currentPlayerId: e.currentPlayerId,
        winnerId: e.winnerId,
        gameId: e.gameId,
    };
};
