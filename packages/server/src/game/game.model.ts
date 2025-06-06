import { UserEntity } from "../user/user.entity";

export enum GamePhase {
    Complete = "Complete",
    CountdownToStart = "CountdownToStart",
    InProgress = "InProgress",
    WaitingForPlayers = "WaitingForPlayers",
}

export type GameAttributes = Readonly<{
    id: string;
    gameId: string;
    currentTotal: number;
    phase: GamePhase;
    currentPlayerId?: string | null;
    winnerId?: string | null;
    winner?: UserEntity;
    fkPlayerOneId?: string | null;
    playerOne?: UserEntity;
    fkPlayerTwoId?: string | null;
    playerTwo?: UserEntity;
    countdownEndsAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}>;
