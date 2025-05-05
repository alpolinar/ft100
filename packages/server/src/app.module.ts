import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppConfigModule } from "./app-config/app.config.module";
import { AppConfigService } from "./app-config/app.config.service";
import { AppResolver } from "./app.resolver";
import { AppService } from "./app.service";
import { GraphQLOptions } from "./config/graphql/graphql.options";
import { LoggingInterceptor } from "./config/interceptors/logging.interceptors";
import { TimeoutInterceptor } from "./config/interceptors/timeout.interceptor";
import { APP_MODULES } from "./config/modules";
import { SequelizeConfigService } from "./config/sequelize/sequelize.config.service";

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
    providers: [
        AppConfigService,
        AppService,
        AppResolver,
        {
            provide: APP_INTERCEPTOR,
            useFactory: (appConfigService: AppConfigService) => {
                return new LoggingInterceptor(appConfigService);
            },
            inject: [AppConfigService],
        },
        {
            provide: APP_INTERCEPTOR,
            useFactory: () => {
                return new TimeoutInterceptor();
            },
        },
    ],
})
export class AppModule {}
