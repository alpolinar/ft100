import { Params } from "@/common/ssr-params";
import { query } from "@/graphql-client/ssr-client";
import { GameContainer } from "@/game/container/GameContainer";
import {
    FetchGameStateDocument,
    FetchGameStateQuery,
    FetchGameStateQueryVariables,
} from "@ods/server-lib";
import { isNullish } from "remeda";
import { redirect } from "next/navigation";
import { Route } from "@/common/routes";

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
