import { Injectable } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions/subscriptions.service";

@Injectable()
export class AppService {
    constructor(private readonly subscriptions: SubscriptionsService) {}
}
