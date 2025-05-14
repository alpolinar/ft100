import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Effect } from "effect/index";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AppConfigService } from "../app-config/app.config.service";
import {
    StrategyReturnType,
    UserStrategyReturnType,
} from "../common/types/auth-types";
import { Payload, isUserJwtPayload } from "./jwt-payload";
import { UserService } from "./user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
        private readonly appConfigService: AppConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appConfigService.get("JWT_SECRET"),
        });
    }

    async validate(
        payload: Payload
    ): Promise<UserStrategyReturnType | undefined> {
        if (isUserJwtPayload(payload)) {
            return {
                type: StrategyReturnType.user,
                user: await Effect.runPromise(
                    this.userService.findUserById(payload.userId)
                ),
            };
        }

        return undefined;
    }
}
