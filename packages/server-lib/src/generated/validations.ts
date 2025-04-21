import { z } from "zod";
import { InputMove } from "./graphql";

type Properties<T> = Required<{
    [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
    v !== undefined && v !== null;

export const definedNonNullAnySchema = z
    .any()
    .refine((v) => isDefinedNonNullAny(v));

export function InputMoveSchema(): z.ZodObject<Properties<InputMove>> {
    return z.object({
        gameId: z.string(),
        userId: z.string(),
        value: z.number(),
    });
}
