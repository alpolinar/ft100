import { Inject } from "@nestjs/common";
import { Args, Resolver, Subscription } from "@nestjs/graphql";
import { PubSubEngine } from "graphql-subscriptions";

@Resolver()
export class SubscriptionsResolver {
    constructor(@Inject("PUB_SUB") private pubSub: PubSubEngine) {}

    @Subscription("listenToGameUpdates")
    listenToGameUpdates(@Args("channelId") channelId: string) {
        return this.pubSub.asyncIterableIterator(channelId);
    }
}
