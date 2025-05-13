import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { SubscriptionsModule } from "src/subscriptions/subscriptions.module";
import { userProvider } from "./user.provider";
import { UserResolver } from "./user.resolver";
import { UserDataAccessLayer } from "./user.dal";
import { AppConfigService } from "../app-config/app.config.service";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AppConfigModule } from "../app-config/app.config.module";

@Module({
    imports: [
        SubscriptionsModule,
        JwtModule.registerAsync({
            imports: [AppConfigModule],
            useFactory: (appConfigService: AppConfigService) => ({
                secret: appConfigService.get("JWT_SECRET"),
                signOptions: {
                    expiresIn: "30d",
                },
            }),
            inject: [AppConfigService],
        }),
    ],
    providers: [
        ...userProvider,
        UserResolver,
        UserService,
        UserDataAccessLayer,
        AppConfigService,
        AuthService,
    ],
    exports: [UserService],
})
export class UserModule {}
