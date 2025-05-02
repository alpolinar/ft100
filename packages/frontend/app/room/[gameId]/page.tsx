import { query } from "@/graphql-client/apollo-client";
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

    return <GameContainer data={data.fetchGameState} />;
};

export default RoomPage;
