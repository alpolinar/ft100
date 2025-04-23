import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { GameState, InputCreateGame } from "@ods/server-lib";
import { pipe } from "effect";
import { Effect, fail, succeed } from "effect/Effect";
import * as O from "effect/Option";
import { GameDataAccessLayer, GameFilterOptions } from "./game.dal";

@Injectable()
export class GameService {
    constructor(
        @Inject(GameDataAccessLayer)
        private readonly gameDal: GameDataAccessLayer
    ) {}

    async fetchGameState(
        gameId: string,
        options?: GameFilterOptions
    ): Promise<Effect<GameState, NotFoundException>> {
        return pipe(
            await this.gameDal.findOne({
                ...options,
                where: {
                    ...options?.where,
                    gameId,
                },
            }),
            O.match({
                onNone: async () => succeed(await this.createGame({ gameId })),
                onSome: async (data) => succeed(data),
            })
        );
    }

    async createGame(input: InputCreateGame) {
        return await this.gameDal.create({
            gameId: input.gameId,
            currentTotal: input.currentTotal ?? 0,
            currentPlayerId: input.currentPlayerId,
            winnerId: input.winnerId,
            fkPlayerOneId: input.fkPlayerOneId,
            fkPlayerTwoId: input.fkPlayerTwoId,
        });
    }
}
