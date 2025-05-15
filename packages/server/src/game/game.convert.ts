import { GameState } from "@ods/server-lib";
import { GameEntity } from "./game.entity";
import { GameAttributes } from "./game.model";

export function getGameAttributes(e: GameEntity): GameAttributes {
    return {
        id: e.id,
        currentTotal: e.currentTotal,
        currentPlayerId: e.currentPlayerId,
        winnerId: e.winnerId,
        winner: e.winner,
        gameId: e.gameId,
        fkPlayerOneId: e.fkPlayerOneId,
        playerOne: e.playerOne,
        fkPlayerTwoId: e.fkPlayerOneId,
        playerTwo: e.playerTwo,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        deletedAt: e.deletedAt,
    };
}

export function convertToGameState(data: GameAttributes): GameState {
    return {
        id: data.id,
        gameId: data.gameId,
        currentTotal: data.currentTotal,
        currentPlayerId: data.currentPlayerId,
        fkPlayerOneId: data.fkPlayerOneId,
        playerOne: data.playerOne
            ? {
                  id: data.playerOne.id,
                  username: data.playerOne.username,
                  verified: data.playerOne.verified,
                  email: data.playerOne.email,
                  img: data.playerOne.img,
                  lastLoginAt: data.playerOne.lastLoginAt,
                  token: data.playerOne.token,
              }
            : undefined,
        fkPlayerTwoId: data.fkPlayerOneId,
        playerTwo: data.playerOne
            ? {
                  id: data.playerOne.id,
                  username: data.playerOne.username,
                  verified: data.playerOne.verified,
                  email: data.playerOne.email,
                  img: data.playerOne.img,
                  lastLoginAt: data.playerOne.lastLoginAt,
                  token: data.playerOne.token,
              }
            : undefined,
        winnerId: data.winnerId,
    };
}
