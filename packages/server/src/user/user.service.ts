import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserDataAccessLayer, UserOptions } from "./user.dal";
import { Effect, Option, pipe as ePipe } from "effect";
import { InputCreateUser, InputUpdateUser, Token, User } from "@ods/server-lib";
import { AppConfigService } from "../app-config/app.config.service";
import { CryptoService } from "../common/utils/crypto";
import { randomInt } from "node:crypto";
import { convertToUser } from "./user.convert";

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
        options?: UserOptions
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
        where: Pick<UserOptions, "where">,
        options?: Omit<UserOptions, "where">
    ): Effect.Effect<User, Error, never> {
        return ePipe(
            this.userDal.findOne({
                ...options,
                where,
            }),
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

    createUser(input: InputCreateUser): Effect.Effect<User, Error, never> {
        return ePipe(
            this.userDal.create({
                username: input.username,
                verified: false,
                email: input.email,
                img: input.img,
            }),
            Effect.map((user) => convertToUser(user))
        );
    }

    updateUser(input: InputUpdateUser) {
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

    generateToken(
        userId: string
    ): Effect.Effect<{ code: number; token: string }, Error, never> {
        const code = randomInt(100_000, 1_000_000);
        const expiryDate = new Date(
            Date.now() + 5 * 60 * 1000 //5 minutes
        );
        return ePipe(
            this.encryptor.encrypt({ userId, code, expiryDate }),
            Effect.map((token) => ({ code, token }))
        );
    }

    validateToken(
        token: string,
        submittedCode: number
    ): Effect.Effect<boolean, Error, never> {
        return ePipe(
            token,
            this.encryptor.decrypt,
            Effect.map(({ code }) => code === submittedCode)
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
                    this.generateToken(user.id),
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
}
