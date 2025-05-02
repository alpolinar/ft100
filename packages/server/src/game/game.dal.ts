import { Inject, Injectable } from "@nestjs/common";
import { GameState } from "@ods/server-lib";
import { Effect, Option, pipe } from "effect";
import { FilterOptions } from "../utils/type-helpers";
import {
    GameAttributes,
    GameCreateAttributes,
    GameEntity,
    GameProvider,
    GameUpdateAttributes,
} from "./game.entity";

export type GameFilterOptions = FilterOptions<GameAttributes>;

@Injectable()
export class GameDataAccessLayer {
    constructor(
        @Inject(GameProvider)
        private readonly gameRepository: typeof GameEntity
    ) {}

    findByPk(
        id: string,
        options?: GameFilterOptions
    ): Effect.Effect<Option.Option<GameState>, Error, never> {
        return pipe(
            Effect.tryPromise({
                try: () => this.gameRepository.findByPk(id, options),
                catch: (e) => (e instanceof Error ? e : new Error(String(e))),
            }),
            Effect.map((data) =>
                pipe(
                    data,
                    Option.fromNullable,
                    Option.map((e) => e.convertToGameState)
                )
            )
        );
    }

    findOne(
        options: GameFilterOptions
    ): Effect.Effect<Option.Option<GameState>, Error, never> {
        return pipe(
            Effect.tryPromise({
                try: () => this.gameRepository.findOne(options),
                catch: (e) => (e instanceof Error ? e : new Error(String(e))),
            }),
            Effect.map((data) =>
                pipe(
                    data,
                    Option.fromNullable,
                    Option.map((e) => e.convertToGameState)
                )
            )
        );
    }

    create(
        values: GameCreateAttributes
    ): Effect.Effect<GameState, Error, never> {
        return pipe(
            Effect.tryPromise({
                try: () => this.gameRepository.create(values),
                catch: (e) => (e instanceof Error ? e : new Error(String(e))),
            }),
            Effect.map((data) => data.convertToGameState)
        );
    }

    update(
        values: GameUpdateAttributes,
        options?: GameFilterOptions
    ): Effect.Effect<GameState, Error> {
        return pipe(
            Effect.tryPromise({
                try: () => this.gameRepository.findByPk(values.id, options),
                catch: (e) => (e instanceof Error ? e : new Error(String(e))),
            }),
            Effect.flatMap((data) => {
                return pipe(
                    data,
                    Option.fromNullable,
                    Option.match({
                        onNone: () =>
                            Effect.fail(new Error("No Game State Found")),
                        onSome: (e) =>
                            Effect.gen(function* () {
                                yield* Effect.promise(() =>
                                    e.update({
                                        currentPlayerId: values.currentPlayerId,
                                        currentTotal: values.currentTotal,
                                        fkPlayerOneId: values.fkPlayerOneId,
                                        fkPlayerTwoId: values.fkPlayerTwoId,
                                        winnerId: values.winnerId,
                                    })
                                );

                                yield* Effect.promise(() =>
                                    e.reload({ useMaster: true })
                                );

                                return e.convertToGameState;
                            }),
                    })
                );
            })
        );
    }
}
