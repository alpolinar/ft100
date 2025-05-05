import { query } from "@/graphql-client/ssr-client";
import { GameContainer } from "@/room/components/GameContainer";
import {
    FetchGameStateDocument,
    FetchGameStateQuery,
    FetchGameStateQueryVariables,
} from "@ods/server-lib";

type GamePageProps = Readonly<{ params: Promise<{ gameId: string }> }>;

const RoomPage = async ({ params }: GamePageProps) => {
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
};

export default RoomPage;
