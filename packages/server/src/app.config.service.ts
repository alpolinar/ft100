import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { z } from "zod";
import { envSchema } from "./config/environments";

type EnvVariables = z.infer<typeof envSchema>;

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}

    get<K extends keyof EnvVariables>(key: K): EnvVariables[K] {
        if (key.includes(".")) {
            return (
                this.configService.get<EnvVariables[K]>(key) ||
                this.configService.get<EnvVariables[K]>(
                    key.slice(key.indexOf(".") + 1)
                )
            );
        }

        return this.configService.get<EnvVariables[K]>(key);
    }
}
