import { Inject, Injectable, Logger } from "@nestjs/common";
import { GameState } from "@ods/server-lib";
import { Effect, Option, flow, pipe } from "effect";
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
    private readonly logger = new Logger("GameService");

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
                catch: (e) => {
                    const err = e instanceof Error ? e : new Error(String(e));
                    this.logger.error(
                        `No Game State Found with ID: ${id}. Error: ${err.message}`
                    );
                    return err;
                },
            }),
            Effect.map(
                flow(
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
                catch: (e) => {
                    const err = e instanceof Error ? e : new Error(String(e));
                    this.logger.error(
                        `No Game State Found. Error: ${err.message}`
                    );
                    return err;
                },
            }),
            Effect.map(
                flow(
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
                catch: (e) => {
                    const err = e instanceof Error ? e : new Error(String(e));
                    this.logger.error(
                        `Failed to create game. Error: ${err.message}`
                    );
                    return err;
                },
            }),
            Effect.map((e) => e.convertToGameState)
        );
    }

    update(
        values: GameUpdateAttributes,
        options?: GameFilterOptions
    ): Effect.Effect<GameState, Error> {
        return pipe(
            Effect.tryPromise({
                try: () => this.gameRepository.findByPk(values.id, options),
                catch: (e) => {
                    const err = e instanceof Error ? e : new Error(String(e));
                    this.logger.error(
                        `No Game State Found. Error: ${err.message}`
                    );
                    return err;
                },
            }),
            Effect.flatMap(
                flow(
                    Option.fromNullable,
                    Option.match({
                        onNone: () => {
                            const err = new Error("No Game State Found!");
                            this.logger.error(err.message);
                            return Effect.fail(err);
                        },
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
                )
            )
        );
    }
}
