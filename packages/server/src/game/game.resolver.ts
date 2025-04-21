import { Args, Query, Resolver } from "@nestjs/graphql";
import { GameService } from "./game.service";
import { GameState } from "@ods/server-lib";

@Resolver()
export class GameResolver {
    constructor(private readonly gameService: GameService) {}

    @Query(() => GameState)
    fetchGameState(@Args("id") id: string): GameState {
        return this.gameService.fetchGameState(id);
    }
}
