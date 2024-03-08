import { IsBoolean, IsDate, IsEmail, IsEnum, IsIn, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { FollowModel } from "../follow/entity/follow.entity";
import { Exclude, Expose, Transform } from "class-transformer";
import { ImagesModel } from "src/images/entity/images.entity";
import { ProfileModel } from "../profile/entity/profile.entity";
import { PostsModel } from "src/posts/entity/posts.entity";
import { CommentsModel } from "src/posts/entity/comments.entity";
import { LikesModel } from "src/posts/entity/likes.entity";
import { BanModel } from "../ban/entity/ban.entity";

export interface User {

    id: number;
    name: string;
    isFollow: boolean;
    profileImg: ImagesModel;

}



export enum RolesTypeEnum {

    ADMIN = 'ADMIN',
    USER = 'USER',
};

export interface BannedUser {

    id: number;
    nickname: string;
    email: string;
    banExpiration: Date;
}


@Entity()
@Exclude()
export class UsersModel extends BaseModel {

    @Column({ default: RolesTypeEnum.USER })
    @IsEnum(RolesTypeEnum)
    @Expose()
    role: RolesTypeEnum;

    @Column()
    @IsEmail()
    email: string;



    @Column()
    @IsString()
    password: string;



    @Column()
    @Expose()
    @IsString()
    nickname: string;



    @Column({ default: 0 })
    @IsNumber()
    @IsOptional()
    @Expose()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesTypeEnum.USER) {
            return value;
        } else {
            return undefined;
        }
    })
    followerCount: number;

    @Column({ default: 0 })
    @IsNumber()
    @IsOptional()
    @Expose()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesTypeEnum.USER) {
            return value;
        } else {
            return undefined;
        }
    })
    followingCount: number;


    @Column('jsonb', { default: [] })
    @IsObject({ each: true })
    @IsOptional()
    @Expose()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesTypeEnum.USER) {
            return value;
        } else {
            return undefined;
        }
    })
    followerList: User[]

    @Column('jsonb', { default: [] })
    @IsObject({ each: true })
    @IsOptional()
    @Expose()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesTypeEnum.USER) {
            return value;
        } else {
            return undefined;
        }
    })
    followingList: User[]


    @Column({ default: false })
    @IsBoolean()
    @IsOptional()
    @Expose()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesTypeEnum.USER) {
            return value;
        } else {
            return undefined;
        }
    })
    isBanned: boolean;


    @Column({ nullable: true })
    @IsDate()
    @IsOptional()
    @Expose()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesTypeEnum.USER) {
            return value;
        } else {
            return undefined;
        }
    })
    banExpiration: Date;


    @Column('jsonb', { default: [] })
    @IsObject()
    @Expose()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesTypeEnum.ADMIN) {
            return value;
        } else {
            return undefined;
        }
    })
    banList: BannedUser[]



    @OneToMany(() => FollowModel, (follow) => follow.follower)
    followers: FollowModel[];

    @OneToMany(() => FollowModel, (follow) => follow.following)
    followings: FollowModel[];


    @OneToOne(() => ProfileModel, (pro) => pro.user)
    @Expose()
    @JoinColumn()
    profile: ProfileModel;


    @OneToMany(() => PostsModel, (post) => post.author)
    posts: PostsModel[];


    @OneToMany(() => CommentsModel, (comment) => comment.author)
    comments: CommentsModel[];


    @OneToMany(() => LikesModel, (like) => like.user)
    likeUsers: LikesModel[];




    @OneToMany(() => BanModel, (ban) => ban.user)
    @Expose()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesTypeEnum.ADMIN) {
            return value;
        } else {
            return undefined;
        }
    })
    banForms: BanModel[];

}