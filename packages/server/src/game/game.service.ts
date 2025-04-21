import { Injectable } from "@nestjs/common";
import { GameState } from "@ods/server-lib";

@Injectable()
export class GameService {
    private gameState = new Map<string, GameState>();
    fetchGameState(id: string): GameState {
        const state = this.gameState.get(id);
        const game = !state
            ? this.gameState
                  .set(id, {
                      currentPlayerId: "1234",
                      currentTotal: 0,
                      id: "querty",
                      winnerId: "",
                  })
                  .get(id)
            : state;
        return game;
    }
}
