import {
    GroupOption,
    Includeable,
    Order,
    Transaction,
    WhereOptions,
} from "sequelize";

export type FilterOptions<T> = Partial<{
    where: WhereOptions<T>;
    order: Order;
    limit: number;
    offset: number;
    include: Includeable[];
    transaction: Transaction;
    raw: boolean;
    group: GroupOption;
    paranoid: boolean;
}>;
