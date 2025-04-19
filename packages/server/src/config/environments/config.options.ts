import { ConfigModuleOptions } from "@nestjs/config";
import {
    validationSchema,
    validationOptions,
} from "nestjs-config-zod-validation";
import { z } from "zod";

export const configOptions: ConfigModuleOptions = {
    isGlobal: true,
    validationSchema: validationSchema(
        z.object({
            APP_CONFIG: z.number().default(3001),
        })
    ),
    validationOptions: {
        ...validationOptions,
        allowUnknown: true,
        abortEarly: true,
    },
    load: [],
};
