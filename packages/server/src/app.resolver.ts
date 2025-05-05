import { Query, Resolver } from "@nestjs/graphql";
import { AppService } from "./app.service";
import pkg from "../package.json";

@Resolver()
export class AppResolver {
    constructor(private readonly appService: AppService) {}

    @Query(() => String)
    healthcheck() {
        return `${pkg.name}: ${pkg.version}`;
    }
}
