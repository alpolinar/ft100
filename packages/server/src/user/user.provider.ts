import { Provider } from "@nestjs/common";
import { UserEntity, UserProvider } from "./user.entity";

export const userProvider: Provider[] = [
    {
        provide: UserProvider,
        useValue: UserEntity,
    },
];
