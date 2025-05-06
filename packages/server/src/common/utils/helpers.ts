import { Effect } from "effect";
import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";

export const catchError =
    (cb?: (error: Error) => void) =>
    (e: unknown): Error => {
        const err = e instanceof Error ? e : new Error(String(e));
        cb?.(err);
        return err;
    };

export const withTransactionEffect =
    <A>(
        effectFn: (transaction: Transaction) => Effect.Effect<A, Error>,
        cb?: (error: Error) => void
    ) =>
    (sequelize: Sequelize): Effect.Effect<A, Error> =>
        Effect.tryPromise({
            try: () =>
                sequelize.transaction(
                    async (t) => await Effect.runPromise(effectFn(t))
                ),
            catch: catchError(cb),
        });
