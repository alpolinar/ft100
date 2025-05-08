import { randomBytes } from "node:crypto";

export function generateGameId(length = 10): string {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    return Array.from(array, (byte) => chars[byte % chars.length])
        .join("")
        .toUpperCase();
}
