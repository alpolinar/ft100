import { Args, Query, Resolver } from "@nestjs/graphql";
import { GameState } from "@ods/server-lib";
import { Effect } from "effect";
import { GameService } from "./game.service";

@Resolver()
export class GameResolver {
    constructor(private readonly gameService: GameService) {}

    @Query("fetchGameState")
    async fetchGameState(@Args("id") id: string): Promise<GameState> {
        return await Effect.runPromise(this.gameService.fetchGameState(id));
    }
}
