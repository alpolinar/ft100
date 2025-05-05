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
import { convertToUser } from "./convert";

export const UserProvider = "USER_PROVIDER" as const;

export type UserAttributes = Readonly<{
    id: string;
    username: string;
    email?: string | null;
    verified: boolean;
    token?: string | null;
    img?: string | null;
    lastLoginAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}>;

export type UserCreateAttributes = Omit<
    UserAttributes,
    "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

export type GameUpdateAttributes = Omit<
    UserAttributes,
    "createdAt" | "updatedAt" | "deletedAt"
>;

@Table({
    tableName: "user",
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class UserEntity extends Model<UserAttributes, UserCreateAttributes> {
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
        unique: true,
        field: "username",
        defaultValue: Sequelize.literal(
            `'user_' || encode(gen_random_bytes(4), 'hex')`
        ),
    })
    readonly username: string;

    @Column({
        type: DataType.STRING,
        field: "email",
        allowNull: true,
    })
    readonly email?: string;

    @Column({
        type: DataType.BOOLEAN,
        field: "verified",
        defaultValue: false,
    })
    readonly veified: boolean;

    @Column({
        type: DataType.STRING,
        field: "token",
        allowNull: true,
    })
    readonly token?: string;

    @Column({
        type: DataType.STRING,
        field: "img",
        allowNull: true,
    })
    readonly img?: string;

    @Column({
        type: DataType.DATE,
        field: "last_login_at",
        allowNull: true,
    })
    readonly lastLoginAt?: Date;

    @CreatedAt
    @Column({ type: DataType.DATE, field: "created_at", allowNull: false })
    readonly createdAt: Date;

    @UpdatedAt
    @Column({ type: DataType.DATE, field: "updated_at", allowNull: false })
    readonly updatedAt: Date;

    @DeletedAt
    @Column({ type: DataType.DATE, field: "deleted_at" })
    readonly deletedAt?: Date;

    get convertToUser() {
        return convertToUser(this);
    }
}
