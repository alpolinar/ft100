"use client";

import { GameState } from "@ods/server-lib";

export type GameContainerProps = Readonly<{ data: GameState }>;

export const GameContainer = ({ data }: GameContainerProps) => {
    return <div>id: {data.id}</div>;
};
