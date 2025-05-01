import { Inject, Injectable } from "@nestjs/common";
import { GameState, InputCreateGame } from "@ods/server-lib";
import { Effect, Option, pipe } from "effect";
import { GameDataAccessLayer, GameFilterOptions } from "./game.dal";

@Injectable()
export class GameService {
    constructor(
        @Inject(GameDataAccessLayer)
        private readonly gameDal: GameDataAccessLayer
    ) {}

    fetchGameState(
        gameId: string,
        options?: GameFilterOptions
    ): Effect.Effect<GameState, Error, never> {
        return pipe(
            this.gameDal.findOne({
                ...options,
                where: {
                    ...options?.where,
                    gameId,
                },
            }),
            Effect.flatMap((data) => {
                return pipe(
                    data,
                    Option.match({
                        onNone: () => this.createGame({ gameId }),
                        onSome: (data) => Effect.succeed(data),
                    })
                );
            })
        );
    }

    createGame(input: InputCreateGame): Effect.Effect<GameState, Error, never> {
        return this.gameDal.create({
            gameId: input.gameId,
            currentTotal: input.currentTotal ?? 0,
            currentPlayerId: input.currentPlayerId,
            winnerId: input.winnerId,
            fkPlayerOneId: input.fkPlayerOneId,
            fkPlayerTwoId: input.fkPlayerTwoId,
        });
    }
}
