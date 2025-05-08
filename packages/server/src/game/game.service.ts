import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import {
    GameState,
    InputConnectPlayer,
    InputCreateGame,
} from "@ods/server-lib";
import { Effect, Option, pipe } from "effect";
import { Sequelize } from "sequelize-typescript";
import { withTransactionEffect } from "src/common/utils/helpers";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { UserEntity } from "../user/user.entity";
import { convertToGameState } from "./convert";
import { GameDataAccessLayer, GameOptions } from "./game.dal";

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

    async connectPlayer(gameId: string, playerId: string): Promise<GameState> {
        const gameStateOption = await Effect.runPromise(
            this.gameDal.findOne({
                where: {
                    gameId,
                },
            })
        );

        if (Option.isNone(gameStateOption)) {
            throw new NotFoundException("No Game State Found");
        }

        const gameState = gameStateOption.value;
        const { fkPlayerOneId, fkPlayerTwoId } = gameState;

        if (
            (fkPlayerOneId !== "" && fkPlayerOneId !== playerId) ||
            (fkPlayerTwoId !== "" && fkPlayerTwoId !== playerId)
        ) {
            throw new BadRequestException("Game Already Full");
        }

        if (fkPlayerOneId === playerId || fkPlayerTwoId === playerId) {
            return gameState;
        }

        if (!fkPlayerOneId) {
            const newState = await Effect.runPromise(
                this.gameDal.update({
                    id: gameState.id,
                    gameId: gameState.gameId,
                    currentTotal: gameState.currentTotal,
                    fkPlayerOneId: playerId,
                    fkPlayerTwoId: gameState.fkPlayerTwoId,
                })
            );
            return convertToGameState(newState);
        }

        if (!fkPlayerTwoId) {
            const newState = await Effect.runPromise(
                this.gameDal.update({
                    id: gameState.id,
                    gameId: gameState.gameId,
                    currentTotal: gameState.currentTotal,
                    fkPlayerOneId: gameState.fkPlayerOneId,
                    fkPlayerTwoId: playerId,
                })
            );
            return convertToGameState(newState);
        }

        return gameState;
    }
}
