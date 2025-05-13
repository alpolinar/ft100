import { User } from "@ods/server-lib";

export enum StrategyReturnType {
    user = 0,
}

export type UserStrategyReturnType = {
    type: StrategyReturnType.user;
    user: User;
};

export const isUserStrategyReturnType = (
    d: UserStrategyReturnType
): d is UserStrategyReturnType => d.type === StrategyReturnType.user;
