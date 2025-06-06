import { z } from "zod";
import {
    GamePhase,
    InputConnectPlayer,
    InputCreateGame,
    InputCreateUser,
    InputMove,
    InputUpdateGame,
    InputUpdateUser,
    InputValidateEmail,
    InputValidateToken,
} from "./graphql";

type Properties<T> = Required<{
    [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
    v !== undefined && v !== null;

export const definedNonNullAnySchema = z
    .any()
    .refine((v) => isDefinedNonNullAny(v));

export const GamePhaseSchema = z.nativeEnum(GamePhase);

export function InputConnectPlayerSchema(): z.ZodObject<
    Properties<InputConnectPlayer>
> {
    return z.object({
        gameId: z.string(),
    });
}

export function InputCreateGameSchema(): z.ZodObject<
    Properties<InputCreateGame>
> {
    return z.object({
        gameId: z.string(),
    });
}

export function InputCreateUserSchema(): z.ZodObject<
    Properties<InputCreateUser>
> {
    return z.object({
        email: z.string(),
        img: z.string().nullish(),
    });
}

export function InputMoveSchema(): z.ZodObject<Properties<InputMove>> {
    return z.object({
        gameId: z.string(),
        value: z.number(),
    });
}

export function InputUpdateGameSchema(): z.ZodObject<
    Properties<InputUpdateGame>
> {
    return z.object({
        currentPlayerId: z.string().nullish(),
        currentTotal: z.number().nullish(),
        fkPlayerOneId: z.string().nullish(),
        fkPlayerTwoId: z.string().nullish(),
        winnerId: z.string().nullish(),
    });
}

export function InputUpdateUserSchema(): z.ZodObject<
    Properties<InputUpdateUser>
> {
    return z.object({
        email: z.string().nullish(),
        id: z.string(),
        img: z.string().nullish(),
        lastLoginAt: z.date().nullish(),
        token: z.string().nullish(),
        username: z.string().nullish(),
        verified: z.boolean().nullish(),
    });
}

export function InputValidateEmailSchema(): z.ZodObject<
    Properties<InputValidateEmail>
> {
    return z.object({
        email: z.string(),
    });
}

export function InputValidateTokenSchema(): z.ZodObject<
    Properties<InputValidateToken>
> {
    return z.object({
        code: z.number(),
        email: z.string(),
    });
}
