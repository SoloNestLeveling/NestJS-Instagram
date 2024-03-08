import { IsNumber } from "class-validator";

export class CommentLikeCountDto {

    @IsNumber()
    commentId: number;
}