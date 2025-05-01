import { query } from "@/graphql-client/apollo-client";
import {
    FetchGameStateDocument,
    FetchGameStateQuery,
    FetchGameStateQueryVariables,
} from "@ods/server-lib";

type GamePageProps = Readonly<{ params: Promise<{ gameId: string }> }>;

export default async function GamePage({ params }: GamePageProps) {
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
