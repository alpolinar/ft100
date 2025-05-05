import { User } from "@ods/server-lib";
import { UserEntity } from "./user.entity";

export const convertToUser = (e: UserEntity): User => {
    return {
        id: e.id,
        username: e.username,
        lastLoginAt: e.lastLoginAt,
        verified: e.veified,
        email: e.email,
        img: e.img,
        token: e.token,
    };
};
