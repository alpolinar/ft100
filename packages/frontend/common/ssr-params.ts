export type Params = Readonly<{ params: Promise<{ gameId: string }> }>;

export type SearchParams = Readonly<{
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>;
