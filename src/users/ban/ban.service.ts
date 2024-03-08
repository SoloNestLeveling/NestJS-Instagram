import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BanModel } from "./entity/ban.entity";
import { Repository } from "typeorm";
import { CreateBanDto } from "./dto/create-ban.dto";
import { UsersModel } from "../entity/users.entity";
import { UsersService } from "../users.service";


@Injectable()
export class BanService {
    constructor(
        @InjectRepository(BanModel)
        private readonly banRepository: Repository<BanModel>,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        private readonly usersService: UsersService

    ) { }

    async createBanForm(managerId: number, dto: CreateBanDto) {

        const { banUserId, reason } = dto

        const banForm = this.banRepository.create({
            user: {
                id: managerId
            },
            banUserId,
            reason,
        });

        const result = await this.banRepository.save(banForm);

        return result;
    }


    async userBan(managerId: number, banUserId: number, banDurationDays: number): Promise<boolean> {


        const user = await this.usersRepository.findOne({
            where: {
                id: banUserId
            },
            select: {
                id: true,
                nickname: true,
                email: true,
                banExpiration: true
            }
        })


        const manager = await this.usersService.getUserById(managerId)


        const banExpiration = new Date()

        banExpiration.setDate(banExpiration.getDate() + banDurationDays);

        user.banExpiration = banExpiration;
        user.isBanned = true;

        await this.usersRepository.save(user);


        manager.banList.push(user);
        await this.usersRepository.save(manager);


        return true;
    };



    async getBanUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: {
                email,
                isBanned: true

            }
        });

        return user;
    }

}