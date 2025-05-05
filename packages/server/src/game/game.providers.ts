import { Provider } from "@nestjs/common";
import { GameEntity, GameProvider } from "./game.entity";

export const gameProvider: Provider[] = [
    {
        provide: GameProvider,
        useValue: GameEntity,
    },
];
