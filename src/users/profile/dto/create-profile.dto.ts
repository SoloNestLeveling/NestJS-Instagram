import { PickType } from "@nestjs/mapped-types";
import { ProfileModel } from "../entity/profile.entity";
import { IsOptional, IsString } from "class-validator";

export class CreateProfileDto extends PickType(ProfileModel, ['name', 'intro', 'link']) {

    @IsString()
    @IsOptional()
    image: string = null;
}