import { Inject, Injectable, Logger } from "@nestjs/common";
import { GameState, InputCreateGame } from "@ods/server-lib";
import { Effect, Option, pipe } from "effect";
import { Sequelize } from "sequelize-typescript";
import { withTransactionEffect } from "../common/utils/helpers";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { UserEntity } from "../user/user.entity";
import { convertToGameState } from "./game.convert";
import { FindGameOptions, GameDataAccessLayer } from "./game.dal";
import { isNonNullish, isNullish } from "remeda";

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
        options?: FindGameOptions
    ): Effect.Effect<GameState, Error, never> {
        return pipe(
            this.gameDal.findOne({
                ...options,
                where: {
                    ...options?.where,
                    gameId,
                },
                include: [
                    { model: UserEntity, as: "winner" },
                    { model: UserEntity, as: "playerOne" },
                    { model: UserEntity, as: "playerTwo" },
                ],
            }),
            Effect.flatMap(
                Option.match({
                    onNone: () => {
                        const err = new Error("No Game State Found!");
                        this.logger.error(err.message);
                        return Effect.fail(err);
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
            withTransactionEffect({
                effectFn: (transaction) =>
                    pipe(
                        this.gameDal.create(
                            {
                                gameId: input.gameId,
                                currentTotal: 0,
                            },
                            { transaction }
                        ),
                        Effect.map(convertToGameState)
                    ),
            })
        );
    }

    deleteGame(id: string): Effect.Effect<boolean, Error, never> {
        return pipe(
            this.sequelize,
            withTransactionEffect({
                effectFn: (transaction) =>
                    pipe(
                        this.gameDal.delete(id, {
                            transaction,
                        }),
                        Effect.flatMap(
                            Option.match({
                                onNone: () => {
                                    const err = new Error(
                                        `Failed to delete game with ID: ${id}.`
                                    );
                                    this.logger.error(err.message);
                                    return Effect.fail(err);
                                },
                                onSome: () => Effect.succeed(true),
                            })
                        )
                    ),
                onError: (err) => {
                    this.logger.error(err.message);
                },
            })
        );
    }

    connectPlayer(
        gameId: string,
        playerId: string
    ): Effect.Effect<GameState, Error, never> {
        return pipe(
            this.sequelize,
            withTransactionEffect({
                effectFn: (transaction) =>
                    pipe(
                        this.gameDal.findOne({
                            where: {
                                gameId,
                            },
                            include: [
                                {
                                    model: UserEntity,
                                    as: "winner",
                                },
                                {
                                    model: UserEntity,
                                    as: "playerOne",
                                },
                                {
                                    model: UserEntity,
                                    as: "playerTwo",
                                },
                            ],
                        }),
                        Effect.flatMap(
                            Option.match({
                                onNone: () => {
                                    const err = new Error(
                                        "No Game State Found!"
                                    );
                                    this.logger.error(err.message);
                                    return Effect.fail(err);
                                },
                                onSome: (gameState) => {
                                    const { fkPlayerOneId, fkPlayerTwoId } =
                                        gameState;

                                    if (
                                        isNonNullish(fkPlayerOneId) &&
                                        fkPlayerOneId !== playerId &&
                                        isNonNullish(fkPlayerTwoId) &&
                                        fkPlayerTwoId !== playerId
                                    ) {
                                        const err = new Error(
                                            "Game Already Full."
                                        );
                                        this.logger.error(err.message);
                                        return Effect.fail(err);
                                    }

                                    if (
                                        fkPlayerOneId === playerId ||
                                        fkPlayerTwoId === playerId
                                    ) {
                                        return Effect.succeed(
                                            convertToGameState(gameState)
                                        );
                                    }

                                    if (!fkPlayerOneId) {
                                        return pipe(
                                            this.gameDal.update(
                                                {
                                                    id: gameState.id,
                                                    gameId: gameState.gameId,
                                                    currentTotal:
                                                        gameState.currentTotal,
                                                    fkPlayerOneId: playerId,
                                                    fkPlayerTwoId:
                                                        gameState.fkPlayerTwoId,
                                                },
                                                {
                                                    transaction,
                                                }
                                            ),
                                            Effect.map((data) =>
                                                convertToGameState(data)
                                            )
                                        );
                                    }

                                    if (!fkPlayerTwoId) {
                                        return pipe(
                                            this.gameDal.update(
                                                {
                                                    id: gameState.id,
                                                    gameId: gameState.gameId,
                                                    currentTotal:
                                                        gameState.currentTotal,
                                                    fkPlayerOneId:
                                                        gameState.fkPlayerOneId,
                                                    fkPlayerTwoId: playerId,
                                                },
                                                { transaction }
                                            ),
                                            Effect.map((data) =>
                                                convertToGameState(data)
                                            )
                                        );
                                    }

                                    return Effect.succeed(
                                        convertToGameState(gameState)
                                    );
                                },
                            })
                        )
                    ),
                onError: (err) => {
                    this.logger.error(err.message);
                },
            })
        );
    }

    playerMove(
        input: Readonly<{
            playerId: string;
            gameId: string;
            value: number;
        }>
    ): Effect.Effect<GameState, Error, never> {
        return pipe(
            this.sequelize,
            withTransactionEffect({
                effectFn: (transaction) =>
                    pipe(
                        this.gameDal.findOne({
                            where: {
                                gameId: input.gameId,
                            },
                        }),
                        Effect.flatMap(
                            Option.match({
                                onNone: () => {
                                    const err = new Error(
                                        "No Game State Found!"
                                    );
                                    this.logger.error(err.message);
                                    return Effect.fail(err);
                                },
                                onSome: (gameState) => {
                                    if (isNullish(gameState.currentPlayerId)) {
                                        const err = new Error(
                                            "Impossible State!"
                                        );
                                        this.logger.error(err.message);
                                        return Effect.fail(err);
                                    }
                                    const currentPlayerId =
                                        gameState.currentPlayerId ===
                                        input.playerId
                                            ? gameState.fkPlayerTwoId
                                            : gameState.fkPlayerOneId;
                                    return pipe(
                                        this.gameDal.update(
                                            {
                                                id: gameState.id,
                                                gameId: gameState.id,
                                                currentTotal:
                                                    gameState.currentTotal +
                                                    input.value,
                                                currentPlayerId,
                                            },
                                            { transaction }
                                        ),
                                        Effect.map((data) =>
                                            convertToGameState(data)
                                        )
                                    );
                                },
                            })
                        )
                    ),
                onError: (err) => {
                    this.logger.error(err.message);
                },
            })
        );
    }
}
