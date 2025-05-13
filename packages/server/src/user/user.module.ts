import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { SubscriptionsModule } from "../subscriptions/subscriptions.module";
import { AppConfigModule } from "../app-config/app.config.module";
import { AppConfigService } from "../app-config/app.config.service";
import { AuthService } from "./auth.service";
import { UserDataAccessLayer } from "./user.dal";
import { userProvider } from "./user.provider";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        PassportModule,
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
        JwtStrategy,
    ],
    exports: [UserService],
})
export class UserModule {}
