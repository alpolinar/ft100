import { z } from "zod";
import {
    InputCreateGame,
    InputCreateUser,
    InputMove,
    InputUpdateGame,
    InputUpdateUser,
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
        email: z.string().nullish(),
        img: z.string().nullish(),
        username: z.string(),
    });
}

export function InputMoveSchema(): z.ZodObject<Properties<InputMove>> {
    return z.object({
        gameId: z.string(),
        userId: z.string(),
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
        username: z.string().nullish(),
    });
}
