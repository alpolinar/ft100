import { Inject, Injectable } from "@nestjs/common";
import { GameState } from "@ods/server-lib";
import { Effect, pipe } from "effect";
import * as O from "effect/Option";
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

    async findByPk(
        id: string,
        options?: GameFilterOptions
    ): Promise<O.Option<GameState>> {
        return pipe(
            await this.gameRepository.findByPk(id, options),
            O.fromNullable,
            O.map((e) => e.convertToGameState)
        );
    }

    async findOne(options: GameFilterOptions): Promise<O.Option<GameState>> {
        return pipe(
            await this.gameRepository.findOne(options),
            O.fromNullable,
            O.map((e) => e.convertToGameState)
        );
    }

    async create(values: GameCreateAttributes): Promise<GameState> {
        return pipe(
            await this.gameRepository.create(values),
            (e) => e.convertToGameState
        );
    }

    async update(
        values: GameUpdateAttributes,
        options?: GameFilterOptions
    ): Promise<O.Option<GameState>> {
        return pipe(
            await this.gameRepository.findByPk(values.id, options),
            O.fromNullable,
            O.match({
                onNone: async () => O.none(),
                onSome: async (e) => {
                    await e.update({
                        currentPlayerId: values.currentPlayerId,
                        currentTotal: values.currentTotal,
                        fkPlayerOneId: values.fkPlayerOneId,
                        fkPlayerTwoId: values.fkPlayerTwoId,
                        winnerId: values.winnerId,
                    });

                    await e.reload({
                        useMaster: true,
                        transaction: options.transaction,
                    });

                    return O.some(e.convertToGameState);
                },
            })
        );
    }
}
