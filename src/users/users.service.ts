import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesTypeEnum, UsersModel } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { privateDecrypt } from 'crypto';
import { ImagesService } from 'src/images/images.service';
import { ImageTypeEnum } from 'src/images/entity/images.entity';
import { arrayUnique } from 'class-validator';
import { CreateManagerDto } from './dto/create-manager.dto';
import { Expose } from 'class-transformer';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        private readonly imagesService: ImagesService
    ) { }


    async creatUser(dto: CreateUserDto) {

        const existEmail = await this.usersRepository.exists({
            where: {
                email: dto.email
            }
        });

        if (existEmail) {
            throw new BadRequestException('이미 존재하는 이메일입니다.')
        };

        const existNickname = await this.usersRepository.exists({
            where: {
                nickname: dto.nickname
            }
        });

        if (existNickname) {
            throw new BadRequestException('이미 존재하는 닉네임입니다.')
        };


        const user = this.usersRepository.create({
            ...dto,
        });

        const result = await this.usersRepository.save(user);


        return result;
    }



    async assignManager(userId: number) {

        const user = await this.getUserById(userId)

        if (user) {

            user.role = RolesTypeEnum.ADMIN



        }

        return this.getUserById(user.id)
    }



    async getUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: {
                email,
            }
        });

        return user;
    }



    async getUserById(id: number) {


        const user = await this.usersRepository.findOne({
            where: {
                id,
            },
            relations: ['profile', 'profile.image', 'banForms']

        });




        return user;
    }


    async getAllUser() {
        const user = await this.usersRepository.find({
            relations: ['profile', 'profile.image']

        })
        return user;
    }



    async getManager() {

        const manager = await this.usersRepository.findOne({
            where: {
                role: RolesTypeEnum.ADMIN
            },
            relations: ['banForms']
        });


        return manager;
    }




}
