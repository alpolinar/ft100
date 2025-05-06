import { Inject, Injectable, Logger } from "@nestjs/common";
import { GameState, InputCreateGame } from "@ods/server-lib";
import { Effect, flow, Option, pipe } from "effect";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { UserEntity } from "../user/user.entity";
import { convertToGameState } from "./convert";
import { GameDataAccessLayer, GameOptions } from "./game.dal";
import { Sequelize } from "sequelize-typescript";
import { catchError, withTransactionEffect } from "src/common/utils/helpers";

@Injectable()
export class GameService {
    private readonly logger = new Logger("GameService");

    constructor(
        @Inject(GameDataAccessLayer)
        private readonly gameDal: GameDataAccessLayer,
        @Inject(SubscriptionsService)
        private readonly subscription: SubscriptionsService,
        private readonly sequelize: Sequelize
    ) {}

    fetchGameState(
        gameId: string,
        options?: GameOptions
    ): Effect.Effect<GameState, Error, never> {
        return pipe(
            this.gameDal.findOne({
                ...options,
                where: {
                    ...options?.where,
                    gameId,
                },
                include: [
                    {
                        model: UserEntity,
                    },
                ],
            }),
            Effect.flatMap(
                Option.match({
                    onNone: () => {
                        this.logger.error("No Game State Found!");
                        return Effect.fail(new Error("No Game State Found!"));
                    },
                    onSome: (data) => {
                        const gameState = convertToGameState(data);
                        this.subscription.listenToGameUpdates(data.id, {
                            listenToGameUpdates: gameState,
                        });
                        return Effect.succeed(gameState);
                    },
                })
            )
        );
    }

    createGame(input: InputCreateGame): Effect.Effect<GameState, Error, never> {
        return pipe(
            this.sequelize,
            withTransactionEffect((transaction) =>
                pipe(
                    this.gameDal.create(
                        {
                            gameId: input.gameId,
                            currentTotal: input.currentTotal ?? 0,
                            currentPlayerId: input.currentPlayerId,
                            winnerId: input.winnerId,
                            fkPlayerOneId: input.fkPlayerOneId,
                            fkPlayerTwoId: input.fkPlayerTwoId,
                        },
                        { transaction }
                    ),
                    Effect.map(convertToGameState)
                )
            )
        );
    }

    deleteGame(id: string): Effect.Effect<boolean, Error, never> {
        return pipe(
            this.sequelize,
            withTransactionEffect(
                (transaction) =>
                    pipe(
                        this.gameDal.delete(id, {
                            transaction,
                        }),
                        Effect.flatMap(
                            Option.match({
                                onNone: () => {
                                    this.logger.error(
                                        `Failed to delete game with ID: ${id}.`
                                    );
                                    return Effect.fail(
                                        new Error("Failed to delete gme.")
                                    );
                                },
                                onSome: () => Effect.succeed(true),
                            })
                        )
                    ),
                (err) => {
                    this.logger.error(err.message);
                }
            )
        );
    }
}
