import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserDataAccessLayer, UserOptions } from "./user.dal";
import { Effect, Option, pipe } from "effect";
import { InputCreateUser, Token, User } from "@ods/server-lib";
import { AppConfigService } from "../app-config/app.config.service";
import { CryptoService } from "../common/utils/crypto";
import { randomInt } from "node:crypto";
import { convertToUser } from "./convert";

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

    findUserById(id: string, options?: UserOptions) {
        return pipe(
            this.userDal.findByPk(id, options),
            Effect.flatMap(
                Option.match({
                    onNone: () => {
                        const err = new Error(`No user found with ID: ${id}`);
                        this.logger.error(err.message);
                        return Effect.fail(err);
                    },
                    onSome: (data) => Effect.succeed(data),
                })
            )
        );
    }

    findUser(
        where: Pick<UserOptions, "where">,
        options?: Omit<UserOptions, "where">
    ): Effect.Effect<User, Error, never> {
        return pipe(
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
                    onSome: (data) => Effect.succeed(data),
                })
            )
        );
    }

    createUser(input: InputCreateUser): Effect.Effect<User, Error, never> {
        return pipe(
            this.userDal.create({
                username: input.username,
                verified: false,
                email: input.email,
                img: input.img,
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
        return pipe(
            this.encryptor.encrypt({ userId, code, expiryDate }),
            Effect.map((token) => ({ code, token }))
        );
    }

    validateToken(
        token: string,
        submittedCode: number
    ): Effect.Effect<boolean, Error, never> {
        return pipe(
            token,
            this.encryptor.decrypt,
            Effect.map(({ code }) => code === submittedCode)
        );
    }
}
