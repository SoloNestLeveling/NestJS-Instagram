import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { FollowService } from './follow/follow.service';
import { FollowModel } from './follow/entity/follow.entity';
import { FollowController } from './follow/follow.controller';
import { ImagesService } from 'src/images/images.service';
import { ImagesModel } from 'src/images/entity/images.entity';
import { ProfileModel } from './profile/entity/profile.entity';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { FollowGateway } from './follow/follow.gateway';
import { BanModel } from './ban/entity/ban.entity';
import { BanService } from './ban/ban.service';
import { BanController } from './ban/ban.controller';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      UsersModel,
      FollowModel,
      ImagesModel,
      ProfileModel,
      BanModel,


    ])
  ],
  exports: [UsersService],
  controllers: [UsersController, FollowController, ProfileController, BanController],
  providers: [UsersService, FollowService, ImagesService, ProfileService, AuthService, FollowGateway, BanService,],
})
export class UsersModule { }
