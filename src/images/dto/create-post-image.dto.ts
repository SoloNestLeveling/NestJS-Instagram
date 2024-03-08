import { PickType } from "@nestjs/mapped-types";
import { ImagesModel } from "../entity/images.entity";

export class CreatePostImageDto extends PickType(ImagesModel, [
    'order',
    'path',
    'type',
    'post',
]) { }