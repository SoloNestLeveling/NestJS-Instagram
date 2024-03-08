import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileModel } from "./entity/profile.entity";
import { QueryRunner, Repository } from "typeorm";
import { UsersService } from "../users.service";
import { ImagesService } from "src/images/images.service";
import { ImageTypeEnum } from "src/images/entity/images.entity";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { EditProfileDto } from "./dto/edit-profile.dto";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(ProfileModel)
        private readonly profileRepository: Repository<ProfileModel>,
        private readonly usersService: UsersService,
        private readonly imagesService: ImagesService
    ) { }


    async createProfile(dto: CreateProfileDto, userId: number) {

        const prevProfile = await this.getProfileByUserId(userId)

        if (prevProfile) {
            throw new BadRequestException('프로필은 오직 1개만 생성가능합니다.')
        };

        const profile = this.profileRepository.create({
            user: {
                id: userId
            },
            ...dto,
            image: {}
        });

        const result = await this.profileRepository.save(profile)

        return this.profileRepository.findOne({
            where: {
                id: result.id
            },
            relations: ["image"]
        });


    }



    async getProfileById(id: number) {
        const profile = await this.profileRepository.findOne({
            where: {
                id,
            },
            relations: ['image']
        });

        return profile;
    };


    async getProfileByUserId(userId: number) {

        const profile = await this.profileRepository.findOne({
            where: {
                user: {
                    id: userId
                }

            },
            relations: ['image']
        });
        return profile;
    }


    async editProfile(dto: EditProfileDto, userId: number) {

        const profile = await this.getProfileByUserId(userId)

        if (dto.name) {

            profile.name = dto.name;
        };


        if (dto.intro) {
            profile.intro = dto.intro;
        };


        if (dto.link) {
            profile.link = dto.link;
        };



        if (dto.image) {

            if (profile.image) {
                const newImage = await this.imagesService.createProfileImage({
                    type: ImageTypeEnum.PROFILE_IMAGE,
                    path: dto.image,
                    profile,
                });

                profile.image = newImage;
            }
        };


        const newProfile = await this.profileRepository.save(profile);

        return this.getProfileById(newProfile.id);

    }
}