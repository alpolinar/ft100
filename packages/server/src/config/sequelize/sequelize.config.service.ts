import { Injectable } from "@nestjs/common";
import {
    SequelizeModuleOptions,
    SequelizeOptionsFactory,
} from "@nestjs/sequelize";
import MODELS from "./database.models";
import { AppConfigService } from "../../app-config/app.config.service";

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
    constructor(private readonly configService: AppConfigService) {}

    createSequelizeOptions():
        | Promise<SequelizeModuleOptions>
        | SequelizeModuleOptions {
        return {
            dialect: "postgres",
            models: MODELS,
            native: false,
            logging: false,
            pool: {
                max: 40,
                min: 5,
                acquire: 30000,
                idle: 10000,
                maxUses: 100,
            },
            host: this.configService.get("DB_HOST"),
            port: this.configService.get("DB_PORT"),
            username: this.configService.get("DB_USERNAME"),
            password: this.configService.get("DB_PASSWORD"),
            database: this.configService.get("DB"),
        };
    }
}
