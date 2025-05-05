import { Inject, Injectable, Logger } from "@nestjs/common";
import { GameState, InputCreateGame } from "@ods/server-lib";
import { Effect, Option, pipe } from "effect";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { UserEntity } from "../user/user.entity";
import { convertToGameState } from "./convert";
import { GameDataAccessLayer, GameFilterOptions } from "./game.dal";

@Injectable()
export class GameService {
    private readonly logger = new Logger("GameService");

    constructor(
        @Inject(GameDataAccessLayer)
        private readonly gameDal: GameDataAccessLayer,
        @Inject(SubscriptionsService)
        private readonly subscription: SubscriptionsService
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
            this.gameDal.create({
                gameId: input.gameId,
                currentTotal: input.currentTotal ?? 0,
                currentPlayerId: input.currentPlayerId,
                winnerId: input.winnerId,
                fkPlayerOneId: input.fkPlayerOneId,
                fkPlayerTwoId: input.fkPlayerTwoId,
            }),
            Effect.map(convertToGameState)
        );
    }
}
