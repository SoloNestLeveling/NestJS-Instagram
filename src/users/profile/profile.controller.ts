import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { User } from "../decorator/user-id.decorator";
import { UsersModel } from "../entity/users.entity";
import { ReqQueryRunner } from "src/common/decorator/query-runner.decorator";
import { QueryRunner } from "typeorm";
import { TransactionInterceptor } from "src/common/interceptor/transaction.interceptor";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { ImagesService } from "src/images/images.service";
import { ImageTypeEnum } from "src/images/entity/images.entity";
import { EditProfileDto } from "./dto/edit-profile.dto";

@Controller('profile')
export class ProfileController {

    constructor(
        private readonly profileService: ProfileService,
        private readonly imagesService: ImagesService
    ) { }


    @Post()
    async createProfile(
        @Body() dto: CreateProfileDto,
        @User() user: UsersModel
    ) {

        const profile = await this.profileService.createProfile(dto, user.id)

        if (dto.image) {
            await this.imagesService.createProfileImage({
                order: 1,
                type: ImageTypeEnum.PROFILE_IMAGE,
                path: dto.image,
                profile,
            });
        }

        return profile;

    };


    @Get(':id')
    async getProfile(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.profileService.getProfileById(id)
    }



    @Patch('edit')
    async editprofile(
        @Body() dto: EditProfileDto,
        @User() user: UsersModel
    ) {

        return this.profileService.editProfile(dto, user.id)
    }

}