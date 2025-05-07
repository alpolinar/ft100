import { Effect } from "effect";
import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";

export function catchError(cb?: (error: Error) => void) {
    return (e: unknown): Error => {
        const err = e instanceof Error ? e : new Error(String(e));
        cb?.(err);
        return err;
    };
}

export function withTransactionEffect<A>({
    effectFn,
    onError,
}: Readonly<{
    effectFn: (transaction: Transaction) => Effect.Effect<A, Error>;
    onError?: (error: Error) => void;
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
