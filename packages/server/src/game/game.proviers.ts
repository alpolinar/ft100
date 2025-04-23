import { GameEntity, GameProvider } from "./game.entity";

export const gameProvider = [
    {
        provide: GameProvider,
        useValue: GameEntity,
    },
];
