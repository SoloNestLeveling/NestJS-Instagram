import { BaseModel } from "src/common/base/entity.base";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { PostsModel } from "./posts.entity";

@Entity()
export class LikesModel extends BaseModel {

    @ManyToOne(() => UsersModel, (user) => user.likeUsers)
    user: UsersModel;


    @ManyToOne(() => PostsModel, (post) => post.likes)
    post: PostsModel;
}