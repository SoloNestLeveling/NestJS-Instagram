import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesModel } from './entity/images.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateProfileImgDto } from './dto/create-profile-image.dto';
import { basename, extname, join } from 'path';
import { POST_FOLDER_PATH, PROFILE_FOLDER_PATH, TEMP_FOLDER_PATH } from 'src/common/const/image-path.const';
import { promises } from 'fs';
import { CreatePostImageDto } from './dto/create-post-image.dto';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(ImagesModel)
        private readonly imagesRepository: Repository<ImagesModel>
    ) { }

    getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<ImagesModel>(ImagesModel) : this.imagesRepository;
    };


    async createProfileImage(dto: CreateProfileImgDto, qr?: QueryRunner) {

        const repository = this.getRepository(qr);

        const tempfile = join(
            TEMP_FOLDER_PATH,
            dto.path
        );

        await promises.access(tempfile)

        const newFileName = basename(tempfile)

        const newFile = join(
            PROFILE_FOLDER_PATH,
            newFileName
        );

        const result = await repository.save({ ...dto })

        await promises.rename(tempfile, newFile);

        return result;

    };


    async getProfileImage(id: number) {

        const image = await this.imagesRepository.findOne({
            where: {
                id,
            }
        });

        return image;
    };






    async createPostImage(dto: CreatePostImageDto, qr?: QueryRunner) {

        const repository = this.getRepository(qr);

        const tempfile = join(
            TEMP_FOLDER_PATH,
            dto.path
        );

        await promises.access(tempfile)

        const newFileName = basename(tempfile)

        const newFile = join(
            POST_FOLDER_PATH,
            newFileName
        );

        const result = await repository.save({ ...dto })

        await promises.rename(tempfile, newFile);

        return result;

    }
}