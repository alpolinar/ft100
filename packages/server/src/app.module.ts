import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { AppConfigService } from "./app.config.service";
import { AppResolver } from "./app.resolver";
import { AppService } from "./app.service";
import { configOptions } from "./config/environments";
import { GraphQLOptions } from "./config/graphql/graphql.options";

@Module({
    imports: [
        ConfigModule.forRoot(configOptions),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useClass: GraphQLOptions,
            imports: [],
        }),
    ],
    controllers: [],
    providers: [AppConfigService, AppService, AppResolver],
    exports: [AppConfigService],
})
export class AppModule {}
