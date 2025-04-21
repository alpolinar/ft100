import { Inject, Injectable } from "@nestjs/common";
import { PubSubEngine } from "graphql-subscriptions";

@Injectable()
export class SubscriptionsService {
    constructor(@Inject("PUB_SUB") private pubSub: PubSubEngine) {}
}
