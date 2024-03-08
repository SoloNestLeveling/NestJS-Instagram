import { IsNumber, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { Column, Entity, ManyToOne } from "typeorm";
import { UsersModel } from "../../entity/users.entity";


@Entity()
export class BanModel extends BaseModel {

    @Column()
    @IsNumber()
    banUserId: number;


    @Column()
    @IsString()
    reason: string;


    @ManyToOne(() => UsersModel, (user) => user.banForms)
    user: UsersModel;



}