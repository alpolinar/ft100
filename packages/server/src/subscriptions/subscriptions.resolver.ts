import { Resolver } from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import { PubSubEngine } from "graphql-subscriptions";

@Resolver()
export class SubscriptionsResolver {
    constructor(@Inject("PUB_SUB") private pubSub: PubSubEngine) {}
}
