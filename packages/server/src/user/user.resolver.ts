import { Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}
}
