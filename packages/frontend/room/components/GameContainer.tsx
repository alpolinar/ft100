"use client";

import { GameState } from "@ods/server-lib";

export type GameContainerProps = Readonly<{ data: GameState }>;

export const GameContainer = ({ data }: GameContainerProps) => {
    return <div className="text-4xl text-red-300">id: {data.id}</div>;
};
