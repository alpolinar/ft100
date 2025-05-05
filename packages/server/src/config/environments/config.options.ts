import { ConfigModuleOptions } from "@nestjs/config";
import {
    validationSchema,
    validationOptions,
} from "nestjs-config-zod-validation";
import { z } from "zod";
import { join } from "node:path";

export const envSchema = z.object({
    APP_PORT: z.coerce.number().default(3001),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number().default(5432),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB: z.string(),
    npm_package_version: z.string(),
});

export const configOptions: ConfigModuleOptions = {
    isGlobal: true,
    validationSchema: validationSchema(envSchema),
    envFilePath: join(process.cwd(), ".env"),
    validationOptions: {
        ...validationOptions,
        allowUnknown: true,
        abortEarly: true,
    },
    load: [],
    validate: (config) => {
        const parsed = envSchema.safeParse(config);
        if (!parsed.success) {
            throw new Error(
                `❌ Invalid environment variables: ${JSON.stringify(parsed.error.format(), null, 2)}`
            );
        }
        return parsed.data;
    },
};
