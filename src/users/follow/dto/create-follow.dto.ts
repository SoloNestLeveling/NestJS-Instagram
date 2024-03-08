import { PickType } from "@nestjs/mapped-types";
import { FollowModel } from "../entity/follow.entity";
import { IsNumber } from "class-validator";

export class CreateFollowDto {

    @IsNumber()
    followingId: number;


}