import { Module } from "@nestjs/common";
import { GameService } from "./game.service";
import { GameResolver } from "./game.resolver";
import { gameProvider } from "./game.proviers";
import { GameDataAccessLayer } from "./game.dal";
import { SubscriptionsModule } from "../subscriptions/subscriptions.module";

@Module({
    imports: [SubscriptionsModule],
    providers: [
        ...gameProvider,
        GameResolver,
        GameService,
        GameDataAccessLayer,
    ],
    exports: [GameService],
})
export class GameModule {}
