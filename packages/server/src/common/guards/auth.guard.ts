import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import { getRequest } from "../utils/request";
import { UserStrategyReturnType } from "../types/auth-types";

@Injectable()
export class AuthGuard extends PassportAuthGuard("jwt") {
    getRequest(context: ExecutionContext) {
        return getRequest(context);
    }

    // biome-ignore lint/suspicious/noExplicitAny: allow
    handleRequest(err: any, user: any, _info: any) {
        const authedUser = user as UserStrategyReturnType;
        if (err || !user || !authedUser.user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
