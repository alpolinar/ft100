import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GameState, InputCreateGame } from "@ods/server-lib";
import { Effect } from "effect";
import { GameService } from "./game.service";

@Resolver()
export class GameResolver {
    constructor(private readonly gameService: GameService) {}

    @Query("fetchGameState")
    async fetchGameState(@Args("id") id: string): Promise<GameState> {
        return await Effect.runPromise(this.gameService.fetchGameState(id));
    }

    @Mutation("createGame")
    async createGame(
        @Args("input") input: InputCreateGame
    ): Promise<GameState> {
        return await Effect.runPromise(this.gameService.createGame(input));
    }
}
