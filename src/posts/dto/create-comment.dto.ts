import { PickType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";
import { CommentsModel } from "../entity/comments.entity";

export class CreateCommentDto extends PickType(CommentsModel, ['comment', 'likeCount']) {

    @IsNumber()
    postId: number;
}