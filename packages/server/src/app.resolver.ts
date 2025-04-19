import { Query, Resolver } from "@nestjs/graphql";
import { AppConfigService } from "./app.config.service";

@Resolver()
export class AppResolver {
    constructor(private readonly appConfigService: AppConfigService) {}

    @Query(() => String)
    healthcheck() {
        return "Hello World!";
    }
}
