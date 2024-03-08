import { Body, Controller, Injectable, Param, ParseIntPipe, Post } from "@nestjs/common";
import { BanService } from "./ban.service";
import { CreateBanDto } from "./dto/create-ban.dto";
import { User } from "../decorator/user-id.decorator";
import { RolesTypeEnum, UsersModel } from "../entity/users.entity";
import { Roles } from "../decorator/role.decorator";

@Controller('ban')
export class BanController {
    constructor(
        private readonly banService: BanService
    ) { }


    @Post(':managerId')
    createBan(
        @Param('managerId', ParseIntPipe) id: number,
        @Body() dto: CreateBanDto
    ) {
        return this.banService.createBanForm(id, dto)
    }



    @Post('user/:banUserId')
    @Roles(RolesTypeEnum.ADMIN)
    banUser(
        @User() manager: UsersModel,
        @Param('banUserId', ParseIntPipe) banUserId: number,
        @Body('banDurationDays', ParseIntPipe) banDurationDays: number,
    ) {

        return this.banService.userBan(manager.id, banUserId, banDurationDays)
    }

}