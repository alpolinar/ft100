import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
    AuthenticatedUser,
    InputCreateUser,
    InputValidateEmail,
    InputValidateToken,
} from "@ods/server-lib";
import { Effect } from "effect/index";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { AuthGuard } from "../common/guards/auth.guard";
import { UserStrategyReturnType } from "../common/types/auth-types";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Mutation("registerUser")
    async registerUser(
        @Args("input") input: InputCreateUser
    ): Promise<boolean> {
        return await Effect.runPromise(this.userService.registerUser(input));
    }

    @Mutation("validateUserEmail")
    async validateUserEmail(
        @Args("input") input: InputValidateEmail
    ): Promise<boolean> {
        return await Effect.runPromise(
            this.userService.validateUserEmail(input.email)
        );
    }

    @Mutation("validateUserToken")
    async validateUserToken(
        @Args("input") input: InputValidateToken
    ): Promise<AuthenticatedUser> {
        return await Effect.runPromise(
            this.authService.validateUserToken(input.email, input.code)
        );
    }

    @UseGuards(AuthGuard)
    @Query("validateJwt")
    async validateJwt(
        @CurrentUser() currentUser: UserStrategyReturnType
    ): Promise<AuthenticatedUser> {
        return Effect.runSync(this.authService.validateJwt(currentUser.user));
    }
}
