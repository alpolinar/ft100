import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserDataAccessLayer } from "./user.dal";

@Injectable()
export class UserService {
    private readonly logger = new Logger("GameService");

    constructor(
        @Inject(UserDataAccessLayer)
        private readonly userDal: UserDataAccessLayer
    ) {}
}
