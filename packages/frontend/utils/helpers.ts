import { GamePhase, GameState } from "@ods/server-lib";

export function generateGameId(length = 10): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    return Array.from(array, (byte) => chars[byte % chars.length])
        .join("")
        .toUpperCase();
}

export function getGamePhase(state: GameState): GamePhase {
    const { fkPlayerOneId, fkPlayerTwoId, winnerId, currentPlayerId } = state;

    if (!fkPlayerOneId || !fkPlayerTwoId) {
        return GamePhase.WaitingForPlayers;
    }

    if (winnerId) {
        return GamePhase.Complete;
    }

    if (!currentPlayerId) {
        return GamePhase.DeterminingFirstPlayer;
    }

    return GamePhase.InProgress;
}
