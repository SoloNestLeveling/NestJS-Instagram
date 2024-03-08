import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entity/posts.entity';
import { ImagesService } from 'src/images/images.service';
import { ImagesModel } from 'src/images/entity/images.entity';
import { CommonService } from 'src/common/common.service';
import { CommentsModel } from './entity/comments.entity';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { CommentsService } from './comments.service';
import { LikesModel } from './entity/likes.entity';
import { PostsGateway } from './posts.gateway';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      PostsModel,
      ImagesModel,
      CommentsModel,
      UsersModel,
      LikesModel,
    ])
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsGateway, ImagesService, CommonService, CommentsService, UsersService, AuthService],
})
export class PostsModule { }
