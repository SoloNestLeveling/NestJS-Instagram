import { IsNumber, IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { PostsModel } from "src/posts/entity/posts.entity";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class CommentsModel extends BaseModel {

    @Column()
    @IsString()
    comment: string;

    @Column({ default: 0 })
    @IsNumber()
    @IsOptional()
    likeCount: number

    @ManyToOne(() => UsersModel, (user) => user.comments)
    author: UsersModel;


    @ManyToOne(() => PostsModel, (post) => post.comments)
    post: PostsModel;

}