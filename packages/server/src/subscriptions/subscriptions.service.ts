import { Inject, Injectable } from "@nestjs/common";
import { TestSubSubscription } from "@ods/server-lib";
import { PubSubEngine } from "graphql-subscriptions";

@Injectable()
export class SubscriptionsService {
    constructor(@Inject("PUB_SUB") private pubSub: PubSubEngine) {}

    async testSub(channelId: string, payload: TestSubSubscription) {
        this.pubSub.publish(channelId, payload);
    }
}
