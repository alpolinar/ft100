import { BadRequestException, Logger } from "@nestjs/common";
import { Effect, Option } from "effect";
import {
    CipherGCMTypes,
    createCipheriv,
    createDecipheriv,
    createHmac,
    randomBytes,
} from "node:crypto";
import { catchError } from "./helpers";

export class CryptoService<T> {
    private readonly logger = new Logger("CryptoService");

    private readonly ENCRYPT_ALGO: CipherGCMTypes = "aes-256-gcm";
    private readonly HASH_ALGO = "sha256";
    private readonly HMAC_KEY: string;
    private readonly ENCRYPT_KEY: string;
    private readonly SEPARATOR: string = ":";

    constructor(hmacKey: string, encryptKey: string) {
        this.HMAC_KEY = hmacKey;
        this.ENCRYPT_KEY = encryptKey;
    }

    encrypt(data: T): Effect.Effect<string, Error, never> {
        return Effect.try({
            try: () => {
                const key = Buffer.from(this.ENCRYPT_KEY, "utf8");
                const iv = randomBytes(16);
                const cipher = createCipheriv(this.ENCRYPT_ALGO, key, iv);
                const stringData = JSON.stringify(data);

                const encryptedData =
                    cipher.update(stringData, "utf8", "hex") +
                    cipher.final("hex");

                const ivString = iv.toString("hex");

                const hmac = createHmac(this.HASH_ALGO, this.HMAC_KEY).update(
                    ivString + encryptedData
                );
                const digest = hmac.digest("hex");
                const authTagString = cipher.getAuthTag().toString("hex");

                return [ivString, encryptedData, digest, authTagString].join(
                    this.SEPARATOR
                );
            },
            catch: catchError((err) => {
                this.logger.error(err.message);
            }),
        });
    }

    decrypt(data: string): Effect.Effect<T, Error, never> {
        return Effect.try({
            try: () => {
                const [ivString, encryptedData, digest, authTagString] =
                    data.split(this.SEPARATOR);

                if (!ivString || !encryptedData || !digest || !authTagString) {
                    throw new Error("Cannot decrypt data.");
                }

                const hmac = createHmac(this.HASH_ALGO, this.HMAC_KEY).update(
                    ivString + encryptedData
                );
                const newDigest = hmac.digest("hex");

                if (digest !== newDigest) {
                    throw new Error("Cannot decrypt token.");
                }

                const key = Buffer.from(this.ENCRYPT_KEY, "utf8");
                const iv = Buffer.from(ivString, "hex");
                const authTag = Buffer.from(authTagString, "hex");

                const decipher = createDecipheriv(
                    this.ENCRYPT_ALGO,
                    key,
                    iv
                ).setAuthTag(authTag);

                const decipheredData =
                    decipher.update(encryptedData, "hex", "utf8") +
                    decipher.final("utf8");

                return JSON.parse(decipheredData, (_key, value) => {
                    const regEx =
                        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
                    if (typeof value === "string" && regEx.test(value)) {
                        const date = new Date(value);
                        if (!Number.isNaN(date.getTime())) {
                            return date;
                        }
                    }
                    return value;
                });
            },
            catch: catchError((err) => {
                this.logger.error(err.message);
            }),
        });
    }
}
