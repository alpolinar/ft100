import { randomBytes } from "node:crypto";

export function generateGameId(length = 10): string {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const bytes = randomBytes(length);
    const charsLength = chars.length;
    let id = "";

    for (let i = 0; i < length; i++) {
        id += chars[bytes[i] % charsLength];
    }

    return id.toUpperCase();
}
