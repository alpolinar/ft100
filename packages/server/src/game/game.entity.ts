import {
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    Model,
    Sequelize,
    Table,
    UpdatedAt,
} from "sequelize-typescript";
import { convertToGameState } from "./convert";

export const GameProvider = "GAME_PROVIDER" as const;

export type GameAttributes = Readonly<{
    id: string;
    gameId: string;
    currentTotal: number;
    currentPlayerId?: string;
    winnerId?: string;
    fkPlayerOneId?: string;
    fkPlayerTwoId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}>;

export type GameCreateAttributes = Omit<
    GameAttributes,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type GameUpdateAttributes = Omit<
    GameAttributes,
    "createdAt" | "updatedAt" | "deletedAt"
>;

@Table({
    tableName: "game",
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class GameEntity extends Model<GameAttributes, GameCreateAttributes> {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        unique: true,
        field: "id",
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
    })
    readonly id: string;

    @Column({
        type: DataType.STRING,
        field: "game_id",
        allowNull: false,
    })
    readonly gameId: string;

    @Column({
        type: DataType.INTEGER,
        field: "current_total",
        defaultValue: 0,
        allowNull: false,
    })
    readonly currentTotal: number;

    @Column({
        type: DataType.UUID,
        field: "current_player_id",
        allowNull: true,
    })
    readonly currentPlayerId?: string;

    @Column({
        type: DataType.UUID,
        field: "winner_id",
        allowNull: true,
    })
    readonly winnerId?: string;

    @Column({
        type: DataType.UUID,
        field: "fk_player_one_id",
        allowNull: true,
    })
    readonly fkPlayerOneId?: string;

    @Column({
        type: DataType.UUID,
        field: "fk_player_two_id",
        allowNull: true,
    })
    readonly fkPlayerTwoId?: string;

    @CreatedAt
    @Column({ type: DataType.DATE, field: "created_at", allowNull: false })
    readonly createdAt: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE, field: "updated_at", allowNull: false })
    readonly updatedAt: Date;

    @DeletedAt
    @Column({ type: DataType.DATE, field: "deleted_at" })
    readonly deletedAt?: Date;

    get convertToGameState() {
        return convertToGameState(this);
    }
}
