import { useEffect, useState } from "react";
import { useCountdown } from "../hooks/useCountdown";

type GameStartCountdownProps = Readonly<{
    countdownEndsAt?: Date | null;
    serverTime: Date;
}>;

export default function GameStartCountdown({
    countdownEndsAt,
    serverTime,
}: GameStartCountdownProps) {
    if (!countdownEndsAt) {
        // TODO: do something here to set a countdownEndsAt
        return <div>invalid state</div>;
    }

    const timeLeft = useCountdown(countdownEndsAt, serverTime);

    if (timeLeft > 0) {
        return <div> Game Starts in: {timeLeft}</div>;
    }

    return <div>show janken</div>;
}
