import { Inject, Injectable, Logger } from "@nestjs/common";
import { Effect, Option, pipe as ePipe } from "effect";
import { catchError } from "src/common/utils/helpers";
import { UserAttributes } from "./user.model";
import {
    UserCreateAttributes,
    UserEntity,
    UserProvider,
    UserUpdateAttributes,
} from "./user.entity";
import { FindOptions } from "sequelize";
import { map } from "remeda";

export type FindUserOptions = FindOptions<UserAttributes>;

@Injectable()
export class UserDataAccessLayer {
    private readonly logger = new Logger("UserDataAccessLeyer");

    constructor(
        @Inject(UserProvider)
        private readonly userRepository: typeof UserEntity
    ) {}

    findByPk(
        id: string,
        options?: FindUserOptions
    ): Effect.Effect<Option.Option<UserAttributes>, Error, never> {
        return ePipe(
            Effect.tryPromise({
                try: () => this.userRepository.findByPk(id, options),
                catch: catchError((err) => {
                    this.logger.error(
                        `No user found with ID: ${id}. Error: ${err.message}`
                    );
                }),
            }),
            Effect.map((user) =>
                ePipe(
                    user,
                    Option.fromNullable,
                    Option.map((e) => e.getUserAttributes)
                )
            )
        );
    }

    findOne(
        options: Omit<FindUserOptions, "where"> &
            Required<Pick<FindUserOptions, "where">>
    ): Effect.Effect<Option.Option<UserAttributes>, Error, never> {
        return ePipe(
            Effect.tryPromise({
                try: () => this.userRepository.findOne(options),
                catch: catchError((err) => {
                    this.logger.error(`No user found. Error: ${err.message}`);
                }),
            }),
            Effect.map((user) =>
                ePipe(
                    user,
                    Option.fromNullable,
                    Option.map((e) => e.getUserAttributes)
                )
            )
        );
    }

    findAll(
        options?: FindUserOptions
    ): Effect.Effect<ReadonlyArray<UserAttributes>, Error, never> {
        return ePipe(
            Effect.tryPromise({
                try: () => this.userRepository.findAll(options),
                catch: catchError((err) => {
                    this.logger.log(`No Users Found: ${err.message}`);
                }),
            }),
            Effect.map((entity) => map(entity, (e) => e.getUserAttributes))
        );
    }

    create(
        values: UserCreateAttributes
    ): Effect.Effect<UserAttributes, Error, never> {
        return ePipe(
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

    update(
        values: UserUpdateAttributes,
        options?: FindUserOptions
    ): Effect.Effect<UserAttributes, Error, never> {
        return ePipe(
            Effect.tryPromise({
                try: () => this.userRepository.findByPk(values.id, options),
                catch: catchError((err) => {
                    this.logger.error(`No User Found. ${err.message}`);
                }),
            }),
            Effect.flatMap((user) =>
                ePipe(
                    user,
                    Option.fromNullable,
                    Option.match({
                        onNone: () => {
                            const err = new Error("No User Found");
                            this.logger.log(err.message);
                            return Effect.fail(err);
                        },
                        onSome: (e) =>
                            Effect.gen(function* (_) {
                                yield* _(
                                    Effect.promise(() => e.update(values))
                                );
                                yield* _(
                                    Effect.promise(() =>
                                        e.reload({ useMaster: true })
                                    )
                                );
                                return e.getUserAttributes;
                            }),
                    })
                )
            )
        );
    }
}
