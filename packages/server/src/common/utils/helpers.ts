import { Effect } from "effect";
import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";

export function catchError<E extends Error = Error>(cb?: (error: E) => void) {
    return (e: unknown): E => {
        const err = e instanceof Error ? e : new Error(String(e));
        cb?.(err as E);
        return err as E;
    };
}

export function withTransactionEffect<A, E extends Error = Error>({
    effectFn,
    onError,
}: Readonly<{
    effectFn: (transaction: Transaction) => Effect.Effect<A, E>;
    onError?: (error: E) => void;
}>) {
    return (sequelize: Sequelize): Effect.Effect<A, Error> =>
        Effect.tryPromise({
            try: () =>
                sequelize.transaction(
                    async (transaction) =>
                        await Effect.runPromise(effectFn(transaction))
                ),
            catch: catchError(onError),
        });
}
