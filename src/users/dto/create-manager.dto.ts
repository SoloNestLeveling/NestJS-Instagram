import { PickType } from "@nestjs/mapped-types";
import { UsersModel } from "../entity/users.entity";

export class CreateManagerDto extends PickType(UsersModel, [
    'banList',
]) { }