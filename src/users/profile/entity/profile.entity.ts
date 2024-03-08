import { IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity.base";
import { ImagesModel } from "src/images/entity/images.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { UsersModel } from "../../entity/users.entity";

@Entity()
export class ProfileModel extends BaseModel {


    @Column({ default: '' })
    @IsString()
    @IsOptional()
    name: string;

    @Column({ default: '' })
    @IsString()
    @IsOptional()
    intro: string;

    @Column({ default: '' })
    @IsString()
    @IsOptional()
    link: string;

    // @Column({ nullable: true })
    // @IsString()
    // @IsOptional()
    // profileImg: string;



    @OneToOne(() => ImagesModel, (image) => image.profile)
    @JoinColumn()
    image: ImagesModel;


    @OneToOne(() => UsersModel, (user) => user.profile)
    user: UsersModel;


}