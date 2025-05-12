import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { Effect } from "effect/index";

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Mutation("validateUserEmail")
    async validateUserEmail(@Args("email") email: string): Promise<boolean> {
        return await Effect.runPromise(
            this.userService.validateUserEmail(email)
        );
    }
}
