import { IsNumber } from "class-validator";

export class FollowUserDto {

    @IsNumber()
    followingId: number;
}