import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    DeletedAt,
    ForeignKey,
    Model,
    Sequelize,
    Table,
    UpdatedAt,
} from "sequelize-typescript";
import { UserEntity } from "../user/user.entity";
import { getGameAttributes } from "./game.convert";
import { GameAttributes } from "./game.model";

export const GameProvider = "GAME_PROVIDER" as const;

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

    @ForeignKey(() => UserEntity)
    @Column({
        type: DataType.UUID,
        field: "winner_id",
        allowNull: true,
    })
    readonly winnerId?: string;

    @BelongsTo(() => UserEntity, { as: "winner", foreignKey: "winner_id" })
    readonly winner?: UserEntity;

    @ForeignKey(() => UserEntity)
    @Column({
        type: DataType.UUID,
        field: "fk_player_one_id",
        allowNull: true,
    })
    readonly fkPlayerOneId?: string;

    @BelongsTo(() => UserEntity, {
        as: "playerOne",
        foreignKey: "fk_player_one_id",
    })
    readonly playerOne?: UserEntity;

    @ForeignKey(() => UserEntity)
    @Column({
        type: DataType.UUID,
        field: "fk_player_two_id",
        allowNull: true,
    })
    readonly fkPlayerTwoId?: string;

    @BelongsTo(() => UserEntity, {
        as: "playerTwo",
        foreignKey: "fk_player_two_id",
    })
    readonly playerTwo?: UserEntity;

    @CreatedAt
    @Column({ type: DataType.DATE, field: "created_at", allowNull: false })
    readonly createdAt: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE, field: "updated_at", allowNull: false })
    readonly updatedAt: Date;

    @DeletedAt
    @Column({ type: DataType.DATE, field: "deleted_at" })
    readonly deletedAt?: Date;

    get getGameAttributes() {
        return getGameAttributes(this);
    }
}
