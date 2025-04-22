import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AppResolver } from "./app.resolver";
import { AppService } from "./app.service";
import { GraphQLOptions } from "./config/graphql/graphql.options";
import { APP_MODULES } from "./config/modules";
import { SequelizeModule } from "@nestjs/sequelize";
import { SequelizeConfigService } from "./config/sequelize/sequelize.config.service";
import { AppConfigModule } from "./app-config/app.config.module";
import { AppConfigService } from "./app-config/app.config.service";

@Module({
    imports: [
        AppConfigModule,
        SequelizeModule.forRootAsync({
            useClass: SequelizeConfigService,
            imports: [AppConfigModule],
        }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useClass: GraphQLOptions,
        }),
        ...APP_MODULES,
    ],
    controllers: [],
    providers: [AppConfigService, AppService, AppResolver],
})
export class AppModule {}
