import { Args, Mutation, Resolver } from "@nestjs/graphql";
import {
    AuthenticatedUser,
    InputCreateUser,
    InputValidateEmail,
    InputValidateToken,
} from "@ods/server-lib";
import { Effect } from "effect/index";
import { AuthService } from "./auth.service";
import { UserService } from "./user.service";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { UserStrategyReturnType } from "../common/types/auth-types";

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
        @Args("input") input: InputValidateEmail,
        @CurrentUser() currentUser: UserStrategyReturnType
    ): Promise<boolean> {
        console.log("currentUser", currentUser);
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
}
