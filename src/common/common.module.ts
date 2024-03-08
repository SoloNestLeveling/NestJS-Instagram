import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import * as multer from 'multer';
import { v4 as uuid } from 'uuid';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { TEMP_FOLDER_PATH } from './const/image-path.const';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([

    ]),
    MulterModule.register({
      limits: {
        fileSize: 1000000
      },
      fileFilter: function (res, file, fn) {

        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return fn(new BadRequestException('이미지 업로드는 .jpg/.jpeg/.png 파일만 가능합니다'), false)
        } return fn(null, true)
      },
      storage: multer.diskStorage({
        destination: function (res, req, fn) {
          fn(null, TEMP_FOLDER_PATH)
        },
        filename: function (res, file, fn) {
          fn(null, `${uuid()}${extname(file.originalname)}`)
        }
      }),
    }),
  ],
  exports: [CommonService],
  controllers: [CommonController],
  providers: [CommonService, ConfigService],
})
export class CommonModule { }
