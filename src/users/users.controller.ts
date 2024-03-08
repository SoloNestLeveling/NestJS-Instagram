import { Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from './decorator/role.decorator';
import { RolesTypeEnum } from './entity/users.entity';
import { UserAndAdminFieldInterceptor } from './interceptor/user-admin.interceptor';
import { IsPublic } from './decorator/is-public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService) { }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUser();
  }


  @Get(':userId')
  getUser(
    @Param('userId', ParseIntPipe) id: number
  ) {
    return this.usersService.getUserById(id)
  }


  @Get('manager/admin')
  getManager() {
    return this.usersService.getManager()
  }




}
