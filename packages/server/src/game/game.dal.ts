import { Inject, Injectable, Logger } from "@nestjs/common";
import { Effect, Option, flow, pipe } from "effect";
import { catchError } from "../common/utils/helpers";
import { EntityOptions } from "../common/utils/type-helpers";
import {
    GameCreateAttributes,
    GameEntity,
    GameProvider,
    GameUpdateAttributes,
} from "./game.entity";
import { GameAttributes } from "./model";

export type GameOptions = EntityOptions<GameAttributes>;

@Injectable()
export class GameDataAccessLayer {
    private readonly logger = new Logger("GameDataAccessLayer");

    constructor(
        @Inject(GameProvider)
        private readonly gameRepository: typeof GameEntity
    ) {}

    findByPk(
        id: string,
        options?: GameOptions
    ): Effect.Effect<Option.Option<GameAttributes>, Error, never> {
        return pipe(
            Effect.tryPromise({
                try: () => this.gameRepository.findByPk(id, options),
                catch: catchError((err) => {
                    this.logger.error(
                        `No Game State Found with ID: ${id}. ${err.message}`
                    );
                }),
            }),
            Effect.map(
                flow(
                    Option.fromNullable,
                    Option.map((e) => e.getGameAttributes)
                )
            )
        );
    }

    findOne(
        options: GameOptions
    ): Effect.Effect<Option.Option<GameAttributes>, Error, never> {
        return pipe(
            Effect.tryPromise({
                try: () => this.gameRepository.findOne(options),
                catch: catchError((err) => {
                    this.logger.error(`No Game State Found. ${err.message}`);
                }),
            }),
            Effect.map(
                flow(
                    Option.fromNullable,
                    Option.map((e) => e.getGameAttributes)
                )
            )
        );
    }

    create(
        values: GameCreateAttributes,
        options?: Pick<GameOptions, "transaction">
    ): Effect.Effect<GameAttributes, Error, never> {
        return pipe(
            Effect.tryPromise({
                try: () => this.gameRepository.create(values, options),
                catch: catchError((err) => {
                    this.logger.error(`Failed to create game. ${err.message}`);
                }),
            }),
            Effect.map((e) => e.getGameAttributes)
        );
    }

    update(
        values: GameUpdateAttributes,
        options?: GameOptions
    ): Effect.Effect<GameAttributes, Error> {
        return pipe(
            Effect.tryPromise({
                try: () => this.gameRepository.findByPk(values.id, options),
                catch: catchError((err) => {
                    this.logger.error(`No Game State Found. ${err.message}`);
                }),
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

                                return e.getGameAttributes;
                            }),
                    })
                )
            )
        );
    }

    delete(
        id: string,
        options?: GameOptions
    ): Effect.Effect<Option.Option<number>, Error, never> {
        return pipe(
            Effect.tryPromise({
                try: () =>
                    this.gameRepository.destroy({
                        ...options,
                        where: {
                            ...options?.where,
                            id,
                        },
                    }),
                catch: catchError((err) => {
                    this.logger.error(
                        `Failed to delete game. Error: ${err.message}`
                    );
                }),
            }),
            Effect.map((deletedRows) => {
                if (deletedRows === 0) {
                    return Option.none();
                }
                return Option.some(deletedRows);
            })
        );
    }
}
