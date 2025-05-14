import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GameState, InputCreateGame } from "@ods/server-lib";
import { Effect } from "effect";
import { GameService } from "./game.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../common/guards/auth.guard";

@Resolver()
export class GameResolver {
    constructor(private readonly gameService: GameService) {}

    @UseGuards(AuthGuard)
    @Query("fetchGameState")
    async fetchGameState(@Args("id") id: string): Promise<GameState> {
        return await Effect.runPromise(this.gameService.fetchGameState(id));
    }

    @UseGuards(AuthGuard)
    @Mutation("createGame")
    async createGame(
        @Args("input") input: InputCreateGame
    ): Promise<GameState> {
        return await Effect.runPromise(this.gameService.createGame(input));
    }
}
