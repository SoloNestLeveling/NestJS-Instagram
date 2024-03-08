import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entity/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ImagesService } from 'src/images/images.service';
import { ImagesModel } from 'src/images/entity/images.entity';
import { BanService } from 'src/users/ban/ban.service';
import { BanModel } from 'src/users/ban/entity/ban.entity';
import { LogBanMiddleware } from './middleware/log-ban.middleware';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      UsersModel,
      ImagesModel,
      BanModel
    ])
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, UsersService, ImagesService, BanService],
})
export class AuthModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(LogBanMiddleware)
      .forRoutes({ path: 'auth/login/email', method: RequestMethod.POST })
  }
}
