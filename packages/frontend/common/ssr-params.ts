export type Params<T> = Readonly<{ params: Promise<T> }>;

export type SearchParams = Readonly<{
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>;
