import { UpdateOptions } from "sequelize";

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
