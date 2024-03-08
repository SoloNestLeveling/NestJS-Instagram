import { PickType } from "@nestjs/mapped-types";
import { ImagesModel } from "../entity/images.entity";

export class CreateProfileImgDto extends PickType(ImagesModel, [
    'order',
    'path',
    'type',
    'profile',
]) { }