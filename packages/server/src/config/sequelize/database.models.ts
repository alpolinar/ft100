import { UserEntity } from "../../user/user.entity";
import { GameEntity } from "../../game/game.entity";
import { ModelCtor } from "sequelize-typescript";

const MODELS: Array<ModelCtor> = [UserEntity, GameEntity];

export default MODELS;
