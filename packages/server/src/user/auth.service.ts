import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthenticatedUser, User } from "@ods/server-lib";
import { pipe } from "effect/Function";
import { Effect } from "effect";
import { genUserJwtPayload } from "./jwt-payload";
import { UserService } from "./user.service";
import { catchError } from "../common/utils/helpers";

@Injectable()
export class AuthService {
    private readonly logger = new Logger("AuthService");

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    validateJwt(user: User): Effect.Effect<AuthenticatedUser, Error, never> {
        return Effect.try({
            try: () => {
                const jwt = this.jwtService.sign(
                    genUserJwtPayload({ userId: user.id })
                );
                return {
                    jwt,
                    user,
                };
            },
            catch: catchError((err) => {
                this.logger.error(`Failed to validate session. ${err.message}`);
            }),
        });
    }

    validateUserToken(
        email: string,
        submittedCode: number
    ): Effect.Effect<AuthenticatedUser, Error, never> {
        return pipe(
            this.userService.findUser({
                where: {
                    email,
                },
            }),
            Effect.flatMap((user) => {
                if (!user.token) {
                    const err = new Error("No verification token provided.");
                    this.logger.error(err.message);
                    return Effect.fail(err);
                }

                return pipe(
                    this.userService.validateToken(user.token, submittedCode),
                    Effect.flatMap((isValid) => {
                        if (!isValid) {
                            const err = new Error(
                                "Submitted Code is not valid."
                            );
                            this.logger.error(err.message);
                            return Effect.fail(err);
                        }
                        return Effect.succeed({
                            jwt: this.jwtService.sign(
                                genUserJwtPayload({ userId: user.id })
                            ),
                            user: user,
                        });
                    })
                );
            })
        );
    }
}
