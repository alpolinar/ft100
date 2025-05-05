import { UserEntity } from "../user/user.entity";

export type GameAttributes = Readonly<{
    id: string;
    gameId: string;
    currentTotal: number;
    currentPlayerId?: string | null;
    winnerId?: string | null;
    winner?: UserEntity;
    fkPlayerOneId?: string | null;
    playerOne?: UserEntity;
    fkPlayerTwoId?: string | null;
    playerTwo?: UserEntity;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}>;
