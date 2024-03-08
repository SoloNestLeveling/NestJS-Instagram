import { PartialType, PickType } from "@nestjs/mapped-types";
import { ProfileModel } from "../entity/profile.entity";
import { IsOptional, IsString } from "class-validator";

export class EditProfileDto extends PickType(ProfileModel, ['intro', 'link', 'name']) {

    @IsString()
    @IsOptional()
    image: string = null;

}