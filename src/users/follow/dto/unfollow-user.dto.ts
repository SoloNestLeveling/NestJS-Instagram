import { IsNumber } from "class-validator";

export class UnFollowUserDto {

    @IsNumber()
    unFollowingId: number;
}