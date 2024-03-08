import { BaseModel } from "src/common/base/entity.base";
import { Column, Entity, ManyToOne } from "typeorm";
import { UsersModel } from "../../entity/users.entity";
import { IsBoolean, IsOptional } from "class-validator";

@Entity()
export class FollowModel extends BaseModel {


    @Column({ default: false })
    @IsBoolean()
    @IsOptional()
    isFollow: boolean;

    @ManyToOne(() => UsersModel, (user) => user.followers)
    follower: UsersModel;

    @ManyToOne(() => UsersModel, (user) => user.followings)
    following: UsersModel;
}