import { randomInt } from "node:crypto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Token, User } from "@ods/server-lib";
import { Effect, Option } from "effect";
import { pipe as ePipe } from "effect/Function";
import { AppConfigService } from "../app-config/app.config.service";
import { CryptoService } from "../common/utils/crypto";
import { convertToUser } from "./user.convert";
import { FindUserOptions, UserDataAccessLayer } from "./user.dal";

@Injectable()
export class UserService {
    private readonly logger = new Logger("UserService");

    constructor(
        @Inject(UserDataAccessLayer)
        private readonly userDal: UserDataAccessLayer,
        private readonly appConfig: AppConfigService
    ) {}

    private encryptor = new CryptoService<Token>(
        this.appConfig.get("HMAC_KEY"),
        this.appConfig.get("ENCRYPT_KEY")
    );

    findUserById(
        id: string,
        options?: FindUserOptions
    ): Effect.Effect<User, Error, never> {
        return ePipe(
            this.userDal.findByPk(id, options),
            Effect.flatMap(
                Option.match({
                    onNone: () => {
                        const err = new Error(`No user found with ID: ${id}`);
                        this.logger.error(err.message);
                        return Effect.fail(err);
                    },
                    onSome: (data) => Effect.succeed(convertToUser(data)),
                })
            )
        );
    }

    findUser(
        options: Omit<FindUserOptions, "where"> &
            Required<Pick<FindUserOptions, "where">>
    ): Effect.Effect<User, Error, never> {
        return ePipe(
            this.userDal.findOne(options),
            Effect.flatMap(
                Option.match({
                    onNone: () => {
                        const err = new Error("No User Found!");
                        this.logger.error(err.message);
                        return Effect.fail(err);
                    },
                    onSome: (data) => Effect.succeed(convertToUser(data)),
                })
            )
        );
    }

    createUser(
        input: Readonly<{
            email?: string;
            verified?: boolean;
            token?: string;
            img?: string;
            lastLoginAt?: Date;
        }>
    ): Effect.Effect<User, Error, never> {
        return ePipe(
            this.userDal.create({
                verified: input.verified ?? false,
                email: input.email,
                img: input.img,
                token: input.token,
                lastLoginAt: input.lastLoginAt,
            }),
            Effect.map((user) => convertToUser(user))
        );
    }

    updateUser(
        input: Readonly<{
            id: string;
            username?: string;
            email?: string;
            verified?: boolean;
            token?: string;
            img?: string;
            lastLoginAt?: Date;
        }>
    ): Effect.Effect<User, Error, never> {
        return ePipe(
            this.userDal.update({
                id: input.id,
                username: input.username,
                verified: input.verified,
                token: input.token,
                email: input.email,
                img: input.img,
                lastLoginAt: input.lastLoginAt,
            }),
            Effect.map((user) => convertToUser(user))
        );
    }

    generateToken(): Effect.Effect<
        { code: number; token: string },
        Error,
        never
    > {
        const code = randomInt(100_000, 1_000_000);
        const expiryDate = new Date(
            Date.now() + 5 * 60 * 1000 //5 minutes
        );
        if (this.appConfig.get("APP_ENV") === "development") {
            this.logger.log(`User Token: ${code}`);
        }
        return ePipe(
            this.encryptor.encrypt({ code, expiryDate }),
            Effect.map((token) => ({ code, token }))
        );
    }

    validateToken(
        token: string,
        submittedCode: number
    ): Effect.Effect<boolean, Error, never> {
        return ePipe(
            this.encryptor.decrypt(token),
            Effect.map(
                ({ code, expiryDate }) =>
                    code === submittedCode && expiryDate > new Date()
            )
        );
    }

    validateUserEmail(email: string): Effect.Effect<boolean, never, never> {
        return ePipe(
            this.findUser({
                where: {
                    email,
                },
            }),
            Effect.flatMap((user) =>
                ePipe(
                    this.generateToken(),
                    Effect.flatMap(({ token }) =>
                        this.updateUser({
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            verified: user.verified,
                            img: user.img,
                            token,
                            lastLoginAt: user.lastLoginAt,
                        })
                    ),
                    Effect.map(() => true)
                )
            ),
            Effect.catchAll((err) => {
                this.logger.error(err.message);
                return Effect.succeed(false);
            })
        );
    }

    registerUser(
        input: Readonly<{ email: string; img?: string }>
    ): Effect.Effect<boolean, Error, never> {
        return ePipe(
            this.generateToken(),
            Effect.flatMap(({ token }) =>
                this.createUser({ email: input.email, img: input.img, token })
            ),
            Effect.match({
                onFailure: (err) => {
                    this.logger.error(err.message);
                    return false;
                },
                onSuccess: () => true,
            })
        );
    }
}
