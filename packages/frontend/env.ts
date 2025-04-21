import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    client: {
        NEXT_PUBLIC_SERVER_PORT: z.coerce.number().default(3001),
        NEXT_PUBLIC_SERVER_ENDPOINT: z.string().url().optional(),
    },
    runtimeEnv: {
        NEXT_PUBLIC_SERVER_PORT: process.env.NEXT_PUBLIC_SERVER_PORT,
        NEXT_PUBLIC_SERVER_ENDPOINT: process.env.NEXT_PUBLIC_SERVER_ENDPOINT,
    },
});
