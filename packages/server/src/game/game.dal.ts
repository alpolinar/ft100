import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Effect, Option, flow, pipe } from "effect";
import { FindOptions } from "sequelize";
import { catchError } from "../common/utils/helpers";
import {
    GameCreateAttributes,
    GameEntity,
    GameProvider,
    GameUpdateAttributes,
} from "./game.entity";
import { GameAttributes } from "./game.model";

export type FindGameOptions = FindOptions<GameAttributes>;

@Injectable()
export class GameDataAccessLayer {
    private readonly logger = new Logger("GameDataAccessLayer");

    constructor(
        @Inject(GameProvider)
        private readonly gameRepository: typeof GameEntity
    ) {}

    findByPk(
        id: string,
        options?: FindGameOptions
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
            Effect.map((game) =>
                pipe(
                    game,
                    Option.fromNullable,
                    Option.map((e) => e.getGameAttributes)
                )
            )
        );
    }

    findOne(
        options: FindGameOptions
    ): Effect.Effect<Option.Option<GameAttributes>, Error, never> {
        return pipe(
            Effect.tryPromise({
                try: () => this.gameRepository.findOne(options),
                catch: catchError((err) => {
                    this.logger.error(`No Game State Found. ${err.message}`);
                }),
            }),
            Effect.map((game) =>
                pipe(
                    game,
                    Option.fromNullable,
                    Option.map((e) => e.getGameAttributes)
                )
            )
        );
    }

    create(
        values: GameCreateAttributes,
        options?: Pick<FindGameOptions, "transaction">
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
        options?: FindGameOptions
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
                                        phase: values.phase,
                                        countdownEndsAt: values.countdownEndsAt,
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
        options?: FindGameOptions
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
