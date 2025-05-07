import { CryptoService } from "../utils/crypto";
import { Effect, Exit } from "effect";
import { Logger } from "@nestjs/common";

describe("CryptoService", () => {
    const HMAC_KEY = "~)gsN8R]@>wO8zKZ@_d>Oi5*3T46^L?j";
    const ENCRYPT_KEY = "dUL6Tko'UeL4D8XB2yuZ.W=;m=74M-Vb";

    // biome-ignore lint/suspicious/noExplicitAny: allow
    let cryptoService: CryptoService<any>;
    let loggerErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        // biome-ignore lint/suspicious/noExplicitAny: allow
        cryptoService = new CryptoService<any>(HMAC_KEY, ENCRYPT_KEY);
        loggerErrorSpy = jest
            .spyOn(Logger.prototype, "error")
            .mockImplementation(() => {});
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should encrypt and decrypt data correctly", () => {
        const input = {
            userId: "id",
            code: 123456,
            expiryDate: new Date(),
        };
        const encryptedData = Effect.runSync(cryptoService.encrypt(input));

        expect(typeof encryptedData).toBe("string");
        expect(encryptedData.split(":")).toHaveLength(4);

        const decryptedData = Effect.runSync(
            cryptoService.decrypt(encryptedData)
        );

        expect(decryptedData).toEqual(input);
    });

    it("should log error and fail decryption with tampered data", () => {
        const input = { secured: true };
        const encrypted = Effect.runSync(cryptoService.encrypt(input));

        // Tamper with data
        const tampered = encrypted.replace(/.[a-z]/, "X");

        expect(() => Effect.runSync(cryptoService.decrypt(tampered))).toThrow(
            "Cannot decrypt token."
        );
        expect(loggerErrorSpy).toHaveBeenCalled();
    });

    it("should log error and fail decryption with malformed input", () => {
        const malformed = "invalid:token";

        const result = Effect.runSyncExit(cryptoService.decrypt(malformed));

        const isFailure = Exit.isFailure(result);

        expect(isFailure).toBe(true);

        if (isFailure) {
            expect(result.cause).toBeDefined();
        }

        expect(loggerErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining("Cannot decrypt data.")
        );
    });
});
