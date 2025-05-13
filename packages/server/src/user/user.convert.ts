import { User } from "@ods/server-lib";
import { UserAttributes } from "./user.model";
import { UserEntity } from "./user.entity";

export function getUserAttributes(e: UserEntity): UserAttributes {
    return {
        id: e.id,
        username: e.username,
        lastLoginAt: e.lastLoginAt,
        verified: e.veified,
        email: e.email,
        img: e.img,
        token: e.token,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        deletedAt: e.deletedAt,
    };
}

export function convertToUser(data: UserAttributes): User {
    return {
        id: data.id,
        username: data.username,
        verified: data.verified,
        email: data.email,
        img: data.img,
        token: data.token,
        lastLoginAt: data.lastLoginAt,
    };
}
