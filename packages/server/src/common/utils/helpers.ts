export const catchError =
    (cb?: (error: Error) => void) =>
    (e: unknown): Error => {
        const err = e instanceof Error ? e : new Error(String(e));
        cb?.(err);
        return err;
    };
