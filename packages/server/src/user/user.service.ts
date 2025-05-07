import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserDataAccessLayer, UserOptions } from "./user.dal";
import { Effect, Exit, Option, pipe } from "effect";
import { Token, User } from "@ods/server-lib";
import { AppConfigService } from "../app-config/app.config.service";
import { CryptoService } from "../common/utils/crypto";
import { randomInt } from "node:crypto";

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
                    onSome: Effect.succeed,
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
                    onSome: Effect.succeed,
                })
            )
        );
    }

    generateUserToken(userId: string): Effect.Effect<string, Error, never> {
        const code = randomInt(100_000, 1_000_000);
        const expiryDate = new Date(
            Date.now() + 5 * 60 * 1000 //5 minutes
        );
        const result = Effect.runSyncExit(
            this.encryptor.encrypt({
                userId,
                code,
                expiryDate,
            })
        );
        if (Exit.isFailure(result)) {
            return Effect.fail(new Error("Failed to generate user token."));
        }
        return Effect.succeed(result.value);
    }
}
