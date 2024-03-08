import { Exclude, Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { join } from "path";
import { exitCode } from "process";
import { BaseModel } from "src/common/base/entity.base";
import { PUBLIC_POST_IMAGE_PATH, PUBLIC_PROFILE_IMAGE_PATH } from "src/common/const/image-path.const";
import { PostsModel } from "src/posts/entity/posts.entity";
import { ProfileModel } from "src/users/profile/entity/profile.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";


export enum ImageTypeEnum {

    POST_IMAGE = 'POST_IMAGE',
    PROFILE_IMAGE = 'PROFILE_IMAGE'
};

@Entity()
export class ImagesModel extends BaseModel {

    @Column()
    @IsInt()
    @IsOptional()
    order?: number;

    @Column()
    @IsEnum(ImageTypeEnum)
    type: ImageTypeEnum;

    @Column()
    @IsString()
    @Transform(({ value, obj }) => {
        if (obj.type === ImageTypeEnum.POST_IMAGE) {
            return `/${join(PUBLIC_POST_IMAGE_PATH, value)}`
        } else {
            return `/${join(PUBLIC_PROFILE_IMAGE_PATH, value)}`
        }
    })
    path: string;


    @OneToOne(() => ProfileModel, (pro) => pro.image)
    profile: ProfileModel;


    @ManyToOne(() => PostsModel, (post) => post.images)
    post: PostsModel;


}