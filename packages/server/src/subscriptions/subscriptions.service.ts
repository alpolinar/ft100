import { Inject, Injectable } from "@nestjs/common";
import { ListenToGameUpdatesSubscription } from "@ods/server-lib";
import { PubSubEngine } from "graphql-subscriptions";

@Injectable()
export class SubscriptionsService {
    constructor(@Inject("PUB_SUB") private pubSub: PubSubEngine) {}

    listenToGameUpdates(
        channelId: string,
        payload: ListenToGameUpdatesSubscription
    ) {
        this.pubSub.publish(channelId, payload);
    }
}
