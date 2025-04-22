import { query } from "@/apollo-client/apollo-client";
import {
    FetchGameStateDocument,
    FetchGameStateQuery,
    FetchGameStateQueryVariables,
} from "@ods/server-lib";

export default async function GamePage({
    params,
}: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params;

    const { data } = await query<
        FetchGameStateQuery,
        FetchGameStateQueryVariables
    >({
        query: FetchGameStateDocument,
        variables: {
            id: gameId,
        },
    });

    console.log("data", data);

    return <div>{gameId}</div>;
}
