import { Inject, Injectable, Logger } from "@nestjs/common";
import { User } from "@ods/server-lib";
import { Effect, Option, flow, pipe } from "effect";
import { catchError } from "src/common/utils/helpers";
import { EntityOptions } from "../common/utils/type-helpers";
import { UserAttributes } from "./model";
import { UserEntity, UserProvider } from "./user.entity";
import { GameCreateAttributes } from "src/game/game.entity";

export type UserOptions = EntityOptions<UserAttributes>;

@Injectable()
export class UserDataAccessLayer {
    private readonly logger = new Logger("UserDataAccessLeyer");

    constructor(
        @Inject(UserProvider) private readonly userRepository: typeof UserEntity
    ) {}

    findByPk(id: string, options?: UserOptions) {
        return pipe(
            Effect.tryPromise({
                try: () => this.userRepository.findByPk(id, options),
                catch: catchError((err) => {
                    this.logger.error(
                        `No user found with ID: ${id}. Error: ${err.message}`
                    );
                }),
            }),
            Effect.map(
                flow(
                    Option.fromNullable,
                    Option.map((e) => e.getUserAttributes)
                )
            )
        );
    }

    findOne(
        options: UserOptions
    ): Effect.Effect<Option.Option<User>, Error, never> {
        return pipe(
            Effect.tryPromise({
                try: () => this.userRepository.findOne(options),
                catch: catchError((err) => {
                    this.logger.error(`No user found. Error: ${err.message}`);
                }),
            }),
            Effect.map(
                flow(
                    Option.fromNullable,
                    Option.map((e) => e.getUserAttributes)
                )
            )
        );
    }

    create(
        values: GameCreateAttributes
    ): Effect.Effect<UserAttributes, Error, never> {
        return pipe(
            Effect.tryPromise({
                try: () => this.userRepository.create(values),
                catch: catchError((err) => {
                    this.logger.error(
                        `Failed to create game. Error: ${err.message}`
                    );
                }),
            }),
            Effect.map((e) => e.getUserAttributes)
        );
    }
}
