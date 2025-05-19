import { Route } from "@/common/routes";
import { Params } from "@/common/ssr-params";
import { GameContainer } from "@/game/container/GameContainer";
import { query } from "@/graphql-client/ssr-client";
import {
    FetchGameStateDocument,
    FetchGameStateQuery,
    FetchGameStateQueryVariables,
} from "@ods/server-lib";
import { redirect } from "next/navigation";
import { isNullish } from "remeda";

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

    if (isNullish(data)) {
        redirect(Route.game);
    }

    // TODO: maybe show game unavailable ui if data is null
    return <GameContainer game={data.fetchGameState} />;
}
