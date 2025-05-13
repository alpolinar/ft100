import { JwtPayload } from "jwt-decode";

export enum JwtType {
    user = 0,
}

export type UserJwtPayload = {
    _type: JwtType.user;
    userId: string;
};

export type Payload = UserJwtPayload & JwtPayload;

export const isUserJwtPayload = (p: Payload): p is UserJwtPayload =>
    p._type === JwtType.user;

export const genUserJwtPayload = (
    arg: Omit<UserJwtPayload, "_type">
): UserJwtPayload => ({
    ...arg,
    _type: JwtType.user,
});
