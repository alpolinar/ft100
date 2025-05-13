import { Injectable, Logger } from "@nestjs/common";
import { AuthenticatedUser } from "@ods/server-lib";
import { pipe } from "effect/Function";
import { Effect } from "effect/index";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    private readonly logger = new Logger("AuthService");

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

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
                            jwt: this.jwtService.sign({ userId: user.id }),
                            user: user,
                        });
                    })
                );
            })
        );
    }
}
