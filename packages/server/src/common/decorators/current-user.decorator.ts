import {
    createParamDecorator,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";
import { UserStrategyReturnType } from "../types/auth-types";
import { getRequest, isGraphqlRequest } from "../utils/request";

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext): UserStrategyReturnType => {
        const request = getRequest(context);
        const user = request.user as UserStrategyReturnType;
        if (!user) {
            throw new ForbiddenException(
                isGraphqlRequest(context)
                    ? "GQL decode failed"
                    : "Rest decode failed"
            );
        }

        return user;
    }
);
