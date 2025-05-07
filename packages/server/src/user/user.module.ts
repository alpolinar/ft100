import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { SubscriptionsModule } from "src/subscriptions/subscriptions.module";
import { userProvider } from "./user.provider";
import { UserResolver } from "./user.resolver";
import { UserDataAccessLayer } from "./user.dal";
import { AppConfigService } from "../app-config/app.config.service";

@Module({
    imports: [SubscriptionsModule],
    providers: [
        ...userProvider,
        UserResolver,
        UserService,
        UserDataAccessLayer,
        AppConfigService,
    ],
    exports: [UserService],
})
export class UserModule {}
