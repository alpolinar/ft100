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
        fkPlayerTwoId: e.fkPlayerTwoId,
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
              }
            : undefined,
        fkPlayerTwoId: data.fkPlayerTwoId,
        playerTwo: data.playerTwo
            ? {
                  id: data.playerTwo.id,
                  username: data.playerTwo.username,
                  verified: data.playerTwo.verified,
                  email: data.playerTwo.email,
                  img: data.playerTwo.img,
                  lastLoginAt: data.playerTwo.lastLoginAt,
              }
            : undefined,
        winnerId: data.winnerId,
    };
}
