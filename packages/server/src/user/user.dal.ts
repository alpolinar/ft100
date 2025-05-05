import { Inject, Injectable, Logger } from "@nestjs/common";
import { FilterOptions } from "../common/utils/type-helpers";
import { UserAttributes, UserEntity, UserProvider } from "./user.entity";
import { Effect, flow, Option, pipe } from "effect";
import { User } from "@ods/server-lib";
import { catchError } from "src/common/utils/helpers";

export type UserFilterOptions = FilterOptions<UserAttributes>;

@Injectable()
export class UserDataAccessLeyer {
    private readonly logger = new Logger("UserDataAccessLeyer");

    constructor(
        @Inject(UserProvider) private readonly userRepository: typeof UserEntity
    ) {}

    findByPk(id: string, options?: UserFilterOptions) {
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
                    Option.map((e) => e.convertToUser)
                )
            )
        );
    }

    findOne(
        options: UserFilterOptions
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
                    Option.map((e) => e.convertToUser)
                )
            )
        );
    }
}
