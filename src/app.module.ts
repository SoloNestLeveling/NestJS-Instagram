import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ImagesModule } from './images/images.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DB_DATABASE_KEY, DB_HOST_KEY, DB_PASSWORD_KEY, DB_PORT_KEY, DB_USERNAME_KEY } from './common/const/env-path.const';
import { UsersModel } from './users/entity/users.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guard/bearer-token.guard';
import { RolesGuard } from './users/guard/roles.guard';
import { AuthService } from './auth/auth.service';
import { FollowModel } from './users/follow/entity/follow.entity';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/image-path.const';
import { ImagesModel } from './images/entity/images.entity';
import { ProfileModel } from './users/profile/entity/profile.entity';
import { PostsModel } from './posts/entity/posts.entity';
import { CommentsModel } from './posts/entity/comments.entity';
import { LikesModel } from './posts/entity/likes.entity';
import { BanModel } from './users/ban/entity/ban.entity';



@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public'
    }),
    JwtModule.register({}),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[DB_HOST_KEY],
      port: parseInt(process.env[DB_PORT_KEY]),
      username: process.env[DB_USERNAME_KEY],
      password: process.env[DB_PASSWORD_KEY],
      database: process.env[DB_DATABASE_KEY],
      entities: [
        UsersModel,
        FollowModel,
        ImagesModel,
        ProfileModel,
        PostsModel,
        CommentsModel,
        LikesModel,
        BanModel,
      ],
      synchronize: true,

    }),
    UsersModule,
    PostsModule,
    ImagesModule,
    CommonModule,
    AuthModule,


  ],
  controllers: [AppController],
  providers: [AppService, AuthService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }],
})
export class AppModule { }
