import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { UserService } from "./user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly sequelize: Sequelize,
        private readonly userService: UserService
    ) {}
}
