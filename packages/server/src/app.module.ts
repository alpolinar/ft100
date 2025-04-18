import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { AppResolver } from "./app.resolver";
import { GraphQLOptions } from "./config/graphql.options";

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useClass: GraphQLOptions,
            imports: [],
        }),
    ],
    controllers: [AppController],
    providers: [AppService, AppResolver],
})
export class AppModule {}
