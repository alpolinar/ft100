import { Params } from "@/common/ssr-params";
import { query } from "@/graphql-client/ssr-client";
import { GameContainer } from "@/game/container/GameContainer";
import {
    FetchGameStateDocument,
    FetchGameStateQuery,
    FetchGameStateQueryVariables,
} from "@ods/server-lib";

type GamePageProps = Params<{ gameId: string }>;

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

    return data?.fetchGameState ? (
        <GameContainer game={data.fetchGameState} />
    ) : (
        <div>no data</div>
    );
}
