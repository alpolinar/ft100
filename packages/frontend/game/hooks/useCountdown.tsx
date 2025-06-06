import { useEffect, useRef, useState } from "react";

export function useCountdown(
    countdownEndsAt: string | Date,
    serverNow: string | Date
) {
    const serverTime = useRef(
        typeof serverNow === "string"
            ? new Date(serverNow).getTime()
            : serverNow.getTime()
    );
    console.log("serverTime", serverTime);
    const target = useRef(
        typeof countdownEndsAt === "string"
            ? new Date(countdownEndsAt).getTime()
            : countdownEndsAt.getTime()
    );
    console.log("target", target);
    const offset = Date.now() - serverTime.current;
    console.log("offset", offset);

    const getRemainingTime = (target: number, offset: number) => {
        const now = Date.now() - offset;
        return Math.max(0, target - now);
    };

    const [remaining, setRemaining] = useState<number>(
        getRemainingTime(target.current, offset)
    );

    console.log("remaining", remaining);

    // biome-ignore lint/correctness/useExhaustiveDependencies: no additional deps
    useEffect(() => {
        const interval = setInterval(() => {
            const timeLeft = getRemainingTime(target.current, offset);
            setRemaining(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [countdownEndsAt, serverNow]);

    return Math.ceil(remaining / 1000);
}
