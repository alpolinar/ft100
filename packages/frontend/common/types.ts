export type CallBack<D, E> = Readonly<{
    onComplete: (data: D) => void;
    onError: (error: E) => void;
}>;
