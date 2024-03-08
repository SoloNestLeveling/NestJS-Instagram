import { PickType } from "@nestjs/mapped-types";
import { PostsModel } from "../entity/posts.entity";
import { IsString } from "class-validator";

export class CreatePostDto extends PickType(PostsModel, ['content', 'title', 'hashTag']) {
    @IsString({ each: true })
    images: string[] = [];
}