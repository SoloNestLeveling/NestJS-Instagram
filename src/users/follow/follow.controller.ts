import { Controller, Get, Injectable, Param, ParseIntPipe, Post } from "@nestjs/common";
import { FollowService } from "./follow.service";
import { User } from "../decorator/user-id.decorator";
import { UsersModel } from "../entity/users.entity";
import { UsersService } from "../users.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Controller('follow')
export class FollowController {
    constructor(
        private readonly followService: FollowService,
        private readonly usersService: UsersService,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>
    ) { }


    @Post(':followingId')
    createFollow(
        @User() user: UsersModel,
        @Param('followingId', ParseIntPipe) followingId: number,
    ) {
        return this.followService.createFollow(user.id, followingId)
    }


    @Post('unfollow/:unFollowIngId')
    unfollow(
        @User() user: UsersModel,
        @Param('unFollowingId', ParseIntPipe) unFollowingId: number,
    ) {

        return this.followService.unFollowUser(user.id, unFollowingId)
    }


    @Get('get/:followingId')
    getFollowing(
        @User() user: UsersModel,
        @Param('followingId', ParseIntPipe) id: number
    ) {
        return this.followService.testGetProfile(user.id, id)


    }



}