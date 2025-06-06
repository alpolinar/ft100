import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
    GameState,
    InputConnectPlayer,
    InputCreateGame,
    InputMove,
} from "@ods/server-lib";
import { Effect } from "effect";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { UserStrategyReturnType } from "src/common/types/auth-types";
import { AuthGuard } from "../common/guards/auth.guard";
import { GameService } from "./game.service";

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

    @UseGuards(AuthGuard)
    @Mutation("connectPlayer")
    async connectPlayer(
        @Args("input") input: InputConnectPlayer,
        @CurrentUser() currentUser: UserStrategyReturnType
    ): Promise<GameState> {
        return await Effect.runPromise(
            this.gameService.connectPlayer(input.gameId, currentUser.user.id)
        );
    }

    @UseGuards(AuthGuard)
    @Mutation("sendMove")
    async sendMove(
        @Args("input") input: InputMove,
        @CurrentUser() currentUser: UserStrategyReturnType
    ): Promise<GameState> {
        return await Effect.runPromise(
            this.gameService.playerMove({
                gameId: input.gameId,
                value: input.value,
                playerId: currentUser.user.id,
            })
        );
    }
}
