import { PickType } from "@nestjs/mapped-types";
import { UsersModel } from "../entity/users.entity";
import { IsOptional, IsString } from "class-validator";

export class CreateUserDto extends PickType(UsersModel, [
    'email',
    'password',
    'nickname',
    'followerCount',
    'followingCount',
    'followerList',
    'followingList',
    'isBanned',
    'banExpiration'
]) {

}