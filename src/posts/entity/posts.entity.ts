import { IsNumber, IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { ImagesModel } from "src/images/entity/images.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CommentsModel } from "./comments.entity";
import { LikesModel } from "./likes.entity";

@Entity()
export class PostsModel extends BaseModel {

    @Column()
    @IsString()
    title: string;


    @Column()
    @IsString()
    content: string;

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    hashTag: string;


    @Column({ default: 0 })
    @IsNumber()
    @IsOptional()
    likeCount?: number;


    @OneToMany(() => ImagesModel, (image) => image.post)
    images: ImagesModel[]

    @ManyToOne(() => UsersModel, (user) => user.posts)
    author: UsersModel;


    @OneToMany(() => CommentsModel, (comment) => comment.post)
    comments: CommentsModel[];


    @OneToMany(() => LikesModel, (like) => like.post)
    likes: LikesModel[]

}