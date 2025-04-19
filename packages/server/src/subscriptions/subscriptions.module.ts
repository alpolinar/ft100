import { Module } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsResolver } from "./subscriptions.resolver";
import { PubSub } from "graphql-subscriptions";

@Module({
    providers: [
        SubscriptionsService,
        SubscriptionsResolver,
        {
            provide: "PUB_SUB",
            useFactory: () => {
                return new PubSub();
            },
        },
    ],
    exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
